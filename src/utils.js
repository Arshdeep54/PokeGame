function CalculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
}
function getMap() {
    return {
        buildings: [
            new Building(75, 140, "Your house", 150, 110, true, "#b0ccd5", "house"),
            new Building(600, 300, "OAK", 150, 110, true, "#b0ccd5", "house"),
            new Building(1150, 150, "MART", 150, 110, true, "#b0ccd5", "Mart"),
            new Building(1150, 350, "Center", 150, 110, true, "#b0ccd5", "Center")
        ],
        grasses: [
            new GrassField(6, 10, 530, 80)
        ],
        trees: [
            new TreeField(6, 3, 700, 0)
        ],
        roads: [
            new Road(70, 255, 300, 100, true),
            new Road(370, 110, 150, 350, true),
            new Road(500, 410, 350, 100, true)
        ]
    };
}
function getOakMap() {
    let tablexpos = canvas.width / 2
    let tableypos = canvas.height / 2 - 200
    return {
        rectangles: [
            new Rectangle(canvas.width / 2 - 250, canvas.height / 2 - 250, 500, 500, "blue", "OAK"),
            new Rectangle(canvas.width / 2 - 250, canvas.height / 2 - 40, 10, 80, "red", "door")
        ],
        tables: [
            new Table(tablexpos, tableypos, 100, 100, 200, 100, "table")
        ],
        balls: [
            new Ball(tablexpos + 40, tableypos + 40, 20, "blue"),
            new Ball(tablexpos + 100, tableypos + 40, 20, "yellow"),
            new Ball(tablexpos + 160, tableypos + 40, 20, "black"),
        ]
    }
}
function getBattleMap() {
    return {
        hpbars: [
            new Healthbar(canvas.width / 2 - 250, canvas.height / 2 - 250, 21, 35, 3, 30, 50, false, 250, 100, ""),
            new Healthbar(canvas.width / 2 + 75, canvas.height / 2 + 50, 29, 35, 5, 30, 60, true, 250, 100, "Bulbasore"),
            // new Rectangle(canvas.width / 2 - 250, canvas.height / 2-40 , 10, 80, "red","door")
        ],
        pokemons: [
            new Pokemon(canvas.width / 2 - 250, canvas.height / 2 - 70, true, 30, 40),
            new Pokemon(canvas.width / 2 + 150, canvas.height / 2 - 200, false, 30, 40)
        ]

    }
}