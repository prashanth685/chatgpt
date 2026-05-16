import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Hey 👋 I’m your AI assistant. Ask me anything!",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);

    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userMessage.text,
      });

      const botMessage = {
        id: Date.now() + 1,
        text: res.data.reply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "Something went wrong. Try again.",
          sender: "bot",
          error: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="app">
      <div className="chat-card">
        {/* HEADER */}
        <div className="chat-header">
          <div className="title">
            <div className="dot" />
            <h2>AI Assistant</h2>
          </div>
          <span className="status">Online</span>
        </div>

        {/* MESSAGES */}
        <div className="chat-body">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`msg ${msg.sender === "user" ? "right" : "left"}`}
            >
              <div className={`bubble ${msg.error ? "error" : ""}`}>
                {msg.text}
                <div className="time">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="msg left">
              <div className="bubble typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <form className="chat-input" onSubmit={sendMessage}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />

          <button disabled={isLoading || !input.trim()}>➤</button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
