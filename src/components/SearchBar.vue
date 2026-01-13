<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PokemonListItem } from '../types/pokemon';

// PROPS: O que o componente recebe do pai
const props = defineProps<{
  colecao: PokemonListItem[]
}>();

// EMITS: Eventos que este componente dispara para o pai
const emit = defineEmits<{
  (e: 'escolhido', nome: string): void
}>();

const termo = ref('');

const sugestoes = computed(() => {
  const query = termo.value.toLowerCase();
  if (query.length < 2) return [];
  return props.colecao.filter(p => p.name.includes(query)).slice(0, 5);
});

function selecionar(nome: string) {
  termo.value = ''; // Limpa o input
  emit('escolhido', nome); // "Avisa" o pai qual foi escolhido
}
</script>

<template>
  <div class="search-container">
    <input
      v-model="termo"
      placeholder="Digite o nome..."
      class="search-input"
    />
    <ul v-if="sugestoes.length > 0" class="suggestions-list">
      <li 
        v-for="s in sugestoes" 
        :key="s.name" 
        @click="selecionar(s.name)"
      >
        {{ s.name.toUpperCase() }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .search-container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto 20px;
    position: relative;
  }
  .search-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
  }
  .suggestions-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-top: none;
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 100; /* Garante que fique por cima de tudo */
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .suggestions-list li {
    padding: 10px;
    cursor: pointer;
    text-align: left;
  }
  .suggestions-list li:hover {
    background-color: #f0f0f0;
    color: #ef5350;
}</style>