export interface ClimateCard {
  id: number;
  title: string;
  frontImage: string;
  backContent: string;
  category: string;
  isFlipped: boolean;
  isMatched: boolean;
  matchId: number;
}

export interface GameState {
  cards: ClimateCard[];
  gameMode: 'easy' | 'medium' | 'hard';
  isPlaying: boolean;
  startTime: number | null;
  endTime: number | null;
  flippedCards: number[];
  matchedPairs: number;
  totalPairs: number;
} 