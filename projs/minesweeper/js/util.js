'use strict';
const UNCLICKEDCELL = '<img src="./img/unclickedcell.png"/>';
const ANTICIPATEDCELL = '<img src="./img/anticipatedcell.png"/>';
const ANTICIPATEDSMILEY = '<img src="./img/anticipatedsmiley.png"/>';
const FLAGGED = '<img src="./img/flagcell.png"/>';
const CLICKEDMINE = '<img src="./img/clickedmine.png"/>';
const MINE = '<img src="./img/mine.png"/>';
const SMILEYDEFAULT = '<img src="./img/smileydefault.png"/>';
const SMILEYDEAD = '<img src="./img/smileydead.png"/>';
const SMILEYVICTORY = '<img src="./img/smileyvictory.png"/>';
const LIGHTBULBON = '<img src="./img/lightbulbon.png"/>';
const LIGHTBULBOFF = '<img src="./img/lightbulboff.png"/>';


function renderBoard(mat, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            strHTML += `<td class="cell" id="${i},${j}" onmousedown ="getHint(this)" 
            onclick="openCell(this)" 
            oncontextmenu="markCell(this);return false;">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
    for (var x = 0; x < mat.length; x++) {
        for (var y = 0; y < mat[x].length; y++) {
            var cell = mat[x][y]
            renderCell(cell.location, UNCLICKEDCELL);
        }
    }
}

function renderBestTimes(selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < 5; i++){
        strHTML += '<tr>';
        switch (i) {
            case 0:
            strHTML += '<th style="font-size:2em" colspan="3">Best Times</th>';
            break;
            case 1:
            strHTML += `<th class="italics">Difficulty</th>
            <th class="italics">Player</th>
            <th class="italics">Time</th>`;
            break;
            case 2:
            var player = localStorage.getItem('bestTimeEasyUsername');
            var time = localStorage.getItem('bestTimeEasy');
            strHTML += `<td>Easy</td><td>${player}</td><td>${time + 's'}`;
            break;
            case 3:
            var player = localStorage.getItem('bestTimeMediumUsername');
            var time = localStorage.getItem('bestTimeMedium');
            strHTML += `<td>Medium</td><td>${player}</td><td>${time + 's'}`;
            break;
            case 4:
            var player = localStorage.getItem('bestTimeHardUsername');
            var time = localStorage.getItem('bestTimeHard');
            strHTML += `<td>Hard</td><td>${player}</td><td>${time + 's'}`;
            break;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
    var elCell = document.getElementById(`${location.i},${location.j}`);
    var numberColor = gBoard[location.i][location.j].minesAroundMeCount
    switch (numberColor) {
        case 0:
            { elCell.style.color = "blue"; }
            break;
        case 1:
            { elCell.style.color = "red"; }
            break;
        case 2:
            { elCell.style.color = "green"; }
            break;
        case 3:
            { elCell.style.color = "yellow"; }
            break;
        case 4:
            { elCell.style.color = "purple"; }
            break;
        case 5:
            { elCell.style.color = "pink"; }
            break;
        case 6:
            { elCell.style.color = "gold"; }
            break;
        case 7:
            { elCell.style.color = "salmon"; }
            break;
        case 8:
            { elCell.style.color = "orange"; }
            break;
    }
    elCell.innerHTML = value;
}

function renderLivesCount(string) {
    var elLivesDisplay = document.getElementById('livesleft');
    elLivesDisplay.innerHTML = `${string} Lives left: ${gLivesCount}`;
}

function renderSmiley(value) {
    var elImage = document.querySelector('.smiley');
    elImage.innerHTML = value;
}

function renderLightBulb(value) {
    var elImage = document.querySelector('.lightbulbimg');
    elImage.innerHTML = value;
    var elText = document.querySelector('.hintcountdisplay');
    elText.innerHTML = `Hints Left: ${gHints.hintcount}`
}

function renderNeighborsHint(cell, mat) {
    var neighbors = [];
    for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
        for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
            if (i < 0 || i >= mat.length || j < 0 || j >= mat.length ||
                (i === cell.location.i && j === cell.location.j)) continue;
            var neighbor = mat[i][j];
            if (!neighbor.isShown) neighbors.push(neighbor);
        }
    }
    for (var x = 0; x < neighbors.length; x++) {
        if (!neighbors[x].isMine) {
            renderCell(neighbors[x].location, neighbors[x].minesAroundMeCount);
        } else if (neighbors[x].isMine) {
            renderCell(neighbors[x].location, MINE);
        }
    }
}

function showMines(mat) {
    var lastMineIdx = gClickedMines.length - 1;
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat.length; j++) {
            var cell = mat[i][j]
            for (var x = 0; x < gClickedMines.length; x++) {
                if (cell.isMine && cell !== gClickedMines[lastMineIdx]) {
                    renderCell(cell.location, MINE);
                }
                else if (cell.isMine && cell === gClickedMines[lastMineIdx]) {
                    renderCell(cell.location, CLICKEDMINE);
                }
            }
        }
    }
}

function getElementLocation(elCell) {
    var getLocation = elCell.id
    getLocation = getLocation.split(',');
    var cellLocation = {
        i: +getLocation[0],
        j: +getLocation[1]
    }
    return cellLocation;
}

function flipHintedCellsBack(mat) {
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat.length; j++) {
            var cell = mat[i][j];
            if (!cell.isShown && !cell.isFlagged) renderCell(cell.location, UNCLICKEDCELL);
            else if (!cell.isShown && cell.isFlagged) renderCell(cell.location, FLAGGED);
        }
    }
}

function updateBestTime(mat) {
    if (mat.length === 4) {
        if (+localStorage.bestTimeEasy > gGameTime.time || !localStorage.bestTimeEasy) {
            var usernameInput = prompt('Congratulations on the new best time!' + 
            ' Write the username you want to be displayed by.');
            localStorage.setItem('bestTimeEasyUsername', usernameInput);
            localStorage.setItem("bestTimeEasy", parseFloat(gGameTime.time).toFixed(2));
        }
    }
    else if (mat.length === 8) {
        if (+localStorage.bestTimeMedium > gGameTime.time|| !localStorage.bestTimeMedium) {
            var usernameInput = prompt('Congratulations on the new best time!' + 
            ' Write the username you want to be displayed by.');
            localStorage.setItem('bestTimeMediumUsername', usernameInput);
            localStorage.setItem("bestTimeMedium", parseFloat(gGameTime.time).toFixed(2));
        }
    }
    else if (mat.length === 12) {
        if (+localStorage.bestTimeHard > gGameTime.time || !localStorage.bestTimeHard) {
            var usernameInput = prompt('Congratulations on the new best time!' + 
            ' Write the username you want to be displayed by.');
            localStorage.setItem('bestTimeHardUsername', usernameInput);
            localStorage.setItem("bestTimeHard", parseFloat(gGameTime.time).toFixed(2));
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}