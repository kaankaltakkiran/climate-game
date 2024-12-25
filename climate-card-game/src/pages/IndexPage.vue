<template>
  <q-page class="game-page q-pa-sm q-pa-md-md">
    <!-- Background Pattern -->
    <div class="background-pattern"></div>

    <!-- Game Setup -->
    <div v-if="!store.isPlaying && !store.isGameComplete && !isCountingDown" class="text-center q-mb-md setup-container">
      <h4 class="text-h4 q-mb-md text-white">Climate Change Memory Game</h4>
      <div class="row justify-center q-gutter-sm q-mb-md">
        <q-btn-group spread>
          <q-btn
            :color="store.gameMode === 'easy' ? 'white' : 'grey-2'"
            :text-color="store.gameMode === 'easy' ? 'primary' : 'grey-8'"
            :label="isMobileView ? 'Easy' : 'Easy'"
            class="mode-btn"
            @click="selectMode('easy')"
          />
          <q-btn
            :color="store.gameMode === 'medium' ? 'white' : 'grey-2'"
            :text-color="store.gameMode === 'medium' ? 'primary' : 'grey-8'"
            :label="isMobileView ? 'Medium' : 'Medium'"
            class="mode-btn"
            @click="selectMode('medium')"
          />
          <q-btn
            :color="store.gameMode === 'hard' ? 'white' : 'grey-2'"
            :text-color="store.gameMode === 'hard' ? 'primary' : 'grey-8'"
            :label="isMobileView ? 'Hard' : 'Hard'"
            class="mode-btn"
            @click="selectMode('hard')"
          />
        </q-btn-group>
      </div>
      <q-btn
        unelevated
        rounded
        color="white"
        text-color="primary"
        icon="play_arrow"
        label="Start Game"
        class="q-mt-sm q-px-xl start-btn"
        size="lg"
        @click="startCountdown"
      />
    </div>

    <!-- Countdown Screen -->
    <div v-if="isCountingDown" class="countdown-screen">
      <div class="text-center">
        <h2 class="text-h2 countdown-number">{{ countdownNumber }}</h2>
        <p class="text-h5 text-primary">Get Ready!</p>
      </div>
    </div>

    <!-- Game Board -->
    <div v-if="store.isPlaying" class="game-board">
      <!-- Timer and Progress Display -->
      <div class="timer-display q-mb-md">
        <q-card flat bordered class="timer-card">
          <q-card-section class="row items-center q-py-sm">
            <q-icon name="timer" size="2rem" color="primary" class="q-mr-md"/>
            <div class="text-h4 text-primary">{{ formatTime(currentTime) }}</div>
          </q-card-section>
        </q-card>
        
        <!-- Progress Indicator -->
        <q-card flat bordered class="progress-card q-ml-md">
          <q-card-section class="row items-center q-py-sm">
            <div class="progress-info">
              <div class="text-subtitle1">Progress</div>
              <div class="text-h5 text-primary">{{ store.matchedPairs }} / {{ store.totalPairs }}</div>
            </div>
            <q-circular-progress
              :value="(store.matchedPairs / store.totalPairs) * 100"
              size="60px"
              :thickness="0.2"
              color="primary"
              class="q-ml-md"
              show-value
            >
              {{ Math.round((store.matchedPairs / store.totalPairs) * 100) }}%
            </q-circular-progress>
          </q-card-section>
        </q-card>
      </div>

      <!-- Match Success Animation Container -->
      <div class="match-success" :class="{ 'show': showMatchSuccess }">
        <div class="match-success__content">
          <div class="match-success__icon">
            <q-icon name="check_circle" color="positive" size="48px" />
          </div>
          <div class="text-h6 text-positive q-mt-sm">Match Found!</div>
        </div>
      </div>

      <div class="cards-container">
        <div class="cards-scroll">
          <div
            v-for="card in store.activeCards"
            :key="card.id"
            class="card-wrapper"
            :class="{ 'matched': card.isMatched }"
          >
            <q-slide-transition>
              <ClimateCard
                v-bind="card"
                @flip="store.toggleCard(card.id)"
              />
            </q-slide-transition>
          </div>
        </div>
      </div>

      <div class="text-center q-mt-md">
        <q-btn
          unelevated
          rounded
          color="negative"
          icon="restart_alt"
          label="Reset Game"
          @click="resetGame"
        />
      </div>
    </div>

    <!-- Game Complete Message -->
    <q-dialog v-model="showCompletionDialog" persistent>
      <q-card class="completion-card">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">Congratulations! 🎉</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="text-center">
            <p class="text-h6 q-mb-md">Time: {{ formatTime(currentTime) }}</p>
            <p class="text-subtitle1">Would you like to play again?</p>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn
            unelevated
            rounded
            label="New Game"
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
import { useClimateStore } from '../stores/climate-store';
import ClimateCard from '../components/ClimateCard.vue';
import { onMounted, ref, watch, onUnmounted, computed } from 'vue';
import { Platform } from 'quasar';

const store = useClimateStore();
const showCompletionDialog = ref(false);
const isCountingDown = ref(false);
const countdownNumber = ref(3);
const currentTime = ref(0);
const showMatchSuccess = ref(false);

// Check if mobile view
const isMobileView = computed(() => {
  return Platform.is.mobile || window.innerWidth < 600;
});

// Timer interval reference
let timerInterval: ReturnType<typeof setInterval> | null = null;

// Format time function
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Start timer function
const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  currentTime.value = 0;
  timerInterval = setInterval(() => {
    currentTime.value++;
  }, 1000);
};

// Stop timer function
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

// Game functions
const selectMode = (mode: 'easy' | 'medium' | 'hard') => {
  store.initializeGame(mode);
};

const startCountdown = () => {
  if (!store.cards.length) {
    store.initializeGame(store.gameMode);
  }
  isCountingDown.value = true;
  countdownNumber.value = 3;

  const countdownInterval = setInterval(() => {
    countdownNumber.value--;
    if (countdownNumber.value <= 0) {
      clearInterval(countdownInterval);
      isCountingDown.value = false;
      startGame();
    }
  }, 1000);
};

const startGame = () => {
  store.startGame();
  // Show all cards for 3 seconds before starting
  store.cards.forEach(card => card.isFlipped = true);
  setTimeout(() => {
    store.cards.forEach(card => card.isFlipped = false);
    startTimer(); // Start the timer after cards are flipped back
  }, 3000);
};

const resetGame = () => {
  stopTimer();
  store.resetCards();
};

const startNewGame = () => {
  showCompletionDialog.value = false;
  store.initializeGame(store.gameMode);
};

// Add method to show match success animation
const showMatchAnimation = () => {
  showMatchSuccess.value = true;
  setTimeout(() => {
    showMatchSuccess.value = false;
  }, 1500);
};

// Watch for changes in matchedPairs to trigger animation
watch(() => store.matchedPairs, (newValue, oldValue) => {
  if (newValue > oldValue) {
    showMatchAnimation();
  }
});

// Watch for game completion
watch(() => store.isGameComplete, (isComplete) => {
  if (isComplete) {
    stopTimer();
    showCompletionDialog.value = true;
  }
});

// Clean up on component unmount
onUnmounted(() => {
  stopTimer();
});

// Initialize game on mount
onMounted(() => {
  store.initializeGame('easy');
});
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
  background-image: 
    radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%),
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
  min-width: 100px;
  font-weight: 600;
  
  @media (max-width: 599px) {
    min-width: 60px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
}

.timer-card,
.progress-card {
  min-width: 180px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .q-card__section {
    padding: 0.5rem 1.5rem;
  }

  @media (max-width: 599px) {
    min-width: 140px;
    
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.match-success {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  z-index: 9999;
  transition: all 0.3s ease;
  pointer-events: none;
  opacity: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);

  &.show {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  &__content {
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem 3rem;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    animation: matchPulse 1.5s ease-out;
    min-width: 200px;
    min-height: 150px;
  }

  &__icon {
    animation: iconBounce 0.5s ease-out;
  }
}

@keyframes matchPulse {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  20% {
    transform: scale(1.1);
    opacity: 1;
  }
  80% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes iconBounce {
  0% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
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
  position: relative;
  width: 100%;
  padding: 0.5rem;
  z-index: 1;

  @media (min-width: 600px) {
    padding: 1rem 0;
  }
}

.cards-scroll {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;

  @media (min-width: 600px) {
    gap: 1rem;
    padding: 1rem;
  }
}

.card-wrapper {
  flex: 0 0 auto;
  width: calc(50% - 0.5rem);
  height: 200px;
  transition: all 0.3s ease;

  @media (min-width: 600px) {
    width: 300px;
    height: 400px;
  }

  &:hover {
    transform: scale(1.02);
  }

  &.matched {
    animation: matchedAnimation 1.5s ease-out forwards;
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
  }
}
</style>
