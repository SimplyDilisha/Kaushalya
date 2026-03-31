import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Mic, MicOff, Volume2, VolumeX, Sparkles,
  User, Bot, Loader2, RefreshCw, ArrowLeft, Heart, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Chatbot responses database - job platform focused
const chatResponses = {
  greetings: [
    "Hello! 👋 I'm Asha, your friendly assistant at ApnaRozgaar. I'm here to help you find inclusive job opportunities. How can I assist you today?",
    "Welcome! 🌟 I'm Asha, and I'm excited to help you on your career journey. What would you like to know?",
    "Hi there! 💜 I'm here to make your job search easier and more accessible. Ask me anything!"
  ],
  profile: [
    "Creating your profile is easy! 📝\n\n1. Click 'My Profile' in the menu\n2. Fill in your skills and experience\n3. Optionally share accommodation needs (100% confidential)\n4. Get matched with suitable employers!\n\nYour information helps us find the perfect fit. Need help with any step?",
    "Your profile is your superpower! 💪 It helps employers understand your amazing skills. You can:\n• Add your work history\n• List certifications\n• Specify preferred work arrangements\n• Upload your resume\n\nAll accessibility info is optional and protected!"
  ],
  accommodations: [
    "Great question about accommodations! ♿\n\nWe work with employers who provide:\n• Screen reader compatible workstations\n• Flexible schedules\n• Remote work options\n• Physical accessibility features\n• Sign language interpreters\n• Assistive technology\n\nEach job listing clearly shows available accommodations!",
    "Workplace accommodations are legally protected! 🛡️\n\nPopular accommodations include:\n• Modified work hours\n• Ergonomic equipment\n• Quiet workspaces\n• Communication aids\n\nYou can filter jobs by specific accommodations you need."
  ],
  employers: [
    "For employers, we offer: 🏢\n\n• Access to talented, diverse candidates\n• Disability-confident hiring guidance\n• Accommodation planning support\n• Inclusive job posting tools\n\nVisit 'For Employers' to post inclusive opportunities!",
    "Inclusive hiring is smart business! 📊\n\nCompanies on our platform commit to:\n• Accessible workplaces\n• Equal opportunity hiring\n• Reasonable accommodations\n• Supportive culture\n\nWant to learn more about becoming an inclusive employer?"
  ],
  help: [
    "I'm here to help! 🤗 Here's what I can assist with:\n\n• 🔍 Finding accessible jobs\n• 📝 Building your profile\n• ♿ Understanding accommodations\n• 🏢 Employer information\n• 🌐 Navigating the platform\n\nJust ask me anything!",
    "Need assistance? I've got you! 💜\n\nTry asking about:\n• 'How do I find remote jobs?'\n• 'What accommodations are available?'\n• 'How do I apply for a job?'\n• 'Is my information private?'\n\nOr use the quick action buttons below!"
  ],
  privacy: [
    "Your privacy is our priority! 🔒\n\n• Disability information is OPTIONAL\n• Data is encrypted and secure\n• You control what employers see\n• We never share without consent\n• Compliant with privacy laws\n\nFeel safe sharing your story with us!",
    "We take privacy seriously! 🛡️\n\nYour accommodation needs are:\n• Only shared when YOU choose\n• Protected by encryption\n• Never used against you\n• Helpful for finding perfect matches\n\nYour journey, your control!"
  ],
  apply: [
    "Applying for jobs is simple! 📤\n\n1. Find a job you love\n2. Click 'Apply Now'\n3. Your profile auto-fills the form\n4. Add a cover letter (optional)\n5. Submit!\n\nYou can track all applications in 'My Profile'. Good luck! 🍀",
    "Ready to apply? Exciting! 🎉\n\nTips for success:\n• Customize your cover letter\n• Highlight relevant skills\n• Mention accommodation needs (if comfortable)\n• Follow up after a week\n\nYou've got this! 💪"
  ],
  default: [
    "That's an interesting question! 🤔 I'm still learning, but I'll do my best to help. Could you try rephrasing, or choose one of the quick actions below?",
    "Hmm, let me think about that! 💭 For the best assistance, try asking about jobs, profiles, accommodations, or how to use the platform. I'm here for you!",
    "I want to make sure I help you correctly! 🌟 Try asking about:\n• Finding jobs\n• Creating profiles\n• Accessibility features\n• Privacy concerns\n\nOr click a quick action button!"
  ]
};

// Keywords for matching
const keywordMap = {
  jobSearch: ['job', 'jobs', 'find', 'search', 'work', 'position', 'opportunity', 'career', 'employment', 'hiring', 'opening'],
  profile: ['profile', 'account', 'resume', 'cv', 'register', 'sign up', 'create', 'build'],
  accommodations: ['accommodation', 'accessible', 'accessibility', 'disability', 'wheelchair', 'blind', 'deaf', 'support', 'assistance', 'special needs', 'assistive'],
  employers: ['employer', 'company', 'business', 'hire', 'recruit', 'post job', 'organization'],
  help: ['help', 'how', 'what', 'guide', 'tutorial', 'explain', 'assist', 'support'],
  privacy: ['privacy', 'private', 'data', 'secure', 'security', 'confidential', 'share', 'protect'],
  apply: ['apply', 'application', 'submit', 'send', 'interested'],
  greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'hola']
};

const getResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      const responses = chatResponses[category];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  return chatResponses.default[Math.floor(Math.random() * chatResponses.default.length)];
};

// Suggested questions
const suggestedQuestions = [
  "How do I find remote jobs?",
  "Is my disability information private?",
  "What companies are hiring?",
  "How do I apply for a job?",
  "Can I get help with my resume?"
];

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! 👋 I'm Asha, your friendly ApnaRozgaar assistant. I'm here to help you find inclusive job opportunities, build your profile, and navigate our platform with ease.\n\nHow can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputValue(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    synthesisRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Text-to-speech function
  const speakText = useCallback((text) => {
    if (!voiceEnabled || !synthesisRef.current) return;
    
    synthesisRef.current.cancel();
    
    const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesisRef.current.speak(utterance);
  }, [voiceEnabled]);

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputValue('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Send message
  const sendMessage = async (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    stopSpeaking();

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      text: getResponse(text),
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botResponse]);
    
    speakText(botResponse.text);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        text: "Chat cleared! 🔄 I'm Asha, ready to help you again. What would you like to know?",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-height))',
      display: 'flex',
      background: 'var(--bg-primary)'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '320px',
        background: 'var(--card-bg)',
        borderRight: '1px solid var(--border)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }} className="desktop-only">
        {/* Back button */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '0.9rem',
          transition: 'color 0.2s'
        }}>
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* Assistant Info */}
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: 'var(--primary-gradient)',
          borderRadius: '20px',
          color: 'white'
        }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <Sparkles size={40} />
          </motion.div>
          <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem' }}>Asha</h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>Your Accessibility Assistant</p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '12px',
            fontSize: '0.85rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4ADE80'
            }} />
            Online & Ready to Help
          </div>
        </div>

        {/* Voice Controls */}
        <div style={{
          padding: '16px',
          background: 'var(--bg-secondary)',
          borderRadius: '12px'
        }}>
          <h3 style={{ 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            color: 'var(--text-muted)',
            marginBottom: '12px'
          }}>
            Accessibility Controls
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <Volume2 size={18} color="var(--accent-purple)" />
                Voice Responses
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={voiceEnabled}
                onChange={() => {
                  if (isSpeaking) stopSpeaking();
                  setVoiceEnabled(!voiceEnabled);
                }}
                aria-label="Toggle voice responses"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Made with <Heart size={12} style={{ display: 'inline', color: '#EF4444' }} /> for accessibility
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Mobile Header */}
        <div className="mobile-only" style={{
          padding: '16px',
          background: 'var(--primary-gradient)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Link to="/" style={{ color: 'white' }}>
            <ArrowLeft size={24} />
          </Link>
          <Sparkles size={28} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem' }}>Asha</h1>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>AI Assistant</p>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {/* Welcome Card - shown only at start */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid var(--border)',
                marginBottom: '16px'
              }}
            >
              <h2 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>
                👋 Welcome to ApnaRozgaar Assistant
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                I can help you with finding jobs, creating your profile, understanding accommodations, and more. Try asking:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--accent-purple)';
                      e.currentTarget.style.background = 'rgba(124, 58, 237, 0.05)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                gap: '16px',
                alignItems: 'flex-start'
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: message.type === 'user' 
                  ? 'var(--teal-gradient)' 
                  : 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {message.type === 'user' 
                  ? <User size={22} color="white" />
                  : <Bot size={22} color="white" />
                }
              </div>
              
              {/* Message bubble */}
              <div style={{
                maxWidth: '70%',
                padding: '16px 20px',
                borderRadius: message.type === 'user' 
                  ? '20px 20px 4px 20px'
                  : '20px 20px 20px 4px',
                background: message.type === 'user'
                  ? 'var(--primary-gradient)'
                  : 'var(--card-bg)',
                color: message.type === 'user' ? 'white' : 'var(--text-primary)',
                boxShadow: 'var(--card-shadow)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                fontSize: '1rem',
                border: message.type === 'bot' ? '1px solid var(--border)' : 'none'
              }}>
                {message.text}
                
                {/* Actions for bot messages */}
                {message.type === 'bot' && (
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border)'
                  }}>
                    {voiceEnabled && (
                      <button
                        onClick={() => speakText(message.text)}
                        aria-label="Read this message aloud"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          color: 'var(--accent-purple)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Volume2 size={14} />
                        Listen
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={22} color="white" />
              </div>
              <div style={{
                padding: '16px 20px',
                borderRadius: '20px 20px 20px 4px',
                background: 'var(--card-bg)',
                boxShadow: 'var(--card-shadow)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid var(--border)'
              }}>
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-purple)' }}
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-purple)' }}
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-purple)' }}
                />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Speaking indicator */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                margin: '0 24px 12px',
                padding: '12px 20px',
                background: 'var(--accent-purple)',
                color: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.9rem'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Volume2 size={18} />
                Asha is speaking...
              </span>
              <button
                onClick={stopSpeaking}
                aria-label="Stop speaking"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Stop
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div style={{
          padding: '20px 24px',
          background: 'var(--card-bg)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          {/* Clear chat button */}
          <button
            onClick={clearChat}
            aria-label="Clear chat history"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={20} color="var(--text-muted)" />
          </button>

          {/* Voice input button */}
          <motion.button
            onClick={toggleListening}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            aria-pressed={isListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: isListening ? 'var(--danger)' : 'var(--bg-secondary)',
              border: isListening ? 'none' : '1px solid var(--border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <MicOff size={22} color="white" />
              </motion.div>
            ) : (
              <Mic size={22} color="var(--accent-purple)" />
            )}
          </motion.button>

          {/* Text input */}
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? '🎤 Listening... speak now' : 'Type your message or click the mic to speak...'}
              aria-label="Type your message"
              style={{
                width: '100%',
                padding: '16px 60px 16px 20px',
                border: '2px solid var(--border)',
                borderRadius: '28px',
                background: 'var(--bg-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              disabled={isListening}
            />
            
            {/* Send button */}
            <motion.button
              onClick={() => sendMessage()}
              aria-label="Send message"
              disabled={!inputValue.trim() || isTyping}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: inputValue.trim() ? 'var(--primary-gradient)' : 'var(--bg-secondary)',
                border: 'none',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: inputValue.trim() ? 1 : 0.5,
                transition: 'all 0.2s'
              }}
            >
              {isTyping ? (
                <Loader2 size={20} color={inputValue.trim() ? 'white' : 'var(--text-muted)'} className="animate-spin" />
              ) : (
                <Send size={20} color={inputValue.trim() ? 'white' : 'var(--text-muted)'} />
              )}
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatbotPage;
