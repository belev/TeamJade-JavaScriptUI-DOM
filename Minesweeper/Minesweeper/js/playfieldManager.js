var PlayFieldManager = (function () {
    var Cell = function (x, y) {
        this.setup('cell', {
            x: x,
            y: y,
            hasMine: false,
            neighbourMinesCount: 0,
            isRevealed: false,
            isFlagged: false
        });
    };

    Cell.prototype = new Sprite();

    function initializeEmptyPlayField(playFieldRows, playFieldCols) {
        var playField = [],
            newCell;

        for (var row = 0; row < playFieldRows; row += 1) {
            playField[row] = [];

            for (var col = 0; col < playFieldCols; col += 1) {
                newCell = new Cell(col * ms.sprites.cell.w, row * ms.sprites.cell.h);
                playField[row][col] = newCell;
            }
        }

        return playField;
    }

    function getPossibleMinesPositions(playFieldRows, playFieldCols, firstClickedRow, firstClickedCol) {
        var possibleMinesCoordinates = [];

        for (var row = 0; row < playFieldRows; row += 1) {
            for (var col = 0; col < playFieldCols; col += 1) {
                if (row != firstClickedRow || col != firstClickedCol) {
                    possibleMinesCoordinates.push(new Position(row, col));
                }
            }
        }

        return possibleMinesCoordinates;
    }

    function neighbourMinesCountIncreaseForAllNeighbours(playField, currentRow, currentCol, playFieldRows, playFieldCols) {
        for (var neighbourRow = currentRow - 1; neighbourRow <= currentRow + 1; neighbourRow += 1) {
            for (var neighbourCol = currentCol - 1; neighbourCol <= currentCol + 1; neighbourCol += 1) {
                //neighbour must exist i.e. it must be a valid cell in order to increase it's counter
                if (neighbourRow >= 0 && neighbourCol >= 0 &&
                    neighbourRow < playFieldRows && neighbourCol < playFieldCols) {
                    if (currentRow != neighbourRow || currentCol != neighbourCol) {
                        playField[neighbourRow][neighbourCol].neighbourMinesCount += 1;
                    }
                }
            }
        }
    }

    function initializePlayField(playFieldRows, playFieldCols, numberOfMines, selectedRow, selectedCol) {
        var playField = initializeEmptyPlayField(playFieldRows, playFieldCols),
            possibleMinesCoordinatesMatrix = getPossibleMinesPositions(playFieldRows, playFieldCols, selectedRow, selectedCol),
            mineIndex,
            currentMineCol,
            currentMineRow;

        // place all mines on the playfield
        for (var i = 0; i < numberOfMines; i += 1) {
            mineIndex = getRandomInt(0, possibleMinesCoordinatesMatrix.length - 1);
            currentMineRow = possibleMinesCoordinatesMatrix[mineIndex].row;
            currentMineCol = possibleMinesCoordinatesMatrix[mineIndex].col;

            playField[currentMineRow][currentMineCol].hasMine = true;

            neighbourMinesCountIncreaseForAllNeighbours(playField, currentMineRow, currentMineCol, playFieldRows, playFieldCols);

            // remove the used coordinates for mine
            // so that there has not two mines on one cell
            possibleMinesCoordinatesMatrix.splice(mineIndex, 1);
        }

        ms.startTimer();

        return playField;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function Position(row, col) {
        return {
            col: col,
            row: row
        }
    }

    return {
        initialize: initializePlayField,
        initializeEmpty: initializeEmptyPlayField,
        isFirstClicked: false
    }
}());