var ms = new function (){

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
        var $rows = parseInt($("#rows").val()) || 8,
            $cols = parseInt($("#cols").val()) || 8,
            $mines = parseInt($("#mines").val()) || 10;

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
            showGameEndScreen("You Lost", "click to try again");
        }, 800);
    };

    this.gameWon = function () {
        ms.stopTimer();

        setTimeout(function () {
            showGameEndScreen("You Won", "click to submit your score");
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
        var endScreenAnimationStep = 0, steps = 30;

        Game.ctx.fillStyle = "black";
        Game.ctx.textAlign = "center";
        Game.ctx.textBaseline = "middle";

        smallTextToBigText();

        function smallTextToBigText() {
            Game.ctx.clearRect(0, 0, Game.canvas[0].width, Game.canvas[0].height);

            endScreenAnimationStep += 1;

            Game.ctx.save();
            Game.ctx.translate(Game.canvas[0].width / 2, Game.canvas[0].height / 2);
            Game.ctx.font = "bold " + endScreenAnimationStep + "px bangers";
            Game.ctx.fillText(title, 0, 0);
            Game.ctx.font = "bold " + endScreenAnimationStep / 2 + "px bangers";
            Game.ctx.fillText(description, 0, 30);
            Game.ctx.restore();

            if (endScreenAnimationStep < steps) {
                requestAnimationFrame(smallTextToBigText, null);
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

            if (colPos >= 0 && colPos < ms.settings.cols &&
                rowPos >= 0 && rowPos < ms.settings.rows) {

                if (!PlayfieldManager.isFirstClicked) {
                    playField = PlayfieldManager.initialize(ms.settings.rows,
                        ms.settings.cols,
                        ms.settings.mines,
                        rowPos, colPos);
                    PlayfieldManager.isFirstClicked = true;
                }

                if (!playField[rowPos][colPos].isFlagged &&
                    playField[rowPos][colPos].hasMine) {
                    ms.isGameOver = true;
                } else if (!playField[rowPos][colPos].isFlagged) {
                    // click on the cell, if the cell is empty, open all the empty cells around it
                    clickCell(rowPos, colPos, true);
                }

                if (ms.unrevealedCount === ms.settings.mines) {
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

            if (colPos >= 0 && colPos < ms.settings.cols &&
                rowPos >= 0 && rowPos < ms.settings.rows) {

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

            if (currentPosition.y > Game.canvas[0].height+ms.sprites.cell.h) {
                return;
            }

            //redraw the field
            drawPlayField();

            //draw a cell on currentPosition.x and currentPosition.y
            SpriteSheet.draw(Game.ctx, 'cell', currentPosition.x, currentPosition.y);

            currentPosition.x += movementVector.x;
            currentPosition.y += movementVector.y;
            movementVector.y++;

            requestAnimationFrame(function () {
                animateCellOpening(movementVector, currentPosition);
            }, null);
        }

        // if clicked on empty cell traverse all neighbour empty cells and open them
        // if clicked on full cell open only the clicked cell
        function clickCell(row, col, isAnimated) {
            // check if the cell we want to reveal is in the playfield
            if (col < 0 || row < 0 ||
                col >= ms.settings.cols || row >= ms.settings.rows) {
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
                for (var neighbourRow = row - 1; neighbourRow <= row + 1; neighbourRow++) {
                    for (var neighbourCol = col - 1; neighbourCol <= col + 1; neighbourCol++) {
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

        return {
            openCell: openCell,
            putFlag: putFlag
        }
    }());
};

$("#startBtn").on("click", function () {
    Game.initialize("board", ms.sprites, ms.startGame);
});