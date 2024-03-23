const board = document.querySelector(".board");
const blockDirections = [ { "x": 1, "y": 0 }, { "x": -1, "y": 0 }, { "x": 0, "y": 1 }, { "x": 0, "y": -1 } ]
const directions = [ { "x": 1, "y": 0 }, { "x": -1, "y": 0 }, { "x": 0, "y": 1 }, { "x": 0, "y": -1 }, { "x": 1, "y": 1 }, { "x": -1, "y": 1 }, { "x": 1, "y": -1 }, { "x": -1, "y": -1 } ];
var xSize = Number(document.querySelector(".xSize").value);
var ySize = Number(document.querySelector(".ySize").value);
var mineSize = Number(document.querySelector(".mineSize").value);
var mineCoordinates = [];

window.oncontextmenu=function() {
    return false;
}

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
        btn.addEventListener("mousedown", divideClick);    
    });
}

function divideClick(event) {
    x = Number(event.target.parentElement.className);
    y = Number(event.target.parentElement.parentElement.className);
    if ((event.button === 2)||(event.which === 3)) {
        drawPoint(x, y, "&#128681");
    } else {
        openBlock(x, y);
    }
}

function openBlock(x, y) {
    coordinate = y * xSize + x;
    if (isMine(x, y)) {
        drawAllMines();
        if (confirm("지뢰입니다! 게임을 다시 시작하시겠습니까?")) {
            applyBoard();
        }
        return;
    }
    image = getAroundMineSize(x, y);
    if (image != 0) {
        drawPoint(x, y, image);
        checkFinish();
        return;
    }
    drawPoint(x, y, "");
    blockDirections.forEach(direction => open(x + direction.x, y + direction.y, []));
    checkFinish();
}

function drawAllMines() {
    mineCoordinates.forEach(coordinate => {
        x = coordinate % xSize;
        y = ~~(coordinate/xSize);
        drawPoint(x, y, "&#128163");
    });
}

function checkFinish() {
    if (false) {
        if (confirm("지뢰를 모두 찾았습니다! 게임을 다시 시작하시겠습니까?")) {
            applyBoard();
        }
    }
}

function open(x, y, coordinates) {
    const coordinate = y * xSize + x;
    if (!isAvailableCoordinate(x, y)) {
        return;
    }
    if (coordinates.includes(coordinate)) {
        return;
    }
    image = getAroundMineSize(x, y);
    if (image != 0) {
        drawPoint(x, y, image);
        return;
    }
    drawPoint(x, y, "");
    coordinates.push(coordinate);
    blockDirections.forEach(direction => open(x + direction.x, y + direction.y, coordinates));
}

function isAvailableCoordinate(x, y) {
    isAvailableX = 0 <= x && x < xSize;
    isAvailableY = 0 <= y && y < ySize;
    return isAvailableX && isAvailableY
}

function drawPoint(x, y, image) {
    tr = board.children[y];
    point = tr.children[x];
    point.innerHTML = `<span>${image}</span>`;
}

function getAroundMineSize(x, y) {
    size = 0
    directions.forEach(direction => {
        afterX = x + direction.x
        afterY = y + direction.y
        if (isMine(afterX, afterY) && isAvailableCoordinate(afterX, afterY)) {
            size++;
        }
    })   
    return size; 
}

function isMine(x, y) {
    const coordinate = y * xSize + x;
    return mineCoordinates.includes(coordinate);
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
