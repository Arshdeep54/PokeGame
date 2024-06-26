import { ENUM } from "./types.js";
import { isMobileOrTablet} from "./utils.js";

export class Table {
  constructor(
    xpos,
    ypos,
    tableWidth,
    tableHeight,
    width,
    height,
    text,
    textTodisplay
  ) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.tableHeight = tableHeight;
    this.tableWidth = tableWidth;
    this.width = width;
    this.height = height;
    this.text = text;
    this.textTodisplay = textTodisplay;
  }
  drawTableLeg(context, x, y) {
    context.fillStyle = "red";
    context.fillRect(x, y, 10, this.tableHeight);
  }

  drawTabletop(context, x, y) {
    context.fillStyle = "yellow";
    context.fillRect(x, y, this.tableWidth, this.tableHeight);
  }

  draw(context) {
    context.fillStyle = "red";
    context.fillRect(this.xpos, this.ypos, this.width, this.height);

    if (this.textTodisplay.length > 1) {
      context.fillStyle = ENUM.COLORS.BLACK;
      var font = isMobileOrTablet() ? ENUM.FONT_MOBILE : ENUM.FONT_DESKTOP;
      context.font = `${font} serif`;
      context.fillText(this.textTodisplay, this.xpos + 30, this.ypos + 30);
    }
  }
}
