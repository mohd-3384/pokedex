/**
 * @param {number} index 
 * @param {object} dataPokemon 
 * @param {String} pokemonImg 
 * @param {Array} pokemonTypes 
 * @returns - pokemoncard
 */
function pokemonCard(index, dataPokemon, pokemonImg, pokemonTypes) {
    const firstType = pokemonTypes[0].type.name;
    const backgroundColor = data[firstType]?.color || '#FFFFFF';
    return `
        <div onclick="openOverlay(${index})" class="pokemon py-2 rounded">
            <div class="pokemon-head px-2 d-flex">
                <p class="pokemon-id">#${index + 1}</p>
                <p class="pokemon-name flex-grow-1 text-center">${dataPokemon.species.name}</p>
            </div>
            <div class="pokemon-img-container" style="background-color: ${backgroundColor};">
                <img src="${pokemonImg}" alt="#" class="pokemon-img d-block mx-auto">
            </div>

            <div class="pokemon-types pt-2 d-flex justify-content-center align-items-center column-gap-3">
                ${pokemonTypes.map(type => `
                    <p class="type-name mb-0 px-2 py-1 rounded" style="background-color: ${data[type.type.name]?.color};">
                        ${type.type.name}
                    </p>
                `).join('')}
        </div>
    `
}
{/* <img src="${data[type.type.name]?.url}" alt="" class="rounded-circle"></img> */ }
/**
 * Dialog Card with overlay effect ==> Pokemon Card
 * @param {number} index
 * @param {object} dataPokemon
 * @param {String} pokemonImg
 * @param {object} pokemonTypes
 * @return {*} 
 */
function overlayTemp(index, dataPokemon, pokemonImg, pokemonTypes) {
    const firstType = pokemonTypes[0].type.name;
    const backgroundColor = data[firstType]?.color || '#FFFFFF';
    return `
        <div class="overlay-pokemon d-flex flex-column justify-content-between align-items-center rounded-5"
            id="dialog">
            <div class="pokemon-info pt-3 d-flex justify-content-between align-items-center">
                <p class="pokemon-overlay-id">#${index + 1}</p>
                <p class="pokemon-overlay-name text-center">${dataPokemon.species.name}</p>
                <p onclick="closeDialog()" class="close-dialog rounded px-2">X</p>
            </div>
            <div class="overlay-pokemon-img-container" style="background-color: ${backgroundColor};">
                <img src="${pokemonImg}"
                    alt="" class="overlay-pokemon-img d-block mx-auto">
            </div>
            <ul class="pokemon-overlay-nav px-0 py-3 mb-0 d-flex justify-content-evenly align-items-center">
                <li onclick="getMainContent()" class="px-3 py-1 rounded text-center">Main</li>
                <li onclick="getStatsContent()" class="px-3 py-1 rounded text-center">Stats</li>
                <li onclick="getChainContent()" class="px-3 py-1 rounded text-center">Evo Chain</li>
            </ul>

            <div class="pokemon-overlay-info-content d-flex flex-column justify-content-center align-items-center">
                <div class="main-content" id="overlayMainContent">
                    <p>Type: ${pokemonTypes.map(type => `
                            <span class="type-name mb-0 px-2 py-1 rounded" style="background-color: ${data[type.type.name]?.color};">${type.type.name}</span>
                        `).join(' ')}
                    </p>
                    <p class="height">Height: ${(dataPokemon.height / 3.58).toFixed(2)} m</p>
                    <p class="weight">Weight: ${(dataPokemon.weight / 2.205).toFixed(2)} kg</p>
                    <p class="abilities">Abilities: ${dataPokemon.abilities.map(ability => `
                    ${ability.ability.name}
                `).join(', ')}</p>
                </div>

                <div class="state-content px-3 d-none" id="overlaystatsContent">
                    ${dataPokemon.stats.map(stat => `
                        <div class="state d-flex justify-content-between align-items-center gap-2">
                            <span class="state-title">${stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}</span>
                            <div class="progress" role="progressbar" aria-label="Example with label">
                                <div class="progress-bar" style="width: ${stat.base_stat}%; background-color:${backgroundColor}">${stat.base_stat}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="chain-content d-flex justify-content-between align-items-center gap-2 d-none" id="overlayChainContent">
                </div>
            </div>

                <div class="prev-next d-flex justify-content-evenly align-items-center mb-4">
                    <span class="prev" id="prev">&lt;</span>
                    <span class="next" id="next">&gt;</span>
                </div>
        </div>
    `
}

/**
 * Renders an evolution chain card.
 * @param {Object} pokemon - The Pokémon data.
 * @returns {string} - The HTML string for the card.
 */
function renderEvolutionCard(pokemon) {
    return `
        <div class="evo d-flex flex-column justify-content-center align-items-center">
            <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}">
            <span class="evo-title">${pokemon.name}</span>
        </div>
    `;
}