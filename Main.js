import { objectManagement } from './animationTools.js';
import { projection } from './cubeTools.js';
import { textManager } from './textManager.js';

//! DO NEXT
//TODO: Make a sign that shows in what part of the animation you are in.
//TODO: Make the site look better and more responsive.

let areaCanvas = document.getElementById('areaCanvas');
let areaCanvasCtx = areaCanvas.getContext('2d');
areaCanvas.width = 900;
areaCanvas.height = 900;

const objectManager = new objectManagement(areaCanvasCtx, areaCanvas);
const projector = new projection(areaCanvasCtx, areaCanvas);
const textManagement = new textManager();

let squareSize = 70;

let startX = (areaCanvas.width - squareSize * 10) / 2;
let startY = (areaCanvas.height - squareSize * 10) / 2;

let canvasSquareWidth = areaCanvas.width - squareSize;
let canvasSquareHeight = areaCanvas.height - squareSize;

let unitSquare = objectManager.createObject((canvasSquareWidth) / 2, (canvasSquareHeight) / 2, squareSize, 'rgb(255, 0, 0)', true);
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

let case2EndState =[];
let case3EndState =[];
let case6EndState =[];
let case8EndState =[];
let case9EndState =[];

let centimeterCube = projector.createCubeObject(cubeVertices, cubeEdges);
let meterCube = projector.createCubeObject(cubeVertices2, cubeEdges);

// Waits for the window to load before drawing the starting state
window.onload = function() {
    objectManager.drawObject(unitSquare);
    objectManager.drawObject(bracketObject);
    objectManager.updateObject(bracketObject, {x: (canvasSquareWidth) / 2, y: (canvasSquareHeight) / 2 - 10, horizontal: true})
    objectManager.drawObject(bracketObject);

    document.getElementById('backButton').disabled = true;

    if ('fonts' in document) {
        document.fonts.load('20px Inter').then(function () {            
            areaCanvasCtx.font = '20px Inter';
            areaCanvasCtx.fillStyle = 'black';
            areaCanvasCtx.fillText('1cm', (canvasSquareWidth) / 2 - 75, (canvasSquareHeight) / 2 + 38);
            areaCanvasCtx.fillText('1cm', (canvasSquareWidth) / 2 + 15, (canvasSquareHeight) / 2 - 40);

            textManagement.setTextToPage(1);
        });
    }
}

let numberOfClicks = 0;
let isAnimating = false;
// Waits for the DOM to load before adding event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    let forwardButton = document.getElementById('forwardButton');
    let backButton = document.getElementById('backButton');
    let resetButton = document.getElementById('resetButton');

    // Canvas click event listener
    areaCanvas.addEventListener('click', () => {
        // Every button checks if there is an animation playing
        if(!isAnimating && !objectManager.checkAnimationStatus() && !projector.checkAnimationStatus() && numberOfClicks < 12) {
            isAnimating = true;
            
            // When advancing the animation all buttons are disabled
            forwardButton.disabled = true;
            backButton.disabled = true;
            resetButton.disabled = true;

            // Main function is called, using a promise to wait for the animation to finish
            main(numberOfClicks).then(() => {
                numberOfClicks++;
                updateSlideIndicator();

                backButton.disabled = false;
                
                forwardButton.disabled = false;
                backButton.disabled = false;
                resetButton.disabled = false;
      
                if(numberOfClicks >= 12) {
                    forwardButton.disabled = true;
                }

                isAnimating = false;
            });
        }
    });

    // Forward button click event listener
    forwardButton.addEventListener('click', () => {
        if(!isAnimating && !objectManager.checkAnimationStatus() && !projector.checkAnimationStatus() && numberOfClicks < 12) {
            isAnimating = true;
            forwardButton.disabled = true;
            backButton.disabled = true;
            resetButton.disabled = true;

            main(numberOfClicks).then(() => {
                numberOfClicks++;
                updateSlideIndicator();

                backButton.disabled = false;

                forwardButton.disabled = false;
                backButton.disabled = false;
                resetButton.disabled = false;

                if(numberOfClicks >= 12) {
                    forwardButton.disabled = true;
                }

                isAnimating = false;
            });
        }
    });

    // Back button click event listener
    backButton.addEventListener('click', () => {
        if(!isAnimating && !objectManager.checkAnimationStatus() && !projector.checkAnimationStatus()) {
            if(numberOfClicks > 0) {
                isAnimating = true;
                numberOfClicks--;
                updateSlideIndicator();
                
                forwardButton.disabled = false;
                if(numberOfClicks <= 0) {
                    backButton.disabled = true;
                }
                
                // AnimationEndStates is called with a promise to wait for the changes to the objects to finish
                animationEndStates(numberOfClicks).then(() => {
                    isAnimating = false;
                });
            }
        }
    });

    // Reset button click event listener
    resetButton.addEventListener('click', () => {
        if(!isAnimating && !objectManager.checkAnimationStatus() && !projector.checkAnimationStatus()) {
            numberOfClicks = 0;
            updateSlideIndicator();
            backButton.disabled = true;
            forwardButton.disabled = false;
            
            isAnimating = true;
            
            animationEndStates(numberOfClicks).then(() => {
                isAnimating = false;
            });
        }
    });
});

// Function that handels advancing the animation
function main(numberOfClicks) {
    return new Promise((resolve) => {
        switch (numberOfClicks) {
            case 0:
                startAnimationSequence([
                    // Starting square and 10cm grid
                    () => textManagement.setTextToPage(2),
                    () => objectManager.animate(unitSquare, {x: startX + 0 * squareSize + 1, y: startY + 0 * squareSize + 1.5}, 1000, false),
                    // Waiting for the animation to finish before moving to the next task 
                    () => new Promise(resolve => setTimeout(resolve, 1050)),
                    () => drawGridScale(),
                    () => objectManager.animateGrid(),
                    // () => new Promise(resolve => setTimeout(resolve, 1600)),
                ]).then(resolve);
                break;
            case 1:
                startAnimationSequence([
                    // Expanding square to 10cm and rendering 10cm cube with scale
                    () => objectManager.animate(unitSquare, {size: 10 * squareSize, color: 'rgb(0, 150, 255)'}, 1000, true),
                    () => new Promise(resolve => setTimeout(resolve, 1200)),
                    () => projector.renderCube(centimeterCube),
                    () => drawGridScale(),
                    () => textManagement.setTextToPage(3),
                ]).then(resolve);
                break;
            case 2:
                startAnimationSequence([
                    // Rotating to show the right side of the cube
                    () => projector.animateCube(centimeterCube, {type: 'rotateX', angle: 0.01} , 1900),
                    () => new Promise(resolve => setTimeout(resolve, 2050)),
                    () => case2EndState = centimeterCube.vertices,
                    () => drawGridScale(),
                ]).then(resolve);
                break;
            case 3:
                startAnimationSequence([
                    // Rotating to show the top of the cube
                    () => projector.animateCube(centimeterCube, {type: 'rotateY', angle: 0.0094} , 2000),
                    () => new Promise(resolve => setTimeout(resolve, 2050)),
                    () => case3EndState = centimeterCube.vertices,
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
                    () => drawGridScale(),
                ]).then(resolve);
                break;
            case 5:
                startAnimationSequence([
                    // Increasing the distance between the cube and the camera and changing the cube's location
                    () => projector.animateCube(centimeterCube, {type: 'vertices', fov: 1000, viewDistance: 20, vertices: changeLocationVertices1}, 1000),
                    () => new Promise(resolve => setTimeout(resolve, 1050)),
                ]).then(resolve);
                break;
            case 6:
                startAnimationSequence([
                    // Creating a grid and a copy of the grid
                    () => projector.createCubeGrid(centimeterCube),
                    () => projector.createGridCopy(),
                    () => projector.drawCubeGrid(),

                    () => textManagement.setTextToPage(4),
                    () => textManagement.setTextToSecondP(),

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
                    // Rotating the meter cube to show the right side
                    () => projector.animateCube(meterCube, {type: 'rotateX', angle: 0.01} , 1900),
                    () => new Promise(resolve => setTimeout(resolve, 2050)),
                    () => case8EndState = meterCube.vertices,
                    () => drawMeterScale(),
                ]).then(resolve);
                break;
            case 9:
                startAnimationSequence([
                    // Rotating the meter cube to show the top
                    () => projector.animateCube(meterCube, {type: 'rotateY', angle: 0.0094} , 2000),
                    () => new Promise(resolve => setTimeout(resolve, 2100)),
                    () => case9EndState = meterCube.vertices,
                    () => drawMeterScale(),
                ]).then(resolve);
                break;
            case 10:
                startAnimationSequence([
                    // Resetting the meter cube to the front face
                    () => projector.animateCube(meterCube, {type: 'rotateX', angle: -0.0095} , 2000),
                    () => new Promise(resolve => setTimeout(resolve, 2100)),
                    () => projector.updateCube(meterCube, {vertices: cubeVertices2.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => drawMeterScale(),
                ]).then(resolve);
                break;
            case 11:
                startAnimationSequence([
                    // Rotating the meter cube to show the right side and the top
                    () => projector.animateCube(meterCube, {type: 'rotateX', angle: 0.0045}, 2000),
                    () => new Promise(resolve => setTimeout(resolve, 2100)),
                    () => projector.animateCube(meterCube, {type: 'rotateY', angle: 0.0045}, 2000),
                    () => new Promise(resolve => setTimeout(resolve, 2100)),
                ]).then(resolve);
                break;
            
        }
    });
}

// Function that handels reversing the animation
function animationEndStates() {
    return new Promise((resolve) => {
        switch (numberOfClicks) {
            case 0:
                // Reset button
                startAnimationSequence([
                    () => textManagement.setTextToPage(1),
                    () => document.getElementById('descriptiveText2').style.display = 'none',

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
                    () => projector.gap = 0.07,
                    () => projector.updateCube(meterCube, {vertices: cubeVertices2.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(meterCube),

                ]).then(resolve);
                break;
            case 1:
                // End state for the 1cm cube and wireframe grid
                startAnimationSequence([
                    () => areaCanvasCtx.clearRect(0, 0, areaCanvas.width, areaCanvas.height),
                    () => objectManager.updateObject(unitSquare, {x: startX + 0 * squareSize + 1, y: startY + 0 * squareSize + 1.5, size: squareSize, color: 'rgb(255, 0, 0)'}, 1000, false),
                    () => objectManager.drawObject(unitSquare),
                    () => objectManager.drawGrid(),
                    () => textManagement.setTextToPage(2),
                    () => drawGridScale(),
                ]).then(resolve);
                break;
            case 2:
                // End state for the 10cm plane getting transformed to a cube
                startAnimationSequence([
                    () => areaCanvasCtx.clearRect(0, 0, areaCanvas.width, areaCanvas.height),
                    () => projector.updateCube(centimeterCube, {vertices: cubeVertices.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(centimeterCube),
                    () => projector.renderCube(centimeterCube),
                    () => drawGridScale(),
                ]).then(resolve);
                break;
            case 3:
                // End state for the 10cm cube rotating to show the right side
                startAnimationSequence([
                    () => areaCanvasCtx.clearRect(0, 0, areaCanvas.width, areaCanvas.height),
                    () => projector.updateCube(centimeterCube, {vertices: case2EndState}),
                    () => projector.updateCubeFaces(centimeterCube),
                    () => projector.renderCube(centimeterCube),
                    () => drawGridScale(),
                ]).then(resolve);
                break;
            case 4:
                // End state for the 10cm cube rotating to show the top
                startAnimationSequence([
                    () => areaCanvasCtx.clearRect(0, 0, areaCanvas.width, areaCanvas.height),
                    () => projector.updateCube(centimeterCube, {vertices: case3EndState}),
                    () => projector.updateCubeFaces(centimeterCube),
                    () => projector.renderCube(centimeterCube),
                    () => drawGridScale(),
                ]).then(resolve);
                break;
            case 5:
                // End state for resetting the 10cm cube to show the front face
                startAnimationSequence([
                    () => projector.viewDistance = 3,
                    () => projector.fov = 700,
                    () => projector.updateCube(centimeterCube, {vertices: cubeVertices.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(centimeterCube),
                    () => projector.renderCube(centimeterCube),
                ]).then(resolve);
                break;
            case 6:
                // End state for the 10cm cube moving away from the camera
                startAnimationSequence([
                    () => projector.viewDistance = 20,
                    () => projector.fov = 1000,
                    () => projector.gap = 0.07,
                    
                    () => projector.updateCube(centimeterCube, {vertices: changeLocationVertices1.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(centimeterCube),
                    () => projector.renderCube(centimeterCube),
                    
                    () => textManagement.setTextToPage(3),
                    () => document.getElementById('descriptiveText2').style.display = 'none',
                ]).then(resolve);
                break;
            case 7:
                // End state for rotating the cube grid to show the right side and the top of the grid
                startAnimationSequence([
                    () => projector.viewDistance = 20,
                    () => projector.fov = 1000,
                    () => projector.gap = 0.07,
                    
                    () => projector.updateCube(centimeterCube, {vertices: changeLocationVertices1.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.createCubeGrid(centimeterCube),
                    () => projector.applyInstantRotation(0.77, "x"),
                    () => projector.applyInstantRotation(-0.77, "y"),
                    () => projector.drawCubeGrid(),

                    () => textManagement.setTextToPage(4),
                ]).then(resolve);
                break;
            case 8:
                // End state for the cube grid getting transformed to the meter cube
                startAnimationSequence([
                    () => projector.fov = 750,
                    () => projector.viewDistance = 3,
                    () => projector.updateCube(meterCube, {vertices: cubeVertices2.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(meterCube),
                    () => projector.renderCube(meterCube),
                    () => drawMeterScale(),
                ]).then(resolve);
                break;
            case 9:
                // End state for the meter cube rotating to show the right side
                startAnimationSequence([
                    () => projector.updateCube(meterCube, {vertices: case8EndState.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(meterCube),
                    () => projector.renderCube(meterCube),
                    () => drawMeterScale(),
                ]).then(resolve);
                break;
            case 10:
                // End state for the meter cube rotating to show the top
                startAnimationSequence([
                    () => projector.updateCube(meterCube, {vertices: case9EndState.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(meterCube),
                    () => projector.renderCube(meterCube),
                    () => drawMeterScale(),
                ]).then(resolve);
                break;
            case 11:
                // End state for the meter cube resetting to show the front face
                startAnimationSequence([
                    () => projector.updateCube(meterCube, {vertices: cubeVertices2.map(vertex => ({x: vertex.x, y: vertex.y, z: vertex.z}))}),
                    () => projector.updateCubeFaces(meterCube),
                    () => projector.renderCube(meterCube),
                ]).then(resolve);
                break;
            
        }
    });
}

// Function that ensures that the animations are played in sequence using promises
function startAnimationSequence(animations) {
    return animations.reduce((promise, animation) => {
        return promise.then(animation);
    }, Promise.resolve());
}

// Draws a scale for the 10cm grid and cube
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

// Draws a scale for the 1m cube
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

function updateSlideIndicator() {
    document.getElementById('slideIndicator').innerHTML = `${numberOfClicks} / 12`;
}