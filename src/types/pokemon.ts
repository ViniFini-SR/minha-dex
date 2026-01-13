export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  types: Array<{ type: { name: string } }>;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
    other: {
      "official-artwork": { front_default: string; front_shiny: string};
    };
  };
  abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
  species: { url: string };
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface EvolutionChain {
  species: { name: string; url: string };
  evolves_to: EvolutionChain[];
}

export interface PokemonSpecies {
  evolution_chain: { url: string };
  generation: { name: string };
}