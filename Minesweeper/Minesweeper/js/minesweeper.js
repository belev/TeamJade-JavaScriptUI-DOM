var ms = new function () {

	var DEFAULT_ROWS_COUNT = 8,
		DEFAULT_COLS_COUNT = 8,
		DEFAULT_MINES_COUNT = 10;

    var playField = [],
        EventHandlerUtils = {},
        $timer = $("#timerValue");

    this.isGameOver = false;
    this.isGameWon = false;
    this.unrevealedCount = 0;
    this.flagsLeft = 0;

    this.settings = {
        rows: 8,
        cols: 8,
        mines: 20
    };

    this.sprites = {
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
    };

    this.startTimer = function () {
        $timer.trigger("start");
    };

    this.stopTimer = function () {
        $timer.trigger("stop");
    };

    this.startGame = function () {
        // reset all
        var $rows = parseInt($("#rows").val()) || DEFAULT_ROWS_COUNT,
            $cols = parseInt($("#cols").val()) || DEFAULT_COLS_COUNT,
            $mines = parseInt($("#mines").val()) || DEFAULT_MINES_COUNT;

        $timer = $("#timerValue").text("0");
        PlayfieldManager.isFirstClicked = false;
        ms.isGameOver = false;
        ms.isGameWon = false;
        ms.settings.rows = setRowColInput($rows);
        ms.settings.cols = setRowColInput($cols);
        ms.settings.mines = setMinesInput($mines);
        ms.unrevealedCount = ms.settings.cols * ms.settings.rows;
        ms.flagsLeft = ms.settings.mines;

        Game.canvas[0].width = ms.settings.cols * ms.sprites.cell.w;
        Game.canvas[0].height = ms.settings.rows * ms.sprites.cell.h;

        playField = PlayfieldManager.initializeEmpty(ms.settings.rows, ms.settings.cols);

        eventHandlerSetup();

        drawPlayField();
    };

    this.gameOver = function () {
        ms.stopTimer();

        setTimeout(function () {
            showGameEndScreen("You Lost", "click here to try again");
        }, 800);
    };

    this.gameWon = function () {
        ms.stopTimer();

        setTimeout(function () {
            showGameEndScreen("You Won", "click here to submit your score");
        }, 800);
    };

    function drawPlayField() {
        Game.ctx.clearRect(0, 0, Game.canvas[0].width, Game.canvas[0].height);

        var cX = 0,
            cY = 0;

        for (var i = 0; i < ms.settings.rows; i += 1) {
            cX = 0;
            for (var j = 0; j < ms.settings.cols; j += 1) {
                cX += ms.sprites.cell.w;

                // if the game is over, draw all the mines
                if (playField[i][j].hasMine && ms.isGameOver && !ms.isGameWon) {
                    playField[i][j].frame = 1;
                    playField[i][j].draw(Game.ctx);

                    SpriteSheet.draw(Game.ctx,
                        'mine',
                        playField[i][j].x,
                        playField[i][j].y);

                    continue;

                } else {
                    playField[i][j].draw(Game.ctx);
                }

                if (playField[i][j].isFlagged) {
                    // draw flag
                    SpriteSheet.draw(Game.ctx,
                        'flag',
                        playField[i][j].x,
                        playField[i][j].y);
                }

                if (playField[i][j].isRevealed &&
                    playField[i][j].neighbourMinesCount !== 0) {
                    // draw number of neighbour mines
                    SpriteSheet.draw(Game.ctx,
                        playField[i][j].neighbourMinesCount,
                        playField[i][j].x,
                        playField[i][j].y);
                }
            }
            cY += ms.sprites.cell.h;
        }

        if (ms.isGameOver) {
            ms.gameOver();
        } else if (ms.isGameWon) {
            ms.gameWon();
        }
    }

    function showGameEndScreen(title, description) {
        var step = 20,
            steps = 50;

        Game.canvas[0].width = 300;
        Game.ctx.fillStyle = "black";
        Game.ctx.textAlign = "center";
        Game.ctx.textBaseline = "middle";

        smallTextToBigText();

        function smallTextToBigText() {
            step += 1;

            Game.ctx.clearRect(0, 0, Game.canvas[0].width, Game.canvas[0].height);
            Game.ctx.save();
            Game.ctx.translate(Game.canvas[0].width / 2, Game.canvas[0].height / 2);
            Game.ctx.font = "bold " + step + "px bangers";
            Game.ctx.fillText(title, 0, 0);
            Game.ctx.font = step / 2 + "px bangers";
            Game.ctx.fillText(description, 0, 30);
            Game.ctx.restore();

            if (step < steps) {
                requestAnimationFrame(smallTextToBigText, null);
            } else {
                // bind the canvas to click event again
                Game.canvas.on("click", EventHandlerUtils.openCell);
            }
        }
    }

    function setRowColInput(input) {
        if (input > 20) {
            return 20;
        }

        if (input < 5) {
            return 5;
        }

        return input;
    }

    function setMinesInput(mines) {
        if (mines < 0) {
            return 1;
        }

        if (mines > ms.settings.rows * ms.settings.cols) {
            return ms.settings.rows * ms.settings.cols - 2;
        }

        return mines;
    }

    function eventHandlerSetup() {
        // first unbind all the previous events (fixing the double right click bug after click the new game button twice)
        Game.canvas.off("click");
        Game.canvas.off("contextmenu");

        // then bind the events
        Game.canvas.on("click", EventHandlerUtils.openCell);
        Game.canvas.on("contextmenu", EventHandlerUtils.putFlag);
    }

    // Building event handling utilities
    EventHandlerUtils = (function () {

        function openCell(e) {
            if (ms.isGameOver) {
                // click to restart the game
                ms.startGame();

                return;
            }

            if (ms.isGameWon) {
                // click to enter the submit score screen
                ResultsManager.toSubmitScoreMenu();

                return;
            }

            e = e || window.event;
            e.preventDefault();

            var x = e.pageX - Game.canvas[0].offsetLeft,
                y = e.pageY - Game.canvas[0].offsetTop,
                colPos = Math.floor(x / ms.sprites.cell.w),
                rowPos = Math.floor(y / ms.sprites.cell.h);

            if (isValidCell(rowPos, colPos)) {

                if (!PlayfieldManager.isFirstClicked) {
                    playField = PlayfieldManager.initialize(ms.settings.rows,
                        ms.settings.cols,
                        ms.settings.mines,
                        rowPos, colPos);
                    PlayfieldManager.isFirstClicked = true;
                }

                if (!playField[rowPos][colPos].isFlagged &&
                    playField[rowPos][colPos].hasMine) {
                    // unbind click events so that if the user click a lot of times nothing will happen until the game over screen appears
                    Game.canvas.off("click");
                    ms.isGameOver = true;
                } else if (!playField[rowPos][colPos].isFlagged) {
                    // click on the cell, if the cell is empty, open all the empty cells around it
                    clickCell(rowPos, colPos, true);
                }

                if (ms.unrevealedCount === ms.settings.mines) {
                    // unbind click events so that if the user click a lot of times nothing will happen until the game won screen appears
                    Game.canvas.off("click");
                    ms.isGameWon = true;
                }

                drawPlayField();
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

            if (isValidCell(rowPos, colPos)) {

                colPos = Math.floor(x / ms.sprites.cell.w);
                rowPos = Math.floor(y / ms.sprites.cell.h);

                if (!playField[rowPos][colPos].isRevealed) {
                    if (playField[rowPos][colPos].isFlagged) {
                        unflagCell(rowPos, colPos);

                    } else if (!playField[rowPos][colPos].isFlagged && ms.flagsLeft > 0) {
                        flagCell(rowPos, colPos);
                    }
                }

                drawPlayField();
            }
        }

        function animateCellOpening(movementVector, currentPosition) {
            // working with canvas coordinates:

            if (currentPosition.y > Game.canvas[0].height + ms.sprites.cell.h) {
                return;
            }

            //redraw the field
            drawPlayField();

            //draw a cell on currentPosition.x and currentPosition.y
            SpriteSheet.draw(Game.ctx, 'cell', currentPosition.x, currentPosition.y);

            currentPosition.x += movementVector.x;
            currentPosition.y += movementVector.y;
            movementVector.y += 1;

            requestAnimationFrame(function () {
                animateCellOpening(movementVector, currentPosition);
            }, null);
        }

        // if clicked on empty cell traverse all neighbour empty cells and open them
        // if clicked on full cell open only the clicked cell
        function clickCell(row, col, isAnimated) {
            // check if the cell we want to reveal is in the playfield
            if (!isValidCell(row, col)) {
                return;
            }

            if (playField[row][col].isRevealed) {
                return;
            }

            setCellToBeRevealed(row, col);

            if (isAnimated) {
                var movementVector = {
                        x: Math.random() * 10 - 5,
                        y: -Math.abs(Math.random() * 15)
                    },
                    currentPosition = {
                        x: col * ms.sprites.cell.w,
                        y: row * ms.sprites.cell.h
                    };

                animateCellOpening(movementVector, currentPosition);
            }

            if (playField[row][col].neighbourMinesCount === 0) {
                for (var neighbourRow = row - 1; neighbourRow <= row + 1; neighbourRow += 1) {
                    for (var neighbourCol = col - 1; neighbourCol <= col + 1; neighbourCol += 1) {
                        if (row != neighbourRow || col != neighbourCol) {
                            clickCell(neighbourRow, neighbourCol, false);
                        }
                    }
                }
            }
        }

        function setCellToBeRevealed(row, col) {
            playField[row][col].isRevealed = true;
            playField[row][col].frame = 1;
            ms.unrevealedCount -= 1;

            // if the cell is flagged, un-flag it
            if (playField[row][col].isFlagged) {
                unflagCell(row, col);
            }
        }

        function flagCell(row, col) {
            playField[row][col].isFlagged = true;
            ms.flagsLeft -= 1;
        }

        function unflagCell(row, col) {
            playField[row][col].isFlagged = false;
            ms.flagsLeft += 1;
        }

        function isValidCell(row, col) {
            return (col >= 0 && row >= 0 && col < ms.settings.cols && row < ms.settings.rows);
        }

        return {
            openCell: openCell,
            putFlag: putFlag
        }
    }());
};

$("#startBtn").on("click", function () {
    Game.initialize("board", ms.sprites, ms.startGame);
});