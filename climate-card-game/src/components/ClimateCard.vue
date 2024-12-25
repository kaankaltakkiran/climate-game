<template>
  <q-card
    class="climate-card"
    :class="{ 'is-flipped': props.isFlipped, 'matched': props.matched }"
    @click="emit('flip')"
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
            @click.stop="emit('flip')"
          />
        </q-card-section>
      </div>
    </div>
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
  matched: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  flip: [] // event with no payload
}>();

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

  &.matched {
    animation: matchedAnimation 1.5s ease-out forwards;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(46, 213, 115, 0.8) 0%, rgba(46, 213, 115, 0) 70%);
      z-index: 2;
      opacity: 0;
      animation: successGlow 1.5s ease-out forwards;
    }

    .climate-card__inner {
      animation: successShake 0.5s ease-out;
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

@keyframes successGlow {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}

@keyframes successShake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}
</style> 