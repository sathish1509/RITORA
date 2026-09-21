import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-ivory flex">
      <Sidebar />
      <main className="flex-1 min-w-0 min-h-screen flex flex-col overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

