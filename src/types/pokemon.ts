export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
        front_default: string;
        back_default: string;
        other: {
            "official-artwork": {
                front_default: string;
            }
        }
    };
    abilities: Array<{
        ability: { name: string };
        is_hidden: boolean;
    }>;
    types: {
        type: {
            name: string;
        }
    }[]
}

export interface PokemonListItem {
    name: string;
}