class Pool {
    constructor(xpos, ypos, width, height) {
        this.xpos = xpos
        this.ypos = ypos
        this.width = width
        this.height = height
        
        this.text = "pool"
    }
    draw(context){
        context.lineWidth = 10
        context.fillStyle="brown"
        context.strokeRect(this.xpos , this.ypos , this.width, this.height)
        context.fillStyle="blue"
        context.fillRect(this.xpos , this.ypos , this.width, this.height)
    }
}