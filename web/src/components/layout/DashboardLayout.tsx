import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar />
      <main className="ml-[260px] transition-all duration-300 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
