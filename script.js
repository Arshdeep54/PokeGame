const canvas = document.querySelector("canvas")
let context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight
// const grad = context.createLinearGradient(0, 0, canvas.width, canvas.height);
// grad.addColorStop(0, "#2E8250");
// grad.addColorStop(0.42, "#0F7855");
// grad.addColorStop(0.76, "#418751");
// grad.addColorStop(1, "#278033");
localStorage.removeItem("pokemon")
localStorage.setItem("pokemon", JSON.stringify([]))
let pokemon = JSON.parse(localStorage.getItem("pokemon"))

let textToDisplay = " "
const player = new Player(300, 100, 40, 60, 'blue', context, textToDisplay);
let rivalPokemonXpos = null

const textBox = new TextBox("Your pokemon is dead ", canvas.width / 2 - 225, canvas.height - 150, 450, 100, context)
let encounteredInCurrentGrass = false

let imap = getMap();
let map = player.mapin;
let oakMap = getOakMap()
let battleMap = getBattleMap()
function handleBattle() {
    if (player.inGrass) {
        player.mapin = "battle"
        player.isListening = false
        context.fillStyle = "#6ece67"
        context.fillRect(0, 0, canvas.width, canvas.height)
        map = "battle"
        draw()
        textBox.draw()
        textBox.instruction = " "
        textBox.inBattle = true

    }
}
async function handleEnterPressed() {
    if (textBox.text === "OAK" || player.mapin == "OAK") {
        player.mapin = "OAK"
        context.fillStyle = "black"
        context.fillRect(0, 0, canvas.width, canvas.height)
        map = "OAK"
        draw()

        player.draw()
        textBox.draw()
        if (textBox.text != "table" && pokemon.length == 0) {
            textBox.instruction = "PICK ONE BALL FROM THE TABLE"
        }
        if (pokemon.length != 0) {
            textBox.instruction = " "
        }
    }
    if (textBox.text === "table" && player.ballSelecting) {
        await getRandomPokemon().then(res => {

            console.log(JSON.parse(localStorage.getItem("pokemon")))
            pokemon = JSON.parse(localStorage.getItem("pokemon"))

            if (pokemon.length == 1) {
                console.log("test runn");
                player.isAllowedInGrass = true

            }
            player.ballSelecting = false
        })
        // console.log(selectedPokemon)
        // console.log("ball selected ",textBox.instruction);
    }
}
function draw() {
    map = player.mapin;
    let maptoRender;
    // console.log("draw",map)
    if (map === "initial") {
        maptoRender = imap
    }
    else if (map === "OAK") {
        maptoRender = oakMap
    }
    else if (map === "battle") {
        maptoRender = battleMap

    }
    for (const buildingType in maptoRender) {
        for (const building of maptoRender[buildingType]) {
            building.draw(context)
        }
    }
    if (map != "battle") {
        player.draw();
    }

}
function init() {
    console.log("init");
    context.fillStyle = "#6ece67"
    context.fillRect(0, 0, canvas.width, canvas.height)
    draw()

    // document.addEventListener('keydown', player.handleKeyDown.bind(player));
    player.draw()
    textBox.draw()
    gameLoop()
}
init();
function oaklevel() {

    map = "OAK"
    draw()

    player.draw()
    textBox.draw()
}

async function gameLoop() {
    // console.log("gameloop");
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "#6ece67"
    context.fillRect(0, 0, canvas.width, canvas.height)
    draw()
    textBox.draw()
    textBox.text = player.textToDisplay

    if (textBox.text === "OAK") {
        textBox.instruction = "Press Enter to Enter the House "
    }

    if (textBox.text === " You don't have any pokemon ") {
        textBox.instruction = "Get one from Prof oak"
    }

    if (player.inGrass) {

        if (!encounteredInCurrentGrass) {
            rivalPokemonXpos = Math.floor(Math.random() * (player.inGrass.width + 1)) + player.inGrass.xpos
            // console.log(rivalPokemonXpos, rivalPokemonXpos % 10);
            rivalPokemonXpos = rivalPokemonXpos - rivalPokemonXpos % 10
            encounteredInCurrentGrass = true
        }
        // console.log(rivalPokemonXpos, player.xpos)
        if (player.xpos == rivalPokemonXpos) {
            handleBattle();
        }
    }

    if (pokemon[0] != null && pokemon.length > 0 && player.mapin == "OAK") {
        textBox.text = "You got " + pokemon[0].pokemon["name"]
    }

    if (player.enterPressed) {
        handleEnterPressed();
    }

    if (player.mapin == "OAK" && player.collidingTable && !player.isAllowedInGrass) {
        for (let i = 0; i < 3; i++) {
            if (player.xpos > getOakMap()["balls"][i].xpos - getOakMap()["balls"][i].radius &&
                (i < 2 ? player.xpos + player.width < getOakMap()["balls"][i + 1].xpos - getOakMap()["balls"][i + 1].radius : player.xpos < getOakMap()["tables"][0].xpos + getOakMap()["tables"][0].width)) {
                textBox.instruction = "Select ball " + (i + 1).toString() + " (Enter)";
                player.textToDisplay = textBox.text;
                break;
            }

        }
    }
    handleWallCollisions()
    requestAnimationFrame(gameLoop);
}
function handleWallCollisions() {
    if (player.xpos < 0) {
        player.xpos = canvas.width
    }
    if (player.xpos > canvas.width) {
        player.xpos = 0
    }
    if (player.ypos < 0) {
        player.ypos = canvas.height
    }
    if (player.ypos > canvas.height) {
        player.ypos = 0
    }
}


// change the map to a battlemap at a random xpos in grass
// generate a random pokemon to fight 
// a lot of maths to calculate who won 

// 
// 
// make menu options to see whats in bag , which pokemons are there 

// make the rest of the map fences trees grass ,roads 
