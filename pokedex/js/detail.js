// Récupère les paramètres de l'URL
const params = new URLSearchParams(window.location.search);
const index = parseInt(params.get("id"));
console.log("ID du Pokémon :", index);

// Validation de l'ID : rediriger si hors limites ou invalide
if (!index || index < 1 || index > 151) {
    window.location.replace('./index.html');
}

const isShiny = params.get("shiny") === "true";
console.log("Est shiny :", isShiny);

const isCaptured = params.get("captured") === "true";
console.log("Est capturé :", isCaptured);

let clickCount = 0;

// Sélection des Div
const pname = document.querySelector('#pokename');
const img = document.querySelector('#pokeimg');
const ptypes = document.querySelector('#poketype');
const ptaille = document.querySelector('#poketaille');
const taille = document.querySelector('#poketail');
const poids = document.querySelector('#pokepoids');
const pstat = document.querySelector('#pokestat');
const statTitre = document.querySelector('#stats');
const btn = document.querySelector('#button');

// Couleur des types
const Colors = {
    normal: '#a8a878', grass: '#78c850', ground: '#e0c068', fighting: '#c03028', rock: '#b8a038',
    steel: '#b8b8d0', fire: '#f08030', electric: '#f8d030', flying: '#a890f0', psychic: '#f85888',
    bug: '#a8b820', dragon: '#7038f8', water: '#6890f0', ice: '#98d8d8', poison: '#a040a0',
    dark: '#705848', ghost: '#705898', fairy: '#ffaec9'
};

// Fonction pour récupérer les détails d'un Pokémon depuis l'API
const getPokemonDetail = async (index) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`);
    return await response.json();
};

const displayPokemonDetails = async (data, fromLocalStorage = false) => {
    try {
        console.log("Données du Pokémon :", data);

        // Affiche Nom Pokemon
        const pokename = document.createElement('h1');
        pokename.textContent = `#${data.id} ${data.name}`;
        pname.appendChild(pokename);

        // Afficher la Pokéball si le Pokémon est capturé
        if (isCaptured) {
            const pokeball = document.createElement('img');
            pokeball.src = './img/32px-Poké_Ball_icon.png';
            pokeball.alt = 'Pokéball';
            pokeball.classList.add('pokeball')
            pname.appendChild(pokeball);
        }
        
        // Affiche img Pokemon
        const icon = data.id;
        const pokeIconFront = document.createElement('img');
        pokeIconFront.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${isShiny ? 'shiny/' : ''}${icon}.gif`;
        const pokeIconBack = document.createElement('img');
        pokeIconBack.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${isShiny ? 'shiny/' : ''}${icon}.gif`;
        img.style.cursor = 'url("./img/64px-Poké_Ball_icon.png"), auto';
        img.appendChild(pokeIconFront);
        img.appendChild(pokeIconBack);

        // Affiche Type Pokemon
        const types = data.types;
        for (const type of types) {
            const pokeType = document.createElement('span');
            pokeType.classList.add('type');
            pokeType.style.backgroundColor = Colors[type.type.name];
            pokeType.textContent = type.type.name;
            ptypes.appendChild(pokeType);
        }

        const poketaille = document.createElement('h2');
        poketaille.classList.add('taille');
        poketaille.textContent = `Taille: ${data.height / 10} m`;
        const pokepoids = document.createElement('h2');
        pokepoids.textContent = `Poids: ${data.weight / 10} kg`;
        pokepoids.classList.add('poids');
        taille.appendChild(poketaille);
        poids.appendChild(pokepoids);
        ptaille.appendChild(taille);
        ptaille.appendChild(poids);

        // Affiche Stats Pokemon
        const stats = data.stats;
        statTitre.textContent = "Stats :";
        for (const stat of stats) {
            const pokestat = document.createElement('div');
            pokestat.classList.add('stats');
            const pokestatdetail = document.createElement('h4');
            pokestatdetail.classList.add('statsdetail');
            pokestatdetail.textContent = `${stat.stat.name} : ${stat.base_stat}`;
            const pokebar = document.createElement('div');
            pokebar.classList.add('bar');
            pokebar.style.width = `${(stat.base_stat / 255) * 100}%`;

            if (data.types.length > 1) {
                pokebar.style.background = "linear-gradient(to bottom right," + Colors[data.types[0].type.name] + ", " + Colors[data.types[1].type.name] + ")";
                poketaille.style.backgroundImage = "linear-gradient(to bottom right," + Colors[data.types[0].type.name] + ", " + Colors[data.types[1].type.name] + ")";
                pokepoids.style.backgroundImage = "linear-gradient(to bottom right," + Colors[data.types[0].type.name] + ", " + Colors[data.types[1].type.name] + ")";
                pokestatdetail.style.backgroundImage = "linear-gradient(to bottom right," + Colors[data.types[0].type.name] + ", " + Colors[data.types[1].type.name] + ")";
                statTitre.style.backgroundImage = "linear-gradient(to bottom right," + Colors[data.types[0].type.name] + ", " + Colors[data.types[1].type.name] + ")";
            } else {
                pokebar.style.backgroundColor = Colors[data.types[0].type.name];
                poketaille.style.color = Colors[data.types[0].type.name];
                pokepoids.style.color = Colors[data.types[0].type.name];
                pokestatdetail.style.color = Colors[data.types[0].type.name];
                statTitre.style.color = Colors[data.types[0].type.name];
            }

            pstat.style.width = (stat.base_stat / 255) * 100;

            pokestat.appendChild(pokestatdetail);
            pstat.appendChild(pokestat);
            pstat.appendChild(pokebar);
        }

        // BOUTON
        // Flèche gauche
        const flecheGbutton = document.createElement('a');
        const flecheGbutton2 = document.createElement('button');
        flecheGbutton2.classList.add('gauche');
        flecheGbutton2.textContent = '<';
        
        if (index <= 1) {
            flecheGbutton2.disabled = true;
            flecheGbutton2.style.cursor = "not-allowed";
            flecheGbutton2.style.opacity = "0.5";
        } else {
            // Vérifier l'état shiny du Pokémon précédent
            const prevStoredPokemon = JSON.parse(localStorage.getItem(`pokemon-${index - 1}`));
            const prevShiny = prevStoredPokemon?.shiny || false;
            const prevCaptured = prevStoredPokemon?.captured || false;
            flecheGbutton.href = `./detail.html?id=${index - 1}&shiny=${prevShiny}${prevCaptured ? '&captured=true' : ''}`;
            flecheGbutton2.style.cursor = "pointer";
        }
        
        flecheGbutton.appendChild(flecheGbutton2);
        btn.appendChild(flecheGbutton);

        // Bouton retour
        const backbutton = document.createElement('a');
        backbutton.href = `./index.html`;
        const backbutton2 = document.createElement('button');
        backbutton2.style.cursor = "pointer";
        backbutton2.textContent = 'Back';
        backbutton.appendChild(backbutton2);
        backbutton2.classList.add('back');
        btn.appendChild(backbutton);

        // Flèche droite
        const flecheDbutton = document.createElement('a');
        const flecheDbutton2 = document.createElement('button');
        flecheDbutton2.textContent = '>';
        
        if (index >= 151) {
            flecheDbutton2.disabled = true;
            flecheDbutton2.style.cursor = "not-allowed";
            flecheDbutton2.style.opacity = "0.5";
        } else {
            // Vérifier l'état shiny du Pokémon suivant
            const nextStoredPokemon = JSON.parse(localStorage.getItem(`pokemon-${parseInt(index) + 1}`));
            const nextShiny = nextStoredPokemon?.shiny || false;
            const nextCaptured = nextStoredPokemon?.captured || false;
            flecheDbutton.href = `./detail.html?id=${parseInt(index) + 1}&shiny=${nextShiny}${nextCaptured ? '&captured=true' : ''}`;
            flecheDbutton2.style.cursor = "pointer";
        }
        
        flecheDbutton.appendChild(flecheDbutton2);
        flecheDbutton2.classList.add('droite');
        btn.appendChild(flecheDbutton);

        const capturePokemon = () => {
            const randomNumber = Math.random() * 100;
            const localStorageKey = `pokemon-${index}`;
            let storedData = localStorage.getItem(localStorageKey);
            
            // Vérifier si le Pokémon est déjà capturé (pas juste s'il existe dans le localStorage)
            if (storedData) {
                let pokemonData = JSON.parse(storedData);
                if (pokemonData.captured) {
                    const feedbackElement = document.createElement('p');
                    feedbackElement.textContent = 'Ce Pokémon a déjà été capturé !';
                    pname.appendChild(feedbackElement);
                    return;
                }
            }
            
            // Tentative de capture
            if (randomNumber > 55) {
                const pokemonData = {
                    data: data,
                    shiny: isShiny,
                    captured: true
                };

                localStorage.setItem(localStorageKey, JSON.stringify(pokemonData));
                const capturedUrl = `./detail.html?id=${index}&shiny=${isShiny}&captured=true`;
                localStorage.setItem(`capturedUrl-${index}`, capturedUrl);
                window.location.href = capturedUrl;
            } else {
                clickCount++;
                if (clickCount < 3) {
                    const feedbackElement = document.createElement('p');
                    feedbackElement.textContent = 'Essayez à nouveau';
                    pname.appendChild(feedbackElement);
                } else {
                    const feedbackElement = document.createElement('p');
                    feedbackElement.textContent = 'Échec de la capture.';
                    pname.appendChild(feedbackElement);
                    setTimeout(() => {
                        window.location.href = './index.html';
                    }, 2000);
                }
            }
        };

        const catchPokemon = document.querySelector('#pokeimg');
        catchPokemon.addEventListener('click', capturePokemon);

    } catch (err) {
        console.error("Erreur lors de l'affichage des détails du Pokémon :", err);
    }
};

const loadPokemonDetails = async () => {
    try {
        const localStorageKey = `pokemon-${index}`;
        let pokemonData = localStorage.getItem(localStorageKey);

        const data = await getPokemonDetail(index);
        console.log("Fetched data from API:", data);

        // Ne pas enregistrer automatiquement dans localStorage
        // Seulement charger s'il existe déjà
        if (pokemonData) {
            pokemonData = JSON.parse(pokemonData);
            
            // Mettre à jour l'URL si capturé
            if (pokemonData.captured) {
                const params = new URLSearchParams(window.location.search);
                params.set("captured", "true");
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                window.history.replaceState(null, '', newUrl);
            }
        }

        displayPokemonDetails(data, false);
    } catch (err) {
        console.error("Erreur lors du chargement des détails du Pokémon :", err);
        window.location.replace('./index.html');
    }
};

document.addEventListener('DOMContentLoaded', loadPokemonDetails);



// // Fonction principale pour charger les détails du Pokémon
// const loadPokemonDetails = async () => {
//     const localStorageKey = `pokemon-${index}`;
//     let pokemonData = localStorage.getItem(localStorageKey);

//     if (pokemonData) {
//         pokemonData = JSON.parse(pokemonData);
//         displayPokemonDetails(pokemonData.data, true); // Appel avec fromLocalStorage = true
//     } else {
//         try {
//             const data = await getPokemonDetail(index);
//             displayPokemonDetails(data);
//         } catch (err) {
//             console.error("Erreur lors de l'affichage des détails du Pokémon :", err);
//         }
//     }
// };

// Appel de la fonction loadPokemonDetails au chargement de la page
// document.addEventListener('DOMContentLoaded', loadPokemonDetails);
// console.log(localStorage.newUrl)

// Charge les détails du Pokémon au chargement de la page
// loadPokemonDetails();

// getPokemonDetail(index)
//         .then(data => {
//             displayPokemonDetails(data);
//         })
//         .catch(err => {
//             console.error("Erreur lors de l'affichage des détails du Pokémon :", err);
//         });
