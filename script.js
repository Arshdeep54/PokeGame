import { Player } from "./src/player.js";
import { generateRivalPok, getRandomPokemon } from "./src/pokemonapi.js";
import { TextBox } from "./src/textbox.js";
import { ENUM } from "./src/types.js";
import {
  getBattleMap,
  getCenterMap,
  getHouseMap,
  getMap,
  getMartMap,
  getOakMap,
  isMobileOrTablet,
} from "./src/utils.js";

window.addEventListener("orientationchange", function () {
  location.reload();
});

const controls = document.getElementById("controls");

if (isMobileOrTablet()) {
  controls.style.display = "block";
} else {
  controls.style.display = "none";
}

const buttons = document.querySelectorAll(".arrow");
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const key = button.className.split(" ")[2];
    console.log(key);
    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: `Arrow${key}`,
        bubbles: true,
        cancelable: true,
      })
    );
  });
});
const enterBtn = document.getElementById("enter");
enterBtn.addEventListener("click", (event) => {
  event.preventDefault();

  enterBtn.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    })
  );
});
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var textToDisplay = ENUM.EMPTY_STRING;
if (localStorage.getItem(ENUM.POKEMON_KEY) === null) {
  localStorage.setItem(ENUM.POKEMON_KEY, JSON.stringify([]));
}
if (localStorage.getItem(ENUM.POKEMON_KEY_ALL) === null) {
  localStorage.setItem(ENUM.POKEMON_KEY_ALL, JSON.stringify([]));
}
if (localStorage.getItem(ENUM.RIVAL_POKEMON_KEY) != null) {
  localStorage.setItem(ENUM.RIVAL_POKEMON_KEY, JSON.stringify([]));
}
if (localStorage.getItem(ENUM.RIVAL_POKEMON_KEY_ALL) === null) {
  localStorage.setItem(ENUM.RIVAL_POKEMON_KEY_ALL, JSON.stringify([]));
}

var pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
var rivalPokemon = JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY));
var pokemonAll = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY_ALL));
var rivalPokemonAll = JSON.parse(
  localStorage.getItem(ENUM.RIVAL_POKEMON_KEY_ALL)
);
localStorage.setItem("currentPokemonIndex",pokemon.length-1);


console.log("INSTRUCTIONS");
console.log("Go to full screen (f11) for better frontend");
console.log(
  "Try touching a grass (preferably the upper one ) , it will say to get a pokemon from oak's house "
);
console.log(
  "Go to oak house and touch the table at the point it will say 'Select Ball n '"
);
console.log(
  "Travel through the grass (for now horizontlly ) and you will randomly end up in war "
);
console.log(
  "After war ends , get to the center ,touch the table ,press enter to heal your pokemon"
);

var rivalPokemonXpos = null;
var rivalTurn = false;
var loadingData = true;
var index = 0;
const player = new Player(1100, 350, 40, 60, "blue", context, textToDisplay);
const textBox = new TextBox(
  "Your pokemon is dead ",
  canvas.width / 3,
  canvas.height / 1.2,
  canvas.width / 3,
  canvas.height / 8,
  context
);
var encounteredInCurrentGrass = false;
var encouteredinCenter = false;
var imap = getMap();
var map = player.mapin;
var oakMap = getOakMap();
var battleMap = getBattleMap();
var centerMap = getCenterMap();
var martMap = getMartMap();
var houseMap = getHouseMap();
player.xpos = getMap().buildings[0].doorx;
player.ypos = getMap().buildings[0].doory + 10;
player.width = isMobileOrTablet() ? 30 : 40;
player.height = isMobileOrTablet() ? 45 : 60;
player.speed = isMobileOrTablet() ? 8 : 7;
var currentPokemonIndex=localStorage.getItem("currentPokemonIndex");
async function handleBattle() {
  if (player.inGrass) {
    player.mapin = ENUM.BATTLE;
    player.isListening = false;
    context.fillStyle = ENUM.COLORS.BG_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
    map = ENUM.BATTLE;
    draw();
    textBox.draw();
    textBox.instruction = " ";
    textBox.inBattle = true;
    textBox.isTlistening = true;

    if (textBox.selectedMove != null) {
      var attackChange = textBox.selectedMove.power/2;

      rivalPokemon = JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY));
      var level = rivalPokemon.rivalData.level;
      var hp = rivalPokemon.rivalData.hp;

      if (hp > 0) {
        rivalPokemon.rivalData.hp = rivalPokemon.rivalData.hp - attackChange;
        localStorage.setItem(
          ENUM.RIVAL_POKEMON_KEY,
          JSON.stringify(rivalPokemon)
        );
        textBox.selectedMove = null;
        console.log("attacks rival");

        rivalTurn = true;
        textBox.isTlistening = false;
      }

      rivalPokemon = JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY));
      hp = rivalPokemon.rivalData.hp;

      if (hp <= 0) {
        player.textToDisplay = ENUM.WON_MESSAGE;
        pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
        currentPokemonIndex=localStorage.getItem("currentPokemonIndex");
        pokemon[currentPokemonIndex].playerData.exp = pokemon[currentPokemonIndex].playerData.exp + 23;
        localStorage.setItem(ENUM.POKEMON_KEY, JSON.stringify(pokemon));
        textBox.battleStatus = "won";
        textBox.battledone = true;
      }
    }
  }
}
async function rivalAttacks() {
  var moves = JSON.parse(
    localStorage.getItem(ENUM.RIVAL_POKEMON_KEY)
  ).validMoves;
  var random = Math.floor(Math.random() * moves.length);
  var lrandomMove = {
    name: random,
    power: 20,
  };
  var randomMove = moves
    ? moves.length > 0
      ? moves[random]
      : lrandomMove
    : lrandomMove;
  textBox.chosenText =
    textBox.battleStatus == null ? "Your opp chose " + randomMove.move : " ";
  textBox.showBattleOptions = true;
  textBox.movedone = true;

  var attackChange = randomMove.power/2;

  pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
  var level = pokemon[currentPokemonIndex].playerData.level;
  var hp = pokemon[currentPokemonIndex].playerData.currenthp;
  if (hp > 0) {
    pokemon[currentPokemonIndex].playerData.currenthp =
      pokemon[currentPokemonIndex].playerData.currenthp - attackChange;
    localStorage.setItem(ENUM.POKEMON_KEY, JSON.stringify(pokemon));
  }
  pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
  hp = pokemon[currentPokemonIndex].playerData.currenthp;
  if (hp <= 0) {
    player.textToDisplay = ENUM.LOST_MESSAGE;
    pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
    pokemon[currentPokemonIndex].playerData.paisa = pokemon[currentPokemonIndex].playerData.paisa - 40;
    localStorage.setItem(ENUM.POKEMON_KEY, JSON.stringify(pokemon));
    textBox.battleStatus = "lost";
    textBox.battledone = true;
  }

  rivalTurn = false;
}
async function handleEnterPressed() {
  if (textBox.text === ENUM.OAK || player.mapin == ENUM.OAK) {
    player.mapin = ENUM.OAK;
    context.fillStyle = ENUM.COLORS.BLACK;
    context.fillRect(0, 0, canvas.width, canvas.height);
    map = ENUM.OAK;
    draw();

    player.draw();
    textBox.draw();
    // console.log(player.canAddNewPok);
    if (textBox.text != ENUM.TABLE) {
      textBox.instruction = ENUM.PICKONE;
    }
  }

  if (textBox.text === ENUM.TABLE && player.ballSelecting) {
    pokemonAll = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY_ALL));
    const max = 19;
    const min = 0;
    var random = Math.floor(Math.random() * (max - min) + min);
    var newPokemon = pokemonAll[random];
    pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
    console.log(pokemon);
    pokemon = [...pokemon, newPokemon];
    console.log(pokemon);
    localStorage.setItem(ENUM.POKEMON_KEY, JSON.stringify(pokemon));
    pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
    console.log(pokemon);

    localStorage.setItem("currentPokemonIndex",pokemon.length-1);

    if (pokemon.length >= 1) {
      player.isAllowedInGrass = true;
    }

    player.ballSelecting = false;
    player.canAddNewPok = false;
  }
  if (textBox.text == ENUM.CENTER || player.mapin == ENUM.CENTER) {
    player.mapin = ENUM.CENTER;
    context.fillStyle = ENUM.COLORS.BLACK;
    context.fillRect(0, 0, canvas.width, canvas.height);
    map = ENUM.CENTER;
    draw();

    player.draw();

    textBox.draw();

    textBox.instruction = ENUM.CENTER_INSTRUCTION;
  }
  if (textBox.text == ENUM.MART || player.mapin == ENUM.MART) {
    player.mapin = ENUM.MART;
    context.fillStyle = ENUM.COLORS.BLACK;
    context.fillRect(0, 0, canvas.width, canvas.height);
    map = ENUM.MART;
    draw();

    player.draw();

    textBox.draw();

    if (pokemon.length != 0) {
      textBox.instruction = ENUM.EMPTY_STRING;
    }
  }

  if (textBox.text == ENUM.HOUSE || player.mapin == ENUM.HOUSE) {
    player.mapin = ENUM.HOUSE;
    context.fillStyle = ENUM.COLORS.BLACK;
    context.fillRect(0, 0, canvas.width, canvas.height);
    map = ENUM.HOUSE;
    draw();

    player.draw();

    textBox.draw();

    if (pokemon.length != 0) {
      textBox.instruction = ENUM.EMPTY_STRING;
    }
  }
}
function drawLoader() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = ENUM.COLORS.BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  var font='6rem'
  context.font = `${font} serif`;
  context.fillStyle = ENUM.COLORS.BLACK;
  
  context.fillText("POKEMON",canvas.width/3,canvas.height/3)
  font = isMobileOrTablet() ? ENUM.FONT_MOBILE : ENUM.FONT_DESKTOP;
  context.font = `${font} serif`;
  context.fillStyle = ENUM.COLORS.WHITE;
  context.fillText("LOADING...", canvas.width / 2-75, canvas.height / 2);
  context.fillStyle = ENUM.COLORS.BLACK;

  context.fillText("Explore around the buildings to find instructions ", canvas.width / 3, canvas.height / 2+70);
  context.fillText("~Move with Arrow keys", canvas.width / 2, canvas.height / 2+95);

  const totalLoading = 20;
  const totalLoadingWidth = 150;

  context.fillStyle = ENUM.COLORS.BLACK;
  context.lineWidth = 1;
  context.strokeRect(
    canvas.width / 2 -75,
    canvas.height / 2 + 30,
    totalLoadingWidth,
    6
  );
  console.log(index);
  const loading = (index / totalLoading) * totalLoadingWidth;

  context.fillStyle = ENUM.COLORS.GREEN; // Change fill color for completed progress
  context.fillRect(canvas.width / 2 -75, canvas.height / 2 + 30, loading, 6);
  context.fillStyle = ENUM.COLORS.BLACK;
}
function draw() {
  map = player.mapin;
  var maptoRender;
  if (map === ENUM.INITIAL) {
    maptoRender = imap;
  } else if (map === ENUM.OAK) {
    maptoRender = oakMap;
  } else if (map === ENUM.BATTLE) {
    maptoRender = battleMap;
  } else if (map === ENUM.CENTER) {
    maptoRender = centerMap;
  } else if (map === ENUM.MART) {
    maptoRender = martMap;
  } else if (map === ENUM.HOUSE) {
    maptoRender = houseMap;
  }
  for (const buildingType in maptoRender) {
    for (const building of maptoRender[buildingType]) {
      building.draw(context);
    }
  }
  if (map != ENUM.BATTLE) {
    player.draw();
  }
}
async function getApiData() {
  for (index = 0; index < 20; index++) {
    if (pokemonAll.length < 20 && rivalPokemonAll.length < 20) {
      console.log(index, "in ");
      pokemonAll = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY_ALL));
      rivalPokemonAll = JSON.parse(
        localStorage.getItem(ENUM.RIVAL_POKEMON_KEY_ALL)
      );
      await getRandomPokemon(pokemonAll.length);
      await generateRivalPok(rivalPokemonAll.length);
    }
  }
  loadingData = false;
}

function init() {
  context.fillStyle = ENUM.COLORS.BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  draw();
  player.draw();
  textBox.draw();
  getApiData();
  gameLoop();
}

async function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = ENUM.COLORS.BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  draw();
  textBox.draw();
  textBox.text = player.textToDisplay;
  if (loadingData) {
    drawLoader();
  }

  if (textBox.text === ENUM.OAK) {
    textBox.instruction = ENUM.PRESS_ENTER + ENUM.OAK;
  }
  if (textBox.text === ENUM.CENTER) {
    textBox.instruction = ENUM.PRESS_ENTER + ENUM.CENTER;
  }
  if (textBox.text === ENUM.MART) {
    textBox.instruction = ENUM.PRESS_ENTER + ENUM.MART;
  }
  if (textBox.text === ENUM.EMPTY_STRING) {
    textBox.instruction = ENUM.EMPTY_STRING;
  }

  if (textBox.text === ENUM.NO_POKEMON) {
    textBox.instruction = ENUM.GET_FROM_OAK;
  }
  if (textBox.text === ENUM.HOUSE) {
    textBox.instruction = ENUM.PRESS_ENTER + ENUM.HOUSE;
  }
  if(player.mapin==ENUM.HOUSE){
    textBox.inHouse=true;
  }else{
    textBox.inHouse=false;
  }

  if (player.inGrass) {
    if (!encounteredInCurrentGrass) {
      textBox.battledone = false;
      // await generateRivalPok();
      rivalPokemonAll = JSON.parse(
        localStorage.getItem(ENUM.RIVAL_POKEMON_KEY_ALL)
      );
      const max = 19;
      const min = 0;
      var random = Math.floor(Math.random() * (max - min) + min);
      var newRivalPokemon = rivalPokemonAll[random];
      rivalPokemon = JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY));
      
      localStorage.setItem(
        ENUM.RIVAL_POKEMON_KEY,
        JSON.stringify(newRivalPokemon)
      );
      rivalPokemon = JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY));
      console.log(rivalPokemon);

      rivalPokemonXpos =
        Math.floor(Math.random() * (player.inGrass.width + 1)) +
        player.inGrass.xpos;
      rivalPokemonXpos = rivalPokemonXpos - (rivalPokemonXpos % 10);
      encounteredInCurrentGrass = true;
      textBox.isTlistening = false;
      textBox.inBattle = false;
    }
    if (
      player.xpos > rivalPokemonXpos - 10 &&
      player.xpos < rivalPokemonXpos + 10
    ) {
      handleBattle();
    }
  }
  if (textBox.mapin === ENUM.INITIAL) {
    if (player.inGrass != null) {
      player.xpos = player.inGrass["xpos"] + player.inGrass.width + 5;
    }

    textBox.mapin = ENUM.BATTLE;
    player.inGrass = null;
    player.mapin = ENUM.INITIAL;
    player.isListening = true;
    player.textToDisplay = " ";
    encounteredInCurrentGrass = false;
  }
  if (textBox.movedone) {
    textBox.isTlistening = false;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    textBox.movedone = false;
    textBox.isTlistening = true;
  }
  pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
  // if (pokemon) {
  //   if (pokemon.length > 0) {
  //     if (pokemon[pokemon.length - 1] != null && player.mapin == ENUM.OAK) {
  //       textBox.text =
  //         "You last got " + pokemon[pokemon.length - 1].pokemonName.pokemon.name;
  //     }
  //   }
  // }

  if (player.enterPressed) {
    handleEnterPressed();
  }
  if (rivalTurn) {
    await rivalAttacks();
    textBox.movedone = true;
  }
  if (!player.canAddNewPok) {
    currentPokemonIndex=localStorage.getItem("currentPokemonIndex");
    if (pokemon[currentPokemonIndex] != null && pokemon.length > 0 && player.mapin == ENUM.OAK) {
      textBox.text = "You got " + pokemon[currentPokemonIndex].pokemonName.pokemon.name;
    }
  }

  if (player.enterPressed) {
    handleEnterPressed();
  }

  if (
    player.mapin == ENUM.OAK &&
    player.collidingTable &&
    !player.isAllowedInGrass
  ) {
    for (var i = 0; i < 3; i++) {
      if (
        player.xpos >
          getOakMap()[ENUM.BALLS][i].xpos - getOakMap()[ENUM.BALLS][i].radius &&
        (i < 2
          ? player.xpos + player.width <
            getOakMap()["balls"][i + 1].xpos -
              getOakMap()["balls"][i + 1].radius
          : player.xpos <
            getOakMap()["tables"][0].xpos + getOakMap()["tables"][0].width)
      ) {
        textBox.instruction = "Select ball " + (i + 1).toString() + " (Enter)";
        player.textToDisplay = textBox.text;
        break;
      }
    }
  }
  handleWallCollisions();
  requestAnimationFrame(gameLoop);
}
function handleWallCollisions() {
  if (player.xpos < 0) {
    player.xpos = canvas.width;
  }
  if (player.xpos > canvas.width) {
    player.xpos = 0;
  }
  if (player.ypos < 0) {
    player.ypos = canvas.height;
  }
  if (player.ypos > canvas.height) {
    player.ypos = 0;
  }
}

init();
