let limit = 20

/**
 * Fetches the first 20 Pokémon from the API and displays them on the main page.
 * @param {number} [offset=0] - The starting point for fetching Pokémon.
 * @returns {Promise<void>} 
 */
async function fetchFirst20Pokemon(offset = 0) {
    showSpinner();
    loadMoreButton.classList.add("d-none");
    const pokedexApiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&$offset=${offset}`;
    try {
        const data = await fetchApiData(pokedexApiUrl);
        const pokemonList = data.results;
        await fetchAndDisplayPokemon(offset, pokemonList);
        loadMoreButton.classList.remove("d-none");
        hideSpinner();
        return pokemonList;
    } catch (error) {
        handleFetchError(error)
    }
}

/**
 * Fetches JSON data from the given API URL.
 * @param {string} url - The API endpoint URL.
 * @returns {Promise<Object>} - The parsed JSON response.
 */
async function fetchApiData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fehler: ${response.status} ${response.statusText}`);
    return response.json();
}

/**
 * Fetches and displays Pokémon data from a list.
 * @param {number} offset - The starting index for Pokémon.
 * @param {Array} pokemonList - List of Pokémon retrieved from the API.
 * @returns {Promise<void>}
 */
async function fetchAndDisplayPokemon(offset, pokemonList) {
    for (let index = offset; index < pokemonList.length; index++) {
        const responsePokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`);
        const dataPokemon = await responsePokemon.json();
        document.querySelector(".pokemons").innerHTML += pokemonCard(
            index, dataPokemon, dataPokemon.sprites.other.home.front_default, dataPokemon.types
        );
    }
}

/**
 * Handles errors during API fetch operations.
 * @param {Error} error - The error object.
 */
function handleFetchError(error) {
    console.error('Fehler beim Abrufen der Pokémon-Daten:', error);
    loadMoreButton.classList.remove("d-none");
    hideSpinner();
}

/**
 * Filters Pokémon cards based on search input.
 */
function filterPokemon() {
    const searchText = searchInput.value.toLowerCase().trim();
    toggleLoadMoreButton(searchText === "")
    const pokemonCards = document.querySelectorAll('.pokemon');
    pokemonCards.forEach(card => {
        const pokemonName = card.querySelector('.pokemon-name').textContent.toLowerCase();
        toggleCardVisibility(card, pokemonName.includes(searchText));
        if (pokemonName.includes(searchText)) {
            card.classList.add('d-block');
            card.classList.remove('d-none');
        } else {
            card.classList.add('d-none');
            card.classList.remove('d-block');
        }
    });
}

/**
 * Toggles the visibility of the "Load More" button.
 * @param {boolean} show - Determines whether to show or hide the button.
 */
function toggleLoadMoreButton(show) {
    const loadMoreButton = document.getElementById('loadMoreButton');
    loadMoreButton.classList.toggle('d-block', show);
    loadMoreButton.classList.toggle('d-none', !show);
}

/**
 * Toggles the visibility of a Pokémon card.
 * @param {HTMLElement} card - The Pokémon card element to toggle.
 * @param {boolean} isVisible - Determines whether the card should be visible.
 */
function toggleCardVisibility(card, isVisible) {
    card.classList.toggle('d-block', isVisible);
    card.classList.toggle('d-none', !isVisible);
}

/**
 * Loads 20 more Pokémon and fetches their data from the API.
 * @returns {Promise<void>}
 */
async function loadMorePokemon() {
    searchInput.value = '';
    showSpinner();
    const offset = limit;
    limit += 20;
    await fetchFirst20Pokemon(offset);
    hideSpinner();
}

/**
 * Opens the overlay for a specific Pokémon by index.
 * @param {number} index - The index of the Pokémon to display.
 * @returns {Promise<void>}
 */
async function openOverlay(index) {
    currentIndex = index;
    document.body.classList.add("overflowY-hidden");
    overlay.classList.add("overlay");
    const dataPokemon = await fetchPokemonData(index);
    setupOverlay(dataPokemon, index);
    setupOverlayNavigation(index);
}

/**
 * Fetches Pokémon data for a given index.
 * @param {number} index - The index of the Pokémon to fetch.
 * @returns {Promise<Object>} - The Pokémon data.
 */
async function fetchPokemonData(index) {
    const responsePokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`);
    return responsePokemon.json();
}

/**
 * Sets up the overlay content for the specified Pokémon.
 * @param {Object} dataPokemon - The Pokémon data object.
 * @param {number} index - The index of the Pokémon.
 */
function setupOverlay(dataPokemon, index) {
    const pokemonImg = dataPokemon.sprites.other.home.front_default;
    const pokemonTypes = dataPokemon.types;
    overlay.innerHTML += overlayTemp(index, dataPokemon, pokemonImg, pokemonTypes);
    fetchAndDisplayEvolutionChain(index + 1, pokemonTypes.map(type => type.type.name));
}

/**
 * Sets up navigation for the overlay with "Previous" and "Next" buttons.
 * @param {number} index - The current Pokémon index.
 */
function setupOverlayNavigation(index) {
    document.getElementById('prev').addEventListener("click", event => navigateOverlay(event, index - 1));
    document.getElementById('next').addEventListener("click", event => navigateOverlay(event, index + 1));
    document.getElementById('dialog').addEventListener("click", event => event.stopPropagation());
}

/**
 * Navigates to a new Pokémon in the overlay.
 * @param {Event} event - The click event object.
 * @param {number} newIndex - The index of the new Pokémon.
 */
function navigateOverlay(event, newIndex) {
    event.stopPropagation();
    const pokemonCards = document.querySelectorAll('.pokemon');
    if (newIndex >= 0 && newIndex < pokemonCards.length) {
        closeOverlay();
        openOverlay(newIndex);
    }
}

/**
 * Fetches and displays the evolution chain for a Pokémon.
 * @param {number} index - The Pokémon index.
 * @param {Array<string>} pokemonTypes - The types of the Pokémon.
 * @returns {Promise<void>}
 */
async function fetchAndDisplayEvolutionChain(index, pokemonTypes) {
    try {
        const chain = await getEvolutionChain(index, pokemonTypes);
        renderEvolutionChain(chain, index);
    } catch (error) {
        console.error('Fehler beim Abrufen der Evolutionskette:', error);
    }
}

/**
 * Fetches the evolution chain for a Pokémon.
 * @param {number} index - The Pokémon index.
 * @param {Array<string>} pokemonTypes - The Pokémon's types.
 * @returns {Promise<Array<Object>>} - The evolution chain Pokémon data.
 */
async function getEvolutionChain(index, pokemonTypes) {
    const chain = [];
    const startIndex = Math.max(1, index - 2);
    const endIndex = index + 3;
    for (let i = startIndex; i < endIndex; i++) {
        const dataPokemon = await fetchPokemonData(i - 1);
        if (dataPokemon.types.some(type => pokemonTypes.includes(type.type.name))) {
            chain.push(dataPokemon);
        }
    }
    return chain;
}

/**
 * Renders the evolution chain in the overlay.
 * @param {Array<Object>} chain - The evolution chain data.
 * @param {number} index - The current Pokémon index.
 */
function renderEvolutionChain(chain, index) {
    const filteredChain = filterEvolutionChain(chain, index);
    overlayChainContent.innerHTML = filteredChain.map(renderEvolutionCard).join('>>');
}

/**
 * Filters the evolution chain to show only relevant Pokémon.
 * @param {Array<Object>} chain - The evolution chain data.
 * @param {number} index - The current Pokémon index.
 * @returns {Array<Object>} - The filtered evolution chain.
 */
function filterEvolutionChain(chain, index) {
    if (chain.length <= 3) return chain;
    const currentIndex = chain.findIndex(p => p.id === index + 1);
    return [
        chain[currentIndex - 1],
        chain[currentIndex],
        chain[currentIndex + 1]
    ].filter(Boolean);
}

/**
 * Displays the specified content in the overlay while hiding others.
 * @param {HTMLElement} showElement - The element to show.
 * @param {HTMLElement[]} hideElements - The elements to hide.
 */
function toggleOverlayContent(showElement, hideElements) {
    showElement.classList.add("d-block");
    showElement.classList.remove("d-none");

    hideElements.forEach(element => {
        element.classList.add("d-none");
        element.classList.remove("d-block");
    });
}

/**
 * Displays the main content in the overlay.
 */
function getMainContent() {
    toggleOverlayContent(overlayMainContent, [overlaystatsContent, overlayChainContent]);
}

/**
 * Displays the stats content in the overlay.
 */
function getStatsContent() {
    toggleOverlayContent(overlaystatsContent, [overlayMainContent, overlayChainContent]);
}

/**
 * Displays the evolution chain content in the overlay.
 */
function getChainContent() {
    toggleOverlayContent(overlayChainContent, [overlayMainContent, overlaystatsContent]);
}

/**
 * Closes the dialog overlay.
 */
function closeDialog() {
    closeOverlay();
}

/**
 * Closes the overlay.
 */
function closeOverlay() {
    document.body.classList.remove("overflowY-hidden");
    overlay.classList.remove("overlay");
    overlay.innerHTML = "";
}
