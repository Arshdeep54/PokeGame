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
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
let rivalPokemon = JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY));
let textToDisplay = ENUM.EMPTY_STRING;
if (localStorage.getItem(ENUM.POKEMON_KEY) === null) {
  localStorage.setItem(ENUM.POKEMON_KEY, JSON.stringify([]));
}
if (localStorage.getItem(ENUM.RIVAL_POKEMON_KEY) != null) {
  localStorage.setItem(ENUM.RIVAL_POKEMON_KEY, JSON.stringify([]));
}

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

let rivalPokemonXpos = null;
let rivalTurn = false;

const player = new Player(1100, 350, 40, 60, "blue", context, textToDisplay);
const textBox = new TextBox(
  "Your pokemon is dead ",
  canvas.width / 3,
  canvas.height / 1.2,
  canvas.width / 3.5,
  canvas.height / 8,
  context
);
let encounteredInCurrentGrass = false;
let encouteredinCenter = false;
let imap = getMap();
let map = player.mapin;
let oakMap = getOakMap();
let battleMap = getBattleMap();
let centerMap = getCenterMap();
let martMap = getMartMap();
let houseMap = getHouseMap();
player.xpos = getMap().buildings[0].doorx;
player.ypos = getMap().buildings[0].doory + 10;
player.width = isMobileOrTablet() ? 30 : 40;
player.height = isMobileOrTablet() ? 45 : 60;
player.speed = isMobileOrTablet() ? 8 : 5;

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
      let attack_change = textBox.selectedMove.power;

      rivalPokemon = JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY));
      let level = rivalPokemon.rivalData.level;
      let hp = rivalPokemon.rivalData.hp;

      if (hp > 0) {
        rivalPokemon.rivalData.hp = rivalPokemon.rivalData.hp - attack_change;
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
        pokemon[0].playerData.exp = pokemon[0].playerData.exp + 23;
        localStorage.setItem(ENUM.POKEMON_KEY, JSON.stringify(pokemon));
        textBox.battleStatus = "won";
        textBox.battledone = true;
      }
    }
  }
}
async function rivalAttacks() {
  let moves = JSON.parse(
    localStorage.getItem(ENUM.RIVAL_POKEMON_KEY)
  ).validMoves;
  let random = Math.floor(Math.random() * moves.length);
  let lrandomMove = {
    name: random,
    power: 20,
  };
  let randomMove = moves
    ? moves.length > 0
      ? moves[random]
      : lrandomMove
    : lrandomMove;
  textBox.chosenText =
    textBox.battleStatus == null ? "Your opp chose " + randomMove.move : " ";
  textBox.showBattleOptions = true;
  textBox.movedone = true;

  let attack_change = randomMove.power;

  pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
  let level = pokemon[0].playerData.level;
  let hp = pokemon[0].playerData.currenthp;
  if (hp > 0) {
    pokemon[0].playerData.currenthp =
      pokemon[0].playerData.currenthp - attack_change;
    localStorage.setItem(ENUM.POKEMON_KEY, JSON.stringify(pokemon));
  }
  pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
  hp = pokemon[0].playerData.currenthp;
  if (hp <= 0) {
    player.textToDisplay = ENUM.LOST_MESSAGE;
    pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
    pokemon[0].playerData.paisa = pokemon[0].playerData.paisa - 40;
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
    if (textBox.text != ENUM.TABLE && pokemon.length == 0) {
      textBox.instruction = ENUM.PICKONE;
    }
    if (pokemon.length != 0) {
      textBox.instruction = ENUM.EMPTY_STRING;
    }
  }

  if (textBox.text === ENUM.TABLE && player.ballSelecting) {
    await getRandomPokemon().then((res) => {
      pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));

      if (pokemon.length == 1) {
        player.isAllowedInGrass = true;
      }
      player.ballSelecting = false;
    });
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
function draw() {
  map = player.mapin;
  let maptoRender;
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
function init() {
  context.fillStyle = ENUM.COLORS.BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  draw();
  player.draw();
  textBox.draw();
  gameLoop();
}

async function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = ENUM.COLORS.BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  draw();
  textBox.draw();
  textBox.text = player.textToDisplay;

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

  if (player.inGrass) {
    if (!encounteredInCurrentGrass) {
      textBox.battledone = false;
      await generateRivalPok();
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
  if (pokemon.length > 0) {
    if (pokemon[0] != null && player.mapin == ENUM.OAK) {
      textBox.text = "You got " + pokemon[0].pokemonName.pokemon.name;
    }
  }

  if (player.enterPressed) {
    handleEnterPressed();
  }
  if (rivalTurn) {
    await rivalAttacks();
    textBox.movedone = true;
  }

  if (pokemon[0] != null && pokemon.length > 0 && player.mapin == ENUM.OAK) {
    textBox.text = "You got " + pokemon[0].pokemonName.pokemon.name;
  }

  if (player.enterPressed) {
    handleEnterPressed();
  }

  if (
    player.mapin == ENUM.OAK &&
    player.collidingTable &&
    !player.isAllowedInGrass
  ) {
    for (let i = 0; i < 3; i++) {
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
