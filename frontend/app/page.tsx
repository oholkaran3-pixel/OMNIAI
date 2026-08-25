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
        <div className="absolute left-[25%] top-[15%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute left-[50%] top-[30%] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute right-[10%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-indigo-600/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.35) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Sidebar */}

      <aside className="relative z-20 shrink-0">
        <Sidebar />
      </aside>

      {/* Main */}

      <section className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Navbar />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Header */}

            <div className="flex flex-col items-center px-4 py-6">
              <div className="mb-4 flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs tracking-wider text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                OMNIAI ONLINE

                <span className="text-slate-500">•</span>

                <span className="text-slate-400">
                  RAG READY
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-[0.3em] text-cyan-300">
                OMNIAI
              </h1>

              <p className="mt-2 text-slate-500">
                Intelligent Multi-Domain Assistant
              </p>
            </div>

            {/* Chat */}

            <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 overflow-hidden px-4 pb-5">
              <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl border border-cyan-400/10 bg-slate-950/60 backdrop-blur-xl">
                <ChatWindow />
              </div>
            </div>
          </div>

          {/* System Panel */}

          <div className="hidden xl:block">
            <SystemPanel />
          </div>
        </div>
      </section>
    </main>
  );
}