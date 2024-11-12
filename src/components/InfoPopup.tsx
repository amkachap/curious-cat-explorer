import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './InfoPopup.css';

interface InfoPopupProps {
  title: string;
  content: string;
  image?: string;
  onClose: () => void;
  onNext: () => void;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ title, content, image, onClose, onNext }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h3>{title}</h3>
        {image && <img src={image} alt={title} />}
        <p>{content}</p>
        <button className="next-button" onClick={(e) => { e.stopPropagation(); onNext(); }}>
          Next Topic <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};