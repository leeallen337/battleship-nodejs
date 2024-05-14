const Battleship = require("../battleship.js");

class GameController {
  static positions = [];

  static InitializeShips() {
    var colors = require("cli-color");
    const Ship = require("./ship.js");
    var ships = [
      new Ship("Aircraft Carrier", 5, colors.CadetBlue),
      new Ship("Battleship", 4, colors.Red),
      new Ship("Submarine", 3, colors.Chartreuse),
      new Ship("Destroyer", 3, colors.Yellow),
      new Ship("Patrol Boat", 2, colors.Orange),
    ];
    return ships;
  }

  static getUsedPositions() {
    return this.positions;
  }

  static addPosition(shot) {
    this.positions.push(shot);
  }

  static CheckIsHit(ships, shot, isMe) {
    if (shot == undefined) throw "The shooting position is not defined";
    if (ships == undefined) throw "No ships defined";
    var returnvalue = false;
    ships.forEach(function (ship) {
      ship.positions.forEach((position) => {
        if (position.row == shot.row && position.column == shot.column) {
          ship.addHit(`${shot.column}${shot.row}`);
          returnvalue = true;
        }
      });
    });

    if (isMe) {
      this.addPosition(shot);
    }

    return returnvalue;
  }

  static CheckIsFleetSunk(ships) {
    if (ships == undefined) throw "No ships defined";
    var remainingShips = ships.filter((ship) => !ship.isSunk());
    return remainingShips.length === 0;
  }

  static isShipValid(ship) {
    return ship.positions.length == ship.size;
  }
}

module.exports = GameController;
