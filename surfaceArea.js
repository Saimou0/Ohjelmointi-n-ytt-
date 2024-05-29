import { objectManagement } from "./animationTools.js";
import { projection } from "./cube.js";

//! DO NOW
//TODO: Transform the 10cm x 10cm square to a 10cm x 10cm x 10cm cube

//! DO NEXT
//TODO: Make a cube of cubes.
//TODO: Transform the 10cm x 10cm x 10cm cube to a 1m x 1m x 1m cube

//! FINISHING TOUCHES
//TODO: Make buttons to control the animations
//TODO: Make the cubes rotateable
//TODO: Style the page to look better

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
let projector = new projection(areaCanvasCtx, areaCanvas);

let unitSquare = objectManager.createObject((areaCanvas.width - squareSize) / 2, (areaCanvas.height - squareSize) / 2, squareSize, 'rgb(255, 0, 0)', true);
let unitCentimeter = objectManager.createObject(startX + currentCol * squareSize + 0.5, startY + currentRow * squareSize + 1, squareSize, 'rgb(255, 0, 0)', true);
let bracketObject = objectManager.createBracket((areaCanvas.width - squareSize) / 2 - 10, (areaCanvas.height - squareSize) / 2, squareSize);

const objectList = [unitSquare, unitCentimeter];

objectManager.setObjects(objectList);

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
            objectManager.animateGrid();
            drawGridScale();
            break;
        case 2:
            objectManager.addToTheQueue(unitSquare, {size: 10 * squareSize, color: 'rgb(255, 0, 255)'}, 1000);
            objectManager.addToTheQueue(unitCentimeter, {x: startX - 98, y: startY}, 1000);
            objectManager.animateAll(numberOfClicks);

            setTimeout(() => {
                objectManager.drawObject(unitSquare);
                objectManager.drawObject(unitCentimeter);
            }, 1500);
            break;
        case 3:

            break;
    }
}

function drawGridScale() {
    objectManager.updateObject(bracketObject, {x: startX, y: startY - 10, size: 10 * squareSize})
    objectManager.drawObject(bracketObject);
    objectManager.updateObject(bracketObject, {x: startX - 10, y: startY, size: 10 * squareSize, horizontal: false})
    objectManager.drawObject(bracketObject);
    
    areaCanvasCtx.fillStyle = `rgba(0, 0, 0)`;
    areaCanvasCtx.font = '20px Inter';

    areaCanvasCtx.fillText('10cm', startX + 11 - (squareSize / 2) + (10 * squareSize / 2), startY - 30);
    areaCanvasCtx.fillText('10cm', startX - 80, startY + (10 * squareSize / 2));

}
