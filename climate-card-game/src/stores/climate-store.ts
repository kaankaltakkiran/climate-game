import { defineStore } from 'pinia'
import type { ClimateCard, GameState } from '../types/climate-card'

// Her kart çifti birbiriyle ilişkili iklim sorunlarını veya neden-sonuç ilişkilerini temsil eder
const allCards: Omit<ClimateCard, 'id' | 'isFlipped' | 'isMatched' | 'matchId'>[] = [
  // Çift 1: Fosil Yakıtlar → Küresel Isınma
  {
    title: 'Fosil Yakıt Kullanımı',
    frontImage:
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&auto=format&fit=crop',
    backContent:
      'Kömür, petrol ve doğal gaz gibi fosil yakıtların yakılması atmosfere sera gazları salar.',
    category: 'Neden',
  },
  {
    title: 'Küresel Isınma',
    frontImage:
      'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&auto=format&fit=crop',
    backContent:
      'Atmosferdeki sera gazları ısıyı hapsederek dünya sıcaklığının artmasına neden olur.',
    category: 'Sonuç',
  },

  // Çift 2: Ormansızlaşma → Tür Yok Oluşu
  {
    title: 'Ormansızlaşma',
    frontImage:
      'https://images.unsplash.com/photo-1728802823035-4ae400307150?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    backContent:
      'Ormanların yok edilmesi, doğal yaşam alanlarını tahrip eder ve karbon emilimini azaltır.',
    category: 'Neden',
  },
  {
    title: 'Türlerin Yok Oluşu',
    frontImage:
      'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?w=800&auto=format&fit=crop',
    backContent:
      'Yaşam alanlarının kaybı, birçok hayvan ve bitki türünün neslinin tükenmesine yol açar.',
    category: 'Sonuç',
  },

  // Çift 3: Okyanus Isınması → Mercan Ağartması
  {
    title: 'Okyanus Isınması',
    frontImage:
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&auto=format&fit=crop',
    backContent: 'Küresel ısınma nedeniyle okyanus suları giderek ısınıyor ve asitlenme artıyor.',
    category: 'Neden',
  },
  {
    title: 'Mercan Ağartması',
    frontImage:
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&auto=format&fit=crop',
    backContent: 'Isınan sular mercanların renklerini kaybetmesine ve ölmesine neden oluyor.',
    category: 'Sonuç',
  },

  // Çift 4: Kutup Buzulları → Deniz Seviyesi
  {
    title: 'Buzulların Erimesi',
    frontImage:
      'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?w=800&auto=format&fit=crop',
    backContent:
      'Artan sıcaklıklar kutuplardaki ve dağlardaki buzulların hızla erimesine neden oluyor.',
    category: 'Neden',
  },
  {
    title: 'Yükselen Denizler',
    frontImage:
      'https://plus.unsplash.com/premium_photo-1667149797176-18026a27760b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    backContent:
      'Eriyen buzullar deniz seviyesinin yükselmesine ve kıyı bölgelerinin sular altında kalmasına yol açıyor.',
    category: 'Sonuç',
  },

  // Çift 5: Atmosferik Değişimler → Aşırı Hava Olayları
  {
    title: 'İklim Değişikliği',
    frontImage:
      'https://plus.unsplash.com/premium_photo-1689962253341-b53e506b719b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    backContent: 'Atmosferdeki değişimler hava akımlarını ve okyanus akıntılarını etkiliyor.',
    category: 'Neden',
  },
  {
    title: 'Aşırı Hava Olayları',
    frontImage:
      'https://images.unsplash.com/photo-1527482937786-6608f6e14c15?w=800&auto=format&fit=crop',
    backContent:
      'Fırtınalar, seller ve kuraklıklar gibi aşırı hava olayları daha sık ve şiddetli hale geliyor.',
    category: 'Sonuç',
  },

  // Çift 6: İklim Desenleri → Gıda Güvenliği
  {
    title: 'Değişen Yağış Düzeni',
    frontImage:
      'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&auto=format&fit=crop',
    backContent: 'İklim değişikliği yağış düzenlerini değiştiriyor ve mevsimsel döngüleri bozuyor.',
    category: 'Neden',
  },
  {
    title: 'Gıda Krizi',
    frontImage:
      'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&auto=format&fit=crop',
    backContent:
      'Düzensiz yağışlar ve aşırı sıcaklıklar tarımsal üretimi tehdit ediyor ve gıda krizine yol açıyor.',
    category: 'Sonuç',
  },

  // Çift 7: Kentleşme → Isı Adası
  {
    title: 'Çarpık Kentleşme',
    frontImage:
      'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&auto=format&fit=crop',
    backContent: 'Betonlaşma ve yeşil alanların azalması şehirlerde ısı birikimini artırıyor.',
    category: 'Neden',
  },
  {
    title: 'Kent Isı Adaları',
    frontImage:
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop',
    backContent:
      'Şehir merkezleri çevre bölgelerden çok daha sıcak hale geliyor ve yaşam kalitesi düşüyor.',
    category: 'Sonuç',
  },

  // Çift 8: Çözümler
  {
    title: 'Yenilenebilir Enerji',
    frontImage:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop',
    backContent:
      'Güneş ve rüzgar gibi temiz enerji kaynakları karbon emisyonlarını azaltmaya yardımcı olur.',
    category: 'Çözüm',
  },
  {
    title: 'Sürdürülebilir Yaşam',
    frontImage:
      'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&auto=format&fit=crop',
    backContent:
      'Elektrikli araçlar ve enerji tasarruflu teknolojiler iklim değişikliğiyle mücadeleye katkı sağlar.',
    category: 'Çözüm',
  },
]

export const useClimateStore = defineStore('climate', {
  state: (): GameState & { errorCards: number[] } => ({
    cards: [],
    gameMode: 'easy',
    isPlaying: false,
    startTime: null,
    endTime: null,
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 0,
    errorCards: [], // Track cards that don't match
  }),

  getters: {
    gameTimeInSeconds: (state): number => {
      if (!state.startTime) return 0
      const endTime = state.endTime || Date.now()
      return Math.floor((endTime - state.startTime) / 1000)
    },
    isGameComplete: (state): boolean => {
      return state.matchedPairs === state.totalPairs && state.totalPairs > 0
    },
    activeCards: (state): (ClimateCard & { showError: boolean })[] => {
      return state.cards.map((card) => ({
        ...card,
        showError: state.errorCards.includes(card.id),
      }))
    },
  },

  actions: {
    initializeGame(mode: 'easy' | 'medium' | 'hard') {
      this.gameMode = mode
      // Zorluk seviyesine göre kart sayısını ayarla
      const pairsCount = mode === 'easy' ? 4 : mode === 'medium' ? 6 : 8
      this.totalPairs = pairsCount

      // Kartları seç ve çiftleri oluştur
      const selectedCards = [...allCards].slice(0, pairsCount * 2)
      const pairs: Array<[(typeof selectedCards)[0], (typeof selectedCards)[1]]> = []

      // Neden-Sonuç çiftlerini oluştur
      for (let i = 0; i < selectedCards.length; i += 2) {
        pairs.push([selectedCards[i], selectedCards[i + 1]])
      }

      // Her çift için kartları oluştur
      const cardPairs: ClimateCard[] = pairs.flatMap((pair, pairIndex) =>
        pair.map((card, cardIndex) => ({
          ...card,
          id: pairIndex * 2 + cardIndex + 1,
          isFlipped: false,
          isMatched: false,
          matchId: pairIndex, // Her çift aynı matchId'yi paylaşır
        })),
      )

      // Son kez kartları karıştır
      this.cards = cardPairs.sort(() => Math.random() - 0.5)
      this.resetGameState()
    },

    startGame() {
      this.isPlaying = true
      this.startTime = Date.now()
      this.endTime = null
      this.flippedCards = []
      this.matchedPairs = 0
    },

    resetGameState() {
      this.isPlaying = false
      this.startTime = null
      this.endTime = null
      this.flippedCards = []
      this.matchedPairs = 0
    },

    resetCards() {
      this.cards.forEach((card) => {
        card.isFlipped = false
        card.isMatched = false
      })
      this.resetGameState()
    },

    toggleCard(cardId: number) {
      if (!this.isPlaying) return

      const currentCard = this.cards.find((card) => card.id === cardId)
      if (
        !currentCard ||
        currentCard.isMatched ||
        currentCard.isFlipped ||
        this.flippedCards.length >= 2 ||
        this.flippedCards.includes(cardId)
      )
        return

      // Clear any existing error states
      this.errorCards = []

      // Flip the card
      currentCard.isFlipped = true
      this.flippedCards.push(cardId)

      if (this.flippedCards.length === 2) {
        const [firstId, secondId] = this.flippedCards
        const firstCard = this.cards.find((card) => card.id === firstId)
        const secondCard = this.cards.find((card) => card.id === secondId)

        if (firstCard && secondCard && firstCard.matchId === secondCard.matchId) {
          // Match found - show cards for 1.5 seconds
          setTimeout(() => {
            if (firstCard) firstCard.isMatched = true
            if (secondCard) secondCard.isMatched = true
            this.matchedPairs++
            this.flippedCards = []

            if (this.matchedPairs === this.totalPairs) {
              this.endTime = Date.now()
            }
          }, 1500)
        } else {
          // No match - show error state for 1.5 seconds
          this.errorCards = [firstId, secondId]
          setTimeout(() => {
            if (firstCard) firstCard.isFlipped = false
            if (secondCard) secondCard.isFlipped = false
            this.flippedCards = []
            this.errorCards = []
          }, 1500)
        }
      }
    },
  },
})
