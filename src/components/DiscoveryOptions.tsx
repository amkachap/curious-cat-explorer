import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faDog, faBug, faFish, faCheck } from '@fortawesome/free-solid-svg-icons';
import { speciesData } from '../data/species';
import './DiscoveryOptions.css';

interface DiscoveryOptionsProps {
  onSelect: (category: 'plants' | 'animals' | 'insects' | 'fish') => void;
  discoveredSpecies: Set<string>;
}

export const DiscoveryOptions = ({ onSelect, discoveredSpecies }: DiscoveryOptionsProps) => {
  const getCategoryStatus = (category: string) => {
    const categorySpecies = speciesData[category];
    const discovered = categorySpecies.filter(species => discoveredSpecies.has(species.id));
    return {
      isComplete: discovered.length === categorySpecies.length
    };
  };

  return (
    <div className="discovery-options">
      {[
        { id: 'plants', label: 'Amazing Plants', icon: faLeaf },
        { id: 'animals', label: 'Awesome Animals', icon: faDog },
        { id: 'insects', label: 'Incredible Insects', icon: faBug },
        { id: 'fish', label: 'Super Sea Animals', icon: faFish }
      ].map(({ id, label, icon }) => {
        const { isComplete } = getCategoryStatus(id);
        return (
          <button
            key={id}
            onClick={() => onSelect(id as 'plants' | 'animals' | 'insects' | 'fish')}
            disabled={isComplete}
            className={isComplete ? 'completed' : ''}
          >
            <FontAwesomeIcon icon={icon} className="option-icon" />
            <span className="option-text">{label}</span>
            {isComplete && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
          </button>
        );
      })}
    </div>
  );
};