const Battleship = require("../battleship.js");
const Position = require("./position.js");
const letters = require("./letters.js");

class GameController {
  static userPositions = [];
  static computerPositions = [];

  static InitializeShips() {
    var colors = require("cli-color");
    const Ship = require("./ship.js");
    var ships = [
      new Ship("Aircraft Carrier", 5, colors.blue),
      new Ship("Battleship", 4, colors.red),
      new Ship("Submarine", 3, colors.green),
      new Ship("Destroyer", 3, colors.yellow),
      new Ship("Patrol Boat", 2, colors.cyan),
    ];
    return ships;
  }

  static getUserGuessedPositions() {
    return this.userPositions;
  }

  static addUserPosition(shot) {
    if (shot) {
      this.userPositions.push(shot);
    }
  }

  static addComputerPosition(shot) {
    this.computerPositions.push(shot.toString());
  }

  static populateShipPositions(ship, position, direction) {
    const shipSize = ship.size;

    let column = position.column.value;
    let row = position.row;

    for (var i = 0; i < shipSize; i++) {
      if (direction === 'w') {
        column--;
      } else if (direction === 'a') {
        row--;
      } else if (direction === 's') {
        column++;
      } else if (direction === 'd') {
        row++
      }
      ship.addPosition(new Position(letters.get(column), row));
    };

    let shipPosition = [];
    ship.positions.forEach(function (position) {
      shipPosition.push(position.toString());
    })

    console.log(`${ship.name} positions are: ${shipPosition}`);
  }

  static CheckIsHit(ships, shot, isMe) {
    if (shot == undefined) {
      throw "The shooting position is not defined";
    }

    if (ships == undefined) {
      throw "No ships defined";
    }

    var returnvalue = false;
    ships.forEach(function (ship) {
      ship.positions.forEach((position) => {
        if (position && shot && position.row == shot.row && position.column == shot.column) {
          ship.addHit(`${shot.column}${shot.row}`);

          returnvalue = true;
        }
      });
    });

    if (isMe) {
      this.addUserPosition(shot);
    } else {
      this.addComputerPosition(shot);
    }

    return returnvalue;
  }

  static CheckIsFleetSunk(ships) {
    if (ships == undefined) throw "No ships defined";
    var sunkenShips = this.GetSunkenShips(ships);
    return sunkenShips.length === ships.length;
  }

  static GetSunkenShips(ships) {
    if (ships == undefined) throw "No ships defined";
    return ships.filter(ship => ship.isSunk());
  }

  static isShipValid(ship) {
    return ship.positions.length == ship.size;
  }
}

module.exports = GameController;
