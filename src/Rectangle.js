import { ENUM } from "./types.js";
import { isMobileOrTablet, wrapText } from "./utils.js";

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
    var lineHeight=20
    const padding = this.ypos + 50;
    
    context.fillStyle = this.color;
    context.fillRect(this.xpos, this.ypos, this.width, this.height);
    if (this.text == ENUM.MART) {
      var instructions = "Nothing here";
      context.fillStyle = ENUM.COLORS.BLACK;
      var font = isMobileOrTablet() ? ENUM.FONT_MOBILE : ENUM.FONT_DESKTOP;
      context.font = `0.8rem  serif`;
      context.fillText(instructions, this.xpos + 230, this.ypos + 50, 400, 400);
    }
    if (this.text == ENUM.HOUSE) {
      context.fillStyle = ENUM.COLORS.BLACK;
      var font = isMobileOrTablet() ? ENUM.FONT_MOBILE : ENUM.FONT_DESKTOP;
       lineHeight = 24; 
      context.font = `${font} serif`;
      var instructions = [
        "Go to full screen and refresh for better frontend.",
        "Try touching a grass , it will say to get a pokemon from OAK's house.",
        "Go to oak house and touch the table to pick one pokemon.",
        "Travel through the grass (for now horizontlly ) and you will randomly end up in war .",
        "After war ends , get to the center ,touch the table ,press enter to heal your pokemon.",
        "You can get a new pokemon each time you visit OAK's house .",
      ];
      let y = padding;
      for (var instruction of instructions) {
        instruction = String.fromCharCode(0x25cf) + " "+ instruction; //charcode for filled bullet
        const wrappedLines = wrapText(context, instruction, this.width - 100);
        for (const line of wrappedLines) {
          var nxpos=this.xpos + 50
          if(wrappedLines[0]!=line){
nxpos=this.xpos+76
          }
          context.fillText(line,nxpos, y);
          y += lineHeight;
        }
        y += lineHeight;
      }
    }
  }
}
