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
    this.cornerp = {
      left1: this.xpos + (3.75 * this.width) / 100,
      left2: this.xpos + (84 * this.width) / 100,
      top: this.ypos + (24 * this.height) / 100,
      right: this.showBattleOptions ? this.xpos + 285 : this.xpos + 470,
      right1: this.xpos + (65 * this.width) / 100,
      right2: this.xpos + (107 * this.width) / 100,
      bottom: this.ypos + (70 / 18) * ((18 * this.height) / 100),
    };
    // console.log((107 * this.width) / 100, (16 * this.height) / 100);
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
    this.moves = JSON.parse(localStorage.getItem("pokemon"))[0].validMoves;
    // console.log(this.moves);
    this.options.fightOptions.forEach((fightOption, index) => {
      if (this.moves.length > index) {
        fightOption.option = this.moves[index].move;
      } else {
        fightOption.option = ".....";
      }
    });
  }
  draw() {
    this.context.lineWidth = 10;
    this.context.fillStyle = "#b0aaaa";
    this.context.fillRect(
      this.xpos,
      this.ypos,
      this.inBattle ? this.width + 100 : this.width,
      this.height
    );
    this.context.fillStyle = "black";
    let font = isMobileOrTablet() ? ENUM.FONT_MOBILE : ENUM.FONT_DESKTOP;
    this.context.font = `${font} serif`;
    
    this.context.fillText(
      this.text,
      this.xpos + (10 * this.width) / 100,
      this.ypos + (30 * this.height) / 100
    );
    this.context.fillText(
      this.instruction,
      this.xpos + (10 * this.width) / 100,
      this.ypos + this.height - (10 * this.height) / 100
    );
  
    if (this.inBattle && !this.battledone) {
      this.loadMoves();

      const options =
        !this.showBattleOptions && this.selectedBattleOption.option == "Fight"
          ? this.options.fightOptions
          : this.options.battleOptions;
      // //console.log(options);
      // this.cursor.x = this.selectedOption ? this.xpos + 20 : this.cornerp.left - 15;
      this.context.fillText(">", this.cursor.x, this.cursor.y);
      options.map((option) =>
        this.context.fillText(option.option, option.xpos, option.ypos)
      );
      // console.log("option",options[0].xpos, options[0].ypos);
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
        //console.log(this.cursor.x, this.cursor.y, this.xpos);
        if (!this.battledone) {
          if (this.showBattleOptions && !this.movedone) {
            this.selectedBattleOption = this.options.battleOptions.find(
              (option) =>
                option.xpos - (3.75 * this.width) / 100 === this.cursor.x &&
                option.ypos === this.cursor.y
            );
            //console.log(this.selectedBattleOption);
            if (this.selectedBattleOption.option == "Run") {
              this.battledone = true;
              this.inBattle = false;
              this.isTlistening = false;
              this.mapin = "initial";
              return;
            }
            if (this.selectedBattleOption.option == "Fight")
              this.showBattleOptions = false;
          } else {
            let smove = this.options.fightOptions.find(
              (option) =>
                option.xpos - (3.75 * this.width) / 100 === this.cursor.x &&
                option.ypos === this.cursor.y
            );
            // console.log(smove);
            if (smove.option != ".....") {
              this.selectedMove = this.moves.find(
                (move) => move.move === smove.option
              );
              this.chosenText =
                this.battleStatus == null
                  ? "You chose " + this.selectedMove.move
                  : " ";
              console.log(this.chosenText);
              this.showBattleOptions = true;
              this.movedone = true;
              console.log(this.selectedMove);
            }
          }

          // //console.log(option.xpos - 15, this.cursor.x, option.ypos, this.cursor.y);
          this.cursor.x = this.showBattleOptions
            ? this.cornerp.left2 - (3.75 * this.width) / 100
            : this.cornerp.left1 - (3.75 * this.width) / 100;
          this.inBattle = true;
        } else {
          //console.log("battle ended ");
          this.inBattle = false;
          this.isTlistening = false;
          this.mapin = "initial";
        }
        break;
      default:
        break;
    }
  }
}
