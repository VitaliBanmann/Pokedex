function renderTypeFilter() {
    return `
        <div class="typFilter">
            <span class="filterLabel">Filter nach Typ:</span>
            <select id="typeFilter" class="filterSelect" multiple onchange="filterByType()">
                ${Object.keys(typeColors).map(t => `<option value="${t}">${t[0].toUpperCase()+t.slice(1)}</option>`).join('')}
            </select>
        </div>
        <div id="filterResetContainer"></div>
    `;
}

function buildPokemonCardHTML(pokemon, types) {
    return `
        <img src="${pokemon.sprites.front_default}" 
             alt="${pokemon.name}" 
             class="pokemonImage"
             loading="lazy">
        <div class="pokemonInfo">
            <h3>
                <span class="pokemonName">${pokemon.germanName}</span>
                <span class="englishName">${pokemon.name}</span>
            </h3>
            <p>#${pokemon.id}</p>
            <div class="types">
                ${types.map(type => createTypeBadge(type)).join('')}
            </div>
        </div>
    `;
}

function createTypeBadge(type) {
    const typeConfig = typeColors[type] || { bg: '#ccc', border: '#333' };
    return `
        <span class="typeTag type-${type}" 
              style="background-color: ${typeConfig.bg}; 
                     border: 2px solid ${typeConfig.border}">
            ${type}
        </span>
    `;
}

function createAbilityElement(ability) {
    const element = document.createElement("div");
    element.className = "abilityItem";
    element.innerHTML = `
        <div class="abilityName">
            ${createAbilityName(ability)}
            ${createHiddenBadge(ability)}
        </div>
        <div class="abilityDescription">
            ${ability.description || "Keine Beschreibung verfügbar."}
        </div>
    `;
    return element;
}

function createStatElement(stat, nameIndex) {
    const statNames = ['HP', 'Angriff', 'Verteidigung', 
                      'Spez. Angriff', 'Spez. Verteidigung', 'Initiative'];
    const percentage = calculateStatPercentage(stat.base_stat);
    
    const element = document.createElement("div");
    element.className = "statBarContainer";
    element.innerHTML = `
        <div class="statBarLabel">
            <span>${statNames[nameIndex]}</span>
            <span>${stat.base_stat}</span>
        </div>
        <div class="statBar">
            <div class="statBarFill" style="width: ${percentage}%"></div>
        </div>
    `;
    
    return element;
}

function renderGenButtons(gens) {
    return `
        <div class="generationButtons">${gens.map(([s,e,n]) => 
            `<button onclick="loadGeneration(${s},${e})" class="genButton">${n||'Gen '+(gens.findIndex(g => g[0] === s && g[1] === e))}</button>`
        ).join('')}</div>
        <div class="pagination">
            <div class="pagination-group">
                <button id="prevPageBtn" onclick="loadPrevPage()" class="pagination-button" disabled>Vorherige 40</button>
                <button id="nextPageBtn" onclick="loadNextPage()" class="pagination-button">Nächste 40</button>
            </div>
            <span id="counter">${offset + 1}-${Math.min(offset + limit, totalPokemon)} von ${totalPokemon}</span>
            <div class="pagination-group">
                <button id="loadLessBtn" onclick="loadLessPokemon()" class="pagination-button" disabled>Weniger anzeigen</button>
                <button id="loadMoreBtn" onclick="loadMorePokemon()" class="pagination-button">Mehr anzeigen</button>
            </div>
        </div>
    `;
}