interface Character {
  _id: string;
  name: string;
  traits: string[];
  warren: string;
  powerLevel: number;
  agility: number;
  intelligence: number;
  description: string;
}

interface DuelResult {
  winner: Character;
  loser: Character;
  winnerScore: number;
  loserScore: number;
  battleDescription: string;
  margin: 'close' | 'decisive' | 'overwhelming';
}

const getBattleDescription = (winner: Character, loser: Character, margin: string): string => {
  const winnerTraits = winner.traits;
  const loserTraits = loser.traits;
  
  // Get primary trait for description
  const getPrimaryTrait = (traits: string[]): string => {
    const priorities = ['brutal', 'assassin', 'strategist', 'schemer', 'swordmaster', 'elemental', 'shadow', 'rage', 'tactical'];
    for (const priority of priorities) {
      if (traits.some(trait => trait.includes(priority))) {
        return priority;
      }
    }
    return traits[0] || 'warrior';
  };

  const winnerTrait = getPrimaryTrait(winnerTraits);
  const loserTrait = getPrimaryTrait(loserTraits);

  const descriptions = {
    close: [
      `${winner.name}'s ${winnerTrait} nature barely overcame ${loser.name}'s ${loserTrait} approach in a grueling battle.`,
      `A razor-thin victory as ${winner.name} exploited a momentary lapse in ${loser.name}'s defense.`,
      `${winner.name} and ${loser.name} traded devastating blows before ${winner.name} claimed victory by the narrowest margin.`,
      `The duel could have gone either way, but ${winner.name}'s experience as a ${winnerTrait} proved decisive.`
    ],
    decisive: [
      `${winner.name}'s ${winnerTrait} prowess clearly outmatched ${loser.name}'s ${loserTrait} tactics.`,
      `${winner.name} systematically dismantled ${loser.name}'s defenses with ${winnerTrait} precision.`,
      `${loser.name} fought valiantly, but ${winner.name}'s ${winnerTrait} abilities proved superior.`,
      `${winner.name} dominated the battlefield, their ${winnerTrait} nature overwhelming ${loser.name}.`
    ],
    overwhelming: [
      `${winner.name} utterly crushed ${loser.name}, their ${winnerTrait} power leaving no doubt about the outcome.`,
      `A complete massacre as ${winner.name}'s ${winnerTrait} abilities made ${loser.name} look like a novice.`,
      `${loser.name} was helpless against ${winner.name}'s overwhelming ${winnerTrait} dominance.`,
      `${winner.name} ended the duel so quickly that ${loser.name} barely had time to react.`
    ]
  };

  const categoryDescriptions = descriptions[margin as keyof typeof descriptions];
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
};

export const simulateDuel = (fighter1: Character, fighter2: Character): DuelResult => {
  // Calculate base scores
  const calculateScore = (character: Character): number => {
    const baseScore = character.powerLevel * 0.5 + character.agility * 0.3 + character.intelligence * 0.2;
    
    // Add trait bonuses
    let traitBonus = 0;
    if (character.traits.includes('brutal')) traitBonus += 2;
    if (character.traits.includes('assassin')) traitBonus += 1.5;
    if (character.traits.includes('strategist')) traitBonus += 1.5;
    if (character.traits.includes('swordmaster')) traitBonus += 2;
    if (character.traits.includes('elemental')) traitBonus += 1;
    if (character.traits.includes('shadow')) traitBonus += 1;
    if (character.traits.includes('rage')) traitBonus += 1.5;
    if (character.traits.includes('tactical')) traitBonus += 1;
    
    // Add randomness (±5%)
    const randomFactor = 1 + (Math.random() - 0.5) * 0.1; // ±5%
    
    return (baseScore + traitBonus) * randomFactor;
  };

  const score1 = calculateScore(fighter1);
  const score2 = calculateScore(fighter2);

  const winner = score1 > score2 ? fighter1 : fighter2;
  const loser = score1 > score2 ? fighter2 : fighter1;
  const winnerScore = Math.max(score1, score2);
  const loserScore = Math.min(score1, score2);

  // Determine margin of victory
  const scoreDifference = Math.abs(score1 - score2);
  let margin: 'close' | 'decisive' | 'overwhelming';
  
  if (scoreDifference < 5) {
    margin = 'close';
  } else if (scoreDifference < 15) {
    margin = 'decisive';
  } else {
    margin = 'overwhelming';
  }

  const battleDescription = getBattleDescription(winner, loser, margin);

  return {
    winner,
    loser,
    winnerScore: Math.round(winnerScore * 10) / 10,
    loserScore: Math.round(loserScore * 10) / 10,
    battleDescription,
    margin
  };
};

export const getRandomCharacters = (characters: Character[], count: number = 2): Character[] => {
  const shuffled = [...characters].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}; 