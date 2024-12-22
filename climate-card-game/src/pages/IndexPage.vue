<template>
  <q-page class="q-pa-md">
    <!-- Game Setup -->
    <div v-if="!store.isPlaying && !store.isGameComplete && !isCountingDown" class="text-center q-mb-lg">
      <h4 class="text-h4 q-mb-md">Climate Change Memory Game</h4>
      <div class="row justify-center q-gutter-md q-mb-lg">
        <q-btn-group outline>
          <q-btn
            :color="store.gameMode === 'easy' ? 'primary' : 'grey'"
            label="Easy"
            @click="selectMode('easy')"
          />
          <q-btn
            :color="store.gameMode === 'medium' ? 'primary' : 'grey'"
            label="Medium"
            @click="selectMode('medium')"
          />
          <q-btn
            :color="store.gameMode === 'hard' ? 'primary' : 'grey'"
            label="Hard"
            @click="selectMode('hard')"
          />
        </q-btn-group>
      </div>
      <q-btn
        color="primary"
        icon="play_arrow"
        label="Start Game"
        class="q-mt-md"
        @click="startCountdown"
      />
    </div>

    <!-- Countdown Screen -->
    <div v-if="isCountingDown" class="countdown-screen">
      <div class="text-center">
        <h2 class="text-h2 countdown-number">{{ countdownNumber }}</h2>
        <p class="text-h5">Get Ready!</p>
      </div>
    </div>

    <!-- Game Board -->
    <div v-if="store.isPlaying" class="game-board">
      <div class="text-center q-mb-md">
        <h5 class="text-h5">Time: {{ formatTime(store.gameTimeInSeconds) }}</h5>
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
          flat
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
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Congratulations! 🎉</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <p>You've completed the game in {{ formatTime(store.gameTimeInSeconds) }}!</p>
          <p>Would you like to play again?</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="New Game" color="primary" @click="startNewGame" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useClimateStore } from '../stores/climate-store';
import ClimateCard from '../components/ClimateCard.vue';
import { onMounted, ref, watch } from 'vue';

const store = useClimateStore();
const showCompletionDialog = ref(false);
const isCountingDown = ref(false);
const countdownNumber = ref(3);

// Format time function
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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
  }, 3000);
};

const resetGame = () => {
  store.resetCards();
};

const startNewGame = () => {
  showCompletionDialog.value = false;
  store.initializeGame(store.gameMode);
};

// Watch for game completion
watch(() => store.isGameComplete, (isComplete) => {
  if (isComplete) {
    showCompletionDialog.value = true;
  }
});

// Initialize game on mount
onMounted(() => {
  store.initializeGame('easy');
});
</script>

<style lang="scss">
.game-board {
  max-width: 1200px;
  margin: 0 auto;
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
  background: rgba(255, 255, 255, 0.95);
  z-index: 9999;
}

.countdown-number {
  font-size: 8rem;
  font-weight: bold;
  color: var(--q-primary);
  animation: pulse 1s infinite;
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
  padding: 1rem 0;
}

.cards-scroll {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
}

.card-wrapper {
  flex: 0 0 auto;
  width: 300px;
  height: 400px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  &.matched {
    animation: matchedAnimation 0.5s ease-out forwards;
  }
}

.completion-card {
  min-width: 300px;
  max-width: 400px;
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

// Responsive adjustments
@media (max-width: 600px) {
  .card-wrapper {
    width: 250px;
    height: 350px;
  }

  .countdown-number {
    font-size: 6rem;
  }
}
</style>
