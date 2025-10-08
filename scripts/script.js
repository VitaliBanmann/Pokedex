const apiUrl = "https://pokeapi.co/api/v2/pokemon";
let offset = 0;
let limit = 40;
let totalPokemon = 0;
let allPokemon = [];
let cachedPokemonDetails = {};
let currentPokemon = null;

// Initialisierung
async function init() {
    renderControls();
    await fetchPokemon();
    initTabs();
}

async function fetchPokemonListData() {
    const { pokemonList, totalCount } = await fetchPokemonList();
    totalPokemon = totalCount;
    return pokemonList;
}

async function processAndDisplayPokemon(pokemonList) {
    const pokemonDetails = await fetchAllPokemonDetails(pokemonList);
    allPokemon = pokemonDetails.filter(Boolean);
    displayPokemon(allPokemon);
    updateCounter();
}

function updateUIAfterFetch() {
    highlightActiveGeneration();
    updateNavButtons();
}

async function fetchPokemon() {
    showLoading(true);
    
    try {
        const pokemonList = await fetchPokemonListData();
        await processAndDisplayPokemon(pokemonList);
    } catch (error) {
        handleFetchError(error);
    } finally {
        showLoading(false);
        updateUIAfterFetch();
    }
}

async function fetchPokemonList() {
    const response = await fetch(`${apiUrl}?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return {
        pokemonList: data.results.map(p => p.url),
        totalCount: data.count
    };
}

async function fetchAllPokemonDetails(urlList) {
    return await Promise.all(urlList.map(fetchPokemonDetails));
}

function handleFetchError(error) {
    console.error("Fehler beim Laden der Pokémon:", error);
}

async function fetchPokemonDetails(url) {
    if (cachedPokemonDetails[url]) return cachedPokemonDetails[url];
    
    try {
        const pokemonData = await fetchPokemonData(url);
        const speciesData = await fetchSpeciesData(pokemonData.species.url);
        
        enrichPokemonData(pokemonData, speciesData);
        await enrichAbilitiesData(pokemonData.abilities);
        
        cachedPokemonDetails[url] = pokemonData;
        return pokemonData;
    } catch (error) {
        handlePokemonDetailsError(error);
        return null;
    }
}

async function fetchPokemonData(url) {
    const response = await fetch(url);
    return await response.json();
}

async function fetchSpeciesData(speciesUrl) {
    const response = await fetch(speciesUrl);
    return await response.json();
}

function shouldShowEmptyState(abilities) {
    return !abilities || abilities.length === 0;
}

function createEmptyState() {
    return '<p>Keine Fähigkeiten gefunden</p>';
}

function createHiddenBadge(ability) {
    return ability.is_hidden ? '<span class="abilityHidden">(Versteckte Fähigkeit)</span>' : '';
}

function openTab(tabId, event = null) {
    hideAllTabs();
    deactivateAllButtons();
    showSelectedTab(tabId);
    activateCurrentButton(tabId, event);
}

function hideAllTabs() {
    document.querySelectorAll('.tabContent').forEach(tab => {
        tab.style.display = 'none';
    });
}


function showSelectedTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        tab.style.display = 'block';
    }
}

function filterByType() {
    const select = document.getElementById('typeFilter');
    const selectedTypes = Array.from(select.selectedOptions).map(o => o.value);
    if (selectedTypes.length === 0) {
        displayPokemon(allPokemon);
        return;
    }
    const filteredPokemon = allPokemon.filter(pokemon => {
        return pokemon.types.some(type => selectedTypes.includes(type.type.name));
    });
    
    displayPokemon(filteredPokemon);
    updateCounter();
}

function searchPokemon() {
    const searchValue = getSearchValue();
    if (isEmptySearch(searchValue)) {
        displayAllPokemon();
        return;
    }
    if (searchValue.length < 3) {
        return;
    }
    
    const filteredPokemon = filterPokemon(searchValue);
    displayPokemon(filteredPokemon);
    updateCounter();
}

function getSearchValue() {
    return document.getElementById('search').value.toLowerCase();
}

function isEmptySearch(value) {
    return value === '';
}

function filterPokemon(searchValue) {
    return allPokemon.filter(pokemon => matchesSearchCriteria(pokemon, searchValue));
}

function matchesSearchCriteria(pokemon, searchValue) {
    return (
        pokemon.name.toLowerCase().includes(searchValue) || 
        pokemon.germanName.toLowerCase().includes(searchValue) ||
        pokemon.id.toString().includes(searchValue)
    );
}

// Ladeanimation
function showLoading(show) {
    const loadingModal = document.getElementById('loadingModal');
    if (show) {
        loadingModal.style.display = 'flex';
        const spinner = loadingModal.querySelector('.pokeballSpinner');
        spinner.style.animation = 'none';
        setTimeout(() => {
            spinner.style.animation = '';
        }, 10);
    } else {
        loadingModal.style.display = 'none';
    }
}