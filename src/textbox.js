class TextBox {
    constructor(text, xpos, ypos, width, height, context) {
        this.text = text
        this.xpos = xpos
        this.ypos = ypos
        this.width = width
        this.height = height
        this.context = context
        this.instruction = " "
        this.inBattle = false
        document.addEventListener('keydown', this.handlekeypressed.bind(this));
        this.selectedBattleOption = null
        this.selectedMove = null
        this.showBattleOptions=true
        this.cornerp = {
            left1:  this.xpos + 15,
            left2:this.xpos + 370,
            top: this.ypos + 30,
            right: this.showBattleOptions ? this.xpos + 285 : this.xpos + 470,
            right1:  this.xpos + 285,
            right2:this.xpos + 470,
            bottom: this.ypos + 70
        }
        this.options = {
            battleOptions: [{
                option: "Fight",
                xpos: this.cornerp.left2,
                ypos: this.cornerp.top
            },
            {
                option: "Pokemon",
                xpos: this.cornerp.left2,
                ypos: this.cornerp.bottom
            },
            {
                option: "Bag",
                xpos: this.cornerp.right2,
                ypos: this.cornerp.top
            },
            {
                option: "Run",
                xpos: this.cornerp.right2,
                ypos: this.cornerp.bottom
            },],
            fightOptions: [
                {
                    option: "Tacle",
                    xpos:this.cornerp.left1,
                    ypos: this.cornerp.top
                },
                {
                    option: ".....",
                    xpos: this.cornerp.left1,
                    ypos:  this.cornerp.bottom
                }, {
                    option: ".....",
                    xpos: this.cornerp.right1,
                    ypos: this.cornerp.top
                }, {
                    option: ".....",
                    xpos:this.cornerp.right1,
                    ypos: this.cornerp.bottom
                },
            ],


        }

        this.cursor = {
            x: this.showBattleOptions ?this.cornerp.left2 - 15: this.cornerp.left1 - 15,
            y: this.options.battleOptions[0].ypos
        }
    }

    draw() {

        this.context.lineWidth = 10;
        this.context.fillStyle = "#b0aaaa";
        this.context.fillRect(this.xpos, this.ypos, this.inBattle ? this.width + 100 : this.width, this.height)
        this.context.fillStyle = "black"
        this.context.font = "22px serif"
        this.context.fillText(this.text, this.xpos + 20, this.ypos + 28)
        this.context.fillText(this.instruction, this.xpos + 20, this.ypos + this.height - 20)
        if (this.inBattle) {
            const options = this.showBattleOptions ?  this.options.battleOptions:this.options.fightOptions 
            // console.log(options);
            // this.cursor.x = this.selectedOption ? this.xpos + 20 : this.cornerp.left - 15;
            this.context.fillText(">", this.cursor.x, this.cursor.y);
            options.map(option => this.context.fillText(option.option, option.xpos, option.ypos));
        }
    }

    handlekeypressed(event) {
        if (!this.inBattle) return
        switch (event.key) {
            case 'ArrowLeft':
                if(this.showBattleOptions&&this.cursor.x!=this.cornerp.left2-15){
               
                    this.cursor.x =this.cornerp.left2 - 15
                }
                else if(!this.showBattleOptions&&this.cursor.x!=this.cornerp.left1-15){
                    this.cursor.x =this.cornerp.left1 - 15
                }
                break;
            case 'ArrowRight':
                if(this.showBattleOptions&&this.cursor.x!=this.cornerp.right2-15){
               
                    this.cursor.x =this.cornerp.right2 - 15
                }
                else if(!this.showBattleOptions&&this.cursor.x!=this.cornerp.right1-15){
                    this.cursor.x =this.cornerp.right1 - 15
                }

                break;
            case 'ArrowUp':
                if (this.cursor.y != this.cornerp.top) {
                    this.cursor.y = this.cornerp.top
                }

                break;
            case 'ArrowDown':
                if (this.cursor.x != this.cornerp.bottom) {
                    this.cursor.y = this.cornerp.bottom
                }

                break;
            case 'Enter':
                console.log(this.cursor.x, this.cursor.y, this.xpos);
                if (this.showBattleOptions) {

                    this.selectedBattleOption = this.options.battleOptions.find(option => option.xpos - 15 === this.cursor.x && option.ypos === this.cursor.y);
                    console.log(this.selectedBattleOption);
                    this.showBattleOptions=false
                }
                else {
                    this.selectedMove = this.options.fightOptions.find(option =>  option.xpos - 15 === this.cursor.x && option.ypos === this.cursor.y);
                    console.log(this.selectedMove);
                }
                // console.log(option.xpos - 15, this.cursor.x, option.ypos, this.cursor.y);
                this.cursor.x = this.showBattleOptions ?this.cornerp.left2 - 15: this.cornerp.left1 - 15
                break
            default:
                break;
        }

    }



}