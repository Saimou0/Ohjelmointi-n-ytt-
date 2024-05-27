import { animation } from "./animation.js";

//! SCHIZO
//TODO: Make all the text and the "arrows" for all the visualizations
//TODO: Make a cube of cubes.
//TODO: Make a 10cm x 10cm x 10cm cube
//TODO: Stop the site from scrolling when rotating the cube and putting the cursor on the bottom or top of the site
//TODO: Plan how the site will look like
//TODO: Zooming to the interactive cube
//TODO: Make "layers" and animate a smooth transitions between them to showcase the surface areas and cubes

let areaCanvas = document.getElementById('areaCanvas');
let areaCanvasCtx = areaCanvas.getContext('2d');
areaCanvas.width = window.innerWidth;
areaCanvas.height = window.innerHeight;

let squareSize = 70;
let numSquares = 10;
let totalSize = numSquares * squareSize;

let startX = (areaCanvas.width - totalSize) / 2;
let startY = (areaCanvas.height - totalSize) / 2;

let isAnimating = false;

let animation1 = new animation(areaCanvasCtx, areaCanvas, isAnimating);

let numberOfClicks = 0;
document.addEventListener('DOMContentLoaded', (event) => {
    areaCanvas.addEventListener('click', () => {
        if(!isAnimating) {
            main(numberOfClicks)
            numberOfClicks++;
        }
    });
});

window.onload = function() {
    animation1.drawObject(unitSquare);
    // drawObject(unitSquare);
    drawBracket(10, 100)
}

let unitSquare = animation1.createObject((areaCanvas.width - squareSize) / 2, (areaCanvas.height - squareSize) / 2, squareSize, 'red', true);
// For now the way you initiate the animations
// TODO: Replace with buttons
function main(numberOfClicks) {
    switch (numberOfClicks) {
        case 0: 
            animation1.animate(unitSquare, {x: startX + currentCol * squareSize + 0.5, y: startY + currentRow * squareSize + 1}, 1000);
            break;
        case 1:
            animateGrid();
            break;
        case 3:

            break;
    }
}

function drawBracket(x, y, size) {
    let bracketSize = 600; // adjust as needed
    areaCanvasCtx.beginPath();
    areaCanvasCtx.moveTo((areaCanvas.width / 2) + x, (areaCanvas.height / 2) + y);
    areaCanvasCtx.lineTo((areaCanvas.width / 2) - x, x);
    // areaCanvasCtx.lineTo((areaCanvas.width / 2) + x, (areaCanvas.height / 2)) + y;
    // areaCanvasCtx.lineTo((areaCanvas.width / 2) - 100, (areaCanvas.height / 2) + y);
    areaCanvasCtx.stroke();
}

// Draws a square at the given coordinates and at the given size
function drawSquareAt(x, y) {
    areaCanvasCtx.beginPath();
    areaCanvasCtx.rect(startX + x * squareSize + 0.5, startY + y * squareSize + 1, squareSize, squareSize);
    areaCanvasCtx.stroke();
}

let currentRow = 0;
let currentCol = 0;
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
