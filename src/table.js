class Table {
    constructor(xpos,ypos,tableWidth,tableHeight,width,height ,text) {
        this.xpos = xpos
        this.ypos=ypos
        this.tableHeight=tableHeight;
        this.tableWidth=tableWidth
        this.width=width
        this.height=height
        this.text=text
    }
    drawTableLeg(context,x,y) {
        // Draw a single leg with a rectangular shape
        context.fillStyle = "red";
        context.fillRect(x, y, 10, this.tableHeight); // Adjust width (10) for leg thickness
    }

    drawTabletop(context,x,y) {
        // Draw the tabletop as a rectangle
        context.fillStyle = "yellow";
        context.fillRect(x, y, this.tableWidth, this.tableHeight);
    }

    draw(context) {
        context.fillStyle="red"
        context.fillRect(this.xpos,this.ypos,this.width,this.height)
        // Draw the table by positioning legs and tabletop
        // const legXOffset = (this.tableWidth - 10) / 2; // Center legs horizontally (adjust based on leg width)
        // this.drawTabletop(context,legXOffset, 0); // Place tabletop at (legXOffset, 0)
        // this.drawTableLeg(context,legXOffset, this.tableHeight); // Draw left leg at bottom
        // this.drawTableLeg(context,legXOffset + this.tableWidth - 10, this.tableHeight); // Draw right leg at bottom (adjust based on leg width)
    }
}