<template>
  <q-card
    class="climate-card"
    :class="{ 
      'is-flipped': props.isFlipped,
      'is-matched': props.isMatched,
      'is-error': props.showError
    }"
    @click="handleFlip"
    v-ripple
  >
    <div class="climate-card__inner">
      <div class="climate-card__front">
        <q-img
          :src="props.frontImage"
          :ratio="16/9"
          class="climate-card__image"
          spinner-color="primary"
          spinner-size="82px"
        >
          <template v-slot:loading>
            <div class="text-subtitle1 text-white">
              Loading...
            </div>
          </template>
        </q-img>
        <q-card-section class="q-pa-sm q-pa-md-md">
          <div class="climate-card__title text-h6 text-weight-bold">
            {{ props.title }}
          </div>
          <div class="climate-card__category">
            <q-badge
              :color="getCategoryColor(props.category)"
              :class="getCategoryClass(props.category)"
              class="category-badge"
              rounded
              outline
            >
              <q-icon
                :name="getCategoryIcon(props.category)"
                size="14px"
                class="q-mr-xs"
              />
              {{ props.category }}
            </q-badge>
          </div>
        </q-card-section>
      </div>
      <div class="climate-card__back">
        <q-card-section class="climate-card__content">
          {{ props.backContent }}
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="refresh"
            class="absolute-bottom-right q-mb-xs q-mr-xs"
            @click.stop="handleFlip"
          />
        </q-card-section>
      </div>
    </div>

    <!-- Match Status Overlay -->
    <transition name="fade">
      <div 
        v-if="props.isMatched || props.showError"
        class="match-status"
        :class="{ 'error': props.showError }"
      >
        <div class="match-status__content">
          <q-icon
            :name="props.isMatched ? 'check_circle' : 'error'"
            :color="props.isMatched ? 'positive' : 'negative'"
            size="2em"
          />
          <div class="match-status__text">
            {{ props.isMatched ? 'Eşleşme Bulundu!' : 'Eşleşme Bulunamadı!' }}
          </div>
        </div>
      </div>
    </transition>
  </q-card>
</template>

<script setup lang="ts">
interface Props {
  id: number;
  title: string;
  frontImage: string;
  backContent: string;
  category: string;
  isFlipped: boolean;
  isMatched?: boolean;
  showError?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  flip: [cardId: number]
}>();

const handleFlip = () => {
  emit('flip', props.id);
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Neden': 'red',
    'Sonuç': 'orange',
    'Çözüm': 'green'
  };
  return colors[category] || 'grey-7';
};

const getCategoryClass = (category: string): string => {
  return `category-${category.toLowerCase()}`;
};

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Neden': 'warning',
    'Sonuç': 'insights',
    'Çözüm': 'eco'
  };
  return icons[category] || 'label';
};
</script>

<style lang="scss">
.climate-card {
  perspective: 1000px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  &:active {
    transform: scale(0.98);
  }
  @media (hover: hover) {
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
  }
  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  &.is-flipped &__inner {
    transform: rotateY(180deg);
  }
  &__front,
  &__back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    background: white;
    overflow: hidden;
  }
  &__front {
    display: flex;
    flex-direction: column;
  }
  &__back {
    transform: rotateY(180deg);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7f7f7;
  }
  &__image {
    border-radius: 12px 12px 0 0;
    height: 50%;
    object-fit: cover;
  }
  &__title {
    font-size: 1rem;
    line-height: 1.2;
    margin-bottom: 0.5rem;
    @media (min-width: 600px) {
      font-size: 1.25rem;
    }
  }
  &__category {
    display: flex;
    justify-content: flex-start;
    margin-top: 0.5rem;
  }
  &__content {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #2c3e50;
    text-align: left;
    height: 100%;
    position: relative;
    padding: 1rem;
    @media (min-width: 600px) {
      font-size: 1.1rem;
      line-height: 1.6;
      padding: 1.5rem;
    }
  }

  &.is-matched .match-status {
    background: rgba(46, 204, 113, 0.9);
  }

  &.is-error {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    
    .match-status {
      background: rgba(231, 76, 60, 0.9);
    }
  }
}

.category-badge {
  font-size: 0.8rem;
  padding: 4px 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 20px;
  
  &.category-neden {
    color: #fff !important;
    background: linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%);
    border: none;
  }
  
  &.category-sonuç {
    color: #fff !important;
    background: linear-gradient(135deg, #ff9f43 0%, #ffbe76 100%);
    border: none;
  }
  
  &.category-çözüm {
    color: #fff !important;
    background: linear-gradient(135deg, #2ecc71 0%, #55efc4 100%);
    border: none;
  }
  .q-icon {
    opacity: 0.9;
  }
}

.match-status {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;

  &__content {
    text-align: center;
    padding: 1rem;
    color: white;
    transform: scale(0.9);
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  &__text {
    margin-top: 0.5rem;
    font-size: 1rem;
    font-weight: 600;

    @media (min-width: 600px) {
      font-size: 1.2rem;
    }
  }

  .q-icon {
    font-size: 2rem;

    @media (min-width: 600px) {
      font-size: 2.5rem;
    }
  }
}

// Animations
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-3px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(3px, 0, 0);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 