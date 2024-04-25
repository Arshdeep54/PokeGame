export class TreeField {
  constructor(x, y, xpos, ypos) {
    this.x = x;
    this.y = y;
    this.xpos = xpos;
    this.ypos = ypos;
    this.heightT = 36;
    this.widthT = 36;
    this.width = this.x * 24;
    this.height = this.y * 32;
    this.text = "Trees";
    // this.context=context
    this.tree = new Image();
    this.tree.src = "./assets/images/tree.png";
  }
  draw(context) {
    // this.context.fillStyle="red"
    // this.context.fillRect(this.xpos, this.ypos+300, this.widthG, this.heightG)
    // const tree = new Image()
    // tree.src = './assets/images/tree.png'
    const treeImage = this.tree;
    if (treeImage.complete) {
      // //console.log("image loaded",this.tree);
      for (let i = 0; i < this.y; i++) {
        let y = this.ypos + i * 32;
        for (let j = 0; j < this.x; j++) {
          let x = this.xpos + j * 24;
          // this.context.drawImage(tree, x, y)
          context.fillStyle = "black";
          // context.fillRect(x,y,this.widthT, this.heightT)
          context.drawImage(treeImage, x, y, this.widthT, this.heightT);
        }
      }
    }

    // let tree=new Image()
    // tree.src = "./assets/images/tree.png"
    // tree.onload = () => {
    //     //console.log("loading image");
    //     context.drawImage(tree, this.xpos, this.ypos)
    //     for (let i = 0; i < this.y; i++) {
    //         let y = this.ypos + i * this.heightG
    //         for (let j = 0; j < this.x; j++) {
    //             let x = this.xpos + j * this.widthG
    //             context.drawImage(tree, x, y)
    //         }

    //     }
    // }
  }
}
