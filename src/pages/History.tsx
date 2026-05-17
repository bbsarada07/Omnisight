import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { EditorialSearch } from '../components/EditorialSearch';

export const HistoryPage: React.FC = () => {
  return (
    <div className="workspace-layout">
      <Sidebar />
      
      <main className="workspace-content bg-[#05080F] p-0 flex flex-col h-full overflow-hidden">
        <EditorialSearch />
      </main>

    </div>
  );
};
