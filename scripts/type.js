// Typen und ihre Eigenschaften
const typeColors = {
    normal: { bg: '#A8A878', border: '#8A8A5C' },
    fire: { bg: '#F08030', border: '#D06010' },
    water: { bg: '#6890F0', border: '#4870D0' },
    electric: { bg: '#F8D030', border: '#D8B010' },
    grass: { bg: '#78C850', border: '#58A830' },
    ice: { bg: '#98D8D8', border: '#78B8B8' },
    fighting: { bg: '#C03028', border: '#A01008' },
    poison: { bg: '#A040A0', border: '#802080' },
    ground: { bg: '#E0C068', border: '#C0A048' },
    flying: { bg: '#A890F0', border: '#8870D0' },
    psychic: { bg: '#F85888', border: '#D83868' },
    bug: { bg: '#A8B820', border: '#889800' },
    rock: { bg: '#B8A038', border: '#988018' },
    ghost: { bg: '#705898', border: '#503878' },
    dragon: { bg: '#7038F8', border: '#5018D8' },
    dark: { bg: '#705848', border: '#503828' },
    steel: { bg: '#B8B8D0', border: '#9898B0' },
    fairy: { bg: '#EE99AC', border: '#CE798C' }
};

// Typ-Effektivitäten
const typeEffectiveness = {
    normal: { weak: ['fighting'], resistant: [], immune: ['ghost'] },
    fire: { weak: ['water', 'ground', 'rock'], resistant: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'] },
    water: { weak: ['electric', 'grass'], resistant: ['fire', 'water', 'ice', 'steel'] },
    electric: { weak: ['ground'], resistant: ['electric', 'flying', 'steel'] },
    grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resistant: ['water', 'electric', 'grass', 'ground'] },
    ice: { weak: ['fire', 'fighting', 'rock', 'steel'], resistant: ['ice'] },
    fighting: { weak: ['flying', 'psychic', 'fairy'], resistant: ['bug', 'rock', 'dark'] },
    poison: { weak: ['ground', 'psychic'], resistant: ['grass', 'fighting', 'poison', 'bug', 'fairy'] },
    ground: { weak: ['water', 'grass', 'ice'], resistant: ['poison', 'rock'], immune: ['electric'] },
    flying: { weak: ['electric', 'ice', 'rock'], resistant: ['grass', 'fighting', 'bug'], immune: ['ground'] },
    psychic: { weak: ['bug', 'ghost', 'dark'], resistant: ['fighting', 'psychic'] },
    bug: { weak: ['fire', 'flying', 'rock'], resistant: ['grass', 'fighting', 'ground'] },
    rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resistant: ['normal', 'fire', 'poison', 'flying'] },
    ghost: { weak: ['ghost', 'dark'], resistant: ['poison', 'bug'], immune: ['normal', 'fighting'] },
    dragon: { weak: ['ice', 'dragon', 'fairy'], resistant: ['fire', 'water', 'electric', 'grass'] },
    dark: { weak: ['fighting', 'bug', 'fairy'], resistant: ['ghost', 'dark'], immune: ['psychic'] },
    steel: { weak: ['fire', 'fighting', 'ground'], resistant: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immune: ['poison'] },
    fairy: { weak: ['poison', 'steel'], resistant: ['fighting', 'bug', 'dark'], immune: ['dragon'] }
};