import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([
    { text: "Hello, how can I help you?", isUser: false },
  ]);
  const [inputText, setInputText] = useState("");

  const handleUserInput = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = { text: inputText, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText("");

    try {
      const response = await fetch("http://127.0.0.1:5000/recommend_movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      const resultText = responseData.result
        .map((sentence) => `${sentence}\n`)
        .join("");
      const botMessage = { text: resultText, isUser: false };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.isUser ? "user-message" : "bot-message"}
            >
              {message.text.split("\n").map((line, lineIndex, array) => (
                <span key={lineIndex}>
                  {line}
                  {lineIndex !== array.length - 1 && <br />}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={inputText}
            onChange={handleUserInput}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;
