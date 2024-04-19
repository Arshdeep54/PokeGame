class Rectangle {
    constructor(xpos, ypos, width, height, color,text) {
        this.xpos = xpos
        this.ypos = ypos
        this.width = width
        this.height = height
        this.color = color
        this.text = text
    }
    draw(context){
        context.fillStyle=this.color;
        context.fillRect(this.xpos,this.ypos,this.width,this.height)
    }
}