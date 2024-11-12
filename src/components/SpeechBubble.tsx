import { useEffect, useState } from 'react';
import './SpeechBubble.css';

interface SpeechBubbleProps {
  message: string;
  isVisible: boolean;
  fadeOut?: boolean;
  isTyping?: boolean;
}

export const SpeechBubble = ({ message, isVisible, fadeOut, isTyping }: SpeechBubbleProps) => {
  const [displayMessage, setDisplayMessage] = useState('');
  const [showTyping, setShowTyping] = useState(isTyping);

  useEffect(() => {
    if (isTyping) {
      setShowTyping(true);
      const timer = setTimeout(() => {
        setShowTyping(false);
        setDisplayMessage(message);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setDisplayMessage(message);
    }
  }, [message, isTyping]);

  return (
    <div className={`speech-bubble ${isVisible ? 'visible' : ''} ${fadeOut ? 'fade-out' : ''}`}>
      {showTyping ? (
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        displayMessage
      )}
    </div>
  );
};