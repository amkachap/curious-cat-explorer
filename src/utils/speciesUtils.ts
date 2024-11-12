import { Species, CategoryType, InfoType } from '../types/species';
import { speciesData } from '../data/species';

export const getRandomSpecies = (category: CategoryType, discoveredSpecies: Set<string>): Species => {
  const categorySpecies = speciesData[category];
  const availableSpecies = categorySpecies.filter(species => !discoveredSpecies.has(species.id));
  
  if (availableSpecies.length === 0) {
    return categorySpecies[0]; // Fallback if all species are discovered
  }
  
  const randomIndex = Math.floor(Math.random() * availableSpecies.length);
  return availableSpecies[randomIndex];
};

export const getSpeciesInfo = (species: Species, infoType: InfoType) => {
  const titles = {
    habitat: 'Where do they live?',
    adaptation: 'What makes them unique?',
    funFacts: 'Tell me fun facts!',
    behavior: 'How do they behave?'
  };

  const image = `https://zoischool.s3.eu-north-1.amazonaws.com/assets/classes/curiosity/${species.id}-${infoType}.jpg`;

  return {
    title: titles[infoType],
    content: species[infoType],
    image
  };
};