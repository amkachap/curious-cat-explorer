import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { SpeechBubble } from './SpeechBubble';
import { DiscoveryOptions } from './DiscoveryOptions';
import { SpeciesCard } from './SpeciesCard';
import { InfoPopup } from './InfoPopup';
import { getRandomSpecies, getSpeciesInfo } from '../utils/speciesUtils';
import { Species, CategoryType, InfoType } from '../types/species';
import './PixelCat.css';

const CAT_IMAGE = 'https://zoischool.s3.eu-north-1.amazonaws.com/assets/classes/curiosity/cat.png';

const INTRO_SEQUENCE = [
  { message: "Meow! 😺", delay: 1000 },
  { message: "Hi there, I am Curious Cat!", delay: 2500 },
  { message: "I love exploring the natural world around us.", delay: 4000 },
  { message: "Would you like to join me on a discovery journey?", delay: 6000 }
];

const INFO_TYPES: InfoType[] = ['habitat', 'adaptation', 'funFacts', 'behavior'];

export const PixelCat = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSpecies, setCurrentSpecies] = useState<Species | null>(null);
  const [discoveredSpecies, setDiscoveredSpecies] = useState<Set<string>>(new Set());
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<{ title: string; content: string; image?: string; type: InfoType } | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [catVisible, setCatVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showStartButton, setShowStartButton] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [showMainMessage, setShowMainMessage] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    setTimeout(() => setCatVisible(true), 500);

    if (showIntro) {
      const showMessage = (index: number) => {
        if (index < INTRO_SEQUENCE.length) {
          setCurrentMessage(INTRO_SEQUENCE[index].message);
          setMessageIndex(index);
          
          if (index === INTRO_SEQUENCE.length - 1) {
            setTimeout(() => setShowStartButton(true), 2000);
          }
        }
      };

      let timeoutId: number;
      const startSequence = () => {
        INTRO_SEQUENCE.forEach((_, index) => {
          timeoutId = window.setTimeout(() => showMessage(index), INTRO_SEQUENCE[index].delay);
        });
      };

      startSequence();
      return () => window.clearTimeout(timeoutId);
    }

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [showIntro]);

  useEffect(() => {
    if (discoveredSpecies.size === 3 && !currentSpecies) {
      setShowMilestone(true);
    }
  }, [discoveredSpecies.size, currentSpecies]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const handleCategorySelect = (category: CategoryType) => {
    const species = getRandomSpecies(category, discoveredSpecies);
    setCurrentSpecies(species);
    setDiscoveredSpecies(prev => new Set([...prev, species.id]));
  };

  const handleInfoSelect = (infoType: InfoType) => {
    if (currentSpecies) {
      const info = getSpeciesInfo(currentSpecies, infoType);
      setSelectedInfo({ ...info, type: infoType });
      setShowInfoPopup(true);
    }
  };

  const handleNextInfo = () => {
    if (currentSpecies && selectedInfo) {
      const currentIndex = INFO_TYPES.indexOf(selectedInfo.type);
      const nextIndex = (currentIndex + 1) % INFO_TYPES.length;
      handleInfoSelect(INFO_TYPES[nextIndex]);
    }
  };

  const handleBack = () => {
    setCurrentSpecies(null);
    setSelectedInfo(null);
  };

  const startGame = () => {
    setGameStarted(true);
    setShowIntro(true);
  };

  const startDiscovery = () => {
    setShowIntro(false);
    setShowMainMessage(true);
  };

  if (!gameStarted) {
    return (
      <div className="discovery-container">
        <div className={`cat-container intro`}>
          <div className={`cat-wrapper ${catVisible ? 'visible' : ''}`}>
            <img src={CAT_IMAGE} alt="Curious Cat" className="cat-image" />
          </div>
          <button className="start-button" onClick={startGame}>
            Start Adventure
          </button>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="discovery-container">
        <div className={`cat-container intro`}>
          <div className={`cat-wrapper ${catVisible ? 'visible' : ''}`}>
            <img src={CAT_IMAGE} alt="Curious Cat" className="cat-image" />
            {currentMessage && (
              <div className="speech-bubbles-container">
                <SpeechBubble
                  message={currentMessage}
                  isVisible={true}
                  isTyping={messageIndex === INTRO_SEQUENCE.length - 1}
                />
              </div>
            )}
          </div>
          {showStartButton && (
            <button className="start-button" onClick={startDiscovery}>
              Let's Start Exploring!
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="discovery-container">
      <div className="scorecard">
        Discoveries: {discoveredSpecies.size}
      </div>

      <button className="fullscreen-button" onClick={toggleFullscreen}>
        <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>

      <div className={`cat-container ${currentSpecies ? 'cat-top' : ''}`}>
        <div className={`cat-wrapper ${catVisible ? 'visible' : ''}`}>
          <img src={CAT_IMAGE} alt="Curious Cat" className="cat-image" />
          {showMainMessage && !currentSpecies && (
            <div className="speech-bubbles-container">
              <SpeechBubble
                message="Pick something to explore from the list below."
                isVisible={true}
              />
            </div>
          )}
        </div>

        {currentSpecies ? (
          <SpeciesCard 
            species={currentSpecies} 
            onInfoSelect={handleInfoSelect}
            onBack={handleBack}
          />
        ) : (
          <DiscoveryOptions 
            onSelect={handleCategorySelect}
            discoveredSpecies={discoveredSpecies}
          />
        )}
      </div>

      {showInfoPopup && selectedInfo && (
        <InfoPopup
          title={selectedInfo.title}
          content={selectedInfo.content}
          image={selectedInfo.image}
          onClose={() => setShowInfoPopup(false)}
          onNext={handleNextInfo}
        />
      )}

      {showMilestone && (
        <div className="milestone-overlay">
          <div className="milestone-content">
            <h2>🎉 Achievement Unlocked!</h2>
            <p>Congrats on hitting 3 discoveries. You are indeed curious! You can play more or move on to the next section.</p>
            <button onClick={() => setShowMilestone(false)}>Continue Exploring</button>
          </div>
        </div>
      )}
    </div>
  );
};