<script setup lang="ts">
  import { ref, onMounted} from 'vue';
  import { getPokemonList, getPokemon } from './services/api';
  import type { Pokemon, PokemonListItem } from './types/pokemon';
  import PokemonCard from './components/PokemonCard.vue';
  
  const pokemons = ref<PokemonListItem[]>([]);
  const pokemonSelecionado = ref<Pokemon | null>(null);
  const loading = ref(false);
  const offset = ref(0);
  const error = ref<string | null> (null);

  async function carregarPokemons() {
    if (loading.value) return;

    loading.value = true;
    try {
      const novosPokemons = await getPokemonList(undefined, offset.value);
      pokemons.value = [...pokemons.value, ...novosPokemons];
    } catch (err) {
      error.value = "Falha na busca";
    } finally {
      loading.value = false;
    }
  }

  async function verDetalhes(name: string) {
    try {
      pokemonSelecionado.value = await getPokemon(name);
    } catch (err) {
      alert("Erro ao carregar detalhes")
    }
  }

  onMounted(() => {carregarPokemons()});
</script>

<template>
  <div class="app-container">
    <h1 class="titulo-principal">Pokedex do Finimon</h1>

    <div v-if="pokemonSelecionado" class="details-section">
      <PokemonCard :pokemon="pokemonSelecionado" />
    </div>

    <div v-if="loading">Carregando dados...</div>

    <div class="pokemon-grid" v-else>
      <div 
        v-for="p in pokemons" 
        :key="p.name" 
        class="list-item"
      >
        <span>{{ p.name.toUpperCase() }}</span>
        <button @click="verDetalhes(p.name)">Ver Detalhes</button>
      </div>
    </div>

    <div class="actions">
      <button
        @click="carregarPokemons"
        :disabled="loading"
      >
        {{ loading ? 'Carregando...' : "Carregar mais" }}
      </button>
    </div>

  </div>
</template>

<style scoped>
  .titulo-principal {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 30px;
    color: #2c3e50; /* Um cinza escuro profissional */  }
  .pokemon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 30px;
  }
  .list-item {
    border: 1px solid #eee;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .details-section {
    display: flex;
    justify-content: center;
    padding: 20px;
    background: #f9f9f9;
  }
</style>