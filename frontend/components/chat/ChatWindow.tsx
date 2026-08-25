"use client";

import { useRef, useState } from "react";

import ChatInput from "./ChatInput";
import OmniCore from "../ai/OmniCore";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BACKEND_URL = "http://localhost:8000";

const LANGUAGE_CODES: Record<string, string> = {
  "In English (India)": "en-IN",
  "In English (US)": "en-US",
  "In Hindi": "hi-IN",
  "In Marathi": "mr-IN",
  "In Tamil": "ta-IN",
  "In Telugu": "te-IN",
  "In Bengali": "bn-IN",
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm OmniAI.",
    },
  ]);

  const [language, setLanguage] =
    useState("In English (India)");

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  // =================================================
  // CHAT
  // =================================================

  async function handleSend(message: string) {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: trimmedMessage,
      },
    ]);

    try {
      const response = await fetch(
        `${BACKEND_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmedMessage,
            language:
              LANGUAGE_CODES[language] || "en-IN",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend error: ${response.status}`
        );
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "I don't have an answer yet.",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Backend unavailable.",
        },
      ]);
    }
  }

  // =================================================
  // OPEN PDF FILE PICKER
  // =================================================

  function handleChoosePDF() {
    if (uploading) return;

    setUploadStatus("");
    setUploadError("");

    fileInputRef.current?.click();
  }

  // =================================================
  // PDF UPLOAD
  // =================================================

  async function handlePDFChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    // Reset input so selecting the same file again
    // will trigger onChange.
    event.target.value = "";

    if (!file) return;

    setUploadError("");
    setUploadStatus("");

    // Basic frontend validation
    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setUploadError(
        "Please select a PDF file."
      );
      return;
    }

    setUploading(true);
    setUploadStatus(
      `Uploading ${file.name}...`
    );

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `${BACKEND_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        let errorMessage =
          `Upload failed: HTTP ${response.status}`;

        try {
          const errorData =
            await response.json();

          if (errorData?.detail) {
            errorMessage =
              typeof errorData.detail === "string"
                ? errorData.detail
                : JSON.stringify(
                    errorData.detail
                  );
          }
        } catch {
          // Keep the HTTP error message.
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      console.log(
        "PDF upload response:",
        data
      );

      setUploadStatus(
        `PDF added successfully • ${
          data.pages ?? 0
        } pages • ${
          data.chunks ?? 0
        } chunks`
      );
    } catch (error) {
      console.error(
        "PDF upload error:",
        error
      );

      if (
        error instanceof TypeError
      ) {
        setUploadError(
          "Cannot connect to OmniAI backend."
        );
      } else if (
        error instanceof Error
      ) {
        setUploadError(
          error.message
        );
      } else {
        setUploadError(
          "PDF upload failed."
        );
      }

      setUploadStatus("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* ================================================= */}
      {/* OMNI CORE */}
      {/* ================================================= */}

      <div className="flex shrink-0 justify-center pt-0">
        <div className="scale-[0.78] origin-top">
          <OmniCore />
        </div>
      </div>

      {/* ================================================= */}
      {/* MESSAGES */}
      {/* ================================================= */}

      <div className="min-h-0 flex-1 overflow-y-auto px-3">

        <div className="flex flex-col gap-3">

          {messages.map((message, index) => {
            const isUser =
              message.role === "user";

            return (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  isUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl border px-4 py-3 ${
                    isUser
                      ? "border-cyan-400/30 bg-cyan-500/10"
                      : "border-blue-400/20 bg-slate-900/70"
                  }`}
                >

                  <div
                    className={`mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      isUser
                        ? "text-cyan-300"
                        : "text-blue-300"
                    }`}
                  >
                    {isUser
                      ? "YOU"
                      : "OMNIAI"}
                  </div>

                  <div className="text-sm leading-6 text-slate-200">
                    {message.content}
                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* ================================================= */}
      {/* VOICE LANGUAGE */}
      {/* ================================================= */}

      <div className="shrink-0 px-3 pb-2">

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-cyan-400/10 bg-slate-900/60 px-4 py-2.5">

          <div>

            <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-cyan-300">
              <span>🌐</span>
              <span>VOICE LANGUAGE</span>
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Voice recognition + AI response language
            </div>

          </div>

          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value)
            }
            className="w-52 rounded-xl border border-cyan-400/20 bg-slate-950 px-4 py-2.5 text-sm font-medium text-cyan-100 outline-none"
          >
            <option>
              In English (India)
            </option>

            <option>
              In English (US)
            </option>

            <option>
              In Hindi
            </option>

            <option>
              In Marathi
            </option>

            <option>
              In Tamil
            </option>

            <option>
              In Telugu
            </option>

            <option>
              In Bengali
            </option>

          </select>

        </div>

      </div>

      {/* ================================================= */}
      {/* KNOWLEDGE BASE */}
      {/* ================================================= */}

      <div className="shrink-0 px-3 pb-2">

        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 px-4 py-2.5">

          <div className="flex items-center justify-between gap-4">

            <div>

              <div className="flex items-center gap-2 text-base font-semibold text-cyan-100">
                <span>📄</span>
                <span>Knowledge Base</span>
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Upload a PDF to give OmniAI new information
              </div>

            </div>

            {/* Hidden file input */}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handlePDFChange}
            />

            {/* Choose PDF button */}

            <button
              type="button"
              onClick={handleChoosePDF}
              disabled={uploading}
              className={`shrink-0 rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                uploading
                  ? "cursor-not-allowed border-cyan-400/20 bg-cyan-400/5 text-cyan-500"
                  : "border-cyan-400/30 bg-cyan-400/5 text-cyan-300 hover:border-cyan-300/60 hover:bg-cyan-400/10"
              }`}
            >
              {uploading
                ? "Uploading..."
                : "Choose PDF"}
            </button>

          </div>

          {/* Upload success */}

          {uploadStatus && (
            <div className="mt-2 rounded-xl border border-green-400/20 bg-green-400/5 px-3 py-2 text-xs text-green-300">
              {uploadStatus}
            </div>
          )}

          {/* Upload error */}

          {uploadError && (
            <div className="mt-2 rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs text-red-300">
              {uploadError}
            </div>
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* INPUT */}
      {/* ================================================= */}

      <div className="shrink-0">
        <ChatInput
          onSend={handleSend}
        />
      </div>

    </div>
  );
}