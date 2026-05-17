import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { EditorialSearch } from '../components/EditorialSearch';

export const HistoryPage: React.FC = () => {
  return (
    <div className="workspace-layout">
      <Sidebar />
      
      <main className="workspace-content bg-[#F5F5F0]">
        <EditorialSearch />
      </main>

    </div>
  );
};
