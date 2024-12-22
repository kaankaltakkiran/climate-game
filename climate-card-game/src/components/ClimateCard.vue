<template>
  <q-card
    class="climate-card"
    :class="{ 'is-flipped': props.isFlipped }"
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
            <q-chip
              :color="getCategoryColor(props.category)"
              text-color="white"
              size="sm"
              class="q-px-sm"
              dense
            >
              {{ props.category }}
            </q-chip>
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
}

const props = defineProps<Props>();
const emit = defineEmits<{
  flip: [] // event with no payload
}>();

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Disasters': 'red-7',
    'Ocean': 'blue-7',
    'Weather': 'purple-7',
    'Ice': 'cyan-7',
    'Ecosystem': 'green-7',
    'Pollution': 'orange-7',
    'Solutions': 'teal-7',
    'Forests': 'light-green-7'
  };
  return colors[category] || 'grey-7';
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
    margin-bottom: 0.25rem;

    @media (min-width: 600px) {
      font-size: 1.25rem;
    }
  }

  &__category {
    display: flex;
    justify-content: flex-start;
    margin-top: 0.25rem;
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
}
</style> 