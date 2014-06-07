//var game = new Game('container', 300, 300);


//game.render();

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

function buildCell(x, y) {
    return {
        x: x,
        y: y,
        hasMine: false,
        neighbourMinesCount: 0,
        isRevealed: false
    }
}

function buildCoordinates(x, y) {
    return {
        x: x,
        y: y
    }
}

function generateCellMatrix(width, height) {
    var cellMatrix = [];

    for (var i = 0; i < width; i++) {
        var currentRow = [];

        for (var j = 0; j < height; j++) {
            currentRow.push(new buildCell(i, j));
        }
        cellMatrix.push(currentRow);
    }

    return cellMatrix;
}

function generatePossibleMinesMatrix(width, height, selectedX, selectedY) {
    var posibleMinesCoordinates = [];

    for (var i = 0; i < width; i++) {

        for (var j = 0; j < height; j++) {

            if (i != selectedX || j != selectedY) {
                posibleMinesCoordinates.push(new buildCoordinates(i, j));
            }
        }
    }

    return posibleMinesCoordinates;
}

function isValidCell(x, y, width, height) {
    if (x < 0 || y < 0 || x >= width || y >= height) {
        return false;
    }
    return true;
}

function cellHasMine(x, y, width, height) {

    if (!isValidCell(x, y, width, height)) {
        return false;
    }
}

function neighbourMinesCountIncreaseForAllNeighbours(cellMatrix, x, y, width, height) {
    for (var neighbourX = x - 1; neighbourX <= x + 1; neighbourX++) {

        for (var neighbourY = y - 1; neighbourY <= y + 1; neighbourY++) {

            if (isValidCell(neighbourX, neighbourY, width, height)) {

                if (x != neighbourX || y != neighbourY) {
                    cellMatrix[neighbourX][neighbourY].neighbourMinesCount++;
                }
            }

        }

    }
}

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

function generateMineMatrix(width, height, numberOfMines, selectedX, selectedY) {
    var cellMatrix = generateCellMatrix(width, height);
    var possibleMinesCordinatesMatrix = generatePossibleMinesMatrix(width, height, selectedX, selectedY);

    for (var i = 0; i < numberOfMines; i++) {
        var mineIndex = getRandomInt(0, possibleMinesCordinatesMatrix.length - 1);
        var currentMineX = possibleMinesCordinatesMatrix[mineIndex].x;
        var currentMineY = possibleMinesCordinatesMatrix[mineIndex].y;

        cellMatrix[currentMineX][currentMineY].hasMine = true;

        neighbourMinesCountIncreaseForAllNeighbours(cellMatrix, currentMineX, currentMineY, width, height);

        possibleMinesCordinatesMatrix.splice(mineIndex, 1);
    }

    return cellMatrix;
}

var matrix = generateCellMatrix(3, 4);
var matrix2 = generatePossibleMinesMatrix(3, 4, 2, 2);
var matrix3 = generateMineMatrix(10, 10, 15, 2, 2);

function consolePrintMatrix(matrix, width, height) {

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

consolePrintMatrix(matrix3, 10, 10);