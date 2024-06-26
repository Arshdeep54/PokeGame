import { ENUM } from "./types.js";

export class Pokemon {
  constructor(xpos, ypos, isMine, width, height) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.isMine = isMine;
    this.width = width;
    this.height = height;
    this.image = new Image();
  }
  draw(context) {
    var currentPokemonIndex=localStorage.getItem("currentPokemonIndex")
    
    var pokemonImage = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY))[currentPokemonIndex]
      .playerData.gifB;
    var rivalPokemonImage = JSON.parse(
      localStorage.getItem(ENUM.RIVAL_POKEMON_KEY)
    ).rivalData.gifF;

    this.image.src = this.isMine ? pokemonImage : rivalPokemonImage;
    const pokImage = this.image;

    if (pokImage.complete && pokImage.src != null) {
      context.drawImage(
        pokImage,
        this.xpos,
        this.ypos,
        this.width,
        this.height
      );
    }
  }
}
