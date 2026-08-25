"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

type SystemStatus = {
  status: string;
  rag: string;
  documents: number;
  pdfs: number;
  fastapi: string;
  chromadb: string;
  ollama: string;
};

export default function SystemPanel() {
  const [system, setSystem] = useState<SystemStatus | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await fetch(
          `${BACKEND_URL}/status`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data = await response.json();

        setSystem(data);
      } catch (error) {
        console.error(
          "Status Error:",
          error
        );

        setSystem(null);
      }
    }

    loadStatus();

    const interval = setInterval(
      loadStatus,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const online =
    system?.status === "online";

  return (
    <aside className="hidden w-72 shrink-0 border-l border-cyan-400/10 bg-slate-950/40 p-5 backdrop-blur-xl xl:block">

      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          System Overview
        </div>

        <div className="mt-2 text-sm text-slate-500">
          OmniAI intelligence core
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-300">
            AI Core
          </span>

          <span
            className={`flex items-center gap-2 text-xs ${
              online
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            <span
              className={`h-2 w-2 animate-pulse rounded-full ${
                online
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
            />

            {online
              ? "ONLINE"
              : "OFFLINE"}
          </span>

        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-[92%] rounded-full bg-cyan-400" />
        </div>

      </div>

      <div className="mb-4 rounded-2xl border border-blue-400/10 bg-blue-400/5 p-4">

        <div className="flex items-center justify-between">

          <span className="text-sm text-slate-300">
            RAG Engine
          </span>

          <span className="text-xs text-cyan-400">
            {system?.rag?.toUpperCase() ||
              "CHECKING"}
          </span>

        </div>

      </div>

      <div className="mb-4 rounded-2xl border border-cyan-400/10 bg-slate-900/50 p-4">

        <div className="text-xs uppercase tracking-widest text-slate-500">
          Knowledge Base
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-cyan-400/5 p-3">

            <div className="text-xs text-slate-500">
              PDFs
            </div>

            <div className="mt-1 text-2xl font-bold text-cyan-300">
              {system?.pdfs ?? 0}
            </div>

          </div>

          <div className="rounded-xl bg-blue-400/5 p-3">

            <div className="text-xs text-slate-500">
              Chunks
            </div>

            <div className="mt-1 text-2xl font-bold text-blue-300">
              {system?.documents ?? 0}
            </div>

          </div>

        </div>

      </div>

      <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/50 p-4">

        <div className="mb-4 text-xs uppercase tracking-widest text-slate-500">
          Services
        </div>

        <div className="space-y-3">

          <div className="flex justify-between">

            <span>FastAPI</span>

            <span>
              {system?.fastapi?.toUpperCase() ||
                "OFFLINE"}
            </span>

          </div>

          <div className="flex justify-between">

            <span>Ollama</span>

            <span>
              {system?.ollama?.toUpperCase() ||
                "OFFLINE"}
            </span>

          </div>

          <div className="flex justify-between">

            <span>ChromaDB</span>

            <span>
              {system?.chromadb?.toUpperCase() ||
                "OFFLINE"}
            </span>

          </div>

        </div>

      </div>

    </aside>
  );
}