<script setup lang="ts">
import { getPokemonThumb } from '../services/api';
import type { PokemonListItem } from '../types/pokemon';

function getPokemonId(url: string): string {
  return url.split('/').filter(Boolean).pop() || '0';
}
defineProps<{
  lista: PokemonListItem[],
  selecionadoNome?: string;
  carregando: boolean
}>();

// Definimos os nomes dos eventos que o pai vai escutar
defineEmits(['detalhar', 'carregarMais']);
</script>

<template>
  <div class="grid-wrapper">
    <div class="list-header">
      <span>Exibindo {{ lista.length }} Pokémons</span>
    </div>

    <div class="scrollable-area">
      <div 
        v-for="p in lista" 
        :key="p.name" 
        class="list-item"
        :class="{ active: selecionadoNome === p.name }"
        @click="$emit('detalhar', p.name)"
      >
        <div class="item-info">
          <span class="pokemon-id">#{{ getPokemonId(p.url).padStart(3, '0') }}</span>
          <img :src="getPokemonThumb(p.url)" class="mini-sprite" />
          <span class="pokemon-name">{{ p.name.toUpperCase() }}</span>
        </div>
      </div>

      <button @click="$emit('carregarMais')" :disabled="carregando" class="btn-load">
        {{ carregando ? 'Buscando mais...' : 'Carregar mais' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.grid-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 15px;
  border: 1px solid #eee;
  overflow: hidden;
}

.list-header {
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  font-weight: bold;
  color: #666;
}

.scrollable-area {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.pokemon-id {
  font-family: 'Courier New', Courier, monospace;
  color: #228be6;
  font-weight: bold;
  margin-right: 10px;
  min-width: 45px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  transition: all 0.2s ease;
}
.list-item:hover {
  background: #f1f3f5;
  transform: translateX(5px); /* Efeito visual de slide */
}
.list-item.active { 
  background: #e7f5ff;
  border-color: #228be6;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.pokemon-name {
  font-weight: 600;
  color: #495057;
}
.btn-load {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  background: #228be6;
  color: white;
  border: none;
  cursor: pointer;
}
</style>