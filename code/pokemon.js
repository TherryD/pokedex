// ---- Seletores dos elementos ----
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const pokedexContainer = document.getElementById('pokedex-container');
const messageArea = document.getElementById('message-area');
const navContainer = document.getElementById('navigation-buttons');
const prevBtn = document.getElementById('prev-btn')
const nextBtn = document.getElementById('next-btn')

// ---- Variável de estado ----
const state = {
    currentPokemonId: null,
    isShiny: false
}

// ---- Função de busca reatorada
const fetchPokemon = async (idOrName) =>{
    navContainer.classList.add('hidden')
    pokedexContainer.innerHTML = ''
    displayMessage('Carregando...', true)

    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${idOrName}`
        const response = await fetch(url)
        if (!response.ok) {throw new Error('Pokémon não encontrado!')}
        
        const pokemonData = await response.json()
        displayMessage('', false)
        createPokemonCard(pokemonData)
    } catch (error) {
        console.error(error)
        state.currentPokemonId = null
        state.isShiny = false
        displayMessage('Pokémon não encontrado. Tente novamente.')
    }
}

// ---- Event Listeners ----

//Listener do formulário de busca
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim().toLowerCase()
    if (searchTerm){
        state.isShiny = false
        fetchPokemon(searchTerm)
    }
});

//Listerners dos botões de naveção
prevBtn.addEventListener('click', () =>{
    if(state.currentPokemonId > 1) {fetchPokemon(state.currentPokemonId - 1)}
})

nextBtn.addEventListener('click', () =>{
    if(state.currentPokemonId < 1025) {fetchPokemon(state.currentPokemonId + 1)}
})

// ---- Funções Auxiliares ----

//Exibi ou esconde a mensagem de status(carregamento/erro)
const displayMessage = (message, show = true) => {
    messageArea.textContent = message;
    messageArea.style.display = show ? 'block' : 'none';
};

//Cria o card HTML para um pokémon e o adiciona na página
const createPokemonCard = (pokemon) => {
    searchInput.value = ''
    state.currentPokemonId = pokemon.id

    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    const name = pokemon.name;
    const id = pokemon.id.toString().padStart(3, '0');

    const normalImage = pokemon.sprites.other['official-artwork'].front_default
    const shinyImage = pokemon.sprites.other['official-artwork'].front_shiny
    const imageUrl = state.isShiny ? shinyImage: normalImage
    
    const types = pokemon.types.map(typeInfo => typeInfo.type.name)
    const typesHtml = types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('')    
     
    const statsHtml = pokemon.stats.map(stat =>{
        let statName = stat.stat.name.replace('special-attack', 'Sp. Atk').replace('special-defense', 'Sp. Def')
        const statPercentage = (stat.base_stat / 255) * 100
        return`
            <div class="stat-row">
                <div class="stat-name">${statName}</div>
                <div class="stat-bar">
                    <div class="stat-bar-inner" style="width: ${statPercentage}%;"></div>
                </div>
                <div class="stat-value">${stat.base_stat}</div>
            </div>
        `
    }).join('')

    const cardHtml = `
        <button id="shiny-btn">X</button>
        <img src="${imageUrl ?? pokemon.sprites.front_default}" alt="Imagem do ${name}">
        <p class="pokemon-number">#${id}</p>
        <h2 class="pokemon-name">${name}</h2>
        <div class="pokemon-types">${typesHtml}</div>
        <div class="pokemon-stats">${statsHtml}</div>
    `;
    card.innerHTML = cardHtml;
    pokedexContainer.appendChild(card);

    const shinyBtn = document.getElementById('shiny-btn')
    shinyBtn.addEventListener('click', () =>{
        state.isShiny = !state.isShiny
        fetchPokemon(state.currentPokemonId)
    })
    navContainer.classList.remove('hidden')
}
const randomId = Math.floor(Math.random() * 1025) + 1
fetchPokemon(randomId)
