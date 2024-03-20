const board = document.querySelector(".board");
var xSize = Number(document.querySelector(".xSize").value);
var ySize = Number(document.querySelector(".ySize").value);
var mineSize = Number(document.querySelector(".mineSize").value);
var mineCoordinates = [];
var directions = [];

function init() {
    const applyBtn = document.querySelector(".apply-btn");
    applyBtn.addEventListener("click", applyBoard)
    applyBoard();
}

function applyBoard() {
    xSize = Number(document.querySelector(".xSize").value);
    ySize = Number(document.querySelector(".ySize").value);
    mineSize = Number(document.querySelector(".mineSize").value);
    drawBoard(xSize, ySize);
    setMines(mineSize);
    addEventAllBlocks();
    setDirections(xSize);
}

function drawBoard(x, y) {
    var columns = ""
    for (let index = 0; index < x; index++) {
        columns += `<td class="${index}"><button></button></td>`;
    }
    var rows = ""
    for (let index = 0; index < y; index++) {
        rows += `<tr class="${index}">${columns}</tr>`;
    }
    board.innerHTML = rows;
}

function setMines(size) {
    const range = [...Array(xSize * ySize).keys()].map(i => i);
    shuffle(range);
    mineCoordinates = range.slice(0, size);
}

function addEventAllBlocks() {
    const btns = board.querySelectorAll("button");
    btns.forEach(btn => {
        btn.addEventListener("click", openBlock);    
    });
}

function openBlock(event) {
    x = Number(event.target.parentElement.className);
    y = Number(event.target.parentElement.parentElement.className);
    open(x, y);
}

function open(x, y) {
    coordinate = y * xSize + x;
    if (isMine(coordinate)) {
        drawPoint(x, y, 1);
        return;
    }
    if (getAroundMineSize(coordinate) != 0) {
        return;
    }
}

function drawPoint(x, y, image) {
    elements = board.getElementsByClassName(`${x}`);
    console.log(Array.from(elements));
    point = Array.from(elements).find(element => element.localName == "td");
    console.log(point);
    point.innerHTML = `<span>${image}</span>`;
}

function getAroundMineSize(coordinate) {
    size = directions.reduce((cnt, direction) => 
        cnt + (isMine(coordinate + direction)), 0
     );
    return size; 
}

function isMine(x, y) {
    coordinate = y * xSize + x;
    return mineCoordinates.includes(coordinate);
}

function isMine(coordinate) {
    return mineCoordinates.includes(coordinate);
}

function setDirections(index) {
    directions = [1, -1, index, -index, 1+index, 1-index, -1+index, -1-index];
}

function shuffle(array) {
    for (let index = array.length - 1; index > 0; index--) {
        const randomPosition = Math.floor(Math.random() * (index + 1));
        const temporary = array[index];
        array[index] = array[randomPosition];
        array[randomPosition] = temporary;
    }
}

init();