import { Player } from "./src/player.js";
import { generateRivalPok } from "./src/pokemonapi.js";
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
// const controls = document.getElementById("controls");
// controls.addEventListener("touchstart", handleTouchControls);

const buttons = document.querySelectorAll(".arrow");

const touchControls = document.getElementById("controls");


if (isMobileOrTablet()) {
  touchControls.style.display = "block"; // Show touch controls on mobile/tablet
} else {
  touchControls.style.display = "none"; // Hide touch controls on desktop
}
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const key = button.className.split(" ")[1];
    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: `Arrow${key}`,
        bubbles: true,
        cancelable: true,
      })
    ); // Simulate keyboard press
  });
});
const enterBtn = document.getElementById("enterbtn");
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

let pokemon = JSON.parse(localStorage.getItem("pokemon"));
let rivalPokemon = JSON.parse(localStorage.getItem("rivalPokemon"));
let textToDisplay = ENUM.EMPTY_STRING;
const player = new Player(1100, 350, 40, 60, "blue", context, textToDisplay);
if (localStorage.getItem("pokemon") === null) {
  localStorage.setItem("pokemon", JSON.stringify([]));
}
if (localStorage.getItem("rivalPokemon") != null) {
  localStorage.setItem("rivalPokemon", JSON.stringify([]));
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
player.width=isMobileOrTablet()?30:40;
player.height=isMobileOrTablet()?45:60;
player.speed=isMobileOrTablet()?7:5

// function handleBattle() {
//   player.mapin = "battle";
//   player.isListening = false;
//   context.fillStyle = ENUM.BG_COLOR;
//   context.fillRect(0, 0, canvas.width, canvas.height);
//   draw();
//   textBox.draw();
//   textBox.instruction = " ";
//   textBox.inBattle = true;
//   textBox.isTlistening = true;
//   if (textBox.selectedMove != null) {
//     textBox.battleStatus = null;
//     console.warn(
//       "this.inBattle && !this.battledone",
//       textBox.inBattle,
//       !textBox.battledone
//     );
//     let attack_change = textBox.selectedMove.power;
//     rivalPokemon = JSON.parse(localStorage.getItem("rivalPokemon"));
//     let level = rivalPokemon.rivalData.level;
//     let hp = rivalPokemon.rivalData.hp;
//     if (hp > 0) {
//       rivalPokemon.rivalData.hp =
//         rivalPokemon.rivalData.hp - attack_change * level;
//       localStorage.setItem("rivalPokemon", JSON.stringify(rivalPokemon));
//       textBox.selectedMove = null;

//       textBox.isTlistening = false;
//       textBox.movedone = true;
//       rivalTurn = true;
//       console.log("textBox.isTlistening", textBox.isTlistening);
//     }
//     rivalPokemon = JSON.parse(localStorage.getItem("rivalPokemon"));
//     hp = rivalPokemon.rivalData.hp;
//     if (hp <= 0) {
//       console.log("hp down ");

//       textBox.battleStatus = "won";
//       textBox.battledone = true;
//       console.log("textBox.battledone", textBox.battledone);
//       console.warn(
//         "this.inBattle && !this.battledone",
//         textBox.inBattle,
//         !textBox.battledone
//       ); //false
//     }
//     console.log("attacks rival");
//     console.warn(
//       "this.inBattle && !this.battledone",
//       textBox.inBattle,
//       !textBox.battledone
//     );
//   }
// }

// async function rivalAttacks() {
//   let moves = JSON.parse(localStorage.getItem("rivalPokemon")).validMoves;
//   let random = Math.floor(Math.random() * moves.length);
//   let randomMove = moves[random];
//   console.log("rival move ", randomMove);
//   textBox.chosenText = "Your opp chose " + randomMove.move;

//   let attack_change = randomMove.power;

//   pokemon = JSON.parse(localStorage.getItem("pokemon"));
//   let level = pokemon[0].playerData.level;
//   let hp = pokemon[0].playerData.currenthp;
//   console.log("attack_change", attack_change);

//   if (hp > 0 && textBox.battleStatus != "won") {
//     pokemon[0].playerData.currenthp =
//       pokemon[0].playerData.currenthp - attack_change * level;
//     localStorage.setItem("pokemon", JSON.stringify(pokemon));
//   }
//   pokemon = JSON.parse(localStorage.getItem("pokemon"));
//   hp = pokemon[0].playerData.currenthp;
//   if (hp <= 0) {
//     textBox.battleStatus = textBox.battleStatus != null ? "won" : "lost";
//     textBox.battledone = true;
//     console.log("textBox.battledone", textBox.battledone);
//   }
//   rivalTurn = false;
// }
async function handleBattle() {
  if (player.inGrass) {
    player.mapin = "battle";
    player.isListening = false;
    context.fillStyle = "#6ece67";
    context.fillRect(0, 0, canvas.width, canvas.height);
    map = "battle";
    draw();
    textBox.draw();
    textBox.instruction = " ";
    textBox.inBattle = true;
    textBox.isTlistening = true;

    if (textBox.selectedMove != null) {
      // let moveData = await getMove(textBox.selectedMove.move.url)
      let attack_change = textBox.selectedMove.power;
      // //console.log("player Stat",moveData.stat_changes);
      // let attack_change = moveData.stat_changes.length > 0 ? moveData.stat_changes.find(stat => stat.stat.name == "attack")?.change : 0
      //console.log("position1", attack_change);

      //console.log("position2", attack_change);

      rivalPokemon = JSON.parse(localStorage.getItem("rivalPokemon"));
      let level = rivalPokemon.rivalData.level;
      let hp = rivalPokemon.rivalData.hp;

      if (hp > 0) {
        rivalPokemon.rivalData.hp = rivalPokemon.rivalData.hp - attack_change;
        localStorage.setItem("rivalPokemon", JSON.stringify(rivalPokemon));
        textBox.selectedMove = null;
        console.log("attacks rival");

        rivalTurn = true;
        textBox.isTlistening = false;
      }

      rivalPokemon = JSON.parse(localStorage.getItem("rivalPokemon"));
      hp = rivalPokemon.rivalData.hp;

      if (hp <= 0) {
        player.textToDisplay = ">You won";
        textBox.battleStatus = "won";
        textBox.battledone = true;
      }
    }
  }
}
async function rivalAttacks() {
  let moves = JSON.parse(localStorage.getItem("rivalPokemon")).validMoves;
  let random = Math.floor(Math.random() * moves.length);
  let randomMove = moves[random];
  console.log(randomMove);
  textBox.chosenText =
    textBox.battleStatus == null ? "Your opp chose " + randomMove.move : " ";
  textBox.showBattleOptions = true;
  textBox.movedone = true;

  let attack_change = randomMove.power;

  pokemon = JSON.parse(localStorage.getItem("pokemon"));
  let level = pokemon[0].playerData.level;
  let hp = pokemon[0].playerData.currenthp;
  if (hp > 0) {
    pokemon[0].playerData.currenthp =
      pokemon[0].playerData.currenthp - attack_change;
    localStorage.setItem("pokemon", JSON.stringify(pokemon));
  }
  pokemon = JSON.parse(localStorage.getItem("pokemon"));
  hp = pokemon[0].playerData.currenthp;
  if (hp <= 0) {
    player.textToDisplay = ">You lost";
    textBox.battleStatus = "lost";
    textBox.battledone = true;
  }

  rivalTurn = false;
}
async function handleEnterPressed() {
  if (textBox.text === ENUM.OAK || player.mapin == ENUM.OAK) {
    player.mapin = ENUM.OAK;
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    map = ENUM.OAK;
    draw();

    player.draw();
    textBox.draw();
    if (textBox.text != "table" && pokemon.length == 0) {
      textBox.instruction = "PICK ONE BALL FROM THE TABLE";
    }
    if (pokemon.length != 0) {
      textBox.instruction = ENUM.EMPTY_STRING;
    }
  }

  if (textBox.text === "table" && player.ballSelecting) {
    await getRandomPokemon().then((res) => {
      pokemon = JSON.parse(localStorage.getItem("pokemon"));

      if (pokemon.length == 1) {
        player.isAllowedInGrass = true;
      }
      player.ballSelecting = false;
    });
  }
  if (textBox.text == ENUM.CENTER || player.mapin == ENUM.CENTER) {
    player.mapin = ENUM.CENTER;
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    map = ENUM.CENTER;
    draw();

    player.draw();

    textBox.draw();

    textBox.instruction = "Touch the table and press Enter ";
  }
  if (textBox.text == ENUM.MART || player.mapin == ENUM.MART) {
    player.mapin = ENUM.MART;
    context.fillStyle = "black";
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
    context.fillStyle = "black";
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
  context.fillStyle = ENUM.BG_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  draw();
  player.draw();
  textBox.draw();
  gameLoop();
}
init();

async function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = ENUM.BG_COLOR;
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

  // if (textBox.mapin === ENUM.INITIAL) {
  //   if (player.inGrass != null) {
  //     console.log("textBox.mapin", textBox.mapin);
  //     player.xpos = player.inGrass["xpos"] + player.inGrass.width + 5;
  //   }

  //   textBox.mapin = ENUM.BATTLE;
  //   console.log("textBox.mapin", textBox.mapin);

  //   player.inGrass = null;
  //   console.log("player.inGrass", player.inGrass);

  //   player.mapin = ENUM.INITIAL;
  //   console.log("player.mapin", player.mapin);
  //   player.isListening = true;
  //   console.log("player.isListening", player.isListening);
  //   player.textToDisplay = ENUM.EMPTY_STRING;
  //   console.log("player.textToDisplay", player.textToDisplay);

  //   encounteredInCurrentGrass = false;
  //   console.log("encounteredInCurrentGrass", encounteredInCurrentGrass);
  // }

  // if (player.inGrass) {
  //   if (!encounteredInCurrentGrass) {
  //     console.log("Step 1", player.inGrass);
  //     await generateRivalPok();
  //     rivalPokemonXpos =
  //       Math.floor(Math.random() * (player.inGrass.width + 1)) +
  //       player.inGrass.xpos;
  //     console.log(rivalPokemonXpos, rivalPokemonXpos % 10);
  //     rivalPokemonXpos = rivalPokemonXpos - (rivalPokemonXpos % 10);
  //     encounteredInCurrentGrass = true;
  //     textBox.battledone = false;
  //     textBox.battleStatus = null;
  //   }

  //   if (
  //     player.xpos > rivalPokemonXpos - 10 &&
  //     player.xpos < rivalPokemonXpos + 10
  //   ) {
  //     handleBattle();
  //   }
  // }
  // if (textBox.movedone) {
  //   textBox.isTlistening = false;
  //   await new Promise((resolve) => setTimeout(resolve, 1500));
  //   pokemon = JSON.parse(localStorage.getItem("pokemon"));
  //   if (!rivalTurn) {
  //     if (textBox.battleStatus == "won") {
  //       player.textToDisplay = "> You won +23 exp ";
  //       pokemon[0].playerData.exp = pokemon[0].playerData.exp + 23;
  //     } else if (textBox.battleStatus == "lost") {
  //       player.textToDisplay = "> you lost $40";
  //       pokemon[0].playerData.paisa = pokemon[0].playerData.paisa - 40;
  //     }
  //     rivalTurn = false;
  //   }

  //   localStorage.setItem("pokemon", JSON.stringify(pokemon));
  //   textBox.movedone = false;
  //   textBox.showBattleOptions = true;
  //   textBox.isTlistening = true;
  // }
  // if (rivalTurn) {
  //   await rivalAttacks();
  //   textBox.movedone = true;
  // }
  if (player.inGrass) {
    if (!encounteredInCurrentGrass) {
      console.log(player.inGrass);
      textBox.battledone = false;
      await generateRivalPok();
      rivalPokemonXpos =
        Math.floor(Math.random() * (player.inGrass.width + 1)) +
        player.inGrass.xpos;
      console.log(rivalPokemonXpos, rivalPokemonXpos % 10);
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
  if (textBox.mapin === "initial") {
    //console.log(player.inGrass);
    // player.inGrass=false
    if (player.inGrass != null) {
      player.xpos = player.inGrass["xpos"] + player.inGrass.width + 5;
    }

    textBox.mapin = "battle";
    player.inGrass = null;
    player.mapin = "initial";
    player.isListening = true;
    player.textToDisplay = " ";
    encounteredInCurrentGrass = false;
  }
  if (textBox.movedone) {
    //console.log("waiting");
    // textBox.showBattleOptions=true
    textBox.isTlistening = false;
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Pause for 1 second
    textBox.movedone = false;
    textBox.isTlistening = true;
  }

  if (pokemon[0] != null && pokemon.length > 0 && player.mapin == "OAK") {
    textBox.text = "You got " + pokemon[0].pokemonName.pokemon.name;
  }

  if (player.enterPressed) {
    handleEnterPressed();
  }
  if (rivalTurn) {
    await rivalAttacks();
    textBox.movedone = true;
  }

  if (pokemon[0] != null && pokemon.length > 0 && player.mapin == "OAK") {
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
          getOakMap()["balls"][i].xpos - getOakMap()["balls"][i].radius &&
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
