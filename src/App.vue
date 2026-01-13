<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPokemonList, getPokemon, getAllPokemonNames } from './services/api';
import type { Pokemon, PokemonListItem } from './types/pokemon';

// Componentes
import PokemonCard from './components/PokemonCard.vue';
import SearchBar from './components/SearchBar.vue';
import PokemonGrid from './components/PokemonGrid.vue';

// Estado Global da Aplicação
const pokemons = ref<PokemonListItem[]>([]);
const pokemonNomes = ref<PokemonListItem[]>([]);
const pokemonSelecionado = ref<Pokemon | null>(null);
const loading = ref(false);
const offset = ref(0);
const limit = 20;

const cacheDetalhes = new Map<string, Pokemon>();

// Função de Busca (Nossa "Stored Procedure" principal)
async function bootstrapApp() {
  if (loading.value) return;
  loading.value = true;
  
  try {
    // 1. Tenta recuperar o catálogo de nomes do LocalStorage (Cache em Disco)
    const cacheKey = 'poke-names-cache';
    const cachedNames = localStorage.getItem(cacheKey);
    
    let nomesCompletos: PokemonListItem[];

    if (cachedNames) {
      // Se existe no disco, damos o "Parse" (deserialização)
      nomesCompletos = JSON.parse(cachedNames);
    } else {
      // Se não, vamos buscar na API (I/O caro) e salvar no disco
      nomesCompletos = await getAllPokemonNames();
      localStorage.setItem(cacheKey, JSON.stringify(nomesCompletos));
    }

    // 2. Busca a lista inicial paginada (Essa geralmente não cacheamos no disco para evitar dados obsoletos)
    const listaInicial = await getPokemonList(limit, offset.value);

    // 3. Popula os estados
    pokemons.value = listaInicial;
    pokemonNomes.value = nomesCompletos;
    offset.value += limit;

  } catch (err) {
    console.error("Erro no Bootstrap:", err);
  } finally {
    loading.value = false;
  }
}

// Função de Busca (Nossa "Stored Procedure" principal)
async function fetchDados() {
  if (loading.value) return;
  loading.value = true;
  try {
    const novos = await getPokemonList(20, offset.value);
    pokemons.value = [...pokemons.value, ...novos];
    offset.value += limit;
  } finally {
    loading.value = false;
  }
}

async function exibirDetalhes(nome: string) {
  // ESTRATÉGIA: Cache-aside (Olha o cache primeiro, se não tiver, busca e guarda)
  
  // 1. Verifica se já temos o detalhe na memória
  if (cacheDetalhes.has(nome)) {
    // console.log(`Cache Hit: ${nome}`);
    pokemonSelecionado.value = cacheDetalhes.get(nome)!;
    return; 
  }

  try {
    // console.log(`Cache Miss: ${nome}. Buscando na API...`);
    const detalhe = await getPokemon(nome);
    
    // 2. Guarda no cache para a próxima vez
    cacheDetalhes.set(nome, detalhe);
    pokemonSelecionado.value = detalhe;
  } catch (err) {
    alert("Erro ao buscar detalhes!");
  }
}

onMounted(bootstrapApp);
</script>

<template>
  <div class="app-container">
    <h1 class="titulo-principal">PokeDash do Finimon</h1>

    <SearchBar :colecao="pokemonNomes" @escolhido="exibirDetalhes" />

    <div class="main-layout">
      
      <aside class="left-panel">
        <div v-if="pokemonSelecionado" class="sticky-card">
          <PokemonCard :pokemon="pokemonSelecionado" @selecionar="exibirDetalhes"/>
        </div>
        <div v-else class="empty-state">
          Selecione um Pokémon para ver os detalhes
        </div>
      </aside>

      <main class="right-panel">
        <PokemonGrid 
          :lista="pokemons" 
          :carregando="loading"
          :selecionadoNome="pokemonSelecionado?.name"
          @detalhar="exibirDetalhes"
          @carregarMais="fetchDados"
        />
      </main>

    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.titulo-principal {
  font-family: 'PokemonFont'; 
  text-align: center;
  margin-top: 1px;
  margin-bottom: 30px;
  font-size: 5rem; 
  color: #ffcb05;
  text-shadow: 
    -2px -2px 0 #3b4cca, 
     2px -2px 0 #3b4cca,
    -2px  2px 0 #3b4cca,
     2px  2px 0 #3b4cca;
}

.main-layout {
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin: 0 auto;
  align-items: stretch;
  width: 100%;
}

.left-panel {
  flex: 1;
  min-width: 350px;
}

.right-panel {
  flex: 1;
  position: relative
}

.empty-state {
  padding: 40px;
  text-align: center;
  border: 2px dashed #ccc;
  border-radius: 20px;
  color: #999;
}

@media (max-width: 800px) {
  /* Se a tela for pequena (celular), volta a ficar um embaixo do outro */
  .main-layout {
    flex-direction: column;
  }
}
</style>