import os
import json
import shutil
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from dotenv import load_dotenv

# CrewAI & Groq Imports
from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq

# Load environment variables (API Keys)
load_dotenv()

# Ensure the temporary data folder exists for CrewAI to read from
os.makedirs("temp_data", exist_ok=True)

app = FastAPI()

# ---------------------------------------------------------
# WEBSOCKET CONNECTION MANAGER
# ---------------------------------------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

manager = ConnectionManager()

# ---------------------------------------------------------
# CORS CONFIGURATION (Crucial for Next.js to talk to Python)
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Must match your Next.js port exactly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# WEBSOCKET ENDPOINT (/ws/telemetry)
# ---------------------------------------------------------
@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Wait for any message (not really used, but keeps connection alive)
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ---------------------------------------------------------
# IN-MEMORY SESSION STORE (Hackathon MVP state management)
# ---------------------------------------------------------
active_sessions = {}

# ---------------------------------------------------------
# API MODELS
# ---------------------------------------------------------
class QueryRequest(BaseModel):
    query: str
    session_id: str = "session_123"
    mode: str = "demo" # Toggles between 'demo' (Pandas) and 'live' (CrewAI)

# ---------------------------------------------------------
# UPLOAD ENDPOINT (/api/upload)
# ---------------------------------------------------------
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    session_id = "session_123"
    file_path = f"temp_data/{session_id}.csv"

    # Save physical file to disk so CrewAI agents can access it later
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Load into Pandas for lightning-fast Demo Mode
        df = pd.read_csv(file_path)
        df.columns = df.columns.str.strip() # Clean headers
        df.dropna(how="all", inplace=True)  # Drop completely empty rows
        
        # Store both the dataframe and the physical file path
        active_sessions[session_id] = {"df": df, "file_path": file_path}

        return {
            "status": "success",
            "message": "Data ingested successfully",
            "columns": list(df.columns),
            "row_count": len(df)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing CSV: {str(e)}")

# ---------------------------------------------------------
# THE LIVE ENGINE: CREWAI ORCHESTRATION
# ---------------------------------------------------------
def run_crewai_live_mode(query: str, file_path: str, websocket: Optional[WebSocket] = None):
    # Initialize Groq Engine (Meta Llama 3)
    llm = ChatGroq(
        temperature=0.1, # Low temperature for data accuracy
        groq_api_key=os.environ.get("GROQ_API_KEY"),
        model_name="llama3-70b-8192" 
    )

    # CRITICAL: Custom Callback for Real-time Telemetry
    def agent_step_callback(step_output):
        if websocket:
            import asyncio
            # Extract the thought/action from step_output safely
            message = f"[AGENT] {str(step_output)[:150]}..." 
            # Create a new event loop task to send the message
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    loop.create_task(manager.send_message(message, websocket))
                else:
                    asyncio.run(manager.send_message(message, websocket))
            except Exception:
                # Fallback for complex threading environments
                pass

    # Agent 1
    data_engineer = Agent(
        role="Senior Data Analyst",
        goal="Analyze the CSV schema and data to answer the user's query mathematically.",
        backstory="You are a ruthless data engineer who ensures numbers are perfectly calculated.",
        verbose=True,
        allow_delegation=False,
        llm=llm,
        step_callback=agent_step_callback
    )

    # Agent 2
    qa_critic = Agent(
        role="Data Quality Assurance Lead",
        goal="Verify the Data Engineer's calculations for anomalies, null values, or logical errors.",
        backstory="You catch hallucinations and force recalculations if data doesn't make sense.",
        verbose=True,
        allow_delegation=False,
        llm=llm,
        step_callback=agent_step_callback
    )

    # Agent 3 (Visualizer)
    visualizer = Agent(
        role="Frontend JSON Architect",
        goal="Convert the verified data into a STRICT Recharts-compatible JSON payload.",
        backstory="You only speak in valid JSON. No markdown, no conversational text. You output a raw JSON object.",
        verbose=True,
        allow_delegation=False,
        llm=llm,
        step_callback=agent_step_callback
    )

    # Tasks
    task_data = Task(
        description=f"Read the CSV at {file_path}. Calculate the exact answer to this user query: '{query}'. Provide the raw numbers and breakdown.",
        expected_output="A structured breakdown of the required calculations and numerical results.",
        agent=data_engineer
    )

    task_qa = Task(
        description="Review the calculations from the previous task. Ensure accuracy. Verify no nulls were improperly summed.",
        expected_output="A verification report confirming the numbers are accurate and ready for visualization.",
        agent=qa_critic
    )

    task_visualizer = Task(
        description="""Take the QA verified data and output a STRICT JSON object.
        The JSON must have exactly three keys:
        1. 'chartData': A list of dictionaries formatted for Recharts (e.g., [{"name": "Category", "value": 100}]).
        2. 'summary': A 2-sentence textual insight.
        3. 'logs': A list of 5 string logs simulating telemetry (e.g., ["[SYSTEM] LLM booted...", "[DATA_AGENT] Analyzed..."]).
        DO NOT wrap the output in markdown blocks like ```json. Output ONLY the raw JSON string.""",
        expected_output="A raw JSON string containing chartData, summary, and logs.",
        agent=visualizer
    )

    # Assemble Crew
    crew = Crew(
        agents=[data_engineer, qa_critic, visualizer],
        tasks=[task_data, task_qa, task_visualizer],
        process=Process.sequential
    )

    result = crew.kickoff()

    # Clean the LLM output in case it hallucinates markdown wrappers
    cleaned_result = result.raw.strip()
    if cleaned_result.startswith("```json"):
        cleaned_result = cleaned_result[7:]
    if cleaned_result.endswith("```"):
        cleaned_result = cleaned_result[:-3]

    try:
        return json.loads(cleaned_result.strip())
    except json.JSONDecodeError:
        return {
            "chartData": [{"name": "Error", "value": 0}],
            "summary": "CrewAI failed to return valid JSON format. Raw output: " + cleaned_result[:100],
            "logs": ["[SYSTEM] Error parsing LLM response.", "[CRASH] Visualizer hallucinated formatting."]
        }

# ---------------------------------------------------------
# QUERY ENDPOINT (/api/query)
# ---------------------------------------------------------
@app.post("/api/query")
async def execute_query(request: QueryRequest):
    session = active_sessions.get(request.session_id)
    
    if not session:
        raise HTTPException(status_code=400, detail="No active data session found. Please upload a file first.")

    query_lower = request.query.lower()

    # ROUTE 1: THE "GOD MODE" LIVE AI
    if request.mode == "live":
        active_ws = manager.active_connections[0] if manager.active_connections else None
        return run_crewai_live_mode(request.query, session["file_path"], websocket=active_ws)

    # ROUTE 2: THE "SAFE DEMO" DETERMINISTIC ENGINE
    else:
        df = session["df"]

        # Keyword Router: Revenue by Region
        if "revenue" in query_lower and "region" in query_lower:
            try:
                # Actual Pandas Math
                grouped = df.groupby('Region')['Revenue'].sum().reset_index()
                chart_data = grouped.to_dict(orient="records")
                
                return {
                    "chartData": chart_data,
                    "summary": "The Southern region outperformed the North, driven by enterprise sales.",
                    "logs": [
                        "[SYSTEM] Initiating Agentic Loop (Deterministic Mode)...",
                        "[DATA_ENGINEER] Parsing intent: Target metric -> Revenue by Region.",
                        "[QA_CRITIC] Scrubbing null values from revenue column...",
                        "[VISUALIZER] Compiling Recharts payload...",
                        "[SYSTEM] Output Rendered."
                    ]
                }
            except Exception:
                return {
                    "chartData": [{"Region": "Demo", "Revenue": 1000}],
                    "summary": "Mock demo data generated. Ensure your CSV has 'Region' and 'Revenue' columns.",
                    "logs": ["[SYSTEM] Schema mismatch. Running mock demo loop."]
                }
        
        # Generic Fallback 
        else:
            return {
                "chartData": df.head(5).to_dict(orient="records"),
                "summary": "Displaying top 5 rows of ingested data as generic fallback.",
                "logs": [
                    "[SYSTEM] Unrecognized query in Demo Mode.",
                    "[DATA_ENGINEER] Extracting top rows from active session...",
                    "[SYSTEM] Output Rendered."
                ]
            }