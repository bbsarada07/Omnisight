import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const EditorialSearch: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('ALL ASSETS');

  const filters = [
    'ALL ASSETS',
    'CRITICAL THREATS',
    'ACTIVE NODES',
    'ARCHIVED'
  ];

  const mockResults = [
    {
      id: 1,
      label: 'SERVER NODE // AP-SOUTH-1',
      title: 'Nexus DB Cluster',
      status: 'active'
    },
    {
      id: 2,
      label: 'THREAT VECTOR // EXTERNAL',
      title: 'DDoS Anomaly detected',
      status: 'alert'
    },
    {
      id: 3,
      label: 'ASSET // US-EAST',
      title: 'Main Ingestion Pipeline',
      status: 'active'
    },
    {
      id: 4,
      label: 'SERVER NODE // EU-CENTRAL',
      title: 'Backup Core',
      status: 'active'
    },
    {
      id: 5,
      label: 'THREAT VECTOR // INTERNAL',
      title: 'Unauthorized Access Attempt',
      status: 'alert'
    },
    {
      id: 6,
      label: 'ASSET // GLOBAL',
      title: 'Authentication Gateway',
      status: 'active'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white border border-[#1A1A1A]/15 flex flex-col min-h-[700px] mt-10 rounded-none shadow-none">
      {/* Task 2: The Command Search Header */}
      <div className="flex items-center px-12 py-8 border-b border-[#1A1A1A]/15 bg-white rounded-none shadow-none">
        <Search className="text-[#E63946] w-8 h-8 mr-6" />
        <input 
          type="text" 
          placeholder="Query assets, threat vectors, or global regions..." 
          className="flex-1 bg-transparent text-4xl font-light text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 focus:outline-none rounded-none shadow-none"
        />
      </div>

      {/* Task 3: The Architectural Filter Bar */}
      <div className="flex border-b border-[#1A1A1A]/15 bg-[#F5F5F0] rounded-none shadow-none">
        {filters.map((filter) => (
          <div
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-8 py-4 border-r border-[#1A1A1A]/15 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors cursor-pointer rounded-none shadow-none ${
              activeFilter === filter 
                ? 'bg-white text-[#1A1A1A] shadow-[inset_0_2px_0_#E63946]' 
                : 'text-[#1A1A1A]/50 hover:bg-white hover:text-[#1A1A1A]'
            }`}
          >
            {filter}
          </div>
        ))}
      </div>

      {/* Task 4: The Data Grid */}
      <div className="grid grid-cols-3 bg-[#F5F5F0] flex-1 rounded-none shadow-none">
        {mockResults.map((result, index) => {
          // Determine borders carefully to avoid double borders.
          // In a 3 column grid, the 3rd, 6th... elements do not need a right border if they touch the edge,
          // but since the container has an outer border, we actually can just put border-r on 1st and 2nd cols.
          const isLastInRow = (index + 1) % 3 === 0;

          return (
            <div 
              key={result.id}
              className={`bg-white border-b border-[#1A1A1A]/15 p-8 hover:bg-[#F5F5F0] transition-colors cursor-pointer rounded-none shadow-none ${isLastInRow ? '' : 'border-r'}`}
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-4 font-bold">
                {result.label}
              </div>
              <div className="text-2xl font-medium tracking-tight text-[#1A1A1A] mb-2">
                {result.title}
              </div>
              <div className="text-xs font-mono text-[#1A1A1A]/60 flex items-center gap-2">
                <div className={`w-2 h-2 ${result.status === 'active' ? 'bg-green-500' : 'bg-[#E63946]'}`}></div>
                {result.status.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
