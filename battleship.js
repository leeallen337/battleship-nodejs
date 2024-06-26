const { Worker, isMainThread } = require("worker_threads");
const readline = require("readline-sync");
const gameController = require("./GameController/gameController.js");
const cliColor = require("cli-color");
const beep = require("beepbeep");
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
let telemetryWorker;

const gridSize = 10;
class Battleship {
  start() {
    telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");

    console.log("Starting...");
    telemetryWorker.postMessage({
      eventName: "ApplicationStarted",
      properties: { Technology: "Node.js" },
    });

    console.log(cliColor.xterm(8)("                                     |__"));
    console.log(cliColor.xterm(8)("                                     |\\/"));
    console.log(cliColor.xterm(8)("                                     ---"));
    console.log(
      cliColor.xterm(8)("                                     / | [")
    );
    console.log(
      cliColor.xterm(8)("                              !      | |||")
    );
    console.log(
      cliColor.xterm(8)("                            _/|     _/|-++'")
    );
    console.log(
      cliColor.xterm(8)("                        +  +--|    |--|--|_ |-")
    );
    console.log(
      cliColor.xterm(8)("                     { /|__|  |/\\__|  |--- |||__/")
    );
    console.log(
      cliColor.xterm(8)(
        "                    +---------------___[}-_===_.'____                 /\\"
      )
    );
    console.log(
      cliColor.xterm(8)(
        "                ____`-' ||___-{]_| _[}-  |     |_[___\\==--            \\/   _"
      )
    );
    console.log(
      cliColor.xterm(8)(
        " __..._____--==/___]_|__|_____________________________[___\\==--____,------' .7"
      )
    );
    console.log(
      cliColor.xterm(8)(
        "|                        Welcome to Battleship                         BB-61/"
      )
    );
    console.log(
      cliColor.xterm(8)(
        " \\_________________________________________________________________________|"
      )
    );
    console.log();
    if (process.env.DEBUG === "true") {
      console.log(
        cliColor.yellow("///////////////////////////////////////////////")
      );

      console.log(
        cliColor.yellow("//////////// Running in Debug mode ////////////")
      );

      console.log(
        cliColor.yellow("///////////////////////////////////////////////\n")
      );

      console.log(
        cliColor.yellow("Exit and run `npm run dev` to run in prod mode\n")
      );
    }

    this.InitializeGame();
    this.StartGame();
  }

  StartGame() {
    console.clear();
    console.log("                                         ,:");
    console.log("                                       ,' |");
    console.log("                                      /   :");
    console.log("                                   --'   /");
    console.log("                                   \\/ /:/");
    console.log("                                   / ://_\\");
    console.log("                                __/   /");
    console.log("                                )'-. /");
    console.log("                                ./  :\\");
    console.log("                                 /.' '");
    console.log("                               '/'");
    console.log("                               +");
    console.log("                              '");
    console.log("                            `.");
    console.log("                        .-'-");
    console.log("                       (    |");
    console.log("                    . .-'  '.");
    console.log("                   ( (.   )8:");
    console.log("               .'    / (_  )");
    console.log("                _. :(.   )8P  `");
    console.log("            .  (  `-' (  `.   .");
    console.log("            .  :  (   .a8a)");
    console.log("           /_`( 'a `a. )''");
    console.log("         (  (/  .  ' )=='");
    console.log("        (   (    )  .8'   +");
    console.log("         (`'8a.( _(   (");
    console.log("       ..-. `8P    ) `  )  +");
    console.log("     -'   (      -ab:  )");
    console.log("    '    _  `    (8P'Ya");
    console.log("  _(    (    )b  -`.  ) +");
    console.log(" ( 8)  ( _.aP' _a   \\( \\   *");
    console.log("+  )/    (8P   (88    )  )");
    console.log("    (a:f   '     `'`");
    console.log("'''");

    do {
      console.log("--------------------- Your Turn ------------------------");
      console.log(
        gameController.getUserGuessedPositions().length > 0
          ? `You have guessed ${gameController
              .getUserGuessedPositions()
              .toString()}`
          : ""
      );

      var sunkenShips = gameController.GetSunkenShips(this.enemyFleet);
      if (sunkenShips.length) {
        sunkenShips.forEach((ship) =>
          console.log(ship.color("You sunk: ", ship.name))
        );
      }

      console.log();
      console.log("Player, it's your turn");
      console.log("Enter coordinates for your shot:");

      let isValidPosition = false;
      do {
        var position = Battleship.ParsePosition(readline.question());
        if (position) {
          isValidPosition = true;
        }
      } while (!isValidPosition);

      var isHit;
      try {
        isHit = gameController.CheckIsHit(this.enemyFleet, position, true);
      } catch {
        isHit = false;
      }

      if (position) {
        telemetryWorker.postMessage({
          eventName: "Player_ShootPosition",
          properties: { Position: position.toString(), IsHit: isHit },
        });
      }

      if (isHit) {
        beep();

        console.log(cliColor.cyan("                \\         .  ./"));
        console.log(cliColor.cyan('              \\      .:";\'.:.."   /'));
        console.log(cliColor.cyan("                  (M^^.^~~:.'\")."));
        console.log(cliColor.cyan("            -   (/  .    . . \\ \\)  -"));
        console.log(cliColor.cyan("               ((| :. ~ ^  :. .|))"));
        console.log(cliColor.cyan("            -   (\\- |  \\ /  |  /)  -"));
        console.log(cliColor.cyan("                 -\\  \\     /  /-"));
        console.log(cliColor.cyan("                   \\  \\   /  /"));
      }

      console.log(
        isHit ? cliColor.red("Yeah ! Nice hit !") : cliColor.yellow("Miss")
      );

      console.log(
        "--------------------- Computer's Turn ------------------------"
      );

      var computerGuesses = gameController.computerPositions;
      console.log(
        computerGuesses.length > 0
          ? `Computer has guessed ${computerGuesses.sort()}`
          : ""
      );

      var computerPos = this.GetRandomPosition();
      var isHit = gameController.CheckIsHit(this.myFleet, computerPos, false);

      telemetryWorker.postMessage({
        eventName: "Computer_ShootPosition",
        properties: { Position: computerPos.toString(), IsHit: isHit },
      });

      console.log();
      console.log(
        `Computer shot in ${computerPos.column}${computerPos.row} and ` +
          (isHit
            ? cliColor.red(`has hit your ship !`)
            : cliColor.yellow(`miss`))
      );
      if (isHit) {
        beep();

        console.log(cliColor.cyan("                \\         .  ./"));
        console.log(cliColor.cyan('              \\      .:";\'.:.."   /'));
        console.log(cliColor.cyan("                  (M^^.^~~:.'\")."));
        console.log(cliColor.cyan("            -   (/  .    . . \\ \\)  -"));
        console.log(cliColor.cyan("               ((| :. ~ ^  :. .|))"));
        console.log(cliColor.cyan("            -   (\\- |  \\ /  |  /)  -"));
        console.log(cliColor.cyan("                 -\\  \\     /  /-"));
        console.log(cliColor.cyan("                   \\  \\   /  /"));
      }

      var amIDead = gameController.CheckIsFleetSunk(this.myFleet);
      var isComputerDead = gameController.CheckIsFleetSunk(this.enemyFleet);

      if (amIDead) {
        console.log("  _____                         ____");
        console.log(" / ____|                       / __ \\");
        console.log("| |  __  __ _ _ __ ___   ___  | |  | |_   _____ _ __");
        console.log(
          "| | |_ |/ _` | '_ ` _ \\ / _ \\ | |  | \\ \\ / / _ \\ '__|"
        );
        console.log("| |__| | (_| | | | | | |  __/ | |__| |\\ V /  __/ |");
        console.log(" \\_____|\\__,_|_| |_| |_|\\___|  \\____/  \\_/ \\___|_|");
      }
      if (isComputerDead) {
        console.log("                             # #  ( )");
        console.log("                          ___#_#___|__");
        console.log("                      _  |____________|  _");
        console.log("               _=====| | |            | | |==== _");
        console.log("         =====| |.---------------------------. | |====");
        console.log(
          "<--------------------'   .  .  .  .  .  .  .  .   '--------------/"
        );
        console.log(
          " \\                                                             /"
        );
        console.log(
          "  \\_______________________________________________WWS_________/"
        );
        console.log(
          "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
        );
        console.log(
          "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
        );
        console.log(
          "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww "
        );
        console.log("__          ___");
        console.log("\\ \\        / (_)");
        console.log(" \\ \\  /\\  / / _ _ __  _ __   ___ _ __");
        console.log(
          "  \\ \\/  \\/ / | | '_ \\| '_ \\ / _ \\ '__|         You've Sunk all"
        );
        console.log(
          "   \\  /\\  /  | | | | | | | |  __/ |              Enemy Ships!"
        );
        console.log("    \\/  \\/   |_|_| |_|_| |_|\\___|_|");
      }
    } while (!amIDead && !isComputerDead);
  }

  static CheckPositionIsValid(letter, number) {
    // check if position is valid in the first place
    let validLetter = letters.get(letter) <= gridSize;
    let validNumber = number <= gridSize;

    let validPosition = validLetter && validNumber;

    return validPosition;
  }

  static ParsePosition(input) {
    // make sure the input can be parsed
    try {
      var letter = letters.get(input.toUpperCase().substring(0, 1));
      var number = parseInt(input.substring(1, 3), 10);
    } catch {
      console.log(`The position ${input} is not valid, try again.`);
    }

    if (this.CheckPositionIsValid(letter, number)) {
      return new position(letter, number);
    } else {
      console.log(`The position ${input} is not valid, try again.`);
    }
  }

  GetRandomPosition() {
    var rows = gridSize;
    var lines = gridSize;

    var rndColumn = Math.floor(Math.random() * lines);
    var letter = letters.get(rndColumn + 1);
    var number = Math.floor(Math.random() * rows) + 1;
    var result = new position(letter, number);

    if (gameController.computerPositions.indexOf(result.toString()) !== -1) {
      if (process.env.DEBUG === "true") {
        console.log(
          cliColor.yellowBright(
            `Computer has guessed position ${result} which has already been guessed. Computer is guessing again...`
          )
        );
      }

      return this.GetRandomPosition();
    }

    return result;
  }

  InitializeGame() {
    this.InitializeMyFleet();
    this.InitializeEnemyFleet();
  }

  InitializeMyFleet() {
    this.myFleet = gameController.InitializeShips();

    console.log(
      "Please position your fleet (Game board size is from A to J and 1 to 10) :"
    );

    this.myFleet.forEach(function (ship) {
      console.log();
      console.log(
        `Please enter the position for the ${ship.name} (size: ${ship.size})`
      );

      let position = readline.question();
      let validShipPlacement = true;
      do {
        console.log(
          `Please enter the direction for the ${ship.name} (size: ${ship.size}).`
        );
        console.log("W = up, A = left, S = down, D = right");

        let direction = readline.question();
        const validDirections = ['w', 'a', 's', 'd'];

        if (validDirections.includes(direction.toLowerCase())) {
          const parsedPosition = Battleship.ParsePosition(position);
          gameController.populateShipPositions(ship, parsedPosition, direction);
          break;
        } else {
          console.log("No a valid placement, try again.");
        }
      } while (validShipPlacement);
    });
  }

  InitializeEnemyFleet() {
    this.enemyFleet = gameController.InitializeShips();

    this.enemyFleet[0].addPosition(new position(letters.B, 4));
    this.enemyFleet[0].addPosition(new position(letters.B, 5));
    this.enemyFleet[0].addPosition(new position(letters.B, 6));
    this.enemyFleet[0].addPosition(new position(letters.B, 7));
    this.enemyFleet[0].addPosition(new position(letters.B, 8));

    this.enemyFleet[1].addPosition(new position(letters.E, 6));
    this.enemyFleet[1].addPosition(new position(letters.E, 7));
    this.enemyFleet[1].addPosition(new position(letters.E, 8));
    this.enemyFleet[1].addPosition(new position(letters.E, 9));

    this.enemyFleet[2].addPosition(new position(letters.A, 3));
    this.enemyFleet[2].addPosition(new position(letters.B, 3));
    this.enemyFleet[2].addPosition(new position(letters.C, 3));

    this.enemyFleet[3].addPosition(new position(letters.F, 8));
    this.enemyFleet[3].addPosition(new position(letters.G, 8));
    this.enemyFleet[3].addPosition(new position(letters.H, 8));

    this.enemyFleet[4].addPosition(new position(letters.C, 5));
    this.enemyFleet[4].addPosition(new position(letters.C, 6));
  }
}

module.exports = Battleship;
