import { objectManagement } from "./animationTools.js";

//! DO NOW
//TODO: 10cm x 10cm square transformation to a solid color square
//TODO: Place the 1cm x 1cm square to the side to show scale and transform the 10cm x 10cm square to a 10cm x 10cm x 10cm cube

//! DO NEXT
//TODO: Make a cube of cubes.
//TODO: Transform the 10cm x 10cm x 10cm cube to a 1m x 1m x 1m cube

//! FINISHING TOUCHES
//TODO: Make buttons to control the animations
//TODO: Make the cubes rotateable
//TODO: Style the page to look better

//! IF TIME
//TODO: Make the cylinder and cone


//* Make unit square expand to fill the grid and change color, while moving unit centimeter to the side

let areaCanvas = document.getElementById('areaCanvas');
let areaCanvasCtx = areaCanvas.getContext('2d');
areaCanvas.width = 900;
areaCanvas.height = 900;

let squareSize = 70;
let numSquares = 10;
let totalSize = numSquares * squareSize;

let currentRow = 0;
let currentCol = 0;

let startX = (areaCanvas.width - totalSize) / 2;
let startY = (areaCanvas.height - totalSize) / 2;

let objectManager = new objectManagement(areaCanvasCtx, areaCanvas);

let unitSquare = objectManager.createObject((areaCanvas.width - squareSize) / 2, (areaCanvas.height - squareSize) / 2, squareSize, 'red', true);
let unitCentimeter = objectManager.createObject(startX + currentCol * squareSize + 0.5, startY + currentRow * squareSize + 1, squareSize, 'red', true);
let bracketObject = objectManager.createBracket((areaCanvas.width - squareSize) / 2 - 10, (areaCanvas.height - squareSize) / 2, squareSize)

let numberOfClicks = 0;
document.addEventListener('DOMContentLoaded', (event) => {
    areaCanvas.addEventListener('click', () => {
        if(!objectManager.checkAnimationStatus()) {
            main(numberOfClicks)
            numberOfClicks++;
        }
    });
});

window.onload = function() {
    objectManager.drawObject(unitSquare);

    // objectManager.drawObject(unitCentimeter);

    objectManager.drawObject(bracketObject);
    objectManager.updateObject(bracketObject, {x: (areaCanvas.width - squareSize) / 2, y: (areaCanvas.height - squareSize) / 2 - 10, horizontal: true})
    objectManager.drawObject(bracketObject);

    if ('fonts' in document) {
        document.fonts.load('20px Inter').then(function () {            
            areaCanvasCtx.font = '20px Inter';
            areaCanvasCtx.fillStyle = 'black';
            areaCanvasCtx.fillText('1cm', (areaCanvas.width - squareSize) / 2 - 75, (areaCanvas.height - squareSize) / 2 + 38);
            areaCanvasCtx.fillText('1cm', (areaCanvas.width - squareSize) / 2 + 15, (areaCanvas.height - squareSize) / 2 - 40);
        });
    }
}

// For now the way you initiate the animations
// TODO: Replace with buttons
function main(numberOfClicks) {
    switch (numberOfClicks) {
        case 0: 
            objectManager.animate(unitSquare, {x: startX + currentCol * squareSize + 0.5, y: startY + currentRow * squareSize + 1}, 1000);
            break;
        case 1:
            animateGrid();
            drawGridScale();
            break;
        case 3:
            objectManager.animate(unitSquare, {size: 10 * squareSize, border: false}, 1000);
            objectManager.animate(unitCentimeter, {x: startX - 100, y: startY}, 1000);

            //* MAKE THESE WORK AT THE SAME TIME

            break;
    }
}

// Draws a square at the given coordinates and at the given size
function drawSquareAt(x, y) {
    areaCanvasCtx.beginPath();
    areaCanvasCtx.rect(startX + x * squareSize + 0.5, startY + y * squareSize + 1, squareSize, squareSize);
    areaCanvasCtx.stroke();
}

// Animates a grid by drawing each square one by one
function animateGrid() {
    if(currentRow >= numSquares) {
        return;
    }
    drawSquareAt(currentCol, currentRow);
    currentCol++;
    if (currentCol >= numSquares) {
        currentCol = 0;
        currentRow++;
    }
    if (currentRow < numSquares) {
        setTimeout(() => requestAnimationFrame(animateGrid), 10);
    }
}

// Instantly draws a grid
function drawGrid() {
    for(let i = 0; i < numSquares; i++) {
        for(let j = 0; j < numSquares; j++) {
            drawSquareAt(i, j);
        }
    }
}

let alpha = 1;

function drawGridScale() {
    alpha = Math.min(alpha + 0.01, 1);

    objectManager.updateObject(bracketObject, {x: startX, y: startY - 10, size: 10 * squareSize})
    objectManager.drawObject(bracketObject);
    objectManager.updateObject(bracketObject, {x: startX - 10, y: startY, size: 10 * squareSize, horizontal: false})
    objectManager.drawObject(bracketObject);
    
    areaCanvasCtx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    areaCanvasCtx.font = '20px Inter';

    areaCanvasCtx.fillText('10cm', startX + 11 - (squareSize / 2) + (10 * squareSize / 2), startY - 30);
    areaCanvasCtx.fillText('10cm', startX - 80, startY + (10 * squareSize / 2));

}
