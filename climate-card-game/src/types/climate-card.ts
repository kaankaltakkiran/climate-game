export interface ClimateCard {
  id: number;
  title: string;
  frontImage: string;
  backContent: string;
  category: string;
  isFlipped: boolean;
}

export interface ClimateCardState {
  cards: ClimateCard[];
} 