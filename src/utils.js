function CalculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
}
function getMap() {
    let constants = {
        house: {
            xpos: 75,
            ypos: 140,
            width: 150,
            height: 110,

        },
        oak: {
            xpos: 600,
            ypos: 300,
            width: 150,
            height: 110,

        },
        mart: {
            xpos: 1050,
            ypos: 150,
            width: 150,
            height: 110,

        },
        center: {
            xpos: 1150,
            ypos: 350,
            width: 150,
            height: 110,

        },

        fence: {
            width: 12

        },
        trees: {
            tree_height: 36,
            tree_width: 26
        },
        road: {
            width: 100
        },
        grass: {
            grass_width: 30,
            grass_height: 12
        }
    }
    return {
        grasses: [
            new GrassField(
                Math.ceil(canvas.width / (3 * constants.grass.grass_width)),
                Math.ceil(canvas.height - constants.oak.ypos - constants.oak.height - constants.road.width - 2 * constants.fence.width),
                constants.fence.width + constants.road.width + canvas.width / 4,
                constants.oak.ypos + constants.oak.height + constants.road.width - constants.fence.width
            ),
            new GrassField(
                10,
                Math.ceil((constants.house.ypos + constants.house.height - canvas.height / 6) / constants.grass.grass_height),
                constants.fence.width + canvas.width / 4 + constants.road.width,
                canvas.height / 6),
        ],
        roads: [
            new Road(constants.fence.width, constants.house.ypos + constants.house.height, canvas.width / 4, constants.road.width, true),
            new Road(constants.fence.width + canvas.width / 4, constants.fence.width, constants.road.width, canvas.height / 1.3, true),
            new Road(
                constants.fence.width + constants.road.width + canvas.width / 4,
                constants.oak.ypos + constants.oak.height,
                canvas.width / 3,
                constants.road.width,
                true
            ),
            new Road(
                constants.fence.width + constants.road.width + canvas.width / 4 + canvas.width / 3,
                canvas.height / 6,
                constants.road.width,
                canvas.height / 1.3

            ),
            new Road(
                constants.fence.width + constants.road.width + canvas.width / 4 + canvas.width / 3 + constants.road.width,
                constants.center.ypos + constants.center.height,
                canvas.width - (constants.fence.width + constants.road.width + canvas.width / 4 + canvas.width / 3 + constants.road.width),
                constants.road.width
            )
        ],
        trees: [
            // new TreeField(6, 3, 700, 0),
            new TreeField(
                Math.ceil(canvas.width / (4 * constants.trees.tree_width)),
                Math.ceil(constants.house.ypos / constants.trees.tree_height),
                constants.fence.width,
                constants.fence.width),
            new TreeField(1, Math.ceil((constants.oak.ypos - constants.house.ypos) / constants.trees.tree_height), constants.fence.width + (canvas.width / 4) + constants.road.width, constants.house.ypos + constants.house.height),
            new TreeField(Math.ceil(canvas.width / (2 * constants.trees.tree_width)), Math.ceil(canvas.height / (6 * constants.trees.tree_height)), constants.fence.width + (canvas.width / 4) + constants.road.width, constants.fence.width),
            new TreeField(5, 1, constants.fence.width + (canvas.width / 4) + constants.road.width, constants.house.ypos + constants.house.height),
            new TreeField(
                Math.ceil(
                    (canvas.width - (constants.fence.width + constants.road.width + canvas.width / 4 + canvas.width / 3 + constants.road.width)
                    ) / constants.trees.tree_width),
                Math.ceil(
                    (canvas.height - (constants.center.ypos + constants.center.height + constants.road.width)) / constants.trees.tree_height
                ),
                constants.fence.width + constants.road.width + canvas.width / 4 + canvas.width / 3 + constants.road.width,
                constants.center.ypos + constants.center.height + constants.road.width
            ),
            new TreeField(
                Math.ceil(
                    (constants.road.width + canvas.width / 4) / constants.trees.tree_width),
                Math.ceil(
                    (canvas.height - (constants.center.ypos + constants.center.height + constants.road.width)) / constants.trees.tree_height
                ),
                constants.fence.width,
                canvas.height / 1.3 + constants.fence.width
            )

        ],
        buildings: [
            new Building(75, 140, "House", 150, 110, true, "#b0ccd5", "house"),
            new Building(600, 300, "OAK", 150, 110, true, "#b0ccd5", "house"),
            new Building(1070, 150, "Mart", 150, 110, true, "#b0ccd5", "Mart"),
            new Building(1150, 350, "Center", 150, 110, true, "#b0ccd5", "Center")
        ],
        fences: [
            // new Fence(constants.house.xpos-constants.fence.width-25,100,20,200,true),
            // new Fence(constants.house.xpos-constants.fence.width-25,100,200,20,false),
            new Fence(0, 0, canvas.width, constants.fence.width, false, "fence"),
            new Fence(0, 0, constants.fence.width, canvas.height, true, "fence"),
            new Fence(0, canvas.height - 10, canvas.width, constants.fence.width, false, "fence"),
            new Fence(canvas.width - 10, 0, constants.fence.width, canvas.height, true, "fence"),
            new Fence(constants.fence.width, constants.house.ypos + constants.house.height + constants.road.width, canvas.width / 4, constants.fence.width, false, "fence"),
            new Fence(constants.fence.width + canvas.width / 4 + constants.road.width, constants.oak.ypos + constants.oak.height + constants.road.width - constants.fence.width, canvas.width / 3, constants.fence.width, false, "fence")
        ],
        pool: [
            new Pool(constants.fence.width + 50, constants.house.ypos + constants.house.height + constants.road.width + constants.fence.width + 30, canvas.width / 4 - 100, canvas.height - (canvas.height / 1.3 + constants.fence.width)-constants.trees.tree_height)
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
        ],

    }
}
function getCenterMap() {
    let tablexpos = canvas.width / 2 - 100
    let tableypos = canvas.height / 2 - 200
    return {
        rectangles: [
            new Rectangle(canvas.width / 2 - 250, canvas.height / 2 - 250, 500, 500, "blue", "Center"),
            new Rectangle(canvas.width / 2 - 250, canvas.height / 2 - 40, 10, 80, "red", "door")
        ],
        tables: [
            new Table(tablexpos, tableypos, 100, 100, 200, 100, "table")
        ],

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
function getMartMap(){
    return {
        rectangles:[
            new Rectangle(canvas.width / 2 - 250, canvas.height / 2 - 250, 500, 500, "#4B4FBD", "Mart"),
            new Rectangle(canvas.width / 2 - 250, canvas.height / 2 - 40, 10, 80, "red", "door")

        ]
    }
}

function getHouseMap(){
    return {
        rectangles:[
            new Rectangle(canvas.width / 2 - 250, canvas.height / 2 - 250, 500, 500, "#4B4FBD", "House"),
            new Rectangle(canvas.width / 2 - 250, canvas.height / 2 - 40, 10, 80, "red", "door")

        ]
    }
}