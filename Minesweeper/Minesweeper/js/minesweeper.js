//(function ($) {
var ms = {
    settings: {
        rows: 8,
        cols: 8,
        mines: 20
    },

    sprites: {
        '1': { sx: 0, sy: 0, w: 20, h: 20, frames: 1 },
        '2': { sx: 20, sy: 0, w: 20, h: 20, frames: 1 },
        '3': { sx: 40, sy: 0, w: 20, h: 20, frames: 1 },
        '4': { sx: 60, sy: 0, w: 20, h: 20, frames: 1 },
        '5': { sx: 80, sy: 0, w: 20, h: 20, frames: 1 },
        '6': { sx: 100, sy: 0, w: 20, h: 20, frames: 1 },
        '7': { sx: 120, sy: 0, w: 20, h: 20, frames: 1 },
        '8': { sx: 140, sy: 0, w: 20, h: 20, frames: 1 },
        mine: { sx: 160, sy: 0, w: 20, h: 20, frames: 1 },
        cell: { sx: 180, sy: 0, w: 20, h: 20, frames: 2 },
        flag: { sx: 220, sy: 0, w: 20, h: 20, frames: 1 }
    },

    $timer: $("#timerValue"),

    playfield: [],

    isGameOver: false,

    isGameWon: false,

    unrevealedCount: 0,

    flagsLeft: 0,

    startTimer: function () {
        ms.$timer.trigger("start");
    },

    stopTimer: function () {
        ms.$timer.trigger("stop");
    },

    startGame: function () {
        // reset all
        var $rows = parseInt($("#rows").val()) || 8,
            $cols = parseInt($("#cols").val()) || 8,
            $mines = parseInt($("#mines").val()) || 10;

        ms.isGameOver = false;
        ms.isGameWon = false;
        ms.$timer = $("#timerValue").text("0");
        Playfield.isFirstClicked = false;
        ms.settings.rows = $rows > 20 ? 20 : $rows;
        ms.settings.cols = $cols > 20 ? 20 : $cols;
        ms.settings.mines = $mines > $rows * $cols ? $rows * $cols - 2 : $mines;
        ms.unrevealedCount = ms.settings.cols * ms.settings.rows;
        ms.flagsLeft = ms.settings.mines;

        Game.canvas[0].width = ms.settings.cols * ms.sprites.cell.w;
        Game.canvas[0].height = ms.settings.rows * ms.sprites.cell.h;

        ms.playfield = Playfield.initializeEmpty(ms.settings.rows, ms.settings.cols);

        ms.drawPlayfield();
        ms.eventHandlerSetup();
    },

    eventHandlerSetup: function () {
        // first unbind all the previous events (fixing the double right click bug after click the new game button twice)
        Game.canvas.off("click");
        Game.canvas.off("contextmenu");

        // then bind the events
        Game.canvas.on("click", EventHandlerManager.openCell);
        Game.canvas.on("contextmenu", EventHandlerManager.putFlag);
    },

    gameover: function () {
        ms.stopTimer();
        console.log('you lost');
        console.log('you have played ' + ms.$timer.text() + 'ms');
        ms.isGameOver = true;
        //TODO: Do some animation here
    },

    gameWon: function () {
        ms.stopTimer();
        console.log('you won');
        console.log('you have played ' + ms.$timer.text() + 'ms');
        ms.isGameWon = true;
        //TODO: Do some animation here
    },

    drawPlayfield: function () {
        Game.ctx.clearRect(0, 0, Game.canvas[0].width, Game.canvas[0].height);

        var cX = 0,
            cY = 0;

        for (var i = 0; i < ms.settings.rows; i += 1) {
            cX = 0;
            for (var j = 0; j < ms.settings.cols; j += 1) {
                cX += ms.sprites.cell.w;

                if (ms.playfield[i][j].hasMine && ms.isGameOver && !ms.isGameWon) { // if the game is over, draw all the mines
                    ms.playfield[i][j].frame = 1;
                    ms.playfield[i][j].draw(Game.ctx);

                    SpriteSheet.draw(Game.ctx,
                        'mine',
                        ms.playfield[i][j].x,
                        ms.playfield[i][j].y);

                    continue;

                } else {
                    ms.playfield[i][j].draw(Game.ctx);
                }

                if (ms.playfield[i][j].isFlagged) {
                    SpriteSheet.draw(Game.ctx,
                        'flag',
                        ms.playfield[i][j].x,
                        ms.playfield[i][j].y);
                }

                if (ms.playfield[i][j].isRevealed &&
                    ms.playfield[i][j].neighbourMinesCount !== 0) {
                    SpriteSheet.draw(Game.ctx,
                        ms.playfield[i][j].neighbourMinesCount,
                        ms.playfield[i][j].x,
                        ms.playfield[i][j].y);
                }
            }
            cY += ms.sprites.cell.h;
        }
    }
};

var Cell = function (x, y) {
    this.setup('cell', {x: x, y: y, hasMine: false, neighbourMinesCount: 0, isRevealed: false, isFlagged: false});
};

Cell.prototype = new Sprite();

// start game button
var startBtn = $("#startBtn");

startBtn.on("click", function () {
    Game.initialize("board", ms.sprites, ms.startGame);
});
//}($));


//var matrix = [];
//var width;
//var height;
//var gameState = '';
//
//
//
//
//var matrix = generateCellMatrix(3, 4);
//var matrix2 = generatePossibleMinesMatrix(3, 4, 2, 2);
//var matrix3 = generateMineMatrix(10, 10, 15, 2, 2);
//var playfieldWidth = 10;
//var playfieldHeight = 10;
//
//var playfield = Playfield.initialize(10, 10, 20, 0, 0);
//consolePrintPlayfield(playfield, playfieldWidth, playfieldHeight);
//
//function consolePrintPlayfield(matrix, width, height) {
//
//    for (var i = 0; i < width; i++) {
//        var line = '';
//        for (var j = 0; j < height; j++) {
//            if (matrix[i][j].hasMine) {
//                line += 'X';
//            }
//            else {
//                line += matrix[i][j].neighbourMinesCount;
//            }
//
//            if (matrix[i][j].isRevealed) {
//                line += 'r';
//            }
//            else {
//                line += '?';
//            }
//            line += ' ';
//        }
//
//        console.log(line);
//    }
//}

//consolePrintPlayfield(matrix3, 10, 10);