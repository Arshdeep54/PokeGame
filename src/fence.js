class Fence {
    constructor(xpos, ypos, width, height, vertical,text) {
        this.xpos = xpos
        this.ypos = ypos
        this.width = width
        this.height = height
        this.color = "brown"
        this.vertical = vertical
        this.text=text
    }
    draw(context) {
        context.lineWidth = 2
        context.fillStyle = this.color
        let distance = 10
        let max_rods = (Math.floor(this.vertical ? this.height : this.width) / distance)
        if (this.vertical) {
            context.beginPath();
            context.moveTo(this.xpos + this.width / 2, this.ypos)
            context.lineTo(this.xpos + this.width / 2, this.ypos + this.height)
            context.stroke()
            context.beginPath();
            context.moveTo(this.xpos, this.ypos + this.height / 2)
            context.lineTo(this.xpos + this.width, this.ypos + this.height / 2)
            context.stroke()
            for (let i = 1; i <= max_rods; i++) {

                context.beginPath();
                context.moveTo(this.xpos, this.ypos + (distance * i))
                context.lineTo(this.xpos + this.width, this.ypos + (distance * i))
                context.stroke()
            }

        }else {
            context.beginPath();
            context.moveTo(this.xpos, this.ypos + this.height / 2)
            context.lineTo(this.xpos + this.width, this.ypos + this.height / 2)
            context.stroke()
            for (let i = 1; i <= max_rods; i++) {

                context.beginPath();
                context.moveTo(this.xpos+ (distance * i), this.ypos )
                context.lineTo(this.xpos+ (distance * i), this.ypos +this.height)
                context.stroke()
            }
        }


    }
}