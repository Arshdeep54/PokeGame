export class Ball {
  constructor(xpos, ypos, radius, color) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.radius = radius;
    this.color = color;
  }
  draw(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.xpos, this.ypos, this.radius, 0, 2 * Math.PI);
    context.fill();
  }
}
