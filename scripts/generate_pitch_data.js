import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * generate_pitch_data.js
 * 
 * Generates a realistic mock CSV dataset for OmniSight agentic analysis.
 * Target File: omnisight_q3_telemetry.csv
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGIONS = ['North America', 'Europe', 'APAC', 'LATAM', 'EMEA'];
const PRODUCT_LINES = ['Cloud Security', 'Endpoint Protection', 'Threat Intelligence', 'Zero Trust'];
const ANOMALIES = ['None', 'None', 'None', 'None', 'None', 'None', 'Revenue Spike', 'Churn Anomaly', 'Market Shift', 'Unusual Growth'];

const generateRow = () => {
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const productLine = PRODUCT_LINES[Math.floor(Math.random() * PRODUCT_LINES.length)];
    const revenue = (Math.random() * (10000000 - 1000000) + 1000000).toFixed(2);
    const churnRate = (Math.random() * (0.15 - 0.01) + 0.01).toFixed(4);
    const marketShare = (Math.random() * (35 - 5) + 5).toFixed(2);
    const competitorGrowth = (Math.random() * (40 - 10) + 10).toFixed(2);
    const anomaly = ANOMALIES[Math.floor(Math.random() * ANOMALIES.length)];

    return `${region},${productLine},${revenue},${churnRate},${marketShare},${competitorGrowth},${anomaly}`;
};

const main = () => {
    const header = 'Region,Product_Line,Revenue,Churn_Rate,Market_Share,Competitor_Growth,Anomalies_Detected';
    const rows = [header];

    for (let i = 0; i < 150; i++) {
        rows.push(generateRow());
    }

    const csvContent = rows.join('\n');
    const outputPath = path.join(__dirname, '..', 'omnisight_q3_telemetry.csv');

    try {
        fs.writeFileSync(outputPath, csvContent);
        console.log(`✅ Success! Generated 150 rows of pitch-ready data.`);
        console.log(`📍 Location: ${outputPath}`);
    } catch (error) {
        console.error('❌ Error writing CSV file:', error);
    }
};

main();
