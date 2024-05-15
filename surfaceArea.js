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

let numberOfClicks = 0;
document.addEventListener('DOMContentLoaded', (event) => {
    areaCanvas.addEventListener('click', () => {
        if(!isAnimating) {
            main(numberOfClicks)
            numberOfClicks++;
        }
    });
});

let unitSquare = createObject((areaCanvas.width - squareSize) / 2, (areaCanvas.height - squareSize) / 2, squareSize, 'red');
// For now the way you initiate the animations
// TODO: Replace with buttons
function main(numberOfClicks) {
    switch (numberOfClicks) {
        case 0: 
            animate(unitSquare, {x: startX + currentCol * squareSize + 0.5, y: startY + currentRow * squareSize + 1}, 1000);
            break;
        case 1:
            animateGrid();
            break;
        case 3:

            break;
    }
}

// Creates an object with x and y coordinates, size and color
function createObject(x, y, size, color) {
    return {x, y, size, color}
}

// Draws the object on the canvas
function drawObject(object) {
    areaCanvasCtx.fillStyle = object.color;
    areaCanvasCtx.fillRect(object.x, object.y, object.size, object.size);
}

// Updates the object with the desired changes
function updateObject(object, changes) {
    Object.assign(object, changes);
}

// Animates the object to smoothly transition to the desired changes
function animate(object, changes, duration) {
    isAnimating = true;
    let startState = Object.assign({}, object);
    let startTime = Date.now();

    function frame() {
        areaCanvasCtx.clearRect(0, 0, areaCanvas.width, areaCanvas.height);
        let elapsedTime = Date.now() - startTime;
        let progress = Math.min(elapsedTime / duration, 1);

        for(let key in changes) {
            let startValue = startState[key];
            let endValue = changes[key];
            object[key] = startValue + (endValue - startValue) * progress;
        }

        drawObject(object);

        if(progress < 1) {
            requestAnimationFrame(frame);
        } else {
            isAnimating = false;
        }
    }

    requestAnimationFrame(frame);
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
        setTimeout(() => requestAnimationFrame(animateGrid), 20);
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
