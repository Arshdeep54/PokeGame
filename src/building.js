import { ENUM } from "./types.js";

export class Building {
  constructor(xpos, ypos, text, width, height, allowed, color, type) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.text = text;
    this.width = width;
    this.height = height;
    this.allowed = allowed;
    this.color = color;
    this.type = type;
    this.doorx = (this.width + 2 * this.xpos) / 2;
    this.doory = this.ypos + this.height;
    this.doorw = this.width / 3;
    this.doorh = this.height / 2;
  }
  draw(context) {
    context.lineWidth = 10;

    context.fillStyle = this.color;
    context.fillRect(this.xpos, this.ypos, this.width, this.height); 
    context.fillStyle = ENUM.COLORS.BUILDING_DOOR

    context.fillRect(
      this.doorx - this.doorw / 2,
      this.doory - this.doorh,
      this.doorw,
      this.doorh
    ); 
    context.fillStyle = ENUM.COLORS.BLACK;
    context.font = "1.2rem serif";
    let textWidth = context.measureText(this.text).width;
    context.fillText(
      this.text,
      this.xpos + (this.width - textWidth) / 2,
      this.ypos + 25
    );
    context.beginPath();
    context.moveTo(this.xpos - this.width / 6, this.ypos);
    context.lineTo(this.doorx, this.ypos - this.height / 2.5); 
    context.lineTo(this.xpos + this.width + this.width / 6, this.ypos);
    context.closePath(); 
    context.stroke(); 
    context.fill();
  }
}
