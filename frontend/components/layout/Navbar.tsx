"use client";

import { Bell, Search, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 border-b border-cyan-500/20 bg-slate-950 flex items-center justify-between px-6">

      <h2 className="text-2xl font-bold text-cyan-400">
        OmniAI
      </h2>

      <div className="flex items-center gap-4">

        <div className="flex items-center bg-slate-900 rounded-lg px-4 py-2">

          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="ml-2 bg-transparent outline-none text-white w-72"
          />

        </div>

        <Bell className="text-gray-300 cursor-pointer hover:text-cyan-400" />

        <Settings className="text-gray-300 cursor-pointer hover:text-cyan-400" />

      </div>

    </header>
  );
}