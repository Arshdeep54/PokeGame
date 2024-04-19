class Player {
    constructor(xpos, ypos, width, height, color, ctx, textToDisplay) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.width = width;
        this.height = height
        this.color = color;
        this.speed = 5;
        this.lastMove = 'front';
        this.ctx = ctx
        // this.isAllowedInGrass = (localStorage.getItem("pokemon").length ==1)
        this.isAllowedInGrass = true
        this.inGrass = null
        this.entered = null
        this.enterPressed = false
        this.mapin = "initial"
        this.collidingTable = false
        this.textToDisplay = textToDisplay
        this.ballSelecting = false
        this.isListening = true;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.images = {
            'left': new Image(),
            'right': new Image(),
            'front': new Image(),
            'back': new Image(),
        };

        this.loadImages();
    }
    loadImages() {
        this.images['left'].src = './assets/images/playerl.png';
        this.images['right'].src = './assets/images/playerr.png';
        this.images['front'].src = './assets/images/playerf.png';
        this.images['back'].src = './assets/images/playerb.png';

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
            this.ctx.drawImage(currentImage, this.xpos, this.ypos, this.width, this.height);
        } else {
            console.warn(`Player image for direction ${this.getDirection()} not loaded yet`);
            // Draw a placeholder image here while the main image loads
            const imagee = new Image()
            imagee.src = './assets/images/playerb.png'
            imagee.onload = () => {
                this.ctx.drawImage(imagee, this.xpos, this.ypos, this.width, this.height)
            }
        }

    }
   

    getDirection() {
        // console.log("getdirection called", this.lastMove)
        return this.lastMove
    }
    handleKeyDown(event) {
        if (!this.isListening) return
        switch (event.key) {
            case 'ArrowLeft':
                this.lastMove = 'left';
                this.moveLeft();
                break;
            case 'ArrowRight':
                this.lastMove = 'right';
                this.moveRight();
                break;
            case 'ArrowUp':
                this.lastMove = 'back';
                this.moveUp();
                break;
            case 'ArrowDown':
                this.lastMove = 'front';
                console.log("front")
                this.moveDown();
                break;
            case 'Enter':
                if (this.textToDisplay == "OAK") {
                    this.enterPressed = true
                } else if (this.textToDisplay == "table") {
                    this.ballSelecting = true
                }
                break;
            default:
                break;
        }
        this.update();

    }
    moveLeft() {
        this.xpos -= this.speed;
        if (this.handleCollisions()) {
            this.xpos += this.speed;
        }
    }

    moveRight() {
        this.xpos += this.speed;
        if (this.handleCollisions()) {
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
        if (this.mapin == "initial") {

            const map = getMap(); // Replace with your map data structure
            for (const buildingType in map) {
                // console.log(buildingType)
                if (buildingType != "grasses" && buildingType != "roads") {
                    for (const building of map[buildingType]) {
                        if (this.collidesWith(building)) {
                            // console.log("collided with " + building)
                            this.textToDisplay = building.text
                            return true

                        } else {
                            this.textToDisplay = " "

                        }
                    }
                }
                else if (buildingType === "grasses") {
                    for (const building of map[buildingType]) {
                        if (this.collidesWith(building)) {
                            console.log(this.isAllowedInGrass, "allowed");
                            // this.isAllowedInGrass=(localStorage.getItem("pokemon").length ==1)
                            if (this.isAllowedInGrass) {
                                // console.log(building)
                                this.inGrass = building
                                this.textToDisplay = " "
                            } else {
                                return true
                            }
                        }
                        else {
                            this.inGrass = null
                            this.textToDisplay = " "
                        }
                    }
                }

            }
        } else if (this.mapin == "OAK") {
            const oakmap = getOakMap()

            for (const buildingType in oakmap) {
                if (buildingType == "rectangles") {

                    for (const building of oakmap[buildingType]) {
                        if (building.text == "OAK") {

                            if (this.collidesFromInside(building)) {
                                // console.log(building);
                                // console.log("collided with " + building)
                                this.textToDisplay = building.text
                                return true

                            } else {
                                this.textToDisplay = " "
                                // console.log("not colliding")

                            }
                        } else {
                            if (this.collidesWith(building)) {
                                if (building.text == "door") {
                                    this.enterPressed = false
                                    this.mapin = "initial"
                                    this.xpos = getMap()["buildings"][1].xpos - this.width

                                }
                                // console.log("collided with " + building)
                                this.textToDisplay = building.text
                                return true

                            } else {
                                this.collidingTable = false
                                this.textToDisplay = " "

                            }
                        }
                    }
                } else {
                    for (const building of oakmap[buildingType]) {
                        // console.log(building)
                        if (this.collidesWith(building)) {
                            if (building.text == "table") {
                                this.collidingTable = true
                            }
                            // console.log("collided with " + building)
                            this.textToDisplay = building.text
                            return true

                        } else {
                            this.collidingTable = false
                            this.textToDisplay = " "

                        }
                    }
                }
            }
        }
        return false
    }
    collidesWith(obj) {
        return (
            this.xpos < obj.xpos + obj.width &&//true
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
        )
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