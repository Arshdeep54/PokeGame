import { ENUM } from "./types.js";

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
    this.tree = new Image();
    this.tree.src = "./assets/images/tree.png";
  }
  draw(context) {
    const treeImage = this.tree;
    if (treeImage.complete) {
      for (var i = 0; i < this.y; i++) {
        var y = this.ypos + i * 32;
        for (var j = 0; j < this.x; j++) {
          var x = this.xpos + j * 24;
          context.fillStyle = ENUM.COLORS.BLACK;
          context.drawImage(treeImage, x, y, this.widthT, this.heightT);
        }
      }
    }
  }
}
