class GrassField {
    constructor(x, y, xpos, ypos) {
        this.x = x
        this.y = y
        this.xpos = xpos
        this.ypos = ypos
        this.heightG = 50
        this.widthG = 50
        this.width=this.x*30
        this.height=this.y*12
        // this.context=context
        this.grass=new Image()
        this.grass.src='./assets/images/grass.png'
    }
    draw(context) {
        // this.context.fillStyle="red"
        // this.context.fillRect(this.xpos, this.ypos+300, this.widthG, this.heightG)
        // const grass = new Image()
        // grass.src = './assets/images/grass.png'
        const grassImage=this.grass
            if(grassImage.complete){

                // //console.log("image loaded",this.grass);
                for (let i = 0; i < this.y; i++) {
                    let y = this.ypos + i * 12
                    for (let j = 0; j < this.x; j++) {
                        let x = this.xpos + j * 30
                        // this.context.drawImage(grass, x, y)
                        context.fillStyle="green"
                        // this.context.fillRect(x, y,this.widthG, this.heightG)
                        context.drawImage(grassImage, x, y,this.widthG, this.heightG)
                    }
        
                }
            }


        // let grass=new Image()
        // grass.src = "./assets/images/grass.png"
        // grass.onload = () => {
        //     //console.log("loading image");
        //     context.drawImage(grass, this.xpos, this.ypos)
        //     for (let i = 0; i < this.y; i++) {
        //         let y = this.ypos + i * this.heightG
        //         for (let j = 0; j < this.x; j++) {
        //             let x = this.xpos + j * this.widthG
        //             context.drawImage(grass, x, y)
        //         }

        //     }
        // }
    }
}