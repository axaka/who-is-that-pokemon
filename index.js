const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const mySlider = document.getElementById("mySlider");
const mySliderDisplay = document.getElementById("mySliderDisplay");
function updateSlider(slider) {
  mySliderDisplay.innerHTML = mySlider.value;
}
function getSliderValue() {
  return mySlider.value;
}

function toggleModal() {
  let modal = document.getElementById("contactModal");
  modal.classList.toggle("hidden");
}

var myAudio = document.getElementById("myAudio");
function playAudio(url) {
  myAudio.querySelector("source").src = url;
  myAudio.play();
}

function getCard(index = 0) {
  return (randomCard = document.querySelectorAll(".pokemon")[index]);
}

function setCardData(data) {
  let card = getCard();

  if (!data) {
    data = {
      frontSprite: "",
      name: "",
    };
  }

  card.querySelector("img").src = data.frontSprite;
  card.querySelector("h1").innerHTML = data.name;
}

function setCardTextVisible(visibility) {
  let card = getCard();
  if (visibility) {
    card.querySelector("h1").classList.remove("hidden");
  } else {
    card.querySelector("h1").classList.add("hidden");
  }
}

const statusCard = document.getElementById("statusCard");
const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");
function setFetchStatus(value, title = "Loading...") {
  const percentage = Number(value).toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 1,
  });
  statusText.innerHTML = percentage;
  statusTitle.innerHTML = title;

  if (value <= 0) {
    statusCard.classList.add("hidden");
  } else {
    statusCard.classList.remove("hidden");
  }
}

let fetchStatus = 0;
let amountToFetch = 0;

// Fetch Pokémon
async function fetchPokemonList(limit = 20) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    );
    const data = await response.json();
    let pokemonDatas = [];
    amountToFetch = limit;
    for (const pokemon of data.results) {
      const pokemonData = await fetchPokemonDetails(pokemon.url);
      pokemonDatas.push(pokemonData);
      setFetchStatus(pokemonDatas.length / amountToFetch);
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

async function endGame() {
  setFetchStatus(score.correct / (score.correct + score.incorrect), "Score");
  setCardData();
  setSelectButtons();
}

async function newGame() {
  score.correct = 0;
  score.incorrect = 0;
  setCardData();
  setSelectButtons();

  toggleModal();
  playAudio("Who's That Pokemon!.mp3");

  remainingPokemon = await fetchPokemonList(getSliderValue());
  await delay(2500);
  setFetchStatus(0);

  await run();
}

async function run() {
  if (remainingPokemon.length > 0) {
    let nextPokemon = randomPokemon();

    correctPokemon = nextPokemon.pokemon;

    // Delete the next pokemon from the list
    remainingPokemon.splice(nextPokemon.index, 1);

    let firstOption = randomPokemon();
    let secondOption = randomPokemon({
      exclude: [firstOption.index],
    });

    let options = [];

    options.push(firstOption.pokemon, correctPokemon);
    if (firstOption.pokemon != secondOption.pokemon) {
      options.push(secondOption.pokemon);
    }

    shuffleArray(options);

    setCardTextVisible(false);
    setCardData(correctPokemon);

    // Set button A, B and C
    setSelectButtons(options);
  } else {
    endGame();
  }
}

function setSelectButtons(options) {
  const buttons = document.querySelectorAll(".pickOption");
  console.log(options);
  buttons.forEach((element, index) => {
    let option = options && options[index] ? options[index].name : "";

    if (option.length > 0) {
      element.innerHTML = option;
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });
}

function setInfoData(data) {}

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
