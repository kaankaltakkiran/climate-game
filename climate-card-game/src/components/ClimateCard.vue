<template>
  <div
    class="climate-card"
    :class="{ 'is-flipped': props.isFlipped }"
    @click="emit('flip')"
  >
    <div class="climate-card__inner">
      <div class="climate-card__front">
        <q-img
          :src="props.frontImage"
          :ratio="16/9"
          class="climate-card__image"
        />
        <div class="climate-card__title">
          {{ props.title }}
        </div>
        <div class="climate-card__category">
          {{ props.category }}
        </div>
      </div>
      <div class="climate-card__back">
        <div class="climate-card__content">
          {{ props.backContent }}
        </div>
      </div>
    </div>
  </div>
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
</script>

<style lang="scss">
.climate-card {
  perspective: 1000px;
  width: 100%;
  height: 100%;
  cursor: pointer;

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: white;
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
    padding: 1.5rem;
    background: #f7f7f7;
  }

  &__image {
    border-radius: 12px 12px 0 0;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    padding: 1rem;
    color: #2c3e50;
  }

  &__category {
    font-size: 0.9rem;
    color: #666;
    padding-bottom: 1rem;
  }

  &__content {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #2c3e50;
  }
}
</style> 