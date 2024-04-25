import { ENUM } from "./types.js";
import { isMobileOrTablet } from "./utils.js";

export class Rectangle {
  constructor(xpos, ypos, width, height, color, text) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.color = color;
    this.text = text;
  }
  draw(context) {
    // //console.log(this.text);
    context.fillStyle = this.color;
    context.fillRect(this.xpos, this.ypos, this.width, this.height);
    if (this.text == ENUM.MART) {
      //console.log("drawing text");
      let instructions = "Nothing here";
      context.fillStyle = "black";
      let font=isMobileOrTablet()?ENUM.FONT_MOBILE:ENUM.FONT_DESKTOP
      context.font = `${font} serif`;
      context.fillText(instructions, this.xpos + 230, this.ypos + 50, 400, 400);
    }
    if (this.text == ENUM.HOUSE) {
      context.fillStyle = "black";
      let font=isMobileOrTablet()?ENUM.FONT_MOBILE:ENUM.FONT_DESKTOP
      context.font = `${font} serif`;
      //console.log("in house ");
      context.fillText(
        "Will add instructions here ,check console for now  ",
        this.xpos + 50,
        this.ypos + 50,
        400,
        400
      );
    }
  }
}
