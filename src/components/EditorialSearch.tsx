import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const EditorialSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL ASSETS');

  const queryData = [
    {
      id: 1,
      type: 'SERVER NODE',
      region: 'AP-SOUTH-1',
      name: 'Nexus DB Cluster',
      status: 'ACTIVE'
    },
    {
      id: 2,
      type: 'THREAT VECTOR',
      region: 'EXTERNAL',
      name: 'DDoS Anomaly detected',
      status: 'ALERT'
    },
    {
      id: 3,
      type: 'ASSET',
      region: 'US-EAST',
      name: 'Main Ingestion Pipeline',
      status: 'ACTIVE'
    },
    {
      id: 4,
      type: 'SERVER NODE',
      region: 'EU-CENTRAL',
      name: 'Backup Core',
      status: 'ACTIVE'
    },
    {
      id: 5,
      type: 'THREAT VECTOR',
      region: 'INTERNAL',
      name: 'Unauthorized Access Attempt',
      status: 'ALERT'
    },
    {
      id: 6,
      type: 'ASSET',
      region: 'GLOBAL',
      name: 'Authentication Gateway',
      status: 'ACTIVE'
    }
  ];

  const filteredData = queryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'ALL ASSETS' ? true : 
                          activeFilter === 'CRITICAL THREATS' ? item.status === 'ALERT' :
                          activeFilter === 'ACTIVE NODES' ? item.status === 'ACTIVE' : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05080F] overflow-hidden">
      
      {/* Task 2: The Command Search Header */}
      <div className="flex items-center px-10 py-6 border-b border-slate-800/80 bg-[#0A0E17]/50">
        <Search className="w-6 h-6 text-indigo-500 mr-4 shrink-0" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Query assets, threat vectors, or global regions..." 
          className="flex-1 bg-transparent border-none outline-none text-2xl font-light text-white placeholder:text-slate-600 focus:ring-0 w-full" 
        />
      </div>

      {/* Task 3: The Architectural Filter Bar */}
      <div className="flex gap-8 border-b border-slate-800/80 bg-[#05080F] px-10 pt-4">
        {['ALL ASSETS', 'CRITICAL THREATS', 'ACTIVE NODES', 'ARCHIVED'].map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`pb-4 text-[11px] uppercase tracking-widest font-bold cursor-pointer transition-colors relative outline-none ${
                isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {filter}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Task 4: The Stealth Glassmorphism Data Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
          {filteredData.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#0A0E17]/80 backdrop-blur-sm border border-slate-800/80 p-5 rounded-xl hover:border-indigo-500/50 hover:bg-[#0A0E17] hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all cursor-pointer group flex flex-col min-h-[160px]"
            >
              
              {/* Task 5: Internal Card Typography */}
              <div className="flex justify-between items-start mb-3 text-[10px] uppercase tracking-widest text-slate-500">
                <span>{item.type}</span>
                <span>{item.region}</span>
              </div>
              
              <div className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors mb-2">
                {item.name}
              </div>

              <div className="text-xs text-slate-600 font-mono mb-4">
                Last updated: Just now
              </div>
              
              <div className="mt-auto pt-3 border-t border-slate-800/50 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${item.status === 'ALERT' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${item.status === 'ALERT' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                </span>
                <span className={`${item.status === 'ALERT' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {item.status}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

