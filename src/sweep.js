/**
 * @author: Charanbabu Karnam
 * @description: Minesweeper using vanilla JS and CSS
 */

var grid = document.getElementById("grid");
var gridRows = document.getElementById("rows");
var gridCols = document.getElementById("cols");
var noOfMines = document.getElementById("mines");
var noOfMovesSpan = document.getElementById("moves");
display = document.querySelector('#time');
timer = document.querySelector('.timer');
var fiveMinutes = 60 * 5;
var timeout;
var movesMade = 0;
var testMode = false; //Turn this variable to true to see where the mines are
// generateGrid();

function generateGrid() {
    //generate 10 by 10 grid by default
    timer.style.display = 'block';
    clearTimeout(timeout);
    startTimer(fiveMinutes, display);
    grid.innerHTML = "";
    movesMade = 0;
    noOfMovesSpan.innerHTML = movesMade;
    for (var i = 0; i < parseInt(gridCols.value); i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < parseInt(gridRows.value); j++) {
            cell = row.insertCell(j);
            cell.onclick = function () {
                movesMade++;
                noOfMovesSpan.innerHTML = movesMade;
                clickCell(this);
            };
            var mine = document.createAttribute("data-mine");
            mine.value = "false";
            cell.setAttributeNode(mine);
        }
    }
    addMines();
}

function addMines() {
    //Add mines randomly
    const mines = parseInt(noOfMines.value);
    const rows = parseInt(gridCols.value);
    const cols = parseInt(gridRows.value);
    for (var i = 0; i < mines; i++) {
        var row = Math.floor(Math.random() * rows);
        var col = Math.floor(Math.random() * cols);
        var cell = grid.rows[row].cells[col];
        cell.setAttribute("data-mine", "true");
        if (testMode) cell.innerHTML = "X";
    }
}

function revealMines() {
    //Highlight all mines in red
    const rows = parseInt(gridCols.value);
    const cols = parseInt(gridRows.value);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = grid.rows[i].cells[j];
            if (cell.getAttribute("data-mine") == "true") cell.className = "mine";
        }
    }
}

function checkLevelCompletion() {
    var levelComplete = true;
    const rows = parseInt(gridCols.value);
    const cols = parseInt(gridRows.value);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if ((grid.rows[i].cells[j].getAttribute("data-mine") == "false")
                && (grid.rows[i].cells[j].innerHTML == "")) levelComplete = false;
        }
    }
    if (levelComplete) {
        alert("You Win!");
        revealMines();
    }
}

function clickCell(cell) {
    //Check if the end-user clicked on a mine
    if (cell.getAttribute("data-mine") == "true") {
        revealMines();
        alert("Game Over");
        setTimeout(() => {
            generateGrid();
        }, 3000);
    } else {
        cell.className = "clicked";
        //Count and display the number of adjacent mines
        var mineCount = 0;
        var cellRow = cell.parentNode.rowIndex;
        var cellCol = cell.cellIndex;
        //alert(cellRow + " " + cellCol);
        for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
            for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                if (grid.rows[i].cells[j].getAttribute("data-mine") == "true") {
                    mineCount++;
                }
            }
        }
        cell.innerHTML = mineCount;
        if (mineCount == 0) {
            //Reveal all adjacent cells as they do not have a mine
            for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
                for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                    //Recursive Call
                    if (grid.rows[i].cells[j].innerHTML == "") {
                        clickCell(grid.rows[i].cells[j]);
                    }
                }
            }
        }
        checkLevelCompletion();
    }
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    timeout = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            alert('Time Exceeded !!, Please Start again')
            timer = duration;
            generateGrid();
        }
    }, 1000);
}