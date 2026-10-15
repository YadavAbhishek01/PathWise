import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../componets/Sidebar";

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="flex items-center justify-between border-b border-[#E8E6DF] bg-white p-3 md:hidden">
        <button
          type="button"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E8E6DF] text-[#1F2421]"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <h1 className="font-['Fraunces'] text-lg text-[#1F2421]">PathWise</h1>
      </div>

      <div className="relative flex min-h-screen flex-col md:flex-row">
        <div
          className={`fixed inset-y-0 left-0 z-40 w-[80%] max-w-[260px] border-r border-[#E8E6DF] bg-white transition-transform duration-200 ease-in-out md:static md:w-[220px] md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
        </div>

        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};