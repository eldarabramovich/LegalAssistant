import React, { useState } from "react";

function ChatPrompt() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:4000/api/chat";
      const res = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (res.status === 500) {
        throw new Error("Server error. Please try again later.");
      }
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data.response || "No response received.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Window</h2>
      <textarea
        className="chat-textarea"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your message..."
        aria-label="Chat prompt"
      ></textarea>
      <button
        className="chat-button"
        onClick={handleSend}
        disabled={loading}
        aria-label="Send message"
      >
        {loading ? "Sending..." : "Send"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div style={{ marginTop: "10px", padding: "10px", background: "#f9f9f9" }}>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default ChatPrompt;
