<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Pokemon } from '../types/pokemon';
import { getPokemonSpecies, getEvolutionChain, getPokemonThumb } from '../services/api';

const props = defineProps<{ pokemon: Pokemon }>();
const imagemPrincipal = ref(props.pokemon.sprites.other['official-artwork'].front_default);
const evolucoes = ref<{ name: string; url: string }[]>([]);
const carregandoEvo = ref(false);

// Watcher: Se o pokemon mudar, resetamos a imagem para a oficial
watch(() => props.pokemon, () => {
  imagemPrincipal.value = props.pokemon.sprites.other['official-artwork'].front_default;
  buscarDadosEvolucao();
}, { immediate: true });

// Computed para filtrar apenas sprites que existem (não nulos)
const todasSprites = computed(() => {
  const s = props.pokemon.sprites;
  return [
    s.other['official-artwork'].front_default,
    s.other['official-artwork'].front_shiny,
    s.front_default,
    s.back_default,
    s.front_shiny,
    s.back_shiny,
  ].filter(url => !!url);
});

// Mapeamento de cores para os tipos
const typeColors: Record<string, string> = {
  fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  poison: '#A040A0', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820'
};

// Recursão para recolher e expandir a árvore evolutiva
function extrairEvolucoes(chain: any, lista: any[] = []) {
  lista.push({
    name: chain.species.name,
    url: chain.species.url
  })

  if (chain.evolves_to && chain.evolves_to.length > 0) {
    extrairEvolucoes(chain.evolves_to[0], lista);
  }

  return lista;
}

// Funcao para buscar a arvore evolutiva
async function buscarDadosEvolucao() {
  if (!props.pokemon.species?.url) return;
  carregandoEvo.value = true;
  try {
    const species = await getPokemonSpecies(props.pokemon.species.url);
    const chainData = await getEvolutionChain(species.evolution_chain.url)
    evolucoes.value = extrairEvolucoes(chainData);
  } catch (err) {
    console.error("Erro ao carregar evolução", err);
    evolucoes.value = [];
  } finally {
    carregandoEvo.value = false;
  }
}
</script>

<template>
  <div class="card-detalhe">
    <div class="image-stage">
      <div class="type-container">
        <span 
          v-for="t in pokemon.types" 
          :key="t.type.name"
          class="type-badge"
          :style="{ backgroundColor: typeColors[t.type.name] || '#777' }"
        >
          {{ t.type.name.toUpperCase() }}
        </span>
      </div>
      <img :src="imagemPrincipal" class="main-display" />
    </div>

    <div class="gallery-wrapper">
      <div 
        v-for="url in todasSprites" 
        :key="url" 
        class="thumb"
        :class="{ active: imagemPrincipal === url }"
        @click="imagemPrincipal = url"
      >
        <img :src="url" />
      </div>
    </div>

    <div class="info-content">
      <h2>{{ pokemon.name.toUpperCase() }}</h2>
      
      <div class="stats">
        <div v-for="s in pokemon.stats" :key="s.stat.name" class="stat-row">
          <label>{{ s.stat.name.replace('special-', 'sp. ') }}</label>
          <div class="bar-bg">
            <div class="bar-fill" :style="{ width: s.base_stat + 'px' }"></div>
          </div>
          <span>{{ s.base_stat }}</span>
        </div>
      </div>

      <div class="evolution-section">
        <h3>Linha de Evolução</h3>
        <div v-if="carregandoEvo" class="loading-evo">A carregar...</div>
        <div v-else class="evo-chain">
          <div v-for="(evo, index) in evolucoes" :key="evo.name" class="evo-item">
            <img :src="getPokemonThumb(evo.url)" :alt="evo.name" />
            <span :class="{ 'current-evo': evo.name === pokemon.name }">
              {{ evo.name.toUpperCase() }}
            </span>
            <span v-if="index < evolucoes.length - 1" class="arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-detalhe {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}
.image-stage {
  height: 320px;
  background: #f9f9f9;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.main-display { max-height: 90%; object-fit: contain; }
.type-container { position: absolute; top: 10px; left: 10px; display: flex; gap: 5px; }
.type-badge { color: white; padding: 4px 8px; border-radius: 6px; font-size: medium; font-weight: bold; }

.gallery-wrapper {
  display: flex;
  gap: 8px;
  margin-top: 15px;
  overflow-x: auto;
  padding-bottom: 5px;
}
.thumb {
  width: 50px; height: 50px; border: 2px solid #eee; border-radius: 8px; cursor: pointer; flex-shrink: 0;
}
.thumb.active { border-color: #228be6; background: #e7f5ff; }
.thumb img { width: 100%; height: 100%; object-fit: contain; }

.stats { margin-top: 15px; }
.stat-row { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  font-size: larger; 
  margin-bottom: 4px; 
}
.stat-row label { width: 80px; text-transform: capitalize; }
.bar-bg { flex: 1; background: #eee; height: 10px; border-radius: 3px; }
.bar-fill { background: #228be6; height: 100%; border-radius: 3px; }
.info-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.evolution-section {
  margin-top: 25px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.evo-chain {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.evo-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.evo-item img {
  width: 50px;
  height: 50px;
}

.evo-item span {
  font-size: 0.75rem;
  font-weight: bold;
  color: #666;
}

.evo-item span.current-evo {
  color: #228be6;
  text-decoration: underline;
}

.arrow {
  font-size: 1.2rem;
  color: #ccc;
  margin: 0 5px;
}
</style>