const limitimg = document.querySelector('#pokemons');

// Fonction pour récupérer la liste des Pokémon
const getPokemon = async () => {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        if (!response.ok) {
            throw new Error('Erreur HTTP ! Statut : ' + response.status);
        }
        return await response.json();
    } catch (err) {
        console.error("Erreur lors de la récupération des Pokémon : " + err);
    }
};

// Fonction pour récupérer les détails d'un Pokémon
const getPokemonDetails = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur HTTP ! Statut : ' + response.status);
        }
        return await response.json();
    } catch (err) {
        console.error("Erreur lors de la récupération des détails du Pokémon : " + err);
    }
};

// Fonction pour afficher la liste des Pokémon
const displayPokemonList = async () => {
    const pokemonList = await getPokemon();

    for (let pokemon of pokemonList.results) {
        const pokeDetails = await getPokemonDetails(pokemon.url);
        const pokemonId = pokeDetails.id;

        const pokeID = document.createElement('a');
        pokeID.classList.add('popokemon');

        const pokename = document.createElement('h2');
        pokename.textContent = pokeDetails.name;

        const pokeIcon = document.createElement('img');
        
        // Vérifier si le Pokémon est capturé dans le localStorage
        const localStorageKey = `pokemon-${pokemonId}`;
        const storedPokemon = JSON.parse(localStorage.getItem(localStorageKey));
        
        let isShiny = false;
        
        // Si le Pokémon est capturé, utiliser son état shiny enregistré
        if (storedPokemon && storedPokemon.captured) {
            isShiny = storedPokemon.shiny;
        } else {
            // Sinon, générer aléatoirement (10% de chance)
            isShiny = Math.random() <= 0.1;
        }

        pokeIcon.src = isShiny
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonId}.png`
            : `https://raw.githubusercontent.com/PokeAPI/sprites/0c328e64c6916ec31f9c9ae3a362b0eb9dca66cb/sprites/pokemon/other/dream-world/${pokemonId}.svg`;

        pokeIcon.alt = pokeDetails.name;

        // URL par défaut ou URL capturée
        let finalUrl;
        if (storedPokemon && storedPokemon.captured) {
            // Utiliser l'URL stockée qui contient le bon état shiny et captured
            finalUrl = `./detail.html?id=${pokemonId}&shiny=${storedPokemon.shiny}&captured=true`;
        } else {
            // URL par défaut avec shiny aléatoire
            finalUrl = `./detail.html?id=${pokemonId}&shiny=${isShiny}`;
        }

        pokeID.href = finalUrl;
        pokeID.style.cursor = 'url("./img/64px-Poké_Ball_icon.png"), auto';
        pokeID.appendChild(pokeIcon);
        pokeID.appendChild(pokename);

        // Afficher une Pokéball si capturé
        if (storedPokemon && storedPokemon.captured) {
            const pokeball = document.createElement('img');
            pokeball.src = './img/32px-Poké_Ball_icon.png';
            pokeball.alt = 'Pokéball';
            pokeball.classList.add('pokeball')
            pokeID.appendChild(pokeball);
        }

        limitimg.appendChild(pokeID);
    }
};

// Appel de la fonction pour afficher la liste des Pokémon
displayPokemonList();
