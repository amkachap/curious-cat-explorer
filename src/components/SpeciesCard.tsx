import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Species, InfoType } from '../types/species';
import './SpeciesCard.css';

interface SpeciesCardProps {
  species: Species;
  onInfoSelect: (type: InfoType) => void;
  onBack: () => void;
}

export const SpeciesCard = ({ species, onInfoSelect, onBack }: SpeciesCardProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showOptions && optionsRef.current) {
      optionsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showOptions]);

  const handleLearnMore = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setShowOptions(true);
    }, 1500);
  };

  return (
    <div className="species-card">
      <div className="species-content">
        <img 
          src={species.image} 
          alt={species.name} 
          className="species-image"
        />
        
        <div className="conversation-container">
          <div className="speech-bubble species visible">
            {species.description}
          </div>
          
          {!showOptions && !isTyping && (
            <button 
              className="learn-more-button"
              onClick={handleLearnMore}
            >
              Learn more about {species.name}
            </button>
          )}

          {isTyping && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          
          {showOptions && (
            <div ref={optionsRef}>
              <div className="speech-bubble species visible">
                Ah, I see you are curious just like me! What else would you like to learn about this amazing creature?
              </div>
              <div className="species-options">
                <button onClick={() => onInfoSelect('habitat')}>
                  Where do they live?
                </button>
                <button onClick={() => onInfoSelect('adaptation')}>
                  What makes them unique?
                </button>
                <button onClick={() => onInfoSelect('funFacts')}>
                  Tell me fun facts!
                </button>
                <button onClick={() => onInfoSelect('behavior')}>
                  How do they behave?
                </button>
              </div>
            </div>
          )}
          
          <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); onBack(); }}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Menu
          </a>
        </div>
      </div>
    </div>
  );
};