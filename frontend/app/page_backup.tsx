"use client";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import ChatWindow from "../components/chat/ChatWindow";
import SystemPanel from "../components/layout/SystemPanel";

export default function Home() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />

        <div className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl animate-pulse" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.35) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

      </div>

      {/* Sidebar */}
      <div className="relative z-10">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">

        <Navbar />

        <div className="flex min-h-0 flex-1 overflow-hidden">

          {/* Chat section */}
          <div className="flex min-w-0 flex-1 flex-col">

            {/* AI Core */}
            <div className="flex justify-center py-6">

              <div className="relative flex h-32 w-32 items-center justify-center">

                <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-spin" />

                <div className="absolute inset-3 rounded-full border border-blue-400/40 animate-spin" />

                <div className="absolute inset-7 rounded-full border border-cyan-300/50 animate-pulse" />

                <div className="absolute h-16 w-16 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />

                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300 bg-cyan-400/10 shadow-[0_0_40px_rgba(34,211,238,0.8)]">

                  <div className="h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,1)] animate-pulse" />

                </div>

              </div>

            </div>

            {/* Status */}
            <div className="mx-auto mb-4 flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-5 py-2 text-sm text-cyan-300">

              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

              OMNIAI SYSTEM ONLINE

              <span className="text-slate-500">•</span>

              RAG READY

              <span className="text-slate-500">•</span>

              AI CORE ACTIVE

            </div>

            {/* Chat */}
            <div className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 overflow-hidden px-4 pb-6">

              <div className="flex w-full flex-1 flex-col rounded-3xl border border-cyan-400/10 bg-slate-950/50 p-4 shadow-[0_0_60px_rgba(8,145,178,0.08)] backdrop-blur-xl">

                <ChatWindow />

              </div>

            </div>

          </div>

          {/* Right System Panel */}
          <SystemPanel />

        </div>

      </div>

    </main>
  );
}