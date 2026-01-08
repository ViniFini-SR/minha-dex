<template>
  <div class="card">
    <img :src="pokemon.sprites.front_default" :alt="pokemon.name">
    <h3>{{ pokemon.name.toUpperCase() }}</h3>
    <p>Nº PokeDex: {{ pokemon.id }}</p>
    <div class="stats">
        <p>Altura: {{ pokemon.height / 10 }}m</p>
        <p>Peso: {{ pokemon.weight / 10 }}kg</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '../types/pokemon';
defineProps<{
    pokemon: Pokemon
}>();
</script>

<style scoped>
    .card {
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        max-width: 250px;
    }
    img { width: 150px; }
</style>