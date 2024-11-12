function toggleModal() {
  let modal = document.getElementById("contactModal");
  console.log(modal);
  modal.classList.toggle("hidden");
}

function debugPokemon() {
  let debugObject = document.getElementById("debug");
  let pokemon = randomPokemon();
  debugObject.innerHTML = JSON.stringify(pokemon.pokemon, null, "<br>");

  // debugger;
  let card = getCard();
  setCardData(card, pokemon.pokemon);
}

function getCard(index = 0) {
  return (randomCard = document.querySelectorAll(".pokemon")[index]);
}

function setCardData(card, data) {
  card.querySelector("img").src = data.frontSprite;
  card.querySelector("h1").innerHTML = "?"; //data.name;
}

// Fetch Pokémon
async function fetchPokemonList(limit = 10) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    );
    const data = await response.json();
    let pokemonDatas = [];
    for (const pokemon of data.results) {
      const pokemonData = await fetchPokemonDetails(pokemon.url);
      pokemonDatas.push(pokemonData);
    }
    return pokemonDatas;
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    return undefined;
  }
}

// Get Pokémon details from the API
async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const pokemonData = await response.json();
    const pokemon = new Pokemon(pokemonData);
    return pokemon;
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    return undefined;
  }
}

/**
 *
 * @param {object} data
 * @param {Array<number>} exclude
 * @returns
 */
function randomPokemon(exclude = []) {
  let index = randomRange(0, remainingPokemon.length - 1, exclude);
  return {
    index,
    pokemon: remainingPokemon[index],
  };
}

/**
 *
 * @param {number} min
 * @param {number} max
 * @param {Array<number>|undefined} exclude
 * @returns
 */
function randomRange(min, max, exclude = []) {
  let attempt = 0;
  let tall;
  do {
    if (attempt > 100)
      return console.error("Could not get random range after many attempts");
    attempt++;

    tall = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (typeof exclude === "Array" && exclude.includes(tall));
  return tall;
}

/**
 * Shuffles the elements of an array in place using the Fisher-Yates (Knuth) shuffle algorithm.
 *
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap the current element with the element at the random index
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}

let remainingPokemon = [];
let correctPokemon = undefined;
let score = {
  correct: 0,
  incorrect: 0,
};

init();
async function init() {
  remainingPokemon = await fetchPokemonList();
  run();
}

function run() {
  if (remainingPokemon.length > 0) {
    let nextPokemon = randomPokemon();

    correctPokemon = nextPokemon.pokemon;

    // Delete the next pokemon from the list
    remainingPokemon.splice(nextPokemon.index, 1);

    let firstOption = randomPokemon();
    let secondOption = randomPokemon({
      exclude: [firstOption],
    });

    let options = [];
    options.push(firstOption.pokemon, secondOption.pokemon, correctPokemon);
    shuffleArray(options);

    // Set the card
    let card = getCard();
    setCardData(card, correctPokemon);

    // Set button A, B and C
    setSelectButtons(options);
  }
}

function setSelectButtons(options) {
  const buttons = document.querySelectorAll(".pickOption");

  options.forEach((element, index) => {
    if (!buttons[index]) return;

    const button = buttons[index];

    if (!element) {
      button.classList.add("hidden");
    } else {
      button.classList.remove("hidden");
      button.innerHTML = element.name;
    }
  });
}

function select(selected = undefined) {
  if (selected?.innerHTML) {
    if (selected.innerHTML == correctPokemon.name) {
      score.correct++;
    } else {
      score.incorrect++;
    }
    console.log(`score is ${score.correct}/${score.correct + score.incorrect}`);

    run();
  }
}
