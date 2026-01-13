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

    <div class="info">
      
      <h2> {{ pokemon.name.toUpperCase() }}</h2>
      <p class="id-badge">#{{ pokemon.id }}</p>

      <div class="stats-grid">
        <div class="stat-item"><strong>Peso: {{ pokemon.weight / 10 }} kg</strong></div>
        <div class="stat-item"><strong>Altura: {{ pokemon.height / 10 }} m</strong></div>
      </div>

      <div class="abilities-section">
        <h3>Habilidades</h3>
        <ul>
          <li v-for="item in pokemon.abilities" :key="item.ability.name">
            {{ item.ability.name }}
            <span v-if="item.is_hidden" class="hidden-tag">(Oculta)</span>
          </li>
        </ul>
      </div>
    
      <div class="sprintes-gallery">
        <img :src="pokemon.sprites.front_default" title="Frente">
        <img :src="pokemon.sprites.back_default" title="Costas">
        <img :src="pokemon.sprites.front_shiny" title="Versão Shiny">
      </div>
    </div>

  </div>
</template>

<style scoped>
  .card-detalhe {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    max-width: 400px;
    padding: 20px;
  }

  .main-img {
    width: 100%;
    height: auto;
  }

  .id-badge {
    color: #999;
    font-weight: bold;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 15px 0;
  }

  .abilities-section {
    text-align: left;
    background: #f8f9fa;
    padding: 10px;
    border-radius: 8px;
  }

  .hidden-tag {
    font-size: 0.8em;
    color: #ef5350;
    font-style: italic;
  }

  .sprites-gallery img {
    width: 60px;
    border: 1px solid #eee;
    margin: 5px;
    border-radius: 50%;
  }
</style>