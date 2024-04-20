const getRandomPokemon = async () => {

    const pokemons = await getPokemons("grass")


    let pokemonName = getslot(pokemons, 1);
    console.log(pokemonName.pokemon.url);
    let pokemonData = await getPokemonData(pokemonName.pokemon["url"])
    console.log(pokemonData);
    let pokemon = {
        pokemonName: pokemonName,
        pokemonData: pokemonData,
        playerData: {
            level: 1,
            currenthp: 35,
            maxhp: 35,
            exp: 64,
            expNextlvl: 100
        }
    }
    // console.log(localStorage.getItem("pokemon"))
    if (JSON.parse(localStorage.getItem("pokemon")).length == 0) {
        console.log("empty storage");
        let pokemonArray = [pokemon]
        localStorage.setItem("pokemon", JSON.stringify(pokemonArray))
        console.log(JSON.parse(localStorage.getItem("pokemon")), "updated ")

    }
    // console.log(pokemon)
}
const getslot = (pokemons, slot) => {
    const max = pokemons.length
    const min = 0
    let random = Math.floor(Math.random() * (max - min) + min)
    let not_slot = slot == 1 ? 2 : 1
    if (pokemons[random].slot == not_slot) {
        getslot(pokemons, slot)
    }
    else {
        return pokemons[random]
    }
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
    let rivalPokemon = getslot(pokemons, slot_p)
    console.log(slot_p, rivalPokemon.pokemon);
    let rivalPokemonData = await getPokemonData(rivalPokemon.pokemon["url"])
    let rivalPokemonObj = {
        rivalPokemon: rivalPokemon,
        rivalPokemonData: rivalPokemonData,
        rivalData: {
            level: 1, //Math.floor(Math.random() * (level_p+1 - (level_p-1)) + level_p-1),
            hp: 35,
            maxhp: 35,
        }
    }
    localStorage.setItem("rivalPokemon", JSON.stringify(rivalPokemonObj))

    // }
}
const getPokemons = async (type) => {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`)
    const data = await response.json()
    return data.pokemon
}
const getMoves = (moves, level) => {
    // console.log("function called",moves);
    return moves.filter(moveobj => {
        return moveobj.version_group_details.some(detail =>
            detail.level_learned_at === level
        );
    }).map(moves => ({ move: moves.move }));
}
const getMove = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    return data

}