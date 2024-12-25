<template>
  <q-page class="game-page q-pa-sm q-pa-md-md">
    <!-- Background Pattern -->
    <div class="background-pattern"></div>

    <!-- Game Setup -->
    <div
      v-if="!store.isPlaying && !store.isGameComplete && !isCountingDown"
      class="text-center q-mb-md setup-container"
    >
      <h4 class="text-h4 q-mb-md text-white">İklim Değişikliği Kart Oyunu</h4>
      <p class="text-subtitle1 text-white q-mb-lg">
        Oyunu kolay, orta veya zor seviyelerden seçerek baslatabilirsiniz.
      </p>
      <div class="row justify-center q-gutter-sm q-mb-md">
        <q-btn-group spread>
          <q-btn
            :color="store.gameMode === 'easy' ? 'white' : 'grey-2'"
            :text-color="store.gameMode === 'easy' ? 'primary' : 'grey-8'"
            class="mode-btn"
            @click="selectMode('easy')"
          >
            <div class="column items-center">
              <div class="text-subtitle1">Kolay</div>
              <div class="row items-center q-mt-sm">
                <q-icon name="casino" size="1.2em" class="q-mr-sm" />
                <span>4 Çift</span>
              </div>
            </div>
          </q-btn>
          <q-btn
            :color="store.gameMode === 'medium' ? 'white' : 'grey-2'"
            :text-color="store.gameMode === 'medium' ? 'primary' : 'grey-8'"
            class="mode-btn"
            @click="selectMode('medium')"
          >
            <div class="column items-center">
              <div class="text-subtitle1">Orta</div>
              <div class="row items-center q-mt-sm">
                <q-icon name="casino" size="1.2em" class="q-mr-sm" />
                <span>6 Çift</span>
              </div>
            </div>
          </q-btn>
          <q-btn
            :color="store.gameMode === 'hard' ? 'white' : 'grey-2'"
            :text-color="store.gameMode === 'hard' ? 'primary' : 'grey-8'"
            class="mode-btn"
            @click="selectMode('hard')"
          >
            <div class="column items-center">
              <div class="text-subtitle1">Zor</div>
              <div class="row items-center q-mt-sm">
                <q-icon name="casino" size="1.2em" class="q-mr-sm" />
                <span>8 Çift</span>
              </div>
            </div>
          </q-btn>
        </q-btn-group>
      </div>
      <q-btn
        unelevated
        rounded
        color="white"
        text-color="primary"
        icon="play_arrow"
        label="Oyunu Başlat"
        class="q-mt-sm q-px-xl start-btn"
        size="lg"
        @click="startCountdown"
      />
    </div>

    <!-- Countdown Screen -->
    <div v-if="isCountingDown" class="countdown-screen">
      <div class="text-center">
        <h2 class="text-h2 countdown-number">{{ countdownNumber }}</h2>
        <p class="text-h5 text-primary">Hazırlan!</p>
      </div>
    </div>

    <!-- Game Board -->
    <div v-if="store.isPlaying" class="game-board">
      <!-- Timer and Progress Display -->
      <div class="timer-display q-mb-md">
        <div class="row justify-center items-center q-col-gutter-md">
          <div class="col-12 col-sm-auto">
            <q-card flat bordered class="timer-card">
              <q-card-section class="row items-center">
                <q-icon name="timer" size="2rem" color="primary" class="q-mr-md" />
                <div class="text-h4 text-primary">{{ formatTime(currentTime) }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-auto">
            <q-card flat bordered class="progress-card">
              <q-card-section class="row items-center">
                <div class="progress-info q-mr-md">
                  <div class="text-subtitle1">İlerleme</div>
                  <div class="text-h5 text-primary">
                    {{ store.matchedPairs }} / {{ store.totalPairs }}
                  </div>
                </div>
                <q-circular-progress
                  :value="(store.matchedPairs / store.totalPairs) * 100"
                  size="60px"
                  :thickness="0.2"
                  color="primary"
                  show-value
                >
                  {{ Math.round((store.matchedPairs / store.totalPairs) * 100) }}%
                </q-circular-progress>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div class="cards-container">
        <div class="cards-scroll">
          <TransitionGroup name="fade">
            <div
              v-for="card in store.activeCards"
              :key="card.id"
              class="card-wrapper"
              :class="{ matched: card.isMatched }"
            >
              <q-slide-transition>
                <ClimateCard
                  :id="card.id"
                  :title="card.title"
                  :frontImage="card.frontImage"
                  :backContent="card.backContent"
                  :category="card.category"
                  :isFlipped="card.isFlipped"
                  :isMatched="card.isMatched"
                  :showError="card.showError"
                  @flip="store.toggleCard(card.id)"
                />
              </q-slide-transition>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <div class="text-center q-mt-md">
        <q-btn
          unelevated
          rounded
          color="negative"
          icon="restart_alt"
          label="Oyunu Sıfırla"
          @click="resetGame"
        />
      </div>
    </div>

    <!-- Game Complete Message -->
    <q-dialog v-model="showCompletionDialog" persistent>
      <q-card class="completion-card">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">Tebrikler! 🎉</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="text-center">
            <p class="text-h6 q-mb-md">Süre: {{ formatTime(currentTime) }}</p>
            <p class="text-subtitle1">Tekrar oynamak ister misiniz?</p>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn
            unelevated
            rounded
            label="Yeni Oyun"
            color="primary"
            class="q-px-xl"
            @click="startNewGame"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useClimateStore } from '../stores/climate-store'
import ClimateCard from '../components/ClimateCard.vue'
import { onMounted, ref, watch, onUnmounted } from 'vue'

const store = useClimateStore()
const showCompletionDialog = ref(false)
const isCountingDown = ref(false)
const countdownNumber = ref(3)
const currentTime = ref(0)
const showMatchSuccess = ref(false)

// Timer interval reference
let timerInterval: ReturnType<typeof setInterval> | null = null

// Format time function
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Start timer function
const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  currentTime.value = 0
  timerInterval = setInterval(() => {
    currentTime.value++
  }, 1000)
}

// Stop timer function
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Game functions
const selectMode = (mode: 'easy' | 'medium' | 'hard') => {
  store.initializeGame(mode)
}

const startCountdown = () => {
  if (!store.cards.length) {
    store.initializeGame(store.gameMode)
  }
  isCountingDown.value = true
  countdownNumber.value = 3

  const countdownInterval = setInterval(() => {
    countdownNumber.value--
    if (countdownNumber.value <= 0) {
      clearInterval(countdownInterval)
      isCountingDown.value = false
      startGame()
    }
  }, 1000)
}

const startGame = () => {
  store.startGame()
  // Show all cards for 3 seconds before starting
  store.cards.forEach((card) => (card.isFlipped = true))
  setTimeout(() => {
    store.cards.forEach((card) => (card.isFlipped = false))
    startTimer() // Start the timer after cards are flipped back
  }, 3000)
}

const resetGame = () => {
  stopTimer()
  store.resetCards()
}

const startNewGame = () => {
  showCompletionDialog.value = false
  store.initializeGame(store.gameMode)
}

// Add method to show match success animation
const showMatchAnimation = () => {
  showMatchSuccess.value = true
  setTimeout(() => {
    showMatchSuccess.value = false
  }, 1500)
}

// Watch for changes in matchedPairs to trigger animation
watch(
  () => store.matchedPairs,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      showMatchAnimation()
    }
  },
)

// Watch for game completion
watch(
  () => store.isGameComplete,
  (isComplete) => {
    if (isComplete) {
      stopTimer()
      showCompletionDialog.value = true
    }
  },
)

// Clean up on component unmount
onUnmounted(() => {
  stopTimer()
})

// Initialize game on mount
onMounted(() => {
  store.initializeGame('easy')
})
</script>

<style lang="scss">
.game-page {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  overflow: hidden;
}

.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 25px 25px,
      rgba(255, 255, 255, 0.2) 2%,
      transparent 0%
    ),
    radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%);
  background-size: 100px 100px;
  pointer-events: none;
  z-index: 0;
}

.setup-container {
  position: relative;
  z-index: 1;
}

.game-board {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}

.mode-btn {
  min-width: 120px;
  padding: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .column {
    min-height: 50px;
  }

  @media (max-width: 599px) {
    min-width: 100px;
    padding: 8px;

    .text-subtitle1 {
      font-size: 0.9rem;
    }
  }
}

.start-btn {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
}

.timer-display {
  width: 100%;
  margin-top: 0.5rem;

  .row {
    margin: 0 auto;
    max-width: 800px;
  }
}

.timer-card,
.progress-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 180px;

  .q-card__section {
    padding: 1rem 1.5rem;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 599px) {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;

    .text-h4 {
      font-size: 1.5rem;
    }

    .q-icon {
      font-size: 1.5rem !important;
    }
  }
}

.progress-card {
  .progress-info {
    min-width: 100px;
  }

  .q-circular-progress {
    min-width: 60px;
  }
}

.card-wrapper {
  aspect-ratio: 3/4;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center center;
  position: relative;

  &.matched {
    animation: matchedAnimation 2s forwards;
    pointer-events: none;
  }
}

@keyframes matchedAnimation {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(0);
    opacity: 0;
    display: none;
  }
}

.countdown-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.98);
  z-index: 9999;
}

.countdown-number {
  font-size: 8rem;
  font-weight: bold;
  color: var(--q-primary);
  animation: pulse 1s infinite;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 599px) {
    font-size: 5rem;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.cards-container {
  width: 100%;
  overflow: hidden;
  padding: 1rem;

  .cards-scroll {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    width: 100%;
    transition: all 0.3s ease;

    @media (max-width: 599px) {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 0.5rem;
    }
  }
}

.completion-card {
  width: 90%;
  max-width: 400px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  .q-card__section:first-child {
    border-radius: 12px 12px 0 0;
  }
}

@keyframes fadeOutScale {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.fade-leave-active {
  position: absolute;
}
</style>
