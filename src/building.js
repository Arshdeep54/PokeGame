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
    //Wall

    context.fillStyle = this.color;
    context.fillRect(this.xpos, this.ypos, this.width, this.height); //x, y, width, height75,140,150,110
    context.fillStyle = "#73544f";

    //Door
    context.fillRect(
      this.doorx - this.doorw / 2,
      this.doory - this.doorh,
      this.doorw,
      this.doorh
    ); //x, y, width, height
    //Roof
    context.fillStyle = "black";
    context.font = "18px serif";
    let textWidth = context.measureText(this.text).width;
    context.fillText(
      this.text,
      this.xpos + (this.width - textWidth) / 2,
      this.ypos + 25
    );
    context.beginPath();
    context.moveTo(this.xpos - this.width / 6, this.ypos); // left most point
    context.lineTo(this.doorx, this.ypos - this.height / 2.5); // line to top point
    context.lineTo(this.xpos + this.width + this.width / 6, this.ypos); //line to right most point
    context.closePath(); // links starting point and end points
    context.stroke(); // adds a stroke to the invisible path
    context.fill();
  }
}
