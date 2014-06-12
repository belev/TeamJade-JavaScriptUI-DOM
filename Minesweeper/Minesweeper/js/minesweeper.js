var ms = new function (){

    var playfield = [],
        EventHandlerUtils = {},
        $timer = $("#timerValue");

    this.settings = {
        rows: 8,
        cols: 8,
        mines: 20,
        fps: 1000 / 60
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

    this.isGameOver = false;
    this.isGameWon = false;
    this.unrevealedCount = 0;
    this.flagsLeft = 0;

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

        ms.isGameOver = false;
        ms.isGameWon = false;
        $timer = $("#timerValue").text("0");
        PlayfieldManager.isFirstClicked = false;
        ms.settings.rows = $rows > 20 ? 20 : $rows;
        ms.settings.cols = $cols > 20 ? 20 : $cols;
        ms.settings.mines = $mines > $rows * $cols ? $rows * $cols - 2 : $mines;
        ms.unrevealedCount = ms.settings.cols * ms.settings.rows;
        ms.flagsLeft = ms.settings.mines;

        Game.canvas[0].width = ms.settings.cols * ms.sprites.cell.w;
        Game.canvas[0].height = ms.settings.rows * ms.sprites.cell.h;

        playfield = PlayfieldManager.initializeEmpty(ms.settings.rows, ms.settings.cols);

        eventHandlerSetup();

        setInterval(drawPlayfield, ms.settings.fps);
    };

    this.gameover = function () {
        ms.stopTimer();
        console.log('you lost');
        console.log('you have played ' + $timer.text() + 'ms');
        ms.isGameOver = true;

        // testing scoreboard
        //ms.drawPlayfield();
        //ResultsManager.saveUser();
        //TODO: Do some animation here
    };

    this.gameWon = function () {
        ms.stopTimer();
        console.log('you won');
        console.log('you have played ' + $timer.text() + 'ms');
        ms.isGameWon = true;
        //TODO: Do some animation here
    };

    // Building event handling utils
    EventHandlerUtils = (function () {
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
                    playfield = PlayfieldManager.initialize(ms.settings.rows,
                        ms.settings.cols,
                        ms.settings.mines,
                        rowPos, colPos);
                    PlayfieldManager.isFirstClicked = true;
                }

                if (!playfield[rowPos][colPos].isFlagged &&
                    playfield[rowPos][colPos].hasMine) {
                    ms.gameover();

                } else if (!playfield[rowPos][colPos].isFlagged) {
                    // click on the cell, if the cell is empty, open all the empty cells around it
                    clickCell(rowPos, colPos);
                }
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

                if (!playfield[rowPos][colPos].isRevealed) {
                    if (playfield[rowPos][colPos].isFlagged) {
                        unflagCell(rowPos, colPos);

                    } else if (!playfield[rowPos][colPos].isFlagged &&
                        ms.flagsLeft > 0) {
                        flagCell(rowPos, colPos);
                    }
                }

                if (ms.unrevealedCount === ms.settings.mines && ms.flagsLeft === 0) {
                    ms.gameWon();
                }
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

            if (playfield[row][col].isRevealed) {
                return;
            }

            setCellToBeRevealed(row, col);

            if (playfield[row][col].neighbourMinesCount === 0) {
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
            playfield[row][col].isRevealed = true;
            playfield[row][col].frame = 1;
            ms.unrevealedCount -= 1;

            // if the cell is flagged, un-flag it
            if (playfield[row][col].isFlagged) {
                unflagCell(row, col);
            }
        }

        function flagCell(row, col) {
            playfield[row][col].isFlagged = true;
            ms.flagsLeft -= 1;
        }

        function unflagCell(row, col) {
            playfield[row][col].isFlagged = false;
            ms.flagsLeft += 1;
        }

        return {
            openCell: openCell,
            putFlag: putFlag
        }
    }());

    function eventHandlerSetup() {
        // first unbind all the previous events (fixing the double right click bug after click the new game button twice)
        Game.canvas.off("click");
        Game.canvas.off("contextmenu");

        // then bind the events
        Game.canvas.on("click", EventHandlerUtils.openCell);
        Game.canvas.on("contextmenu", EventHandlerUtils.putFlag);
    }

    function drawPlayfield() {
        Game.ctx.clearRect(0, 0, Game.canvas[0].width, Game.canvas[0].height);

        var cX = 0,
            cY = 0;

        for (var i = 0; i < ms.settings.rows; i += 1) {
            cX = 0;
            for (var j = 0; j < ms.settings.cols; j += 1) {
                cX += ms.sprites.cell.w;

                if (playfield[i][j].hasMine && ms.isGameOver && !ms.isGameWon) { // if the game is over, draw all the mines
                    playfield[i][j].frame = 1;
                    playfield[i][j].draw(Game.ctx);

                    SpriteSheet.draw(Game.ctx,
                        'mine',
                        playfield[i][j].x,
                        playfield[i][j].y);

                    continue;

                } else {
                    playfield[i][j].draw(Game.ctx);
                }

                if (playfield[i][j].isFlagged) {
                    SpriteSheet.draw(Game.ctx,
                        'flag',
                        playfield[i][j].x,
                        playfield[i][j].y);
                }

                if (playfield[i][j].isRevealed &&
                    playfield[i][j].neighbourMinesCount !== 0) {
                    SpriteSheet.draw(Game.ctx,
                        playfield[i][j].neighbourMinesCount,
                        playfield[i][j].x,
                        playfield[i][j].y);
                }
            }
            cY += ms.sprites.cell.h;
        }
    }
};

$("#startBtn").on("click", function () {
    Game.initialize("board", ms.sprites, ms.startGame);
});