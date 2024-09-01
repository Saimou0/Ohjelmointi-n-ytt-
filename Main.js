import { objectManagement } from './animationTools.js';
import { projection } from './cubeTools.js';

//! DO NEXT
//TODO: Make the end state of each animation part and link it to the back button.

let areaCanvas = document.getElementById('areaCanvas');
let areaCanvasCtx = areaCanvas.getContext('2d');
areaCanvas.width = 900;
areaCanvas.height = 900;

const objectManager = new objectManagement(areaCanvasCtx, areaCanvas);
let projector = new projection(areaCanvasCtx, areaCanvas);

let squareSize = 70;

let startX = (areaCanvas.width - squareSize * 10) / 2;
let startY = (areaCanvas.height - squareSize * 10) / 2;

let canvasSquareWidth = areaCanvas.width - squareSize;
let canvasSquareHeight = areaCanvas.height - squareSize;

let unitSquare = objectManager.createObject((canvasSquareWidth) / 2, (canvasSquareHeight) / 2, squareSize, 'rgb(255, 0, 0)', true);
let unitCentimeter = objectManager.createObject(startX + 0 * squareSize, startY + 0 * squareSize, squareSize - 1, 'rgb(255, 0, 0)', true);
let bracketObject = objectManager.createBracket((canvasSquareWidth) / 2 - 10, (canvasSquareHeight) / 2, squareSize);

const cubeVertices = [
    {x: -1, y: -1, z: -1}, // Vertex 0
    {x: 1, y: -1, z: -1},  // Vertex 1
    {x: 1, y: 1, z: -1},   // Vertex 2
    {x: -1, y: 1, z: -1},  // Vertex 3
    {x: -1, y: -1, z: 1},  // Vertex 4
    {x: 1, y: -1, z: 1},   // Vertex 5
    {x: 1, y: 1, z: 1},    // Vertex 6
    {x: -1, y: 1, z: 1}    // Vertex 7
];

const cubeVertices2 = [
    {x: -0.95, y: -0.95, z: -0.95}, // Vertex 0
    {x: 0.95, y: -0.95, z: -0.95},  // Vertex 1
    {x: 0.95, y: 0.95, z: -0.95},   // Vertex 2
    {x: -0.95, y: 0.95, z: -0.95},  // Vertex 3

    {x: -0.95, y: -0.95, z: 0.95},  // Vertex 4 back top left when viewed from the front
    {x: 0.95, y: -0.95, z: 0.95},   // Vertex 5 back top right when viewed from the front
    {x: 0.95, y: 0.95, z: 0.95},    // Vertex 6 back bottom left when viewed from the front
    {x: -0.95, y: 0.95, z: 0.95}    // Vertex 7 back bottom right when viewed from the front
];

const cubeEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // Front face
    [4, 5], [5, 6], [6, 7], [7, 4], // Back face
    [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
];

const changeLocationVertices1 = [
    {x: -5.2, y: -5.2, z: -5.2}, // Vertex 0
    {x: -4.2, y: -5.2, z: -5.2}, // Vertex 1
    {x: -4.2, y: -4.2, z: -5.2}, // Vertex 2
    {x: -5.2, y: -4.2, z: -5.2}, // Vertex 3
    {x: -5.2, y: -5.2, z: -4.2}, // Vertex 4
    {x: -4.2, y: -5.2, z: -4.2}, // Vertex 5
    {x: -4.2, y: -4.2, z: -4.2}, // Vertex 6
    {x: -5.2, y: -4.2, z: -4.2}  // Vertex 7
];

let centimeterCube = projector.createCubeObject(cubeVertices, cubeEdges);
let meterCube = projector.createCubeObject(cubeVertices2, cubeEdges);


window.onload = function() {
    objectManager.drawObject(unitSquare);
    objectManager.drawObject(bracketObject);
    objectManager.updateObject(bracketObject, {x: (canvasSquareWidth) / 2, y: (canvasSquareHeight) / 2 - 10, horizontal: true})
    objectManager.drawObject(bracketObject);

    if ('fonts' in document) {
        document.fonts.load('20px Inter').then(function () {            
            areaCanvasCtx.font = '20px Inter';
            areaCanvasCtx.fillStyle = 'black';
            areaCanvasCtx.fillText('1cm', (canvasSquareWidth) / 2 - 75, (canvasSquareHeight) / 2 + 38);
            areaCanvasCtx.fillText('1cm', (canvasSquareWidth) / 2 + 15, (canvasSquareHeight) / 2 - 40);
        });
    }
}

let numberOfClicks = 5;
let isAnimating = false;
document.addEventListener('DOMContentLoaded', (event) => {
    let forwardButton = document.getElementById('forwardButton');
    let backButton = document.getElementById('backButton');
    let resetButton = document.getElementById('resetButton');

    areaCanvas.addEventListener('click', () => {
        if(!isAnimating && !objectManager.checkAnimationStatus() && !projector.checkAnimationStatus()) {
            isAnimating = true;
            animationIndicatorOn();
            main(numberOfClicks).then(() => {
                numberOfClicks++;
                isAnimating = false;
                animationIndicatorOff();
            });
        }
    });

    forwardButton.addEventListener('click', () => {
        if(!isAnimating && !objectManager.checkAnimationStatus() && !projector.checkAnimationStatus()) {
            isAnimating = true;
            main(numberOfClicks).then(() => {
                numberOfClicks++;
                isAnimating = false;
            });
        }
    });

    backButton.addEventListener('click', () => {
        if(!isAnimating && !objectManager.checkAnimationStatus() && !projector.checkAnimationStatus()) {
            if(numberOfClicks > 0) {
                numberOfClicks--;
                isAnimating = true;
                main(numberOfClicks).then(() => {
                    isAnimating = false;
                });
            }
        }
    });

    resetButton.addEventListener('click', () => {
        if(!isAnimating && !objectManager.checkAnimationStatus() && !projector.checkAnimationStatus()) {
            numberOfClicks = 0;
            isAnimating = true;
            animationEndStates(numberOfClicks).then(() => {
                isAnimating = false;
            });
        }
    });
});

function main(numberOfClicks) {
    return new Promise((resolve) => {
        switch (numberOfClicks) {
            case 0:
                // Starting square and 10cnm grid
                startAnimationSequence([
                    () => objectManager.animate(unitSquare, {x: startX + 0 * squareSize + 1, y: startY + 0 * squareSize + 1.5}, 1000, false),
                    () => new Promise(resolve => setTimeout(resolve, 1050)),
                    () => drawGridScale(),
                    () => objectManager.animateGrid()
                ]).then(resolve);
                break;
            case 1:
                // Expanding square to 10cm and rendering 10cm cube with scale
                startAnimationSequence([
                    () => objectManager.animate(unitSquare, {size: 10 * squareSize, color: 'rgb(0, 150, 255)'}, 1000, true),
                    () => objectManager.removeObject(unitCentimeter),
                    () => new Promise(resolve => setTimeout(resolve, 1200)),
                    () => projector.renderCube(centimeterCube),
                    () => drawGridScale(),
                ]).then(resolve);
                break;
            case 2:
                // Rotating to first show the right side and then the top of the 10cm cube
                startAnimationSequence([
                    // Rotating to show the right side of the cube
                    () => projector.animateCube(centimeterCube, {type: 'rotateX', angle: 0.01} , 1900),
                    () => new Promise(resolve => setTimeout(resolve, 2050)),
                    () => drawGridScale(),
                ]).then(resolve);
                break;
            case 3:
                startAnimationSequence([
                    // Rotating to show the top of the cube
                    () => projector.animateCube(centimeterCube, {type: 'rotateY', angle: 0.0094} , 2000),
                    () => new Promise(resolve => setTimeout(resolve, 2050)),
                    () => drawGridScale(),
                ]).then(resolve);
                break;
            case 4:
                startAnimationSequence([
                    // Resetting to the front face of the cube
                    () => projector.animateCube(centimeterCube, {type: 'rotateX', angle: -0.0095} , 2000),
                    () => new Promise(resolve => setTimeout(resolve, 2100)),
                    
                    // Resetting the cube's vertices to the original position
                    () => projector.updateCube(centimeterCube, {vertices: cubeVertices.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(centimeterCube),
                    () => projector.renderCube(centimeterCube),
                ]).then(resolve);
                break;
            case 5:
                // Increasing the distance between the cube and the camera and changing the cube's location
                startAnimationSequence([
                    () => projector.animateCube(centimeterCube, {type: 'vertices', fov: 1000, viewDistance: 20, vertices: changeLocationVertices1}, 1000),
                ]).then(resolve);
                break;
            case 6:
                startAnimationSequence([
                    // Creating a grid and a copy of the grid
                    () => projector.createCubeGrid(centimeterCube),
                    () => projector.createGridCopy(),
                    () => projector.drawCubeGrid(),

                    () => new Promise(resolve => setTimeout(resolve, 500)),
                    
                    // Rotating the cube grid to show the front, right side and the top
                    () => projector.rotateCubeGrid(0.0046, 1000, "x"),
                    () => new Promise(resolve => setTimeout(resolve, 1500)),
                    () => projector.rotateCubeGrid(-0.0046, 1000, "y"),
                    () => new Promise(resolve => setTimeout(resolve, 1500)),
                ]).then(resolve);
                break;
            case 7:
                startAnimationSequence([
                    // Reset the cube grid rotation
                    () => projector.rotateCubeGrid(0.0046, 1000, "y"),
                    () => new Promise(resolve => setTimeout(resolve, 1500)),
                    () => projector.rotateCubeGrid(-0.0046, 1000, "x"),
                    () => new Promise(resolve => setTimeout(resolve, 1500)),
                    () => projector.decreaseGap(),

                    () => new Promise(resolve => setTimeout(resolve, 500)),

                    // Render meter cube
                    () => projector.fov = 750,
                    () => projector.viewDistance = 3,
                    () => projector.renderCube(meterCube),
                    () => drawMeterScale(),
                ]).then(resolve);
                break;
            case 8:
                startAnimationSequence([
                    () => projector.animateCube(meterCube, {type: 'rotateX', angle: 0.01} , 1900),
                    () => new Promise(resolve => setTimeout(resolve, 2050)),
                    () => drawMeterScale(),
                ]).then(resolve);
                break;
            case 9:
                startAnimationSequence([
                    () => projector.animateCube(meterCube, {type: 'rotateY', angle: 0.0094} , 2000),
                    () => new Promise(resolve => setTimeout(resolve, 2100)),
                    () => drawMeterScale(),
                ]).then(resolve);
                break;
            case 10:
                startAnimationSequence([
                    () => projector.animateCube(meterCube, {type: 'rotateX', angle: -0.0095} , 2000),
                    () => new Promise(resolve => setTimeout(resolve, 2100)),
                    () => projector.updateCube(meterCube, {vertices: cubeVertices2.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                ]).then(resolve);
                break;
        }
    });

}

function animationEndStates() {
    return new Promise((resolve) => {
        switch (numberOfClicks) {
            case 0:
                // Reset button
                startAnimationSequence([
                    () => areaCanvasCtx.clearRect(0, 0, areaCanvas.width, areaCanvas.height),
                    () => objectManager.updateObject(unitSquare, {x: (canvasSquareWidth) / 2, y: (canvasSquareHeight) / 2, color: 'rgb(255, 0, 0)', size: squareSize}, true),
                    () => objectManager.drawSquare(unitSquare),
                    () => objectManager.updateObject(bracketObject, {x: (canvasSquareWidth) / 2, y: (canvasSquareHeight) / 2 - 10, size: squareSize, horizontal: true}),
                    () => objectManager.drawObject(bracketObject),
                    () => objectManager.updateObject(bracketObject, {x: (canvasSquareWidth) / 2 - 10, y: (canvasSquareHeight) / 2, size: squareSize, horizontal: false}),
                    () => objectManager.drawObject(bracketObject),
                    () => areaCanvasCtx.font = '20px Inter',
                    () => areaCanvasCtx.fillStyle = 'black',
                    () => areaCanvasCtx.fillText('1cm', (canvasSquareWidth) / 2 - 75, (canvasSquareHeight) / 2 + 38),
                    () => areaCanvasCtx.fillText('1cm', (canvasSquareWidth) / 2 + 15, (canvasSquareHeight) / 2 - 40),
                    
                    // Reset cube
                    () => projector.fov = 700,
                    () => projector.viewDistance = 3,
                    () => projector.updateCube(centimeterCube, {vertices: cubeVertices.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(centimeterCube),
                    () => projector.gap = 0.15,
                    () => projector.updateCube(meterCube, {vertices: cubeVertices2.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(meterCube),

                ]).then(resolve);
                break;
            case 1:
        }
    });
}

function startAnimationSequence(animations) {
    return animations.reduce((promise, animation) => {
        return promise.then(animation);
    }, Promise.resolve());
}

function drawGridScale() {
    objectManager.updateObject(bracketObject, {x: startX, y: startY - 10, size: 10 * squareSize, horizontal: true})
    objectManager.drawObject(bracketObject);
    objectManager.updateObject(bracketObject, {x: startX - 10, y: startY, size: 10 * squareSize, horizontal: false})
    objectManager.drawObject(bracketObject);

    areaCanvasCtx.fillStyle = `rgba(0, 0, 0)`;
    areaCanvasCtx.font = '20px Inter';

    areaCanvasCtx.fillText('10cm', startX + 11 - (squareSize / 2) + (10 * squareSize / 2), startY - 30);
    areaCanvasCtx.fillText('10cm', startX - 80, startY + (10 * squareSize / 2));
}

function drawMeterScale() {
    objectManager.updateObject(bracketObject, {x: startX, y: startY - 10, size: 10 * squareSize, horizontal: true})
    objectManager.drawObject(bracketObject);
    objectManager.updateObject(bracketObject, {x: startX - 10, y: startY, size: 10 * squareSize, horizontal: false})
    objectManager.drawObject(bracketObject);

    areaCanvasCtx.fillStyle = `rgba(0, 0, 0)`;
    areaCanvasCtx.font = '20px Inter';

    areaCanvasCtx.fillText('1m', startX + 11 - (squareSize / 2) + (10 * squareSize / 2), startY - 30);
    areaCanvasCtx.fillText('1m', startX - 80, startY + (10 * squareSize / 2));
}

function animationIndicatorOn() {
    let indicator = document.getElementById('animationIndicator');
    indicator.style.color = 'green';

    indicator.innerHTML = 'Animoi';
}

function animationIndicatorOff() {
    let indicator = document.getElementById('animationIndicator');
    indicator.style.color = 'red';

    indicator.innerHTML = 'Ei animoi';
}