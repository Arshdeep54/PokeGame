import { Ball } from "./Ball.js";
import { Rectangle } from "./Rectangle.js";
import { Building } from "./building.js";
import { Fence } from "./fence.js";
import { GrassField } from "./grass.js";
import { Healthbar } from "./healthbar.js";
import { Pokemon } from "./pokemon.js";
import { Pool } from "./pool.js";
import { Road } from "./road.js";
import { Table } from "./table.js";
import { TreeField } from "./tree.js";
import { ENUM } from "./types.js";

export function isMobileOrTablet() {
  const userAgent = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}
export function getMap() {
  let constants = {
    house: {
      xpos: canvas.width / 20,
      ypos: canvas.height / 4,
      width: canvas.width / 10,
      height: canvas.height / 6,
    },
    oak: {
      xpos: canvas.width / 2.5,
      ypos: canvas.height / 3,
    },
    mart: {
      xpos: canvas.width / 1.3,
      ypos: canvas.height / 6,
    },
    center: {
      xpos: canvas.width / 1.2,
      ypos: canvas.height / 2,
    },

    fence: {
      width: 12,
    },
    trees: {
      tree_height: 36,
      tree_width: 26,
    },
    road: {
      width: 100,
    },
    grass: {
      grass_width: 30,
      grass_height: 12,
    },
  };
  return {
    grasses: [
      new GrassField(
        Math.ceil(canvas.width / (3 * constants.grass.grass_width)),
        Math.ceil(
          canvas.height -
            constants.oak.ypos -
            constants.house.height -
            constants.road.width -
            2 * constants.fence.width
        ),
        constants.fence.width + constants.road.width + canvas.width / 4,
        constants.oak.ypos +
          constants.house.height +
          constants.road.width -
          constants.fence.width
      ),

      new GrassField(
        Math.ceil(
          (canvas.width / 3 + constants.road.width) /
            constants.grass.grass_width
        ),
        Math.ceil(canvas.height / (6 * constants.grass.grass_height)),
        constants.fence.width + canvas.width / 4 + constants.road.width,
        0
      ),
    ],
    roads: [
      new Road(
        constants.fence.width,
        constants.house.ypos + constants.house.height,
        canvas.width / 4,
        constants.road.width,
        true
      ),
      new Road(
        constants.fence.width + canvas.width / 4,
        constants.fence.width,
        constants.road.width,
        canvas.height / 1.3,
        true
      ),
      new Road(
        constants.fence.width + constants.road.width + canvas.width / 4,
        constants.oak.ypos + constants.house.height,
        canvas.width / 3,
        constants.road.width,
        true
      ),
      new Road(
        constants.fence.width +
          constants.road.width +
          canvas.width / 4 +
          canvas.width / 3,
        canvas.height / 6,
        constants.road.width,
        canvas.height / 1.2
      ),
      new Road(
        constants.fence.width +
          constants.road.width +
          canvas.width / 4 +
          canvas.width / 3 +
          constants.road.width,
        constants.center.ypos + constants.house.height,
        canvas.width -
          (constants.fence.width +
            constants.road.width +
            canvas.width / 4 +
            canvas.width / 3 +
            constants.road.width),
        constants.road.width
      ),
    ],
    trees: [
      new TreeField(
        Math.ceil(canvas.width / (4 * constants.trees.tree_width)),
        Math.ceil(constants.house.ypos / constants.trees.tree_height),
        constants.fence.width,
        constants.fence.width
      ),
      new TreeField(
        1,
        Math.floor(constants.house.height / constants.trees.tree_height),
        constants.fence.width + canvas.width / 4 + constants.road.width,
        constants.oak.ypos
      ),
      new TreeField(
        Math.ceil(canvas.width / (4 * constants.trees.tree_width)),
        Math.ceil(
          (constants.oak.ypos - canvas.height / 6) / constants.trees.tree_height
        ),
        constants.fence.width + canvas.width / 4 + constants.road.width,
        canvas.height / 6
      ),
      new TreeField(
        Math.floor(
          (constants.oak.xpos -
            constants.fence.width -
            canvas.width / 4 -
            constants.road.width) /
            constants.trees.tree_width
        ),
        1,
        constants.fence.width + canvas.width / 4 + constants.road.width,
        constants.oak.ypos
      ),
      new TreeField(
        Math.ceil(
          (canvas.width -
            (constants.fence.width +
              constants.road.width +
              canvas.width / 4 +
              canvas.width / 3 +
              constants.road.width)) /
            constants.trees.tree_width
        ),
        Math.ceil(
          (canvas.height -
            (constants.center.ypos +
              constants.house.height +
              constants.road.width)) /
            constants.trees.tree_height
        ),
        constants.fence.width +
          constants.road.width +
          canvas.width / 4 +
          canvas.width / 3 +
          constants.road.width,
        constants.center.ypos + constants.house.height + constants.road.width
      ),
      new TreeField(
        Math.ceil(
          (constants.road.width + canvas.width / 4) / constants.trees.tree_width
        ),
        Math.ceil(
          (canvas.height -
            (constants.center.ypos +
              constants.house.height +
              constants.road.width)) /
            constants.trees.tree_height
        ),
        constants.fence.width,
        canvas.height / 1.3 + constants.fence.width
      ),
    ],
    buildings: [
      new Building(
        constants.house.xpos,
        constants.house.ypos,
        ENUM.HOUSE,
        constants.house.width,
        constants.house.height,
        true,
        ENUM.COLORS.BUILDING,
        ENUM.HOUSE
      ),
      new Building(
        constants.oak.xpos,
        constants.oak.ypos,
        ENUM.OAK,
        constants.house.width,
        constants.house.height,
        true,
        ENUM.COLORS.BUILDING,
        ENUM.HOUSE
      ),
      new Building(
        constants.mart.xpos,
        constants.mart.ypos,
        ENUM.MART,
        constants.house.width,
        constants.house.height,
        true,
        ENUM.COLORS.BUILDING,
        ENUM.MART
      ),
      new Building(
        constants.center.xpos,
        constants.center.ypos,
        ENUM.CENTER,
        constants.house.width,
        constants.house.height,
        true,
        ENUM.COLORS.BUILDING,
        ENUM.CENTER
      ),
    ],
    fences: [
      new Fence(0, 0, canvas.width, constants.fence.width, false, "fence"),
      new Fence(0, 0, constants.fence.width, canvas.height, true, "fence"),
      new Fence(
        0,
        canvas.height - 10,
        canvas.width,
        constants.fence.width,
        false,
        "fence"
      ),
      new Fence(
        canvas.width - 10,
        0,
        constants.fence.width,
        canvas.height,
        true,
        "fence"
      ),
      new Fence(
        constants.fence.width,
        constants.house.ypos + constants.house.height + constants.road.width,
        canvas.width / 4,
        constants.fence.width,
        false,
        "fence"
      ),
      new Fence(
        constants.fence.width + canvas.width / 4 + constants.road.width,
        constants.oak.ypos +
          constants.house.height +
          constants.road.width -
          constants.fence.width,
        canvas.width / 3,
        constants.fence.width,
        false,
        "fence"
      ),
    ],
    pool: [
      new Pool(
        constants.fence.width + 50,
        constants.house.ypos +
          constants.house.height +
          constants.road.width +
          constants.fence.width +
          30,
        canvas.width / 4 - 100,
        canvas.height -
          (canvas.height / 1.3 + constants.fence.width) -
          constants.trees.tree_height
      ),
    ],
  };
}
export function getOakMap() {
  let tablexpos = canvas.width / 2;
  let tableypos = canvas.height / 2 - 200;
  return {
    rectangles: [
      new Rectangle(
        canvas.width / 2 - 250,
        canvas.height / 2 - 250,
        500,
        500,
        "blue",
        ENUM.OAK
      ),
      new Rectangle(
        canvas.width / 2 - 250,
        canvas.height / 2 - 40,
        10,
        80,
        "red",
        "door"
      ),
    ],
    tables: [
      new Table(
        tablexpos,
        tableypos,
        100,
        100,
        200,
        100,
        ENUM.TABLE,
        ENUM.EMPTY_STRING
      ),
    ],
    balls: [
      new Ball(tablexpos + 40, tableypos + 40, 20, "blue"),
      new Ball(tablexpos + 100, tableypos + 40, 20, "yellow"),
      new Ball(tablexpos + 160, tableypos + 40, 20, ENUM.COLORS.BLACK),
    ],
  };
}
export function getCenterMap() {
  let tablexpos = canvas.width / 2 - 100;
  let tableypos = canvas.height / 2 - 200;
  return {
    rectangles: [
      new Rectangle(
        canvas.width / 2 - 250,
        canvas.height / 2 - 250,
        500,
        500,
        "blue",
        ENUM.CENTER
      ),
      new Rectangle(
        canvas.width / 2 - 250,
        canvas.height / 2 - 40,
        10,
        80,
        "red",
        "door"
      ),
    ],
    tables: [
      new Table(
        tablexpos,
        tableypos,
        100,
        100,
        200,
        100,
        ENUM.TABLE,
        "Healing Table"
      ),
    ],
  };
}
export function getBattleMap() {
  return {
    hpbars: [
      new Healthbar(
        isMobileOrTablet() ? canvas.width / 4 : canvas.width / 2 - 250,
        isMobileOrTablet() ? canvas.height / 5 : canvas.height / 2 - 250,
        21,
        35,
        3,
        30,
        50,
        false,
        isMobileOrTablet() ? canvas.width / 3 : 250,
        isMobileOrTablet() ? canvas.height / 5 : 100,
        ""
      ),

      new Healthbar(
        isMobileOrTablet() ? canvas.width / 1.8 : canvas.width / 2 + 75,
        isMobileOrTablet() ? canvas.height / 1.8 : canvas.height / 2 + 50,
        29,
        35,
        5,
        30,
        60,
        true,
        isMobileOrTablet() ? canvas.width / 3 : 250,
        isMobileOrTablet() ? canvas.height / 5 : 100,
        "Bulbasore"
      ),
    ],
    pokemons: [
      new Pokemon(
        isMobileOrTablet() ? canvas.width / 4 : canvas.width / 2 - 250,
        isMobileOrTablet() ? canvas.height / 2.2 : canvas.height / 2 - 70,
        true,
        isMobileOrTablet() ? canvas.width / 6 : 200,
        isMobileOrTablet() ? canvas.height / 6 : 200
      ),
      new Pokemon(
        isMobileOrTablet() ? canvas.width / 1.5 : canvas.width / 2 + 150,
        isMobileOrTablet() ? canvas.height / 5 : canvas.height / 2 - 200,
        false,
        isMobileOrTablet() ? canvas.width / 6 : 200,
        isMobileOrTablet() ? canvas.height / 6 : 200
      ),
    ],
  };
}
export function getMartMap() {
  return {
    rectangles: [
      new Rectangle(
        canvas.width / 2 - 250,
        canvas.height / 2 - 250,
        500,
        500,
        ENUM.COLORS.HOUSE,
        ENUM.MART
      ),
      new Rectangle(
        canvas.width / 2 - 250,
        canvas.height / 2 - 40,
        10,
        80,
        "red",
        "door"
      ),
    ],
  };
}
export function getHouseMap() {
  return {
    rectangles: [
      new Rectangle(
        canvas.width / 2 - 250,
        canvas.height / 2 - 250,
        500,
        500,
        ENUM.COLORS.HOUSE,
        ENUM.HOUSE
      ),
      new Rectangle(
        canvas.width / 2 - 250,
        canvas.height / 2 - 40,
        10,
        80,
        "red",
        "door"
      ),
    ],
  };
}
