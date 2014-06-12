var EventHandlerManager = (function () {
    function openCell(e) {
        if (ms.isGameOver || ms.isGameWon) {
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

            if (!PlayfieldManager.isFirstClicked) {
                ms.playfield = PlayfieldManager.initialize(ms.settings.rows,
                    ms.settings.cols,
                    ms.settings.mines,
                    rowPos, colPos);
                PlayfieldManager.isFirstClicked = true;
            }

            if (!ms.playfield[rowPos][colPos].isFlagged &&
                ms.playfield[rowPos][colPos].hasMine) {
                ms.gameover();

            } else if (!ms.playfield[rowPos][colPos].isFlagged) {
                // click on the cell, if the cell is empty, open all the empty cells around it
                clickCell(rowPos, colPos);
            }

            ms.drawPlayfield();
        }
    }

    function putFlag(e) {
        if (ms.isGameOver || ms.isGameWon) {
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
                if (ms.playfield[rowPos][colPos].isFlagged) {
                    unflagCell(rowPos, colPos);

                } else if (!ms.playfield[rowPos][colPos].isFlagged &&
                    ms.flagsLeft > 0) {
                    flagCell(rowPos, colPos);
                }
            }

            if (ms.unrevealedCount === ms.settings.mines && ms.flagsLeft === 0) {
                ms.gameWon();
            }

            ms.drawPlayfield();
        }
    }

    // if clicked on empty cell traverse all neighbour empty cells and open them
    // if clicked on full cell open only the clicked cell
    function clickCell(row, col) {
        // check if the cell we want to reveal is in the playfield
        if (col < 0 || row < 0 ||
            col >= ms.settings.cols || row >= ms.settings.rows) {
            return;
        }

        if (ms.playfield[row][col].isRevealed) {
            return;
        }

        setCellToBeRevealed(row, col);

        if (ms.playfield[row][col].neighbourMinesCount === 0) {
            for (var neighbourRow = row - 1; neighbourRow <= row + 1; neighbourRow++) {
                for (var neighbourCol = col - 1; neighbourCol <= col + 1; neighbourCol++) {
                    if (row != neighbourRow || col != neighbourCol) {
                        clickCell(neighbourRow, neighbourCol);
                    }
                }
            }
        }
    }

    function setCellToBeRevealed(row, col) {
        ms.playfield[row][col].isRevealed = true;
        ms.playfield[row][col].frame = 1;
        ms.unrevealedCount -= 1;

        // if the cell is flagged, un-flag it
        if (ms.playfield[row][col].isFlagged) {
            unflagCell(row, col);
        }
    }

    function flagCell(row, col) {
        ms.playfield[row][col].isFlagged = true;
        ms.flagsLeft -= 1;
    }

    function unflagCell(row, col) {
        ms.playfield[row][col].isFlagged = false;
        ms.flagsLeft += 1;
    }

    return {
        openCell: openCell,
        putFlag: putFlag
    }
}());