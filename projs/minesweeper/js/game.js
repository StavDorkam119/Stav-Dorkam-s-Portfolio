'use strict';

var gBoard;
var gGameIsOn;
var gGameTime;
var gClickedMines;
var gPreviousClickedCell;
var gFirstClickCell;
var gDefaultBoardSize;
var gLivesCount;
var gHints;
var gMinesAreSet;

function init(size) {
    gDefaultBoardSize = size;
    gGameIsOn = true
    gClickedMines = [];
    gPreviousClickedCell = null;
    gFirstClickCell = null;
    gLivesCount = 3;
    gMinesAreSet = false;
    gGameTime = { interval: null, isRunning: false, time: 0 };
    gHints = { hintcount: 3, isActive: false, playerWantsHint: false }
    gBoard = buildBoard(size);
    renderBestTimes('.best-scores-board');
    renderBoard(gBoard, '.board-container');
    renderSmiley(SMILEYDEFAULT);
    renderLightBulb(LIGHTBULBOFF);
    renderLivesCount('');
}

function buildBoard(length) {
    var board = [];
    for (var i = 0; i < length; i++) {
        board.push([]);
        for (var j = 0; j < length; j++) {
            var cell = {
                minesAroundMeCount: 0,
                isShown: false,
                isMine: false,
                isFlagged: false,
                location: {
                    i: i,
                    j: j
                }
            }
            board[i].push(cell)
        }
    }
    return board;
}

function startTimer() {
    gGameTime.interval = setInterval(function () {
        gGameTime.time += 0.01
        var elTimer = document.getElementById("timer");
        elTimer.innerHTML = 'Time: ' + parseFloat(gGameTime.time).toFixed(2) + 's'
    }, 10);
}

function openCell(elCell) {
    if (gGameIsOn) {
        if (!gGameTime.isRunning) {
            startTimer();
            gGameTime.isRunning = true;
        }
        var cellLocation = getElementLocation(elCell);
        var cell = gBoard[cellLocation.i][cellLocation.j];
        if (!gFirstClickCell) {
            gFirstClickCell = cell;
            renderCell(cell.location, cell.minesAroundMeCount);
            setMines(gBoard);
            countMinesForEachCell(gBoard);
            exposeNeighbors(cell, gBoard)
        }
        if (cell.isFlagged) return;
        if (cell.isMine) {
            gClickedMines.push(cell);
            renderSmiley(SMILEYDEAD);
            renderCell(cell.location, CLICKEDMINE);
            updateLivesCount();
        }
        else {
            if (gPreviousClickedCell !== cell) {
                gPreviousClickedCell = cell;
                renderCell(cell.location, cell.minesAroundMeCount);
                renderSmiley(SMILEYDEFAULT);
                exposeNeighbors(cell, gBoard);
                checkVictory(gBoard);
            }
        }
    }
}

function markCell(elCell) {
    if (gGameIsOn) {
        if (!gGameTime.isRunning) {
            startTimer();
            gGameTime.isRunning = true;
        }
        var cellLocation = getElementLocation(elCell);
        var cell = gBoard[cellLocation.i][cellLocation.j];
        if (cell.isShown) return;
        if (!cell.isFlagged) {
            cell.isFlagged = true;
            renderCell(cell.location, FLAGGED);
            checkVictory(gBoard);
        }
        else if (cell.isFlagged) {
            cell.isFlagged = false;
            renderCell(cell.location, UNCLICKEDCELL);
            checkVictory(gBoard);
        }
    }
}

function setMines(mat) {
    var mineCount;
    switch (mat.length) {
        case 4:
            mineCount = 2;
            break;
        case 8:
            mineCount = 12;
            break;
        case 12:
            mineCount = 30;
            break;
    }
    while (mineCount > 0) {
        var i = getRandomInt(0, mat.length);
        var j = getRandomInt(0, mat.length);
        var disI = Math.abs(i - gFirstClickCell.location.i);
        var disJ = Math.abs(j - gFirstClickCell.location.j);
        if (mat[i][j].isMine || mat[i][j] === gFirstClickCell || (disI + disJ <= 2)) continue;
        else {
            mat[i][j].isMine = true;
            mineCount--;
        }
    }
    gMinesAreSet = true;
}

function countMinesForEachCell(board) {
    for (var x = 0; x < board.length; x++) {
        for (var y = 0; y < board.length; y++) {
            var cell = board[x][y];
            countMinesAroundMe(board, cell);
        }
    }
}

function countMinesAroundMe(mat, cell) {
    if (cell.isMine) return;
    for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
        for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
            if (i < 0 || i === mat.length || j < 0 || j === mat[i].length) continue;
            if (i === cell.location.i && j === cell.location.j) continue;
            var neighborCell = mat[i][j];
            if (neighborCell.isMine === true) cell.minesAroundMeCount++;
        }
    }
}

function exposeNeighbors(cell, mat) {
    if (cell.minesAroundMeCount === 0 && !cell.isShown) {
        renderCell(cell.location, cell.minesAroundMeCount)
        cell.isShown = true;
        for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
            for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
                if (i < 0 || i >= mat.length || j < 0 || j >= mat.length ||
                    (i === cell.location.i && j === cell.location.j)) continue;
                var neighbor = mat[i][j];
                if (neighbor.minesAroundMeCount === 0 && !neighbor.isShown) {
                    exposeNeighbors(neighbor, mat);
                } else if (neighbor.minesAroundMeCount !== 0 && !neighbor.isShown) {
                    renderCell(neighbor.location, neighbor.minesAroundMeCount);
                    neighbor.isShown = true;
                }
            }
        }
    } else if (cell.minesAroundMeCount !== 0 && !cell.isShown) {
        renderCell(cell.location, cell.minesAroundMeCount);
        cell.isShown = true;
    }
}

function playerWantsHint() {
    if (!gHints.playerWantsHint && gFirstClickCell !== null && gHints.hintcount > 0) {
        gHints.playerWantsHint = true;
        renderLightBulb(LIGHTBULBON);
    } else if (gHints.playerWantsHint) {
        gHints.playerWantsHint = false;
        renderLightBulb(LIGHTBULBOFF);
    }
}

function getHint(elCell) {
    var cellLocation = getElementLocation(elCell);
    var cell = gBoard[cellLocation.i][cellLocation.j];
    if (!cell.isShown && !gHints.isActive && gHints.playerWantsHint &&
        gHints.hintcount > 0 && gGameIsOn) {
        gHints.hintcount--;
        gHints.isActive = true;
        gGameIsOn = false;
        if (cell.isMine) renderCell(cell.location, MINE);
        else renderCell(cell.location, cell.minesAroundMeCount);
        renderNeighborsHint(cell, gBoard);
        setTimeout(flipHintedCellsBack, 3000, gBoard);
        setTimeout(function () {
            gHints.isActive = false;
            gGameIsOn = true;
            gHints.playerWantsHint = false;
            renderLightBulb(LIGHTBULBOFF);
        }, 3000);
    }
}

function gameOver() {
    gGameIsOn = false;
    clearInterval(gGameTime.interval);
}

function checkVictory(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j];
            if (!gMinesAreSet || (!cell.isShown && !cell.isMine)
                || (cell.isMine && !cell.isFlagged) || (!cell.isMine && cell.isFlagged)) return;
        }
    }
    gameOver();
    renderSmiley(SMILEYVICTORY);
    renderLivesCount('Great Job! You Win!');
    updateBestTime(gBoard);
    renderBestTimes('.best-scores-board');
}

function restartGame(size) {
    if (!size) size = gDefaultBoardSize;
    clearInterval(gGameTime.interval);
    document.getElementById("timer").innerHTML = 'Time:0';
    init(size);
}

function updateLivesCount() {
    gLivesCount--;
    renderLivesCount('Bomb Clicked!');
    if (gLivesCount === 0) {
        var elLivesDisplay = document.getElementById('livesleft');
        elLivesDisplay.innerHTML = 'Game Over! You Lose!';
        showMines(gBoard);
        gameOver();
    }
}