<template>
  <div class="app-container">
    <h1>Minha Pokedex</h1>

    <div class="search-box">
      <input
        v-model="searchId"
        placeholder="Digite o nome ou ID"
        @keyup.enter="fetchData"
      />
      <button @click="fetchData">Buscar</button>
    </div>

    <PokemonCard v-if="pokemon" :pokemon="pokemon"/>

    <p v-if="loading">Consultando...</p>
    <p v-if="error" class="error"> {{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPokemon } from './services/api';
import type { Pokemon } from './types/pokemon';
import PokemonCard from './components/PokemonCard.vue';

const pokemon = ref<Pokemon | null>(null);
const searchId = ref('1'); // Padrão é o bulba
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchData() {
  if (!searchId.value) return;

  loading.value = true;
  error.value = null;

  try {
    const data = await getPokemon(searchId.value.toLocaleLowerCase());
    pokemon.value = data;
  } catch {
    pokemon.value = null;
    error.value = "Pokemon não enconstrado. Verifique o nome ou id digitado...";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<style>
  .app-container { 
    font-family: sans-serif; 
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
  }
  .search-box {
    margin-bottom: 20px;
  }
  input {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-right: 10px;
  }
  button {
    padding: 10px 20px;
    cursor: pointer;
    background: #ef5350;
    color: white;
    border: none;
    border-radius: 4px;
  }
  .error {
    color: red;
    margin-top: 10px;
  }
</style>