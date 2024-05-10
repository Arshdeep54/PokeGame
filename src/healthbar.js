import { ENUM } from "./types.js";

export class Healthbar {
  constructor(
    xpos,
    ypos,
    hp,
    maxhp,
    level,
    exp,
    expforNextlevel,
    isMine,
    width,
    height,
    pokemonName
  ) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.hp = hp;
    this.maxhp = maxhp;
    this.level = level;
    this.exp = exp;
    this.expforNextlevel = expforNextlevel;
    this.isMine = isMine;
    this.width = width;
    this.height = height;
    this.pokemonName = " ";
    this.totalbarwidth = 190;
  }
  loadData() {
    var currentPokemonIndex=localStorage.getItem("currentPokemonIndex")

    this.pokemonName = this.isMine
      ? JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY))[currentPokemonIndex].pokemonName
          .pokemon.name
      : JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY))?.rivalPokemon
          .pokemon.name;
    this.hp = this.isMine
      ? JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY))[currentPokemonIndex].playerData
          .currenthp
      : JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY)).rivalData.hp;
    this.maxhp = this.isMine
      ? JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY))[currentPokemonIndex].playerData.maxhp
      : JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY)).rivalData
          .maxhp;
    this.level = this.isMine
      ? JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY))[currentPokemonIndex].playerData.level
      : JSON.parse(localStorage.getItem(ENUM.RIVAL_POKEMON_KEY)).rivalData
          .level;
    this.exp = JSON.parse(
      localStorage.getItem(ENUM.POKEMON_KEY)
    )[0].playerData.exp;
    this.expforNextlevel = JSON.parse(
      localStorage.getItem(ENUM.POKEMON_KEY)
    )[0].playerData.expNextlvl;
    this.hp = this.hp < 0 ? 0 : this.hp;
  }
  draw(context) {

    var currentPokemonIndex=localStorage.getItem("currentPokemonIndex")
    this.loadData();
    context.fillStyle = "yellow";
    context.fillRect(this.xpos, this.ypos, this.width, this.height);
    context.fillStyle = ENUM.COLORS.BLACK;
    context.font = "1rem serif";
    context.fillText(this.pokemonName, this.xpos + 20, this.ypos + 20);

    context.fillText("HP ", this.xpos + 20, this.ypos + 50);
    context.fillStyle = ENUM.COLORS.BLACK;
    context.lineWidth = 1;
    context.strokeRect(this.xpos + 50, this.ypos + 40, this.totalbarwidth, 6);
    var hpfill = (this.hp / this.maxhp) * this.totalbarwidth;
    if (hpfill > this.totalbarwidth) {
      hpfill = this.totalbarwidth;
    }
    context.fillRect(this.xpos + 50, this.ypos + 40, hpfill, 6);
    var hpstring = this.hp?.toString() + "/" + this.maxhp.toString();
    context.fillText(hpstring, this.xpos + this.width - 60, this.ypos + 65);
    if (this.isMine) {
      context.fillText("XP ", this.xpos + 20, this.ypos + 90);
      context.fillStyle = ENUM.COLORS.BLACK;
      context.lineWidth = 1;
      context.strokeRect(this.xpos + 50, this.ypos + 80, this.totalbarwidth, 6);
      var xpfill = (this.exp / this.expforNextlevel) * this.totalbarwidth;
      if (xpfill > this.totalbarwidth) {
        var diff = xpfill - this.totalbarwidth;
        this.exp = diff;
        var pokemon = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY));
        pokemon[currentPokemonIndex].playerData.exp = diff;
        pokemon[currentPokemonIndex].playerData.level = pokemon[currentPokemonIndex].playerData.level + 1;
        this.level = pokemon[currentPokemonIndex].playerData.level;
        localStorage.setItem(ENUM.POKEMON_KEY, JSON.stringify(pokemon));

        xpfill = (this.exp / this.expforNextlevel) * this.totalbarwidth;
      }
      context.fillRect(this.xpos + 50, this.ypos + 80, xpfill, 6);
    }
    context.fillText(
      "lvl " + this.level.toString(),
      this.xpos + this.width - 50,
      this.ypos + 20
    );
  }
}
