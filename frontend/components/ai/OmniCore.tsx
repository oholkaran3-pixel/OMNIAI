"use client";

import { useEffect, useRef, useState } from "react";

type SpeechResult = {
  transcript: string;
};

type SpeechRecognitionEventLike = Event & {
  results: {
    [index: number]: {
      [index: number]: SpeechResult;
    };
  };
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  onresult:
    | ((event: SpeechRecognitionEventLike) => void)
    | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const BACKEND_URL = "http://localhost:8000";

export default function OmniCore() {
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [status, setStatus] = useState("Touch to talk");
  const [error, setError] = useState("");

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  // --------------------------------------------------
  // INITIALIZE SPEECH RECOGNITION
  // --------------------------------------------------

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice input is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    // Start with English.
    // We will add automatic language selection later.
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      setThinking(false);
      setStatus("Listening...");
      setError("");
    };

    recognition.onresult = async (
      event: SpeechRecognitionEventLike
    ) => {
      const transcript =
        event.results[0]?.[0]?.transcript?.trim();

      if (!transcript) {
        setStatus("I didn't hear that.");
        return;
      }

      console.log("Voice input:", transcript);

      setListening(false);
      setThinking(true);
      setStatus("Thinking...");

      await sendVoiceMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);

      setListening(false);
      setThinking(false);
      setStatus("Voice error");

      setError(
        "I could not hear you. Please try again."
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  // --------------------------------------------------
  // SEND VOICE MESSAGE TO OMNIAI
  // --------------------------------------------------

  async function sendVoiceMessage(
    voiceText: string
  ) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: voiceText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend error: ${response.status}`
        );
      }

      const data = await response.json();

      const reply =
        data.reply || "I don't have an answer yet.";

      console.log("OmniAI reply:", reply);

      setStatus("Speaking...");

      speakReply(reply);

    } catch (error) {
      console.error(
        "OmniAI voice error:",
        error
      );

      setThinking(false);
      setStatus("Backend unavailable");

      setError(
        "Cannot connect to OmniAI backend."
      );
    }
  }

  // --------------------------------------------------
  // TEXT TO SPEECH
  // --------------------------------------------------

  function speakReply(text: string) {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      setThinking(false);
      setStatus("Ready");
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.rate = 1.05;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onend = () => {
      setThinking(false);
      setListening(false);
      setStatus("Touch to talk");
    };

    speech.onerror = () => {
      setThinking(false);
      setStatus("Touch to talk");
    };

    window.speechSynthesis.speak(speech);
  }

  // --------------------------------------------------
  // START / STOP LISTENING
  // --------------------------------------------------

  function toggleListening() {
    if (!recognitionRef.current) {
      setError(
        "Voice input is not available."
      );
      return;
    }

    setError("");

    // Stop speaking if OmniAI is currently speaking.
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (listening) {
      recognitionRef.current.stop();

      setListening(false);
      setThinking(false);
      setStatus("Touch to talk");

      return;
    }

    try {
      setStatus("Starting microphone...");

      recognitionRef.current.start();
    } catch (error) {
      console.error(
        "Microphone start error:",
        error
      );

      setListening(false);
      setThinking(false);
      setStatus("Touch to talk");
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="flex flex-col items-center">

      {/* AI CORE */}

      <button
        type="button"
        onClick={toggleListening}
        disabled={thinking}
        aria-label="Talk to OmniAI"
        className="group relative flex h-64 w-64 items-center justify-center rounded-full outline-none"
      >

        {/* Outer glow */}

        <div
          className={`absolute inset-0 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 ${
            listening
              ? "scale-125 bg-cyan-300/25"
              : thinking
                ? "scale-110 bg-blue-400/20"
                : "group-hover:scale-110"
          }`}
        />

        {/* Outer ring */}

        <div
          className={`absolute inset-2 rounded-full border transition-all duration-700 ${
            listening
              ? "animate-spin border-cyan-300/70"
              : "border-cyan-400/30"
          }`}
        />

        {/* Second ring */}

        <div
          className={`absolute inset-7 rounded-full border border-blue-400/40 ${
            listening
              ? "animate-[spin_3s_linear_infinite]"
              : ""
          }`}
        />

        {/* Third ring */}

        <div
          className={`absolute inset-12 rounded-full border border-cyan-300/50 ${
            thinking
              ? "animate-pulse"
              : ""
          }`}
        />

        {/* Core glow */}

        <div
          className={`absolute h-32 w-32 rounded-full blur-2xl transition-all duration-500 ${
            listening
              ? "bg-cyan-300/40"
              : thinking
                ? "bg-blue-400/40"
                : "bg-cyan-400/20"
          }`}
        />

        {/* Central sphere */}

        <div
          className={`relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-cyan-300/80 bg-slate-950 shadow-[0_0_50px_rgba(34,211,238,0.6)] transition-all duration-500 ${
            listening
              ? "scale-110 shadow-[0_0_80px_rgba(34,211,238,0.9)]"
              : thinking
                ? "scale-105 shadow-[0_0_70px_rgba(59,130,246,0.8)]"
                : "group-hover:scale-105"
          }`}
        >

          {/* Inner energy */}

          <div
            className={`h-8 w-8 rounded-full bg-cyan-300 shadow-[0_0_30px_rgba(103,232,249,1)] ${
              listening || thinking
                ? "animate-pulse"
                : ""
            }`}
          />

        </div>

        {/* Orbit dot */}

        <div className="absolute inset-0 animate-[spin_5s_linear_infinite]">

          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,1)]" />

        </div>

      </button>

      {/* STATUS */}

      <div className="mt-3 text-center">

        <div
          className={`text-sm font-semibold tracking-[0.2em] ${
            listening
              ? "text-cyan-300"
              : thinking
                ? "text-blue-300"
                : "text-slate-400"
          }`}
        >
          {status}
        </div>

        <div className="mt-1 text-xs text-slate-600">
          {listening
            ? "Speak now"
            : thinking
              ? "OmniAI is processing your request"
              : "Click the core to speak"}
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-3 max-w-sm rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-2 text-center text-xs text-red-300">
          {error}
        </div>
      )}

    </div>
  );
}