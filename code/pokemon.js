const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const pokedexContainer = document.getElementById('pokedex-container');
const messageArea = document.getElementById('message-area');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSearch();
});


const handleSearch = async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {return;}
    pokedexContainer.innerHTML = '';
    displayMessage('Carregando...', true); 

    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${searchTerm}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Pokémon não encontrado!');
        }
        const pokemonData = await response.json();
        displayMessage('', false)
        createPokemonCard(pokemonData);
    } catch (error) {
        console.error(error);
        displayMessage('Pokémon não encontrado. Tente novamente.');
    }
};

const displayMessage = (message, show = true) => {
    messageArea.textContent = message;
    messageArea.style.display = show ? 'block' : 'none';
};

const createPokemonCard = (pokemon) => {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    const name = pokemon.name;
    const id = pokemon.id.toString().padStart(3, '0');
    const imageUrl = pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default;
    const types = pokemon.types.map(typeInfo => typeInfo.type.name);                   
    const typesHtml = types.map(type => 
        `<span class="type-badge type-${type}">${type}</span>`
    ).join('');
    const cardHtml = `
        <img src="${imageUrl}" alt="Imagem do ${name}">
        <p class="pokemon-number">#${id}</p>
        <h2 class="pokemon-name">${name}</h2>
        <div class="pokemon-types">
            ${typesHtml}
        </div>
    `;
    card.innerHTML = cardHtml;
    pokedexContainer.appendChild(card);
};