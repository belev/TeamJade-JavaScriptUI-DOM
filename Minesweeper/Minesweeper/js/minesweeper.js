(function () {

    var ms = {
        settings: {
            rows: 10,
            cols: 10,
            mines: 1
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

        playfield: [],

        isGameEnded: false,

        unrevealedCount: 0,

        startGame: function () {
            ms.unrevealedCount = ms.settings.cols * ms.settings.rows;

            Game.canvas[0].width = ms.settings.cols * ms.sprites.cell.w;
            Game.canvas[0].height = ms.settings.rows * ms.sprites.cell.h;

            ms.playfield = ms.Playfield.initializeEmpty(ms.settings.rows, ms.settings.cols);

            ms.drawPlayfield();
            ms.eventHandlerSetup();
        },

        eventHandlerSetup: function() {
            Game.canvas.on("click", openCell);
            Game.canvas.on("contextmenu", putFlag);

            // if clicked on empty cell traverse all neighbour empty cells and open them
            // if clicked on full cell open only the clicked cell
            // other way you have clicked a mine and you die

            function clickCell(x, y) {

                if (!isValidCell(x, y, ms.settings.cols, ms.settings.rows)) {
                    return;
                }

                if (ms.playfield[x][y].isRevealed) {
                    return;
                }


                ms.playfield[x][y].isRevealed = true;
                ms.playfield[x][y].frame = 1;
                ms.unrevealedCount -= 1;

                if (ms.playfield[x][y].hasMine) {
                    ms.gameover();
                    return;
                }

                if (ms.unrevealedCount == ms.settings.mines) {
                    ms.gameWon();
                    return;
                }

                if (ms.playfield[x][y].neighbourMinesCount == 0) {

                    for (var neighbourX = x - 1; neighbourX <= x + 1; neighbourX++) {

                        for (var neighbourY = y - 1; neighbourY <= y + 1; neighbourY++) {

                            if (x != neighbourX || y != neighbourY) {
                                clickCell(neighbourX, neighbourY);
                            }
                        }
                    }
                }
            }

            function openCell(e) {
                if (ms.isGameEnded) {
                    return;
                }

                e = e || window.event;
                e.preventDefault();

                var x = e.pageX - Game.canvas[0].offsetLeft,
                    y = e.pageY - Game.canvas[0].offsetTop,
                    colPos = Math.floor(x / ms.sprites.cell.w),
                    rowPos = Math.floor(y / ms.sprites.cell.h);

                if (colPos >= 0 && colPos < ms.settings.cols &&
                        rowPos >= 0 && rowPos < ms.settings.rows) {

                    if (!ms.Playfield.isFirstClicked) {
                        ms.playfield = ms.Playfield.initialize(ms.settings.rows,
                            ms.settings.cols,
                            ms.settings.mines,
                            rowPos, colPos);
                        ms.Playfield.isFirstClicked = true;
                    }

                    if (!ms.playfield[rowPos][colPos].isFlagged && ms.playfield[rowPos][colPos].hasMine) {
                        ms.gameover();
                    } else if (!ms.playfield[rowPos][colPos].isFlagged) {
                        clickCell(rowPos, colPos);
                    }

                    ms.drawPlayfield();

                    console.log(ms.unrevealedCount);
                }
            }

            function putFlag(e) {
                if (ms.isGameEnded) {
                    return;
                }

                e = e || window.event;
                e.preventDefault();

                var x = e.pageX - Game.canvas[0].offsetLeft,
                    y = e.pageY - Game.canvas[0].offsetTop,
                    colPos = Math.floor(x / ms.sprites.cell.w),
                    rowPos = Math.floor(y / ms.sprites.cell.h);

                if (colPos >= 0 && colPos < ms.settings.cols &&
                    rowPos >= 0 && rowPos < ms.settings.rows) {

                    colPos = Math.floor(x / ms.sprites.cell.w);
                    rowPos = Math.floor(y / ms.sprites.cell.h);

                    if (!ms.playfield[rowPos][colPos].isRevealed) {
                        ms.playfield[rowPos][colPos].isFlagged = !ms.playfield[rowPos][colPos].isFlagged;

                        ms.drawPlayfield();
                    }
                }
            }
        },

        gameover: function () {
            console.log('you lost');
            ms.isGameEnded = true;
        },

        gameWon: function () {
            console.log('you won');
            ms.isGameEnded = true;
        },

        drawPlayfield: function() {
            var cX = 0,
                cY = 0;

            for (var i = 0; i < ms.settings.rows; i += 1) {
                cX = 0;
                for (var j = 0; j < ms.settings.cols; j += 1) {
                    cX += ms.sprites.cell.w;

                    if (ms.playfield[i][j].hasMine && ms.isGameEnded) { // if the game is over, draw all the mines
                        ms.playfield[i][j].frame = 1;
                        ms.playfield[i][j].draw(Game.ctx);

                        SpriteSheet.draw(Game.ctx,
                            'mine',
                            ms.playfield[i][j].x,
                            ms.playfield[i][j].y);
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
        },

        Playfield : (function () {
            function initializeEmptyPlayfield(width, height) {

                var cellMatrix = [];

                for (var i = 0; i < width; i++) {
                    var currentRow = [];

                    for (var j = 0; j < height; j++) {
                        var cellCoordinates = new Position(i, j);
                        currentRow.push(new Cell(j * ms.sprites.cell.w, i * ms.sprites.cell.h));
                    }
                    cellMatrix.push(currentRow);
                }

                return cellMatrix;
            }

            function getPossibleMinesPositions(playfieldWidth, playfieldHeight, firstClickedCellX, firstClickedCellY) {
                var posibleMinesCoordinates = [];

                for (var i = 0; i < playfieldWidth; i++) {

                    for (var j = 0; j < playfieldHeight; j++) {

                        if (i != firstClickedCellX || j != firstClickedCellY) {
                            posibleMinesCoordinates.push(new Position(i, j));
                        }
                    }
                }
                return posibleMinesCoordinates;
            }
            // when every mine is placed on random, increases it's neighbours neighbourMinesCount by one
            function neighbourMinesCountIncreaseForAllNeighbours(cellMatrix, x, y, playfieldWidth, playfieldHeight) {
                for (var neighbourX = x - 1; neighbourX <= x + 1; neighbourX++) {

                    for (var neighbourY = y - 1; neighbourY <= y + 1; neighbourY++) {
                        //neighbour must exist i.e. it must be a valid cell in order to increase it's counter
                        if (isValidCell(neighbourX, neighbourY, playfieldWidth, playfieldHeight)) {

                            if (x != neighbourX || y != neighbourY) {
                                cellMatrix[neighbourX][neighbourY].neighbourMinesCount++;
                            }
                        }
                    }
                }
            }

            function initializePlayfield(playfieldWidth, playfieldHeight, numberOfMines, selectedX, selectedY) {
                var playfield = initializeEmptyPlayfield(playfieldWidth, playfieldHeight);

                // get all possible coordinates for mines after the first click on the playfield
                var possibleMinesCoordinatesMatrix = getPossibleMinesPositions(playfieldWidth, playfieldHeight, selectedX, selectedY);

                // place all mines on the playfield
                for (var i = 0; i < numberOfMines; i++) {
                    var mineIndex = getRandomInt(0, possibleMinesCoordinatesMatrix.length - 1);
                    var currentMineX = possibleMinesCoordinatesMatrix[mineIndex].x;
                    var currentMineY = possibleMinesCoordinatesMatrix[mineIndex].y;

                    playfield[currentMineX][currentMineY].hasMine = true;

                    neighbourMinesCountIncreaseForAllNeighbours(playfield, currentMineX, currentMineY, playfieldWidth, playfieldHeight);

                    // remove the used coordinates for mine
                    // so that there has not two mines on one cell
                    possibleMinesCoordinatesMatrix.splice(mineIndex, 1);
                }

                return playfield;
            }

            return {
                initialize: initializePlayfield,
                initializeEmpty: initializeEmptyPlayfield,
                isFirstClicked: false
            }
        }())
    };

    window.addEventListener("load", function () {
        Game.initialize("board", ms.sprites, ms.startGame);
    });

    var Cell = function(x, y) {
        this.setup('cell', {x: x, y: y, hasMine: false, neighbourMinesCount: 0, isRevealed: false, isFlagged: false});
    };

    Cell.prototype = new Sprite();
}());

/********************** Logic part to be integrated *****************/

var matrix = [];
var width;
var height;
var gameState = '';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Position(x, y) {
    return {
        x: x,
        y: y
    }
}

//Looks if the neighbour cell we want to check is in the play field
function isValidCell(x, y, playfieldWidth, playfieldHeight) {
    if (x < 0 || y < 0 || x >= playfieldWidth || y >= playfieldHeight) {
        return false;
    }
    return true;
}

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