"use client";

import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [message, setMessage] = useState("");

  function handleSend() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSend(trimmedMessage);
    setMessage("");
  }

  return (
    <div className="flex gap-3 border-t border-cyan-500/20 p-4">

      <input
        className="min-w-0 flex-1 rounded-xl bg-slate-900 p-3 text-white outline-none placeholder:text-slate-500"
        placeholder="Ask OmniAI anything..."
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={!message.trim()}
        className="rounded-xl bg-cyan-500 px-5 text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Send
      </button>

    </div>
  );
}