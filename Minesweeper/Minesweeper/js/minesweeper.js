var sprites = {
    cell: { sx: 17, sy: 12, w: 20, h: 25, frames: 2 },
    '1': { sx: 10, sy: 43, w: 20, h: 25, frames: 1 },
    '2': { sx: 32, sy: 43, w: 20, h: 25, frames: 1 },
    '3': { sx: 54, sy: 43, w: 20, h: 25, frames: 1 },
    '4': { sx: 76, sy: 43, w: 20, h: 25, frames: 1 },
    '5': { sx: 98, sy: 43, w: 20, h: 25, frames: 1 },
    '6': { sx: 120, sy: 43, w: 20, h: 25, frames: 1 },
    '7': { sx: 142, sy: 43, w: 20, h: 25, frames: 1 },
    '8': { sx: 164, sy: 43, w: 20, h: 25, frames: 1 },
    'flag': { sx: 12, sy: 70, w: 20, h: 25, frames: 2 },
    'mine': { sx: 12, sy: 98, w: 22, h: 25, frames: 1 }
};

var startGame = function () {
    SpriteSheet.draw(Game.ctx, 'cell', 0, 0, 1);
    SpriteSheet.draw(Game.ctx, 'mine', 0, 0);
};

window.addEventListener("load", function() {
    Game.initialize("board", sprites, startGame);
});


var matrix = [];
var width;
var height;
var gameState = '';


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gameOver() {
    //some more code
}

function Position(x, y) {
    return {
        x: x,
        y: y
    }
}

function Cell(position) {
    return {
        position: position,
        hasMine: false,
        neighbourMinesCount: 0,
        isRevealed: false
    }
}

var Playfield = (function () {
    function initializeEmptyPlayfield(width, height) {
        var cellMatrix = [];

        for (var i = 0; i < width; i++) {
            var currentRow = [];

            for (var j = 0; j < height; j++) {
                var cellCoordinates = new Position(i, j);
                currentRow.push(new Cell(cellCoordinates));
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

    function neighbourMinesCountIncreaseForAllNeighbours(cellMatrix, x, y, playfieldWidth, playfieldHeight) {
        for (var neighbourX = x - 1; neighbourX <= x + 1; neighbourX++) {

            for (var neighbourY = y - 1; neighbourY <= y + 1; neighbourY++) {

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
        initialize: initializePlayfield
    }
}());

function isValidCell(x, y, playfieldWidth, playfieldHeight) {
    if (x < 0 || y < 0 || x >= playfieldWidth || y >= playfieldHeight) {
        return false;
    }
    return true;
}

// if clicked on empty cell traverse all neighbour empty cells and open them
// if clicked on full cell open only the clicked cell
// other way you have clicked a mine and you die
function clickCell(cellMatrix, x, y) {

    if (!isValidCell(x, y, width, height)) {
        return;
    }

    if (cellMatrix[x][y].isRevealed) {
        return;
    }

    cellMatrix[x][y].isRevealed = true;

    if (cellMatrix[x][y].hasMine) {
        gameOver();
        return;
    }
    if (cellMatrix[x][y].neighbourMinesCount == 0) {

        for (var neighbourX = x - 1; neighbourX <= x + 1; neighbourX++) {

            for (var neighbourY = y - 1; neighbourY <= y + 1; neighbourY++) {

                if (x != neighbourX || y != neighbourY) {
                    clickCell(cellMatrix, neighbourX, neighbourY);
                }
            }
        }
    }
}


//var matrix = generateCellMatrix(3, 4);
//var matrix2 = generatePossibleMinesMatrix(3, 4, 2, 2);
//var matrix3 = generateMineMatrix(10, 10, 15, 2, 2);
var playfieldWidth = 10;
var playfieldHeight = 10;

var playfield = Playfield.initialize(10, 10, 20, 0, 0);
consolePrintPlayfield(playfield, playfieldWidth, playfieldHeight);

function consolePrintPlayfield(matrix, width, height) {

    for (var i = 0; i < width; i++) {
        var line = '';
        for (var j = 0; j < height; j++) {
            if (matrix[i][j].hasMine) {
                line += 'X';
            }
            else {
                line += matrix[i][j].neighbourMinesCount;
            }

            if (matrix[i][j].isRevealed) {
                line += 'r';
            }
            else {
                line += '?';
            }
            line += ' ';
        }

        console.log(line);
    }
}

//consolePrintPlayfield(matrix3, 10, 10);