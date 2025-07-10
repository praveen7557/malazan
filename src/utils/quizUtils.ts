export interface Character {
  _id: string;
  name: string;
  description: string;
  traits: string[];
  image: string;
}

export interface QuizScores {
  [characterId: string]: number;
}

export const calculateTopCharacters = (scores: QuizScores): string[] => {
  const maxScore = Math.max(...Object.values(scores));
  return Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([characterId, _]) => characterId);
};

export const getCharactersByIds = (characterIds: string[], characters: Character[]): Character[] => {
  return characters.filter(character => characterIds.includes(character._id));
};