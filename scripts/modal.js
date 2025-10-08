function openModal(pokemon) {
    currentPokemon = pokemon;
    const modal = document.getElementById("pokemonModal");
    
    prepareModalContent(pokemon);
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function prepareModalContent(pokemon) {
    const modalContent = document.querySelector("#pokemonModal .modalContent");
    const types = pokemon.types.map(t => t.type.name);
    
    setModalTheme(modalContent, types);
    renderModalHeader(pokemon);
    renderModalImage(pokemon);
    renderPhysicalDetails(pokemon);
    renderTypeDetails(pokemon, types);
    renderStats(pokemon.stats);
    calculateTypeEffects(types);
    renderDetailedAbilities(pokemon.abilities);
}

function setModalTheme(modalContent, types) {
    const colors = types.map(t => typeColors[t] || { bg: '#777', border: '#555' });
    modalContent.style.setProperty('--type-color-1', colors[0].bg);
    modalContent.style.setProperty('--type-color-2', colors[1]?.bg || colors[0].bg);
    modalContent.className = "modalContent typeColored";
}

function renderModalHeader(pokemon) {
    document.getElementById("modalTitle").innerHTML = `
        <span class="pokemonName">#${pokemon.id} ${pokemon.germanName}</span>
        <span class="englishName">${pokemon.name}</span>
    `;
}

function renderModalImage(pokemon) {
    const artwork = pokemon.sprites.other["official-artwork"]?.front_default;
    const homeArt = pokemon.sprites.other?.home?.front_default;
    document.getElementById("modalImage").src = artwork || homeArt || pokemon.sprites.front_default;
}

function renderPhysicalDetails(pokemon) {
    document.getElementById("weightValue").textContent = `${pokemon.weight / 10} kg`;
    document.getElementById("heightValue").textContent = `${pokemon.height / 10} m`;
}

function renderTypeDetails(pokemon, types) {
    document.getElementById("modalTypes").innerHTML = `
        <strong>Typen:</strong> ${types.map(type => createTypeBadge(type)).join('')}
    `;
}

function closeModal() {
    document.getElementById("pokemonModal").style.display = "none";
    document.body.style.overflow = "auto";
}

function renderDetailedAbilities(abilities) {
    const container = document.getElementById("detailedAbilities");
    
    container.innerHTML = createAbilitiesHeader();
    
    if (shouldShowEmptyState(abilities)) {
        container.innerHTML += createEmptyState();
        return;
    }
    
    abilities.forEach(ability => {
        container.appendChild(createAbilityElement(ability));
    });
}

function createAbilitiesHeader() {
    return '<h3>Fähigkeiten</h3>';
}

function createAbilityName(ability) {
    return `<span>${ability.germanName || ability.ability.name}</span>`;
}

function renderStats(stats) {
    const [firstColumnStats, secondColumnStats] = splitStats(stats);
    
    renderStatColumn('statsBars', firstColumnStats, 0);
    renderStatColumn('statsBars2', secondColumnStats, 3);
}

function splitStats(stats) {
    return [stats.slice(0, 3), stats.slice(3)];
}

function renderStatColumn(containerId, stats, nameIndexOffset) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    stats.forEach((stat, index) => {
        container.appendChild(createStatElement(stat, index + nameIndexOffset));
    });
}

function calculateStatPercentage(baseStat, maxStat = 255) {
    return (baseStat / maxStat) * 100;
}

function calculateTypeEffects(types) {
    const { strengths, weaknesses, immunities } = analyzeTypeMatchups(types);
    displayTypeMatchups(strengths, weaknesses, immunities);
}

function displayTypeMatchups(strengths, weaknesses, immunities) {
    displayTypeEffects('strengthsInfo', Array.from(strengths));
    displayTypeEffects('weaknessesInfo', Array.from(weaknesses));
    displayTypeEffects('immunitiesInfo', Array.from(immunities));
}

function displayTypeEffects(elementId, types) {
    const container = document.getElementById(elementId);
    container.innerHTML = types.map(type => `
        <span class="typeTag type-${type}" 
              style="background-color: ${typeColors[type].bg}; 
                     border: 2px solid ${typeColors[type].border}">
            ${type}
        </span>
    `).join('');
}

function determineFinalMatchups(types, counters, weaknessCount, resistanceCount) {
    determineWeaknesses(types, counters.weaknesses, weaknessCount, counters.immunities);
    determineResistances(types, counters.resistances, resistanceCount);
}

function determineWeaknesses(types, weaknesses, count, immunities) {
    Object.entries(count).forEach(([type, cnt]) => {
        if (!immunities.has(type) && cnt === types.length) {
            weaknesses.add(type);
        }
    });
}

function determineResistances(types, resistances, count) {
    Object.entries(count).forEach(([type, cnt]) => {
        if (cnt === types.length) resistances.add(type);
    });
}

function determineAttackStrengths(types, strengths) {
    types.forEach(type => {
        Object.entries(typeEffectiveness).forEach(([otherType, data]) => {
            if (data.weak.includes(type)) strengths.add(otherType);
        });
    });
}

function initTabs() {
    openTab('statsTab');
}

function analyzeTypeMatchups(types) {
    const counters = {
        strengths: new Set(),
        weaknesses: new Set(),
        immunities: new Set(),  // Hier definieren wir immunities
        resistances: new Set()
    };

    const { weaknessCount, resistanceCount } = countTypeVulnerabilities(types, counters.immunities);
    determineFinalMatchups(types, counters, weaknessCount, resistanceCount);
    determineAttackStrengths(types, counters.strengths);

    return counters;
}

function countTypeVulnerabilities(types, immunities) {
    const weaknessCount = {};
    const resistanceCount = {};

    types.forEach(type => {
        const typeData = typeEffectiveness[type];
        if (!typeData) return;

        countWeaknesses(typeData, weaknessCount);
        countResistances(typeData, resistanceCount);
        recordImmunities(typeData, immunities);
    });

    return { weaknessCount, resistanceCount };
}

function countWeaknesses(typeData, counter) {
    typeData.weak?.forEach(t => counter[t] = (counter[t] || 0) + 1);
}

function countResistances(typeData, counter) {
    typeData.resistant?.forEach(t => counter[t] = (counter[t] || 0) + 1);
}

function recordImmunities(typeData, immunitiesSet) {
    typeData.immune?.forEach(t => immunitiesSet.add(t));
}