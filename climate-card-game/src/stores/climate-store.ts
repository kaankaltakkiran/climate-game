import { defineStore } from 'pinia';
import type { ClimateCard } from '../types/climate-card';

export const useClimateStore = defineStore('climate', {
  state: () => ({
    cards: [
      {
        id: 1,
        title: 'Forest Fires',
        frontImage: 'https://source.unsplash.com/800x600/?forest,fire',
        backContent: 'Forest fires are becoming more frequent and intense due to climate change. They release massive amounts of CO2, creating a dangerous feedback loop that further worsens global warming.',
        category: 'Disasters',
        isFlipped: false
      },
      {
        id: 2,
        title: 'Rising Sea Levels',
        frontImage: 'https://source.unsplash.com/800x600/?ocean,flood',
        backContent: 'Rising sea levels caused by melting ice caps and thermal expansion threaten coastal communities worldwide. By 2100, sea levels could rise by 1-2 meters.',
        category: 'Ocean',
        isFlipped: false
      },
      {
        id: 3,
        title: 'Extreme Weather',
        frontImage: 'https://source.unsplash.com/800x600/?storm,hurricane',
        backContent: 'Climate change is increasing the frequency and intensity of extreme weather events, including hurricanes, droughts, and heatwaves.',
        category: 'Weather',
        isFlipped: false
      },
      {
        id: 4,
        title: 'Melting Glaciers',
        frontImage: 'https://source.unsplash.com/800x600/?glacier,melting',
        backContent: 'Glaciers are melting at unprecedented rates, threatening water supplies for millions and contributing to sea level rise.',
        category: 'Ice',
        isFlipped: false
      },
      {
        id: 5,
        title: 'Biodiversity Loss',
        frontImage: 'https://source.unsplash.com/800x600/?endangered,species',
        backContent: 'Climate change is causing mass extinction of species, disrupting ecosystems, and threatening global biodiversity.',
        category: 'Ecosystem',
        isFlipped: false
      },
      {
        id: 6,
        title: 'Carbon Emissions',
        frontImage: 'https://source.unsplash.com/800x600/?factory,pollution',
        backContent: 'Rising carbon emissions from human activities are the primary driver of climate change, leading to global temperature increase.',
        category: 'Pollution',
        isFlipped: false
      }
    ] as ClimateCard[]
  }),

  actions: {
    toggleCard(id: number) {
      const card = this.cards.find(c => c.id === id);
      if (card) {
        card.isFlipped = !card.isFlipped;
      }
    }
  }
}); 