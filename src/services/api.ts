import type {Pokemon, PokemonListItem} from '../types/pokemon';

/**
 * Função assíncrona para busca de Pokemon pelo ID ou Nome
 * @param {string | number} id
 * @returns {Promise<Pokemon>}
 */
export async function getPokemon(id: string | number): Promise<Pokemon> {
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
        throw new Error('Pokemon não encontrado!');
    }

    return await response.json();
}

/**
 * Busca apenas a sprite.
 * @param {string} pokemonUrl
 * @return {string}
 */
export function getPokemonThumb(pokemonUrl: string): string {
    const id = pokemonUrl.split('/').filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/**
 * Função assíncrona para buscar uma lista de Pokemon
 * @param {number} limit
 * @returns {Promise<PokemonListItem>}
 */
export async function getPokemonList(limit = 20, offset = 0): Promise<PokemonListItem[]> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Erro ao buscar listagem');

    const data = await response.json();
    return data.results;
}

/**
 * Função assíncrona para buscar o nome de todos os Pokemons
  * @returns {Promise<PokemonListItem>}
 */
export async function getAllPokemonNames(): Promise<PokemonListItem[]> {
    const metaResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1`);
    const metaData = await metaResponse.json();
    const total = metaData.count;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${total}`);
    if (!response.ok) throw new Error('Erro ao buscar dados');

    const data = await response.json();
    return data.results;
}