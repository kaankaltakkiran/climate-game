<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div
        v-for="card in store.cards"
        :key="card.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <div class="card-container">
          <ClimateCard
            v-bind="card"
            @flip="store.toggleCard(card.id)"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useClimateStore } from '../stores/climate-store';
import ClimateCard from '../components/ClimateCard.vue';

const store = useClimateStore();
</script>

<style lang="scss">
.card-container {
  height: 400px;
  margin-bottom: 1rem;
}
</style>
