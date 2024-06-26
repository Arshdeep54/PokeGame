import { ENUM } from "./types.js";

export class Road {
  constructor(xpos, ypos, width, height, horizontal) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.horizontal = horizontal;
  }
  draw(context) {
    context.fillStyle = ENUM.COLORS.ROAD;
    context.fillRect(this.xpos, this.ypos, this.width, this.height);
  }
}
