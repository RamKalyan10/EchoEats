import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, X, Sparkles, Volume2, ShoppingCart, MicOff } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Food menu data for voice ordering
const FOOD_MENU = [
  // South Indian
  { id: 12, name: 'Masala Dosa', price: 7.99, category: 'south-indian', keywords: ['dosa', 'masala dosa', 'south indian'] },
  { id: 27, name: 'Idli with Sambar', price: 5.99, category: 'south-indian', keywords: ['idli', 'idly', 'sambar'] },
  { id: 28, name: 'Medu Vada', price: 5.99, category: 'south-indian', keywords: ['vada', 'medu vada', 'vade'] },
  { id: 29, name: 'Uttapam', price: 6.99, category: 'south-indian', keywords: ['uttapam', 'uttappam', 'uthappam'] },
  
  // Biryanis
  { id: 13, name: 'Vegetable Biryani', price: 11.99, category: 'biryani', keywords: ['veg biryani', 'vegetable biryani', 'biryani veg'] },
  { id: 14, name: 'Chicken Biryani', price: 13.99, category: 'biryani', keywords: ['chicken biryani', 'biryani chicken'] },
  { id: 15, name: 'Egg Biryani', price: 10.99, category: 'biryani', keywords: ['egg biryani', 'biryani egg'] },
  
  // Curries
  { id: 18, name: 'Paneer Butter Masala', price: 10.99, category: 'veg-curries', keywords: ['paneer', 'paneer butter', 'paneer masala'] },
  { id: 19, name: 'Chana Masala', price: 8.99, category: 'veg-curries', keywords: ['chana', 'chole', 'chickpea'] },
  { id: 22, name: 'Butter Chicken', price: 13.99, category: 'non-veg', keywords: ['butter chicken', 'chicken butter'] },
  
  // Street Food
  { id: 35, name: 'Pav Bhaji', price: 7.99, category: 'street-food', keywords: ['pav bhaji', 'pav baji', 'bhaji'] },
  { id: 36, name: 'Vada Pav', price: 4.99, category: 'street-food', keywords: ['vada pav', 'wada pav', 'vadapav'] },
  { id: 37, name: 'Pani Puri', price: 5.99, category: 'street-food', keywords: ['pani puri', 'golgappa', 'puchka'] },
  
  // Desserts
  { id: 43, name: 'Gulab Jamun', price: 4.99, category: 'desserts', keywords: ['gulab jamun', 'gulabjamun', 'sweet'] },
  
  // Beverages
  { id: 49, name: 'Filter Coffee', price: 2.99, category: 'beverages', keywords: ['coffee', 'filter coffee', 'south indian coffee'] },
  { id: 50, name: 'Masala Chai', price: 2.49, category: 'beverages', keywords: ['tea', 'chai', 'masala chai'] },
];

interface VoiceAssistantProps {
  onAddToCart?: (item: { id: number; name: string; price: number; image: string }) => void;
}

export function VoiceAssistant({ onAddToCart }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your EchoEats voice assistant. Click the microphone to speak or type your order. Try 'I want chicken biryani'!",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceCart, setVoiceCart] = useState<CartItem[]>([]);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  // Initialize Web Speech API
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    // Check for Speech Recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      setIsVoiceSupported(false);
      return;
    }

    try {
      // Initialize recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        console.log('Recognized:', transcript, 'Confidence:', confidence);
        
        if (transcript && transcript.trim()) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'no-speech':
            toast('No speech detected. Please try again.', { duration: 3000 });
            break;
          case 'audio-capture':
            toast.error('No microphone found. Please check your device.');
            break;
          case 'not-allowed':
            toast.error('Microphone access denied. Please enable in browser settings.', { duration: 5000 });
            break;
          case 'network':
            toast.error('Network error. Please check your connection.');
            break;
          case 'aborted':
            // User stopped, no message needed
            break;
          default:
            toast('Could not recognize speech. Please try typing instead.', { duration: 3000 });
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        synthesisRef.current = window.speechSynthesis;
        
        // Load voices
        window.speechSynthesis.getVoices();
      }

      isInitializedRef.current = true;

    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setIsVoiceSupported(false);
      toast.error('Voice features unavailable. You can still type!');
    }

    return () => {
      // Cleanup
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = useCallback((text: string) => {
    if (!synthesisRef.current) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Try to use a more natural voice
    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Female') || voice.lang.includes('en-US')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    synthesisRef.current.speak(utterance);
  }, []);

  const findFoodItem = (query: string): typeof FOOD_MENU[0] | null => {
    const lowerQuery = query.toLowerCase();
    
    // Direct match by name or keywords
    for (const item of FOOD_MENU) {
      if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return item;
      }
    }
    
    return null;
  };

  const getRecommendations = (query: string): typeof FOOD_MENU => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('spicy') || lowerQuery.includes('hot')) {
      return FOOD_MENU.filter(item => 
        ['Chicken Biryani', 'Pav Bhaji', 'Pani Puri', 'Chana Masala'].includes(item.name)
      );
    }
    
    if (lowerQuery.includes('vegetarian') || lowerQuery.includes('veg')) {
      return FOOD_MENU.filter(item => 
        item.category === 'veg-curries' || item.category === 'south-indian'
      );
    }
    
    if (lowerQuery.includes('breakfast')) {
      return FOOD_MENU.filter(item => 
        ['Idli with Sambar', 'Masala Dosa', 'Medu Vada', 'Uttapam'].includes(item.name)
      );
    }
    
    if (lowerQuery.includes('dessert') || lowerQuery.includes('sweet')) {
      return FOOD_MENU.filter(item => item.category === 'desserts');
    }
    
    // Return popular items
    return FOOD_MENU.slice(0, 3);
  };

  const addToVoiceCart = (item: typeof FOOD_MENU[0], quantity: number = 1) => {
    setVoiceCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity }];
    });

    // Also add to main cart if callback provided
    if (onAddToCart) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          image: '', // Image will be handled by main app
        });
      }
    }
  };

  const processOrder = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Extract quantity
    let quantity = 1;
    const quantityMatch = lowerQuery.match(/(\d+|one|two|three|four|five)/);
    if (quantityMatch) {
      const num = quantityMatch[1];
      const numberMap: { [key: string]: number } = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5
      };
      quantity = numberMap[num] || parseInt(num) || 1;
    }

    // Check for specific item
    const item = findFoodItem(query);
    if (item) {
      addToVoiceCart(item, quantity);
      return `Great choice! I've added ${quantity} ${item.name} to your cart for $${(item.price * quantity).toFixed(2)}. What else would you like?`;
    }

    // Check for category requests
    if (lowerQuery.includes('show') || lowerQuery.includes('what') || lowerQuery.includes('menu')) {
      const recommendations = getRecommendations(query);
      if (recommendations.length > 0) {
        const itemsList = recommendations.map(item => `${item.name} for $${item.price}`).join(', ');
        return `Here are some options: ${itemsList}. Which would you like?`;
      }
    }

    // Check for cart-related queries
    if (lowerQuery.includes('cart') || lowerQuery.includes('order') && !lowerQuery.includes('place order')) {
      if (voiceCart.length === 0) {
        return "Your cart is empty. What would you like to order?";
      }
      const total = voiceCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const cartItems = voiceCart.map(item => `${item.quantity} ${item.name}`).join(', ');
      return `You have ${cartItems}. Total is $${total.toFixed(2)}. Ready to checkout?`;
    }

    // Checkout
    if (lowerQuery.includes('checkout') || lowerQuery.includes('place order') || lowerQuery.includes('confirm')) {
      if (voiceCart.length === 0) {
        return "Your cart is empty. Please add some items first!";
      }
      const total = voiceCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setVoiceCart([]);
      return `Perfect! Your order of $${total.toFixed(2)} has been placed. It will arrive in about 30 minutes. Thank you!`;
    }

    // Default response
    return "I can help you order food! Try 'I want chicken biryani' or 'Show me breakfast items'. What would you like?";
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Process and respond
    setTimeout(() => {
      const response = processOrder(message);
      
      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response (shorter version for speed)
      const shortResponse = response.length > 100 ? response.substring(0, 100) + '...' : response;
      speak(shortResponse);
    }, 500);
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not available. Please type instead.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Error stopping recognition:', e);
      }
      setIsListening(false);
      return;
    }

    try {
      recognitionRef.current.start();
      toast('🎤 Listening... Speak now!', { duration: 2000 });
    } catch (error: any) {
      console.error('Error starting recognition:', error);
      if (error.message && error.message.includes('already started')) {
        // Recognition already running, just stop it
        recognitionRef.current.stop();
      } else {
        toast.error('Failed to start voice recognition. Please try again.');
      }
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const suggestedMessages = [
    "I want chicken biryani",
    "Show me South Indian food",
    "What's for breakfast?",
    "Add masala dosa",
  ];

  return (
    <>
      {/* Voice Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-orange-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <div>
                <div className="font-semibold">EchoEats Assistant</div>
                <div className="text-xs text-orange-100">
                  {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : isVoiceSupported ? 'Voice-powered' : 'Type your order'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Voice Cart Summary */}
          {voiceCart.length > 0 && (
            <div className="p-3 bg-orange-50 border-b border-orange-200">
              <div className="flex items-center gap-2 text-sm">
                <ShoppingCart className="w-4 h-4 text-orange-600" />
                <span className="text-orange-800 font-medium">
                  {voiceCart.length} item{voiceCart.length !== 1 ? 's' : ''} in cart
                </span>
                <span className="ml-auto text-orange-600 font-bold">
                  ${voiceCart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Voice Not Supported Warning */}
          {!isVoiceSupported && (
            <div className="p-3 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-start gap-2 text-sm">
                <MicOff className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-yellow-800 text-xs">
                    Voice recognition not supported. Please use Chrome, Edge, or Safari. You can still type!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Messages */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 space-y-2">
              <p className="text-xs text-gray-500 mb-1">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedMessages.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                    className="bg-orange-50 text-orange-600 px-3 py-2 rounded-lg text-xs hover:bg-orange-100 transition-colors text-left border border-orange-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
            <div className="flex items-center gap-2">
              {isVoiceSupported && (
                <button
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-full transition-all flex-shrink-0 ${
                    isListening 
                      ? 'bg-red-500 animate-pulse shadow-lg' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  } text-white`}
                  title={isListening ? 'Click to stop listening' : 'Click to start voice input'}
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors animate-pulse flex-shrink-0"
                  title="Stop speaking"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder={isVoiceSupported ? "Type or speak..." : "Type your order..."}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex-shrink-0"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Voice Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all hover:scale-110 z-40 ${
          isOpen 
            ? 'bg-gray-500 hover:bg-gray-600' 
            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
        } text-white`}
        title={isOpen ? 'Close assistant' : 'Open voice assistant'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {/* Voice indicator badge */}
      {isListening && !isOpen && (
        <div className="fixed bottom-20 right-6 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse z-40">
          🎤 Listening...
        </div>
      )}
    </>
  );
}
