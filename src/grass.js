export class GrassField {
  constructor(x, y, xpos, ypos) {
    this.x = x;
    this.y = y;
    this.xpos = xpos;
    this.ypos = ypos;
    this.heightG = 50;
    this.widthG = 50;
    this.width = this.x * 30;
    this.height = this.y * 12;
    this.grass = new Image();
    this.grass.src = "./assets/images/grass.png";
  }
  draw(context) {
    const grassImage = this.grass;
    if (grassImage.complete) {
      for (var i = 0; i < this.y; i++) {
        var y = this.ypos + i * 12;
        for (var j = 0; j < this.x; j++) {
          var x = this.xpos + j * 30;
          context.fillStyle = "green";
          context.drawImage(grassImage, x, y, this.widthG, this.heightG);
        }
      }
    }
  }
}
