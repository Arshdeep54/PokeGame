export const getRandomPokemon = async () => {
  const pokemons = await getPokemons("grass");

  let pokemon = await getslot(pokemons, 1, true, 1);

  if (JSON.parse(localStorage.getItem("pokemon")).length == 0) {
    let pokemonArray = [pokemon];
    localStorage.setItem("pokemon", JSON.stringify(pokemonArray));
  }
};
const getslot = async (pokemons, isMine, level) => {
  const max = pokemons.length;
  const min = 0;
  let random = Math.floor(Math.random() * (max - min) + min);

  let pokemonData = await getPokemonData(pokemons[random].pokemon.url);

  let showdownImagef = pokemonData.sprites.other.showdown.front_default;
  let showdownImageb = pokemonData.sprites.other.showdown.back_default;
  // console.log(showdownImageb, showdownImagef);
  if (pokemonData.moves.length == 0) {
    // console.log("moves missing ");
    await getslot(pokemons, isMine, level);
  }
  if (showdownImagef == null && showdownImageb == null) {
    // console.log("gifs missing ");
    await getslot(pokemons, isMine, level);
  }
  let pokemon;
  // console.log("  getting moves ");
  let validMoves = await getMoves(pokemonData.moves, level);
  if (validMoves.length == 0) {
    // console.log("validmoves missing ");
    await getslot(pokemons, isMine, level);
  }
  // console.log("validMoves", validMoves);
  if (isMine) {
    pokemon = {
      pokemonName: pokemons[random],
      pokemonData: pokemonData,
      playerData: {
        gifF:
          showdownImagef != null
            ? showdownImagef
            : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/30.gif",
        gifB:
          showdownImageb != null
            ? showdownImageb
            : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/30.gif",
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
        level: 1, //Math.floor(Math.random() * (level_p+1 - (level_p-1)) + level_p-1),
        hp: pokemonData.stats[0].base_stat,
        maxhp: pokemonData.stats[0].base_stat,
        gifF:
          showdownImagef != null
            ? showdownImagef
            : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/30.gif",
        gifB:
          showdownImageb != null
            ? showdownImageb
            : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/30.gif",
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

export const generateRivalPok = async () => {
  // if (localStorage.getItem("rivalPokemon") === null) {
  const pokemons = await getPokemons("grass");
  let player_pokemon = JSON.parse(localStorage.getItem("pokemon"));
  // let slot_p = player_pokemon[0].pokemonName.slot;
  let level_p = player_pokemon[0].playerData.level; //later I wll gchange it to max level pokemon the player has
  let rivalPokemon = await getslot(pokemons, false, level_p + 1);
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
  localStorage.setItem("rivalPokemon", JSON.stringify(rivalPokemon));

  // }
};
const getPokemons = async (type) => {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
  const data = await response.json();
  return data.pokemon;
};

async function getMoves(moves, level) {
  const filteredMoves = moves.filter((moveobj) => {
    // Check for a match in a single loop and return directly
    for (const detail of moveobj.version_group_details) {
      if (
        detail.level_learned_at === level ||
        detail.level_learned_at === level + 1 ||
        detail.level_learned_at === level - 1
      ) {
        return true; // Move learned at this level or nearby level, include it
      }
    }
    return false; // No match found, exclude the move
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
      // console.error("Error fetching move data:", error);
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
