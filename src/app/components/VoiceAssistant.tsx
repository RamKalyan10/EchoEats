import { useState } from 'react';
import { Mic, X, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
}

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your EchoEats assistant. Ask me about our menu or say what you're craving!",
      sender: 'assistant',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);

  const suggestedMessages = [
    "What's good for dinner tonight?",
    "I want something spicy",
  ];

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate assistant response
    setTimeout(() => {
      let response = '';
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('dinner') || lowerMessage.includes('tonight')) {
        response = "For a quick meal, our Pad Thai is ready in just 20 minutes!";
      } else if (lowerMessage.includes('spicy')) {
        response = "For a quick meal, our Pad Thai is ready in just 20 minutes!";
      } else if (lowerMessage.includes('burger')) {
        response = "Our Classic Bacon Burger is a bestseller! It's juicy, delicious, and ready in 25 minutes.";
      } else if (lowerMessage.includes('healthy') || lowerMessage.includes('salad')) {
        response = "I recommend our Grilled Chicken Salad - fresh, healthy, and only takes 15 minutes!";
      } else {
        response = "I'd recommend checking out our popular items. The Pad Thai is ready in 20 minutes!";
      }

      const assistantMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      handleSendMessage("What's good for dinner tonight?");
    }, 2000);
  };

  return (
    <>
      {/* Voice Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-orange-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <div>
                <div className="font-semibold">EchoEats Assistant</div>
                <div className="text-xs text-orange-100">Voice-powered ordering</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-orange-600 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Messages */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex gap-2">
              {suggestedMessages.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className="flex-1 bg-orange-50 text-orange-600 px-3 py-2 rounded-full text-xs hover:bg-orange-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t flex items-center gap-2">
            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-full transition-all ${
                isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Mic className={`w-5 h-5 ${isListening ? 'text-white' : 'text-gray-600'}`} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Tap to speak or type below"
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Voice Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110 z-40"
      >
        <Mic className="w-6 h-6" />
      </button>
    </>
  );
}
