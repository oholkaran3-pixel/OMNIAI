import { Message as ChatMessage } from "@/types/chat";

interface Props {
  message: ChatMessage;
}

export default function Message({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl rounded-2xl p-4 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-cyan-500/20 text-white"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}