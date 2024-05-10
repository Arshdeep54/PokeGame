import { ENUM } from "./types.js";
import { isMobileOrTablet } from "./utils.js";

export class TextBox {
  constructor(text, xpos, ypos, width, height, context) {
    this.text = text;
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.context = context;
    this.instruction = ENUM.EMPTY_STRING;
    this.inHouse = false;
    this.inBattle = false;
    this.isTlistening = false;
    this.mapin = ENUM.BATTLE;
    this.movedone = false;
    this.battleStatus = null;
    this.chosenText = ENUM.EMPTY_STRING;
    document.addEventListener("keydown", this.handlekeypressed.bind(this));
    this.selectedBattleOption = null;
    this.selectedMove = null;
    this.battledone = false;
    this.showBattleOptions = true;
    this.currentPokemonIndex = 0;
    this.cornerp = {
      left1: this.xpos + (3.75 * this.width) / 100,
      left2: this.xpos + (84 * this.width) / 100,
      top: this.ypos + (24 * this.height) / 100,
      right: this.showBattleOptions ? this.xpos + 285 : this.xpos + 470,
      right1: this.xpos + (65 * this.width) / 100,
      right2: this.xpos + (107 * this.width) / 100,
      bottom: this.ypos + (70 / 18) * ((18 * this.height) / 100),
    };
    this.options = {
      battleOptions: [
        {
          option: "Fight",
          xpos: this.cornerp.left2,
          ypos: this.cornerp.top,
        },
        {
          option: "Pokemon",
          xpos: this.cornerp.left2,
          ypos: this.cornerp.bottom,
        },
        {
          option: "Bag",
          xpos: this.cornerp.right2,
          ypos: this.cornerp.top,
        },
        {
          option: "Run",
          xpos: this.cornerp.right2,
          ypos: this.cornerp.bottom,
        },
      ],
      fightOptions: [
        {
          option: "Tacle",
          xpos: this.cornerp.left1,
          ypos: this.cornerp.top,
        },
        {
          option: ".....",
          xpos: this.cornerp.left1,
          ypos: this.cornerp.bottom,
        },
        {
          option: ".....",
          xpos: this.cornerp.right1,
          ypos: this.cornerp.top,
        },
        {
          option: ".....",
          xpos: this.cornerp.right1,
          ypos: this.cornerp.bottom,
        },
      ],
    };
    this.moves = null;
    this.cursor = {
      x: this.showBattleOptions
        ? this.cornerp.left2 - (3.75 * this.width) / 100
        : this.cornerp.left1 - (3.75 * this.width) / 100,
      y: this.options.battleOptions[0].ypos,
    };
  }
  async loadMoves() {
    var currentPokemonIndex = localStorage.getItem("currentPokemonIndex");

    this.moves = JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY))[
      currentPokemonIndex
    ].validMoves;
    this.options.fightOptions.forEach((fightOption, index) => {
      if (this.moves.length > index) {
        fightOption.option = this.moves[index].move;
      } else {
        fightOption.option = ".....";
      }
    });
  }
  draw() {
    if (this.inHouse) {
      return;
    }
    this.context.lineWidth = 10;
    this.context.fillStyle = ENUM.COLORS.TEXTBOX;
    this.context.fillRect(
      this.xpos,
      this.ypos,
      this.inBattle ? this.width + 100 : this.width,
      this.height
    );
    this.context.fillStyle = ENUM.COLORS.BLACK;
    var font = isMobileOrTablet() ? ENUM.FONT_MOBILE : ENUM.FONT_DESKTOP;
    this.context.font = `${font} serif`;

    this.context.fillText(
      this.text,
      this.xpos + (6 * this.width) / 100,
      this.ypos + (30 * this.height) / 100
    );
    this.context.fillText(
      this.instruction,
      this.xpos + (6 * this.width) / 100,
      this.ypos + this.height - (10 * this.height) / 100
    );

    if (this.inBattle && !this.battledone) {
      this.loadMoves();

      const options =
        !this.showBattleOptions && this.selectedBattleOption.option == "Fight"
          ? this.options.fightOptions
          : this.options.battleOptions;
      this.context.fillText(">", this.cursor.x, this.cursor.y);
      options.map((option) =>
        this.context.fillText(option.option, option.xpos, option.ypos)
      );
    }
    if (this.inBattle && this.movedone) {
      this.context.fillText(
        this.chosenText,
        this.xpos + (3.75 * this.width) / 100,
        this.ypos + (20 * this.height) / 100
      );
    }
  }

  handlekeypressed(event) {
    if (!this.isTlistening) return;
    switch (event.key) {
      case "ArrowLeft":
        if (
          this.showBattleOptions &&
          this.cursor.x != this.cornerp.left2 - (3.75 * this.width) / 100
        ) {
          this.cursor.x = this.cornerp.left2 - (3.75 * this.width) / 100;
        } else if (
          !this.showBattleOptions &&
          this.cursor.x != this.cornerp.left1 - (3.75 * this.width) / 100
        ) {
          this.cursor.x = this.cornerp.left1 - (3.75 * this.width) / 100;
        }
        break;
      case "ArrowRight":
        if (
          this.showBattleOptions &&
          this.cursor.x != this.cornerp.right2 - (3.75 * this.width) / 100
        ) {
          this.cursor.x = this.cornerp.right2 - (3.75 * this.width) / 100;
        } else if (
          !this.showBattleOptions &&
          this.cursor.x != this.cornerp.right1 - (3.75 * this.width) / 100
        ) {
          this.cursor.x = this.cornerp.right1 - (3.75 * this.width) / 100;
        }

        break;
      case "ArrowUp":
        if (this.cursor.y != this.cornerp.top) {
          this.cursor.y = this.cornerp.top;
        }

        break;
      case "ArrowDown":
        if (this.cursor.x != this.cornerp.bottom) {
          this.cursor.y = this.cornerp.bottom;
        }
        break;
      case "Enter":
        if (!this.battledone) {
          if (this.showBattleOptions && !this.movedone) {
            this.selectedBattleOption = this.options.battleOptions.find(
              (option) =>
                option.xpos - (3.75 * this.width) / 100 === this.cursor.x &&
                option.ypos === this.cursor.y
            );
            if (this.selectedBattleOption.option == "Run") {
              this.battledone = true;
              this.inBattle = false;
              this.isTlistening = false;
              this.mapin = ENUM.INITIAL;
              return;
            }
            if (this.selectedBattleOption.option == "Pokemon") {
              console.log("pokkkkk");
              var currentPokemonIndex = localStorage.getItem(
                "currentPokemonIndex"
              );
              currentPokemonIndex = parseInt(currentPokemonIndex, 10) || 0;
              currentPokemonIndex++;
              if (
                JSON.parse(localStorage.getItem(ENUM.POKEMON_KEY)).length - 1 <
                currentPokemonIndex
              ) {
                currentPokemonIndex = 0;
              }
              localStorage.setItem("currentPokemonIndex", currentPokemonIndex);
            }
            if (this.selectedBattleOption.option == "Fight")
              this.showBattleOptions = false;
          } else {
            var smove = this.options.fightOptions.find(
              (option) =>
                option.xpos - (3.75 * this.width) / 100 === this.cursor.x &&
                option.ypos === this.cursor.y
            );
            if (smove.option != ".....") {
              this.selectedMove = this.moves.find(
                (move) => move.move === smove.option
              );
              this.chosenText =
                this.battleStatus == null
                  ? "You chose " + this.selectedMove.move
                  : " ";
              this.showBattleOptions = true;
              this.movedone = true;
            }
          }
          this.cursor.x = this.showBattleOptions
            ? this.cornerp.left2 - (3.75 * this.width) / 100
            : this.cornerp.left1 - (3.75 * this.width) / 100;
          this.inBattle = true;
        } else {
          this.inBattle = false;
          this.isTlistening = false;
          this.mapin = ENUM.INITIAL;
        }
        break;
      default:
        break;
    }
  }
}
