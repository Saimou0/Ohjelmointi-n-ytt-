let gridCanvas = document.getElementById('gridCanvas');
let gridCanvasCtx = gridCanvas.getContext('2d');
gridCanvas.width = 501;
gridCanvas.height = 501;

let squareCanvas = document.getElementById('squareCanvas');
let squareCanvasCtx = squareCanvas.getContext('2d');
squareCanvas.width = 51;
squareCanvas.height = 51;

//TODO: Make all the text and the "arrows" for all the visualizations
//TODO: Make a cube of cubes.
//TODO: Make a 10cm x 10cm x 10cm cube
//TODO: Stop the site from scrolling when rotating the cube and putting the cursor on the bottom or top of the site
//TODO: Plan how the site will look like
//TODO: Zooming to the interactive cube
//TODO: Make "layers" and animate transitions between them to showcase the surface areas and cubes

function drawSquare() {
    squareCanvasCtx.translate(0.5, 0.5);

    squareCanvasCtx.strokeStyle = 'red';

    squareCanvasCtx.beginPath();
    squareCanvasCtx.moveTo(0, 0);
    squareCanvasCtx.lineTo(50, 0);
    squareCanvasCtx.lineTo(50, 50);
    squareCanvasCtx.lineTo(0, 50);
    squareCanvasCtx.lineTo(0, 0);
    squareCanvasCtx.stroke();
}

function drawGrid() {
    gridCanvasCtx.translate(0.5, 0.5);

    gridCanvasCtx.strokeStyle = 'blue';
    
    for (let x = 0; x <= 10; x++) {
        gridCanvasCtx.beginPath();
        gridCanvasCtx.moveTo(x * 50, 0);
        gridCanvasCtx.lineTo(x * 50, 500);
        gridCanvasCtx.stroke();
    }
    
    for (let y = 0; y <= 10; y++) {
        gridCanvasCtx.beginPath();
        gridCanvasCtx.moveTo(0, y * 50);
        gridCanvasCtx.lineTo(500, y * 50);
        gridCanvasCtx.stroke();
    }
}

drawSquare();
drawGrid();