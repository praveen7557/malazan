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
  // Handle empty scores object
  const scoreValues = Object.values(scores);
  if (scoreValues.length === 0) {
    console.warn('No scores accumulated during quiz');
    return [];
  }

  const maxScore = Math.max(...scoreValues);
  return Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([characterId, _]) => characterId);
};

export const getCharactersByIds = (characterIds: string[], characters: Character[]): Character[] => {
  const foundCharacters = characters.filter((character) =>
    characterIds.includes(character._id)
  );

  // Log missing character IDs for debugging
  const missingIds = characterIds.filter(
    (id) => !characters.find((char) => char._id === id)
  );
  if (missingIds.length > 0) {
    console.warn('Missing character IDs:', missingIds);
  }

  return foundCharacters;
};