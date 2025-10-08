const gens = [
    [1,151,'Gen 1'], [152,251,'Gen 2'], [252,386,'Gen 3'],
    [387,493,'Gen 4'], [494,649,'Gen 5'], [650,721,'Gen 6'],
    [722,809,'Gen 7'], [810,905,'Gen 8'], [906,1025,'Gen 9'],
    [1026,1302,'Sonder'],
    [1,1025,'Alle']
];

function renderControls() {
    document.getElementById('controls').innerHTML = renderGenButtons(gens);
    document.getElementById('typeFilterContainer').innerHTML = renderTypeFilter();
    document.getElementById('filterResetContainer').innerHTML = `
        <button onclick="resetFilters()" class="resetButton">Filter zurücksetzen</button>
    `;
}

async function loadGeneration(start, end) {
    try {
        offset = start - 1;
        limit = end - start + 1;
        await fetchPokemon();
        updateCounter();
    } catch (error) {
        console.error("Fehler beim Laden der Generation:", error);
    }
}

function updateCounter() {
    const counterElement = document.getElementById('counter');
    if (!counterElement || totalPokemon === 0) return;
    
    const start = Math.min(offset + 1, totalPokemon);
    const end = Math.min(offset + limit, totalPokemon);
    counterElement.textContent = `${start}-${end} von ${totalPokemon}`;
}

function navigatePokemon(direction) {
    if (!currentPokemon) return;
    const currentIndex = allPokemon.findIndex(p => p.id === currentPokemon.id);
    if (currentIndex === -1) return;
    let newIndex = currentIndex + direction;
    if (newIndex < 0) {
        newIndex = allPokemon.length - 1;
    } else if (newIndex >= allPokemon.length) {
        newIndex = 0;
    }
    openModal(allPokemon[newIndex]);
}

function checkCloseModal(event) {
    if (event.target.id === "pokemonModal") {
        closeModal();
    }
}

function displayAllPokemon() {
    displayPokemon(allPokemon);
}

function activateCurrentButton(tabId, event) {
    const button = event?.currentTarget || 
                 document.querySelector(`.tabButton[onclick*="${tabId}"]`);
    
    if (button) {
        button.classList.add('active');
    }
}

function deactivateAllButtons() {
    document.querySelectorAll('.tabButton').forEach(button => {
        button.classList.remove('active');
    });
}

function resetFilters() {
    const typeFilter = document.getElementById('typeFilter');
    typeFilter.selectedIndex = -1;
    
    document.getElementById('search').value = '';
    
    displayAllPokemon();
    updateCounter();
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const canLoadMore = offset + limit < totalPokemon;
    
    loadMoreBtn.disabled = !canLoadMore;
    loadMoreBtn.classList.toggle('disabled', !canLoadMore);
}

function updateLoadLessButton() {
    const loadLessBtn = document.getElementById('loadLessBtn');
    const canLoadLess = limit > 40;
    
    loadLessBtn.disabled = !canLoadLess;
    loadLessBtn.classList.toggle('disabled', !canLoadLess);
}

function loadMorePokemon() {
    limit += 40;
    fetchPokemon();
    updateLoadMoreButtons();
}

function loadLessPokemon() {
    if (limit > 40) {
        limit -= 40;
        fetchPokemon();
        updateLoadMoreButtons();
    }
}

function resetGenerationHighlights() {
    document.querySelectorAll('.genButton').forEach(btn => {
        btn.classList.remove('activeGen');
    });
}

function getActiveGenerationIndex() {
    if (!gens || !Array.isArray(gens)) return -1;
    
    for (let i = 0; i < gens.length; i++) {
        const [start, end] = gens[i];
        if (offset + 1 >= start && offset + limit <= end) {
            return i;
        }
    }
    return -1;
}

function highlightActiveGeneration() {
    resetGenerationHighlights();
    const activeGenIndex = getActiveGenerationIndex();
    
    if (activeGenIndex >= 0) {
        document.querySelector(`.genButton:nth-child(${activeGenIndex + 1})`)
               .classList.add('activeGen');
    }
}

function loadNextPage() {
    if (offset + limit < totalPokemon) {
        offset += 40;
        limit = 40;
        fetchPokemon();
    }
}

function loadPrevPage() {
    if (offset >= 40) {
        offset -= 40;
    } else {
        offset = 0;
    }
    limit = 40;
    fetchPokemon();
}

function updatePageNavButtons() {
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (prevBtn) {
        prevBtn.disabled = offset === 0;
        prevBtn.classList.toggle('disabled', offset === 0);
    }
    if (nextBtn) {
        nextBtn.disabled = offset + 40 >= totalPokemon;
        nextBtn.classList.toggle('disabled', offset + 40 >= totalPokemon);
    }
}

function updateLimitButtons() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadLessBtn = document.getElementById('loadLessBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.disabled = offset + limit >= totalPokemon;
        loadMoreBtn.classList.toggle('disabled', offset + limit >= totalPokemon);
    }
    if (loadLessBtn) {
        loadLessBtn.disabled = limit <= 40;
        loadLessBtn.classList.toggle('disabled', limit <= 40);
    }
}

function updateNavButtons() {
    updatePageNavButtons();
    updateLimitButtons();
}