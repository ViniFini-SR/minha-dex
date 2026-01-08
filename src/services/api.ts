import type {Pokemon} from '../types/pokemon';

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