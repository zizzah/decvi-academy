'use client';

import { useEffect, useRef, useState } from "react";

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatRoomProps {
  roomId: string;
  backendWsUrl?: string;
}

export default function ChatRoom({ roomId, backendWsUrl = "ws://localhost:8000" }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${backendWsUrl}/ws/chat/${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const msg: Message = {
        sender: "other", // you can parse sender from event.data if you send structured JSON
        text: event.data,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, msg]);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [roomId, backendWsUrl]);

  const sendMessage = () => {
    if (wsRef.current && inputValue.trim() !== "") {
      // If your backend expects raw text:
      wsRef.current.send(inputValue);
      const myMsg: Message = {
        sender: "me",
        text: inputValue,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, myMsg]);
      setInputValue("");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", maxWidth: "400px" }}>
      <h3>Chat Room: {roomId}</h3>
      <div style={{ minHeight: "200px", marginBottom: "1rem", overflowY: "auto", border: "1px solid #eee", padding: "0.5rem" }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: "0.5rem" }}>
            <strong>{m.sender}:</strong> {m.text} <small>({m.timestamp})</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message…"
        style={{ width: "calc(100% - 80px)", marginRight: "8px" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
