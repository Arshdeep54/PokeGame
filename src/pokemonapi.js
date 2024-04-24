const getRandomPokemon = async () => {

    const pokemons = await getPokemons("grass")


    let pokemon = await getslot(pokemons, 1, true);

    if (JSON.parse(localStorage.getItem("pokemon")).length == 0) {
        let pokemonArray = [pokemon]
        localStorage.setItem("pokemon", JSON.stringify(pokemonArray))
    }
}
const getslot = async (pokemons, slot, isMine) => {
    const max = pokemons.length
    const min = 0
    let random = Math.floor(Math.random() * (max - min) + min)
    let not_slot = slot == 1 ? 2 : 1
    let pokemonData = await getPokemonData(pokemons[random].pokemon.url)
    //console.log(pokemonData);


    let showdownImagef = pokemonData.sprites.other.showdown.front_default
    let showdownImageb = pokemonData.sprites.other.showdown.back_default
    console.log(showdownImageb, showdownImagef);
    let moves =getMoves(pokemonData.moves,1)
    if(moves.length==0){
        await getslot(pokemons, slot)
    }
    // moves.forEach(async move => {
    //     moveData=await getMove(move.move.url)
    //     //console.log(moveData);
    //     // if(moveData.stat_changes.length==0){
    //     //     await getslot(pokemons, slot)
    //     // }
    // });
    if (pokemons[random].slot == not_slot || (showdownImagef == null && showdownImageb == null)) {
        console.log("somethings missing ");
        await getslot(pokemons, slot)

    }
    let pokemon;
    if (isMine) {

        pokemon = {
            pokemonName: pokemons[random],
            pokemonData: pokemonData,
            playerData: {
                level: 1,
                currenthp: 35,
                maxhp: 35,
                exp: 64,
                expNextlvl: 100
            }
        }
    }
    else {
        pokemon = {
            rivalPokemon: pokemons[random],
            rivalPokemonData: pokemonData,
            rivalData: {
                level: 1, //Math.floor(Math.random() * (level_p+1 - (level_p-1)) + level_p-1),
                hp: 35,
                maxhp: 35,
            }
        }
    }
    return pokemon

}

const getPokemonData = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

const generateRivalPok = async () => {
    // if (localStorage.getItem("rivalPokemon") === null) {
    const pokemons = await getPokemons("grass")
    let player_pokemon = JSON.parse(localStorage.getItem("pokemon"))
    let slot_p = player_pokemon[0].pokemonName.slot
    let level_p = player_pokemon[0].playerData.level  //later I wll gchange it to max level pokemon the player has 
    let rivalPokemon = await getslot(pokemons, slot_p, false)
    // //console.log(slot_p, rivalPokemon.pokemon);
    // let rivalPokemonData = await getPokemonData(rivalPokemon.pokemon["url"])
    // let rivalPokemonObj = {
    //     rivalPokemon: rivalPokemon,
    //     rivalPokemonData: rivalPokemonData,
    //     rivalData: {
    //         level: 1, //Math.floor(Math.random() * (level_p+1 - (level_p-1)) + level_p-1),
    //         hp: 35,
    //         maxhp: 35,
    //     }
    // }
    localStorage.setItem("rivalPokemon", JSON.stringify(rivalPokemon))

    // }
}
const getPokemons = async (type) => {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`)
    const data = await response.json()
    return data.pokemon
}
// const getMoves = (moves, level) => {
//     // //console.log("function called",moves);
//     let movesObj = moves.filter(moveobj => {
//         return moveobj.version_group_details.some(detail =>
//             detail.level_learned_at === level
//         );
//     }).map(moves => ({ move: moves.move }));
//     let movesObjf = []
//     movesObj.forEach(async move => {
//         //console.log(move.move.url);
//         let moveData = await getMove(move.move.url)
//         if (moveData.stat_changes.length > 0) {
//             moveData.stat_changes.forEach(stat_change => {
//                 if (stat_change.stat.name == "attack" || stat_change.stat.name == "defence") {
//                     let moveObj = {
//                         move: move.move.name,
//                         url: move.move.url,
//                         change: stat_change.stat.name == "attack" ? stat_change.change : stat_change.change * (-1)
//                     }
//                     movesObjf.push(moveObj)
//                 }
//             })
//         }
//     });
//     return movesObj
// }
async function getMoves(moves, level) {
    const filteredMoves = moves.filter(moveobj =>
      moveobj.version_group_details.some(detail => detail.level_learned_at === level)
    );
  
    const moveDataPromises = filteredMoves.map(move =>
      fetch(move.move.url).then(response => response.json())
    );
    const moveData = await Promise.all(moveDataPromises);
  
    return moveData.map(data => ({
      move: data.name,
      url: data.url,
      change: data.stat_changes?.find(change => change.stat.name === "attack")?.change ||
              (data.stat_changes?.find(change => change.stat.name === "defense")?.change * -1) ||
              0,
      power:data.power,
      pp:data.pp
    }));
  }
const getMove = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    return data

}