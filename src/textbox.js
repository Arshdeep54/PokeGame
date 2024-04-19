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
        this.cornerp = {
            left: this.xpos + 370,
            top: this.ypos + 30,
            right: this.xpos + 470,
            bottom: this.ypos + 70
        }
        this.options = [
            {
                option: "Fight",
                xpos: this.cornerp.left,
                ypos: this.cornerp.top
            },
            {
                option: "Pokemon",
                xpos: this.cornerp.left,
                ypos: this.cornerp.bottom
            },
            {
                option: "Bag",
                xpos: this.cornerp.right,
                ypos: this.cornerp.top
            },
            {
                option: "Run",
                xpos: this.cornerp.right,
                ypos: this.cornerp.bottom
            },
        ]
        this.cursor = {
            x: this.cornerp.left - 15,
            y: this.options[0].ypos
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
            this.context.fillText(">", this.cursor.x, this.cursor.y)
            this.options.map(option => {
                this.context.fillText(option.option, option.xpos, option.ypos)
            })
        }
    }
    handlekeypressed(event) {
        if (!this.inBattle) return
        switch (event.key) {
            case 'ArrowLeft':
                console.log("left clincknek ewcb");
                if (this.cursor.x != this.cornerp.left-15) {
                    console.log("moving to right ");
                    this.cursor.x = this.cornerp.left-15
                }
                break;
            case 'ArrowRight':
                console.log("right clincknek ewcb");
                if (this.cursor.x != this.cornerp.right-15) {
                    this.cursor.x = this.cornerp.right-15
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
                    console.log(this.cursor.x,this.cursor.y,this.xpos);
                    let option=this.getOption(this.cursor.x,this.cursor.y)
                    console.log(option);
                    break
            default:
                break;
        }

    }
    getOption(x,y){
        this.options.forEach(option=>{
            if(option.xpos==x&&option.ypos==y){
                return option
            }
        })
        return null
    }

}