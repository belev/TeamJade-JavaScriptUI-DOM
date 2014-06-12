var Playfield = (function () {
    function initializeEmptyPlayfield(width, height) {
        var cellMatrix = [],
            newCell;

        for (var i = 0; i < width; i++) {
            cellMatrix[i] = [];

            for (var j = 0; j < height; j++) {
                newCell = new Cell(j * ms.sprites.cell.w, i * ms.sprites.cell.h);
                cellMatrix[i][j] = newCell;
            }
        }

        return cellMatrix;
    }

    function getPossibleMinesPositions(playfieldWidth, playfieldHeight, firstClickedCellX, firstClickedCellY) {
        var possibleMinesCoordinates = [];

        for (var i = 0; i < playfieldWidth; i++) {
            for (var j = 0; j < playfieldHeight; j++) {
                if (i != firstClickedCellX || j != firstClickedCellY) {
                    possibleMinesCoordinates.push(new Position(i, j));
                }
            }
        }

        return possibleMinesCoordinates;
    }

    // when every mine is placed on random, increases it's neighbours neighbourMinesCount by one
    function neighbourMinesCountIncreaseForAllNeighbours(cellMatrix, x, y) {
        for (var neighbourX = x - 1; neighbourX <= x + 1; neighbourX += 1) {
            for (var neighbourY = y - 1; neighbourY <= y + 1; neighbourY += 1) {
                //neighbour must exist i.e. it must be a valid cell in order to increase it's counter
                if (neighbourX >= 0 && neighbourY >= 0 &&
                    neighbourX < ms.settings.cols && neighbourY < ms.settings.rows) {
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

        ms.startTimer();

        return playfield;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function Position(x, y) {
        return {
            x: x,
            y: y
        }
    }

    return {
        initialize: initializePlayfield,
        initializeEmpty: initializeEmptyPlayfield,
        isFirstClicked: false
    }
}());