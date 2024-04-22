const canvas = document.querySelector("canvas")
let context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

if (localStorage.getItem("pokemon") === null) {
    localStorage.setItem("pokemon", JSON.stringify([]))
}
console.log("INSTRUCTIONS");
console.log("Go to full screen (f11) for better frontend")
console.log("Try touching a grass (preferably the upper one ) , it will say to get a pokemon from oak's house ")
console.log("Go to oak house and touch the table at the point it will say 'Select Ball n '")
console.log("Travel through the grass (for now horizontlly ) and you will randomly end up in war ")
console.log("After war ends , get to the center ,touch the table ,press enter to heal your pokemon")



let pokemon = JSON.parse(localStorage.getItem("pokemon"))
let rivalPokemon = JSON.parse(localStorage.getItem("rivalPokemon"))
let textToDisplay = " "

const player = new Player(1100, 350, 40, 60, 'blue', context, textToDisplay);
let rivalPokemonXpos = null

const textBox = new TextBox("Your pokemon is dead ", canvas.width / 2 - 225, canvas.height - 150, 450, 100, context)
let encounteredInCurrentGrass = false
let encouteredinCenter = false

let imap = getMap();
let map = player.mapin;
let oakMap = getOakMap()
let battleMap = getBattleMap()
let centerMap = getCenterMap();
let martMap = getMartMap();
let houseMap = getHouseMap()

player.xpos = getMap().buildings[0].doorx
player.ypos = getMap().buildings[0].doory + 10


async function handleBattle() {
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
        textBox.isTlistening = true

        if (textBox.selectedMove != null) {

            // let moveData = await getMove(textBox.selectedMove.move.url)
            let attack_change = textBox.selectedMove.change
            // //console.log("player Stat",moveData.stat_changes);
            // let attack_change = moveData.stat_changes.length > 0 ? moveData.stat_changes.find(stat => stat.stat.name == "attack")?.change : 0
            //console.log("position1", attack_change);
            if (attack_change == null) { attack_change = 0 }
            //console.log("position2", attack_change);
            if (attack_change > 0) {
                attack_change += 1
                pokemon = JSON.parse(localStorage.getItem("pokemon"))
                let level = pokemon[0].playerData.level
                let hp = pokemon[0].playerData.currenthp
                //console.log("pokemon", hp);
                if (hp > 0) {
                    pokemon[0].playerData.hp = pokemon[0].playerData.hp + (attack_change * level)
                    localStorage.setItem("pokemon", JSON.stringify(pokemon))
                    //console.log(JSON.parse(localStorage.getItem("pokemon")));
                    textBox.selectedMove = null
                    //console.log("attacks rival");
                    await rivalAttacks()
                } else {
                    player.textToDisplay = ">You lost"
                    textBox.battledone = true
                }
            } else {
                attack_change -= 1
                rivalPokemon = JSON.parse(localStorage.getItem("rivalPokemon"))
                let level = rivalPokemon.rivalData.level
                let hp = rivalPokemon.rivalData.hp
                //console.log("rrrpokemon", hp);

                if (hp > 0) {

                    rivalPokemon.rivalData.hp = rivalPokemon.rivalData.hp + (attack_change * level)
                    localStorage.setItem("rivalPokemon", JSON.stringify(rivalPokemon))
                    //console.log(JSON.parse(localStorage.getItem("rivalPokemon")));
                    textBox.selectedMove = null
                    //console.log("attacks rival");

                    await rivalAttacks()

                } else if (hp <= 0) {
                    player.textToDisplay = ">You won"
                    textBox.battledone = true
                }
            }
            //console.log("attack", attack_change);
        }

    }
}
async function rivalAttacks() {
    //console.log("hiiiiiiiiii6");
    let moveData;

    let moves = await getMoves(JSON.parse(localStorage.getItem("rivalPokemon")).rivalPokemonData.moves, JSON.parse(localStorage.getItem("rivalPokemon")).rivalData.level)
    let random = Math.floor(Math.random() * 3)
    let randomMove = moves[random]
    //console.log(randomMove.move);
    textBox.chosenText = "Your opp chose " + randomMove.move
    textBox.showBattleOptions = true
    textBox.movedone = true

    //console.log(randomMove.change);
    let attack_change = randomMove.change
    // let attack_change = moveData.stat_changes.length > 0 ? moveData.stat_changes.find(stat => stat.stat.name == "attack")?.change : 0
    //console.log("position3", attack_change);
    if (attack_change == null || attack_change == undefined) { attack_change = 0 }
    //console.log("position4", attack_change);
    if (attack_change > 0) {
        attack_change += 1
        rivalPokemon = JSON.parse(localStorage.getItem("rivalPokemon"))
        let level = rivalPokemon.rivalData.level
        let hp = rivalPokemon.rivalData.hp
        //console.log("rrrpokemon", hp);

        if (hp > 0) {
            rivalPokemon.rivalData.hp = rivalPokemon.rivalData.hp + (attack_change * level)
            localStorage.setItem("rivalPokemon", JSON.stringify(rivalPokemon))
            //console.log(JSON.parse(localStorage.getItem("rivalPokemon")));

        } else if (hp <= 0) {
            player.textToDisplay = ">You Won"
            textBox.battledone = true
        }
    } else {
        attack_change -= 1
        pokemon = JSON.parse(localStorage.getItem("pokemon"))
        //console.log(pokemon[0]);
        let level = pokemon[0].playerData.level
        let hp = pokemon[0].playerData.currenthp
        //console.log("pokemonnnn", hp);
        if (hp > 0) {
            pokemon[0].playerData.currenthp = pokemon[0].playerData.currenthp + (attack_change * level)
            localStorage.setItem("pokemon", JSON.stringify(pokemon))
            //console.log(JSON.parse(localStorage.getItem("pokemon")));

        } else if (hp <= 0) {
            //console.log("youlosttttt");
            player.textToDisplay = ">You lost"
            textBox.battledone = true
        }
    }

    //console.log("attack", attack_change);
    // textBox.selectedMove = null

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

            //console.log(JSON.parse(localStorage.getItem("pokemon")))
            pokemon = JSON.parse(localStorage.getItem("pokemon"))

            if (pokemon.length == 1) {
                //console.log("test runn");
                player.isAllowedInGrass = true

            }
            player.ballSelecting = false
        })
        // //console.log(selectedPokemon)
        // //console.log("ball selected ",textBox.instruction);
    }
    if (textBox.text == "Center" || player.mapin == "Center") {
        player.mapin = "Center"
        context.fillStyle = "black"
        context.fillRect(0, 0, canvas.width, canvas.height)
        map = "Center"
        draw()

        player.draw()

        textBox.draw()

        if (pokemon.length != 0) {
            textBox.instruction = " "
        }
    }
    if (textBox.text == "Mart" || player.mapin == "Mart") {
        player.mapin = "Mart"
        context.fillStyle = "black"
        context.fillRect(0, 0, canvas.width, canvas.height)
        map = "Mart"
        draw()

        player.draw()

        textBox.draw()

        if (pokemon.length != 0) {
            textBox.instruction = " "
        }
    }

    if (textBox.text == "House" || player.mapin == "House") {
        player.mapin = "House"
        context.fillStyle = "black"
        context.fillRect(0, 0, canvas.width, canvas.height)
        map = "House"
        draw()

        player.draw()

        textBox.draw()

        if (pokemon.length != 0) {
            textBox.instruction = " "
        }
    }

}
function draw() {
    map = player.mapin;
    let maptoRender;
    // //console.log("draw",map)
    if (map === "initial") {
        maptoRender = imap
    }
    else if (map === "OAK") {
        maptoRender = oakMap
    }
    else if (map === "battle") {
        maptoRender = battleMap

    }
    else if (map === "Center") {
        maptoRender = centerMap
    }
    else if (map === "Mart") {
        maptoRender = martMap
    }
    else if (map === "House") {
        maptoRender = houseMap
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
    //console.log("init");
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
    // //console.log("gameloop");
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "#6ece67"
    context.fillRect(0, 0, canvas.width, canvas.height)
    draw()
    textBox.draw()
    textBox.text = player.textToDisplay

    if (textBox.text === "OAK") {
        textBox.instruction = "Press Enter to Enter the House "
    }
    if (textBox.text === "Center") {
        textBox.instruction = "Press Enter to Enter the Center "
    }
    if (textBox.text === "Mart") {
        textBox.instruction = "Press Enter to Enter the Mart "
    }


    if (textBox.text === " You don't have any pokemon ") {
        textBox.instruction = "Get one from Prof oak"
    }
    if (textBox.text === "House") {
        textBox.instruction = "Press Enter to Enter the House "
    }

    if (player.inGrass) {
        if (!encounteredInCurrentGrass) {
            //console.log(player.inGrass);
            textBox.battledone = false
            await generateRivalPok();
            rivalPokemonXpos = Math.floor(Math.random() * (player.inGrass.width + 1)) + player.inGrass.xpos
            // //console.log(rivalPokemonXpos, rivalPokemonXpos % 10);
            rivalPokemonXpos = rivalPokemonXpos - rivalPokemonXpos % 10
            encounteredInCurrentGrass = true
        }
        // //console.log(rivalPokemonXpos, player.xpos)
        if (player.xpos == rivalPokemonXpos) {
            handleBattle();
        }
    }
    if (textBox.mapin === "initial") {
        //console.log(player.inGrass);
        // player.inGrass=false
        if (player.inGrass != null) {

            player.xpos = (player.inGrass["xpos"] + player.inGrass.width + 5)
        }

        textBox.mapin = "battle"
        player.inGrass = null
        player.mapin = "initial"
        player.isListening = true
        player.textToDisplay = " "
        encounteredInCurrentGrass = false
    }
    if (textBox.movedone) {
        //console.log("waiting");
        // textBox.showBattleOptions=true
        textBox.isTlistening = false
        await new Promise(resolve => setTimeout(resolve, 1500)); // Pause for 1 second
        textBox.movedone = false;
        textBox.isTlistening = true
    }

    if (pokemon[0] != null && pokemon.length > 0 && player.mapin == "OAK") {
        textBox.text = "You got " + pokemon[0].pokemonName.pokemon.name
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
// render the moves according to the level 
// a lot of maths to calculate who won 

// 
// 
// make menu options to see whats in bag , which pokemons are there 

// make the rest of the map fences trees grass ,roads 
