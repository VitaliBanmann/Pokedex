function enrichPokemonData(pokemonData, speciesData) {
    pokemonData.germanName = speciesData.names.find(name => name.language.name === "de")?.name || pokemonData.name;
    pokemonData.englishName = pokemonData.name;
}

async function enrichAbilitiesData(abilities) {
    await Promise.all(abilities.map(async ability => {
        const abilityData = await fetchAbilityData(ability.ability.url);
        enrichAbility(ability, abilityData);
    }));
}

async function fetchAbilityData(abilityUrl) {
    const response = await fetch(abilityUrl);
    return await response.json();
}

function enrichAbility(ability, abilityData) {
    ability.germanName = abilityData.names.find(name => name.language.name === "de")?.name || ability.ability.name;
    ability.description = getGermanDescription(abilityData);
}

function getGermanDescription(abilityData) {
    return abilityData.effect_entries.find(e => e.language.name === "de")?.effect || 
           abilityData.flavor_text_entries.find(f => f.language.name === "de")?.flavor_text || 
           "Keine deutsche Beschreibung verfügbar.";
}

function handlePokemonDetailsError(error) {
    console.error("Fehler beim Laden der Pokémon-Details:", error);
}

function displayPokemon(pokemonList) {
    const pokedex = document.querySelector('.pokedex');
    pokedex.innerHTML = "";

    pokemonList.forEach(pokemon => {
        if (!pokemon) return;
        
        const pokemonCard = createPokemonCard(pokemon);
        pokedex.appendChild(pokemonCard);
    });
}

function createPokemonCard(pokemon) {
    const types = pokemon.types.map(t => t.type.name);
    const card = document.createElement("div");
    
    card.className = "pokemonCard";
    applyCardStyling(card, types);
    card.onclick = () => openModal(pokemon);
    card.innerHTML = buildPokemonCardHTML(pokemon, types);
    
    return card;
}

function applyCardStyling(card, types) {
    const [primaryType, secondaryType] = types;
    const primaryColor = typeColors[primaryType]?.bg || '#ccc';
    
    card.style.background = types.length > 1 
        ? `linear-gradient(135deg, ${primaryColor}, ${typeColors[secondaryType]?.bg || '#ccc'})`
        : primaryColor;
    
    card.style.border = `3px solid ${types.length > 1 ? '#333' : typeColors[primaryType]?.border || '#333'}`;
}