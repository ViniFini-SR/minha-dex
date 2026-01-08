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