import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToApi } from '../api/chat';
import type { Message } from '../api/chat';
import './Chatbot.css';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '안녕하세요! 영어 단어 퀴즈 챗봇입니다. 원하시는 영어 학습 주제와 난이도를 말씀해 주시면, 맞춤형 단어와 퀴즈를 준비해 드릴게요!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessage = await sendMessageToApi(newMessages);
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages([...newMessages, { role: 'assistant', content: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        <header className="chatbot-header">
          <div className="header-icon">🤖</div>
          <div className="header-title">
            <h2>Vocab Quiz Bot</h2>
            <p>당신의 똑똑한 영어 학습 파트너</p>
          </div>
        </header>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-row ${msg.role}`}>
              {msg.role === 'assistant' && <div className="avatar">🤖</div>}
              <div className={`message-bubble ${msg.role}`}>
                {msg.content.split('\\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-row assistant">
              <div className="avatar">🤖</div>
              <div className="message-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="주제나 난이도를 입력하거나 대답해보세요..."
            disabled={isLoading}
          />
          <button type="submit" disabled={!input.trim() || isLoading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
