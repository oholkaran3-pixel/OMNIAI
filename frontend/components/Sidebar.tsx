"use client";

import {
  House,
  MessageSquare,
  FileText,
  Globe,
  Bot,
  Settings,
} from "lucide-react";

const menu = [
  { icon: House, label: "Home" },
  { icon: MessageSquare, label: "Chat" },
  { icon: FileText, label: "Documents" },
  { icon: Globe, label: "Web Search" },
  { icon: Bot, label: "Agents" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-cyan-500/20 flex flex-col">
      <div className="p-6 border-b border-cyan-500/20">
        <h1 className="text-3xl font-bold text-cyan-400">
          OmniAI
        </h1>
      </div>

      <nav className="flex-1 p-4">
        {menu.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-cyan-500/10 transition text-gray-300 hover:text-cyan-300"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}