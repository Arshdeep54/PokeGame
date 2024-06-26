import { ENUM } from "./types.js";


export const getRandomPokemon = async (oldLen) => {
  const pokemons = await getPokemons("grass");

  var pokemon = await getslot(pokemons, 1, true, 1);

  var oldPokemonArray=JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY_ALL))
  if(oldPokemonArray.length<oldLen+1){

    var pokemonArray = [...oldPokemonArray,pokemon];
    localStorage.setItem(ENUM.POKEMON_KEY_ALL, JSON.stringify(pokemonArray));
  }
  
};
const getslot = async (pokemons, isMine, level) => {
  const max = pokemons.length;
  const min = 0;
  var random = Math.floor(Math.random() * (max - min) + min);

  var pokemonData = await getPokemonData(pokemons[random].pokemon.url);

  var showdownImagef = pokemonData.sprites.other.showdown.front_default;
  var showdownImageb = pokemonData.sprites.other.showdown.back_default;
  if (pokemonData.moves.length == 0) {
    await getslot(pokemons, isMine, level);
  }
  if (showdownImagef == null && showdownImageb == null) {
    await getslot(pokemons, isMine, level);
  }
  var pokemon;
  var validMoves = await getMoves(pokemonData.moves, level);
  if (validMoves.length == 0) {
    await getslot(pokemons, isMine, level);
  }
  if (isMine) {
    pokemon = {
      pokemonName: pokemons[random],
      pokemonData: pokemonData,
      playerData: {
        gifF: showdownImagef != null ? showdownImagef : ENUM.GIF_DEFAULT_FRONT,
        gifB: showdownImageb != null ? showdownImageb : ENUM.GIF_DEFAULT_BACK,
        level: 1,
        paisa: 500,
        currenthp: pokemonData.stats[0].base_stat,
        maxhp: pokemonData.stats[0].base_stat,
        exp: 64,
        expNextlvl:
          pokemonData.base_experience != null
            ? pokemonData.base_experience
            : 100,
      },
      validMoves: validMoves,
    };
  } else {
    pokemon = {
      rivalPokemon: pokemons[random],
      rivalPokemonData: pokemonData,
      rivalData: {
        level: 1,
        hp: pokemonData.stats[0].base_stat,
        maxhp: pokemonData.stats[0].base_stat,
        gifF: showdownImagef != null ? showdownImagef : ENUM.GIF_DEFAULT_FRONT,
        gifB: showdownImageb != null ? showdownImageb : ENUM.GIF_DEFAULT_BACK,
      },
      validMoves: validMoves,
    };
  }
  return pokemon;
};

const getPokemonData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const generateRivalPok = async (oldLen) => {
  const pokemons = await getPokemons("grass");
  // var player_pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
  // var level_p = player_pokemon[player.currentPokemonIndex].playerData.level;
  var rivalPokemon = await getslot(pokemons, false,  1);

  var oldRivalPokemonArray=JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY_ALL))
  if(oldRivalPokemonArray.length<oldLen+1){

    var pokemonArray = [...oldRivalPokemonArray,rivalPokemon];
    localStorage.setItem(ENUM.RIVAL_POKEMON_KEY_ALL, JSON.stringify(pokemonArray));
  }
  // }
};
const getPokemons = async (type) => {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
  const data = await response.json();
  return data.pokemon;
};

async function getMoves(moves, level) {
  const filteredMoves = moves.filter((moveobj) => {
    for (const detail of moveobj.version_group_details) {
      if (
        detail.level_learned_at === level ||
        detail.level_learned_at === level + 1 ||
        detail.level_learned_at === level - 1
      ) {
        return true;
      }
    }
    return false;
  });

  const moveDataPromises = filteredMoves.map(async (moveobj) => {
    try {
      const moveData = await getMove(moveobj.move.url);
      if (moveData.power !== null) {
        return {
          move: moveData.name,
          url: moveData.url,
          power: moveData.power,
          learnedAtLevel: moveobj.version_group_details.find(
            (detail) =>
              detail.level_learned_at === level ||
              detail.level_learned_at === level + 1 ||
              detail.level_learned_at === level - 1
          ).level_learned_at,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  });

  const moveData = await Promise.allSettled(moveDataPromises);
  const validMoves = moveData.filter(
    (result) => result.status === "fulfilled" && result.value !== null
  );

  return validMoves.map((result) => result.value);
}
const getMove = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
