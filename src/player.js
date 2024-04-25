import { getCenterMap, getHouseMap, getMap, getMartMap, getOakMap } from "./utils.js";

const ENUM = {
  OAK: "OAK",
  INITIAL: "initial",
  HOUSE: "House",
  GET_FROM_OAK: "Get one from Prof oak",
  CENTER: "Center",
  MART: "Mart",
  NO_POKEMON: "You don't have any pokemon",
  PRESS_ENTER: "Press Enter to Enter the ",
  BG_COLOR: "#6ece67",
  EMPTY_STRING: " ",
  BATTLE: "battle",
};

export class Player {
  constructor(xpos, ypos, width, height, color, ctx, textToDisplay) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 5;
    this.lastMove = "front";
    this.ctx = ctx;
    this.isAllowedInGrass =
      JSON.parse(localStorage.getItem("pokemon")).length == 1;
    // this.isAllowedInGrass = true
    this.inGrass = null;
    this.entered = null;
    this.enterPressed = false;
    this.mapin = ENUM.INITIAL;
    this.collidingTable = false;
    this.healingTable = false;
    this.textToDisplay = textToDisplay;
    this.ballSelecting = false;
    this.isListening = true;

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.images = {
      left: new Image(),
      right: new Image(),
      front: new Image(),
      back: new Image(),
    };

    this.loadImages();
  }
  loadImages() {
    this.images["left"].src = "./assets/images/playerl.png";
    this.images["right"].src = "./assets/images/playerr.png";
    this.images["front"].src = "./assets/images/playerf.png";
    this.images["back"].src = "./assets/images/playerb.png";

    for (const direction in this.images) {
      this.images[direction].onerror = () => {
        console.error(`Error loading image: ${this.images[direction].src}`);
      };
    }
  }
  draw() {
    const currentImage = this.images[this.getDirection()];
    // this.ctx.fillRect(this.xpos,this.ypos,this.width,this.height)
    if (currentImage.complete) {
      this.ctx.drawImage(
        currentImage,
        this.xpos,
        this.ypos,
        this.width,
        this.height
      );
    } else {
      console.warn(
        `Player image for direction ${this.getDirection()} not loaded yet`
      );
      // Draw a placeholder image here while the main image loads
      const imagee = new Image();
      imagee.src = "./assets/images/playerb.png";
      imagee.onload = () => {
        this.ctx.drawImage(
          imagee,
          this.xpos,
          this.ypos,
          this.width,
          this.height
        );
      };
    }
  }

  getDirection() {
    // //console.log("getdirection called", this.lastMove)
    return this.lastMove;
  }
  handleKeyDown(event) {
    if (!this.isListening) return;
    switch (event.key) {
      case "ArrowLeft":
        this.lastMove = "left";
        this.moveLeft();
        break;
      case "ArrowRight":
        this.lastMove = "right";
        this.moveRight();
        break;
      case "ArrowUp":
        this.lastMove = "back";
        this.moveUp();
        break;
      case "ArrowDown":
        this.lastMove = "front";
        //console.log("front")
        this.moveDown();
        break;
      case "Enter":
        if (
          this.textToDisplay == ENUM.OAK ||
          this.textToDisplay == ENUM.CENTER ||
          this.textToDisplay == ENUM.MART ||
          this.textToDisplay == ENUM.HOUSE
        ) {
          this.enterPressed = true;
          this.xpos = canvas.width / 2;
          // this.ypos=getMap()["buildings"][1].ypos+20
        } else if (this.textToDisplay == "table" && this.mapin == ENUM.OAK) {
          this.ballSelecting = true;
        } else if (this.textToDisplay == "table" && this.mapin == ENUM.CENTER) {
          this.healingTable = true;
          let pokemons = JSON.parse(localStorage.getItem("pokemon"));
          let newPokemonArray = [];
          for (const pokemon of pokemons) {
            pokemon.playerData.currenthp = pokemon.playerData.maxhp;
            newPokemonArray.push(pokemon);
          }
          localStorage.setItem("pokemon", JSON.stringify(newPokemonArray));
          this.textToDisplay = "Your Pokemons are healed";
          //console.log(
          // newPokemonArray
          // );
        }
        break;
      default:
        break;
    }
    this.update();
  }
  moveLeft() {
    this.xpos -= this.speed;
    //console.log("leftttt")
    if (this.handleCollisions()) {
      //console.log("leftttttttttttttttttttttt")
      this.xpos += this.speed;
    }
  }

  moveRight() {
    this.xpos += this.speed;
    //console.log("rigthtt")
    if (this.handleCollisions()) {
      //console.log("rigthttttttttttttttttttttttt")
      this.xpos -= this.speed;
    }
  }

  moveUp() {
    this.ypos -= this.speed;
    if (this.handleCollisions()) {
      this.ypos += this.speed;
    }
  }

  moveDown() {
    this.ypos += this.speed;
    if (this.handleCollisions()) {
      this.ypos -= this.speed;
    }
  }

  // Check collisions with buildings and trees
  handleCollisions() {
    if (this.mapin == ENUM.INITIAL) {
      const map = getMap(); // Replace with your map data structure
      for (const buildingType in map) {
        // //console.log(buildingType)
        if (buildingType != "grasses" && buildingType != "roads") {
          for (const building of map[buildingType]) {
            if (this.collidesWith(building)) {
              // //console.log("collided with " + building)
              this.textToDisplay = building.text;
              return true;
            } else {
              this.textToDisplay = ENUM.EMPTY_STRING;
            }
          }
        } else if (buildingType === "grasses") {
          for (const building of map[buildingType]) {
            if (this.collidesWith(building)) {
              // //console.log(this.isAllowedInGrass, "allowed",JSON.parse(localStorage.getItem("pokemon")));
              // this.isAllowedInGrass=(localStorage.getItem("pokemon").length ==1)
              if (this.isAllowedInGrass) {
                // //console.log(building)
                this.inGrass = building;
                this.textToDisplay = ENUM.EMPTY_STRING;
              } else {
                this.textToDisplay = ENUM.NO_POKEMON;

                return true;
              }
            } else {
              this.textToDisplay = ENUM.EMPTY_STRING;
            }
          }
        }
      }
    } else if (this.mapin == ENUM.OAK) {
      const oakmap = getOakMap();

      for (const buildingType in oakmap) {
        if (buildingType == "rectangles") {
          for (const building of oakmap[buildingType]) {
            if (building.text == ENUM.OAK) {
              if (this.collidesFromInside(building)) {
                // //console.log(building);
                // //console.log("collided with " + building)
                this.textToDisplay = building.text;
                return true;
              } else {
                this.textToDisplay = ENUM.EMPTY_STRING;
                // //console.log("not colliding")
              }
            } else {
              if (this.collidesWith(building)) {
                if (building.text == "door") {
                  this.enterPressed = false;
                  this.mapin = ENUM.INITIAL;
                  this.xpos = getMap()["buildings"][1].xpos - this.width;
                }
                // //console.log("collided with " + building)
                this.textToDisplay = building.text;
                return true;
              } else {
                this.collidingTable = false;
                this.textToDisplay = ENUM.EMPTY_STRING;
              }
            }
          }
        } else {
          for (const building of oakmap[buildingType]) {
            // //console.log(building)
            if (this.collidesWith(building)) {
              if (building.text == "table") {
                this.collidingTable = true;
              }
              // //console.log("collided with " + building)
              this.textToDisplay = building.text;
              return true;
            } else {
              this.collidingTable = false;
              this.textToDisplay = ENUM.EMPTY_STRING;
            }
          }
        }
      }
    } else if (this.mapin == ENUM.CENTER) {
      //console.log("in center ");
      const centerMap = getCenterMap();

      for (const buildingType in centerMap) {
        if (buildingType == "rectangles") {
          for (const building of centerMap[buildingType]) {
            if (building.text == ENUM.CENTER) {
              if (this.collidesFromInside(building)) {
                //console.log(building);
                // //console.log("collided with " + building)
                this.textToDisplay = building.text;
                return true;
              } else {
                this.textToDisplay = ENUM.EMPTY_STRING;
                //console.log("not colliding 222")
              }
            } else {
              if (this.collidesWith(building)) {
                // if (building.text == "door") {
                this.enterPressed = false;
                this.mapin = ENUM.INITIAL;
                this.xpos = getMap()["buildings"][3].xpos - this.width;
                // }
                // //console.log("collided with " + building)
                this.textToDisplay = building.text;
                return true;
              } else {
                this.textToDisplay = ENUM.EMPTY_STRING;
                //console.log("not colliding")
              }
            }
          }
        } else {
          for (const building of centerMap[buildingType]) {
            // //console.log(building)
            if (this.collidesWith(building)) {
              if (building.text == "table") {
                this.healingTable = true;
              }
              // //console.log("collided with " + building)
              this.textToDisplay = building.text;
              return true;
            } else {
              this.healingTable = false;
              this.textToDisplay = ENUM.EMPTY_STRING;
            }
          }
        }
      }
    } else if (this.mapin == ENUM.MART) {
      //console.log("in Mart ");
      const martMap = getMartMap();

      for (const buildingType in martMap) {
        if (buildingType == "rectangles") {
          for (const building of martMap[buildingType]) {
            if (building.text == ENUM.MART) {
              if (this.collidesFromInside(building)) {
                //console.log(building);
                // //console.log("collided with " + building)
                this.textToDisplay = building.text;
                return true;
              } else {
                this.textToDisplay = ENUM.EMPTY_STRING;
                //console.log("not colliding 222")
              }
            } else {
              if (this.collidesWith(building)) {
                // if (building.text == "door") {
                this.enterPressed = false;
                this.mapin = ENUM.INITIAL;
                this.xpos = getMap()["buildings"][2].xpos - this.width;
                // }
                // //console.log("collided with " + building)
                this.textToDisplay = building.text;
                return true;
              } else {
                this.textToDisplay = ENUM.EMPTY_STRING;
                //console.log("not colliding")
              }
            }
          }
        }
      }
    } else if (this.mapin == ENUM.HOUSE) {
      //console.log("in House ");
      const houseMap = getHouseMap();

      for (const buildingType in houseMap) {
        if (buildingType == "rectangles") {
          for (const building of houseMap[buildingType]) {
            if (building.text == ENUM.HOUSE) {
              if (this.collidesFromInside(building)) {
                //console.log(building);
                // //console.log("collided with " + building)
                this.textToDisplay = building.text;
                return true;
              } else {
                this.textToDisplay = ENUM.EMPTY_STRING;
                //console.log("not colliding 222")
              }
            } else {
              if (this.collidesWith(building)) {
                // if (building.text == "door") {
                this.enterPressed = false;
                this.mapin = ENUM.INITIAL;
                this.xpos = getMap()["buildings"][0].doorx;
                this.ypos = getMap()["buildings"][0].doory;
                console.log(
                  getMap()["buildings"][0].xpos - this.width,
                  getMap()["buildings"][0]
                );
                // }
                // //console.log("collided with " + building)
                this.textToDisplay = building.text;
                return true;
              } else {
                this.textToDisplay = ENUM.EMPTY_STRING;
                //console.log("not colliding")
              }
            }
          }
        }
      }
    }
    return false;
  }
  collidesWith(obj) {
    return (
      this.xpos < obj.xpos + obj.width && //true
      this.xpos + this.width > obj.xpos &&
      this.ypos < obj.ypos + obj.height &&
      this.ypos + this.height > obj.ypos
    );
  }

  collidesFromInside(obj) {
    return (
      this.xpos + this.width > obj.xpos + obj.width ||
      this.xpos < obj.xpos ||
      this.ypos + this.height > obj.ypos + obj.height ||
      this.ypos < obj.ypos
    );
  }
  enteredDoor(obj) {
    return (
      this.xpos > obj.doorx &&
      this.xpos + this.width < obj.doorw + obj.doorx &&
      this.ypos > obj.ypos + obj.height
    );
  }

  // Adjust player position after collision (can be refined)
  adjustPositionAfterCollision(obj) {
    if (this.xpos < obj.xpos) {
      this.xpos = obj.xpos + obj.width;
    } else if (this.xpos + this.width > obj.xpos + obj.width) {
      this.xpos = obj.xpos - this.width;
    } else if (this.ypos < obj.ypos) {
      this.ypos = obj.ypos + obj.height;
    } else if (this.ypos + this.height > obj.ypos + obj.height) {
      this.ypos = obj.ypos - this.height;
    }
  }
  update() {
    this.draw(); // Draw after movement logic is processed
  }
}
