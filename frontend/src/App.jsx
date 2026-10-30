import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import WelcomeBanner from './components/WelcomeBanner';
import MessageItem from './components/MessageItem';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorBanner from './components/ErrorBanner';
import ChatInput from './components/ChatInput';
import { SCHEDULED_LANGUAGES, DEFAULT_LANGUAGE_CODE } from './constants/languages';
import { sendChatMessage, checkBackendHealth } from './services/api';
import './App.css';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE_CODE);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [backendStatus, setBackendStatus] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check backend health on initial load
    checkBackendHealth().then((status) => {
      setBackendStatus(status);
    });
  }, []);

  const activeLanguageObj = SCHEDULED_LANGUAGES.find((l) => l.code === selectedLanguage) || SCHEDULED_LANGUAGES[5];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleLanguageChange = (newCode) => {
    setSelectedLanguage(newCode);
    setErrorMessage('');
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) {
      setErrorMessage('कृपया पहले अपना प्रश्न लिखें (Please enter a question before sending).');
      return;
    }

    setErrorMessage('');

    const userMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const assistantReply = await sendChatMessage(text, selectedLanguage);
      setMessages((prev) => [...prev, assistantReply]);
    } catch {
      setErrorMessage('उत्तर प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    const confirmed = window.confirm('क्या आप पूरी बातचीत मिटाना चाहते हैं? (Are you sure you want to clear the conversation?)');
    if (confirmed) {
      setMessages([]);
      setErrorMessage('');
      setInputText('');
    }
  };

  const handleSelectSampleQuery = (query) => {
    setInputText(query);
  };

  return (
    <div className="app-container">
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onClearChat={handleClearChat}
        messageCount={messages.length}
        isLoading={isLoading}
        backendStatus={backendStatus}
      />

      <main className="chat-main" role="main">
        <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage('')} />

        <div className="conversation-container" aria-label="Chat history">
          {messages.length === 0 ? (
            <WelcomeBanner onSelectSampleQuery={handleSelectSampleQuery} />
          ) : (
            <div className="message-stream">
              {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} />
              ))}
              {isLoading && <LoadingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      <footer className="chat-footer">
        <ChatInput
          inputText={inputText}
          onInputChange={setInputText}
          onSendMessage={() => handleSendMessage(inputText)}
          isLoading={isLoading}
          selectedLanguageName={activeLanguageObj ? `${activeLanguageObj.name} (${activeLanguageObj.nativeName})` : ''}
        />
      </footer>
    </div>
  );
}
