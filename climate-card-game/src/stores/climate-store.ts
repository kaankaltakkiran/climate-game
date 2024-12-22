import { defineStore } from 'pinia';
import type { ClimateCard, GameState } from '../types/climate-card';

const allCards: Omit<ClimateCard, 'id' | 'isFlipped' | 'isMatched' | 'matchId'>[] = [
  {
    title: 'Forest Fires',
    frontImage: 'https://source.unsplash.com/800x600/?forest,fire',
    backContent: 'Forest fires are becoming more frequent and intense due to climate change.',
    category: 'Disasters'
  },
  {
    title: 'Rising Sea Levels',
    frontImage: 'https://source.unsplash.com/800x600/?ocean,flood',
    backContent: 'Rising sea levels threaten coastal communities worldwide.',
    category: 'Ocean'
  },
  {
    title: 'Extreme Weather',
    frontImage: 'https://source.unsplash.com/800x600/?storm,hurricane',
    backContent: 'Climate change increases extreme weather events frequency.',
    category: 'Weather'
  },
  {
    title: 'Melting Glaciers',
    frontImage: 'https://source.unsplash.com/800x600/?glacier,melting',
    backContent: 'Glaciers are melting at unprecedented rates.',
    category: 'Ice'
  },
  {
    title: 'Biodiversity Loss',
    frontImage: 'https://source.unsplash.com/800x600/?endangered,species',
    backContent: 'Climate change causes mass extinction of species.',
    category: 'Ecosystem'
  },
  {
    title: 'Carbon Emissions',
    frontImage: 'https://source.unsplash.com/800x600/?factory,pollution',
    backContent: 'Carbon emissions are the primary driver of climate change.',
    category: 'Pollution'
  },
  {
    title: 'Renewable Energy',
    frontImage: 'https://source.unsplash.com/800x600/?solar,wind',
    backContent: 'Clean energy solutions help combat climate change.',
    category: 'Solutions'
  },
  {
    title: 'Deforestation',
    frontImage: 'https://source.unsplash.com/800x600/?deforestation',
    backContent: 'Deforestation contributes to global warming.',
    category: 'Forests'
  }
];

export const useClimateStore = defineStore('climate', {
  state: (): GameState => ({
    cards: [],
    gameMode: 'easy',
    isPlaying: false,
    startTime: null,
    endTime: null,
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 0
  }),

  getters: {
    gameTimeInSeconds: (state): number => {
      if (!state.startTime) return 0;
      const endTime = state.endTime || Date.now();
      return Math.floor((endTime - state.startTime) / 1000);
    },
    isGameComplete: (state): boolean => {
      return state.matchedPairs === state.totalPairs && state.totalPairs > 0;
    },
    activeCards: (state): ClimateCard[] => {
      return state.cards.filter(card => !card.isMatched);
    }
  },

  actions: {
    initializeGame(mode: 'easy' | 'medium' | 'hard') {
      this.gameMode = mode;
      const pairsCount = mode === 'easy' ? 4 : mode === 'medium' ? 6 : 8;
      this.totalPairs = pairsCount;
      
      // Shuffle and select cards based on mode
      const shuffledCards = [...allCards]
        .sort(() => Math.random() - 0.5)
        .slice(0, pairsCount);

      // Create pairs of cards with guaranteed type safety
      const cardPairs: ClimateCard[] = shuffledCards.flatMap((card, index) => {
        const baseCard: ClimateCard = {
          ...card,
          id: index * 2 + 1,
          isFlipped: false,
          isMatched: false,
          matchId: index
        };
        const pairCard: ClimateCard = {
          ...card,
          id: index * 2 + 2,
          isFlipped: false,
          isMatched: false,
          matchId: index
        };
        return [baseCard, pairCard];
      });

      // Final shuffle of all cards
      this.cards = cardPairs.sort(() => Math.random() - 0.5);
      this.resetGameState();
    },

    resetGameState() {
      this.isPlaying = false;
      this.startTime = null;
      this.endTime = null;
      this.flippedCards = [];
      this.matchedPairs = 0;
    },

    startGame() {
      this.isPlaying = true;
      this.startTime = Date.now();
      this.endTime = null;
    },

    toggleCard(id: number) {
      if (!this.isPlaying) {
        this.startGame();
      }

      const cardIndex = this.cards.findIndex(c => c.id === id);
      if (cardIndex === -1) return;

      const currentCard = this.cards[cardIndex];
      // Early return if card is not in a valid state for flipping
      if (!currentCard || currentCard.isMatched || currentCard.isFlipped || this.flippedCards.length >= 2) {
        return;
      }

      // Update the card in the array with type safety
      this.cards[cardIndex] = {
        id: currentCard.id,
        title: currentCard.title,
        frontImage: currentCard.frontImage,
        backContent: currentCard.backContent,
        category: currentCard.category,
        matchId: currentCard.matchId,
        isMatched: currentCard.isMatched,
        isFlipped: true
      };
      
      this.flippedCards.push(id);

      // Check for match when two cards are flipped
      if (this.flippedCards.length === 2) {
        const [firstId, secondId] = this.flippedCards;
        const firstCard = this.cards.find(c => c.id === firstId);
        const secondCard = this.cards.find(c => c.id === secondId);

        if (firstCard && secondCard && firstCard.matchId === secondCard.matchId) {
          // Match found
          setTimeout(() => {
            this.cards = this.cards.map(c => {
              if (c.id === firstId || c.id === secondId) {
                return {
                  ...c,
                  isMatched: true
                };
              }
              return c;
            });
            this.matchedPairs++;
            this.flippedCards = [];

            // Check if game is complete
            if (this.matchedPairs === this.totalPairs) {
              this.endTime = Date.now();
            }
          }, 500);
        } else {
          // No match, flip cards back
          setTimeout(() => {
            this.cards = this.cards.map(c => {
              if (this.flippedCards.includes(c.id)) {
                return {
                  ...c,
                  isFlipped: false
                };
              }
              return c;
            });
            this.flippedCards = [];
          }, 1000);
        }
      }
    },

    resetCards() {
      this.cards = this.cards.map(card => ({
        ...card,
        isFlipped: false,
        isMatched: false
      }));
      this.resetGameState();
    }
  }
}); 