// src/pages/AITrainer.jsx
import React, { useState, useRef, useEffect } from 'react';
import './AITrainer.css';

const AITrainer = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: '👋 Cześć! Jestem Twoim AI Trenerem w aplikacji FIT DZIK! Mogę pomóc Ci w treningu, diecie i odpowiedzieć na wszystkie pytania związane z aktywnością fizyczną. O czym chciałbyś porozmawiać?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Błąd serwera');
      }

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: '❌ Przepraszam, wystąpił błąd podczas łączenia z AI Trenerem. Spróbuj ponownie za chwilę.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    try {
      await fetch('http://localhost:4000/chat/reset', {
        method: 'GET'
      });
      
      setMessages([
        {
          id: 1,
          type: 'ai',
          text: '👋 Cześć! Jestem Twoim AI Trenerem w aplikacji FIT DZIK! Mogę pomóc Ci w treningu, diecie i odpowiedzieć na wszystkie pytania związane z aktywnością fizyczną. O czym chciałbyś porozmawiać?',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Błąd podczas resetowania czatu:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickQuestions = [
    "Jak zacząć trening siłowy?",
    "Jaka dieta na masę?",
    "Jak schudnąć zdrowo?",
    "Plan treningowy dla początkujących",
    "Suplementy - co warto brać?",
    "Regeneracja po treningu"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="ai-trainer">
      <div className="chat-header">
        <div className="header-content">
          <h1>🤖 AI Trener FIT DZIK</h1>
          <p>Twój osobisty asystent treningowy i dietetyczny</p>
        </div>
        <button className="reset-btn" onClick={resetChat}>
          🔄 Nowa rozmowa
        </button>
      </div>

      <div className="quick-questions">
        <h3>💡 Szybkie pytania:</h3>
        <div className="questions-grid">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              className="quick-question-btn"
              onClick={() => handleQuickQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                <div className="message-text">
                  {message.text}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
              <div className="message-avatar">
                {message.type === 'ai' ? '🤖' : '👤'}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message ai">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="message-avatar">🤖</div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Napisz swoje pytanie o trening, dietę lub zdrowie..."
              className="message-input"
              rows="2"
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              {isLoading ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITrainer;
