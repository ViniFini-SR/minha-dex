<script setup lang="ts">
  import type { Pokemon } from '../types/pokemon';
  defineProps<{
    pokemon: Pokemon
  }>();
</script>

<template>
  <div class="card-detalhe">

    <div class="image-container">
      <img
        :src="pokemon.sprites.other['official-artwork'].front_default"
        :alt="pokemon.name"
        class="main-img"
      >
    </div>

    <div class="abilities-section">
      <h3> Habilidades </h3>
      <ul>
        <li v-for="item in pokemon.abilities" :key="item.ability.name">
          {{ item.ability.name }}
          
        </li>
      </ul>
    </div>

  </div>
</template>

<style scoped>
  .card-detalhe {
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    max-width: 250px;
  }
  img {
    width: 150px;
  }
</style>