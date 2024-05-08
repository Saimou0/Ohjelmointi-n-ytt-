

let canvas = document.getElementById('cubeCanvas');
let ctx = canvas.getContext('2d');

let angle = 0;
let vertices = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
    
    [0.9, -1, 1],
    [0.9, 1, 1],
    
    [0.8, 1, 1],
    [0.8, -1, 1],
]

// Connect points from the vertices array via their index
let edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // back face
    [4, 5], [5, 6], [6, 7], [7, 4], // front face
    [0, 4], [1, 5], [2, 6], [3, 7],  // connecting edges
    [8, 9], [10, 11],
];

let angleX = 0;
let angleY = 0;
let scale = 1;

canvas.addEventListener('mousedown', function(e) {
    let startX = e.pageX;
    let startY = e.pageY;
    document.addEventListener('mousemove', rotateCube);

    function rotateCube(e) {
        angleY += (e.pageX - startX) * 0.01;
        angleX -= (e.pageY - startY) * 0.01;
        startX = e.pageX;
        startY = e.pageY;
        drawCube();
    }
    
    if(e.button === 2) {
        cameraX += e.movementX;
        cameraY += e.movementY;
        drawCube();
        
    }

    document.addEventListener('mouseup', function() {
        document.removeEventListener('mousemove', rotateCube);
    }, { once: true });
});

canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    e.stopPropagation();

    let newScale = scale + e.deltaY * -0.01;
    if(newScale < 1) {
        scale = 1;
    } else if (newScale > 9) {
        scale = 9;
    } else {
        scale = newScale;
    }

    console.log(scale);
    drawCube();
});

function project([x, y, z]) {
    // Implement a simple perspective projection
    let localScale = 100 / (2.5 + z);
    let x2d = x * localScale * scale;
    let y2d = y * localScale * scale;
    return [x2d, y2d];
}

function rotate(vertex) {
    // Implement a 3D rotation matrix
    let [x, y, z] = vertex;
    let cosX = Math.cos(angleX);
    let sinX = Math.sin(angleX);
    let cosY = Math.cos(angleY);
    let sinY = Math.sin(angleY);
    let z1 = cosX * z - sinX * y;
    let y1 = sinX * z + cosX * y;
    let x1 = cosY * x - sinY * z1;
    let z2 = sinY * x + cosY * z1;
    return [x1, y1, z2];
}

let cameraX = 0;
let cameraY = 0;

export function drawCube() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2 + cameraX, canvas.height / 2 + cameraY);

    edges.forEach(edge => {
        let v1 = project(rotate(vertices[edge[0]]));
        let v2 = project(rotate(vertices[edge[1]]));

        // Calculate the distance between the two vertices

        ctx.beginPath();
        ctx.moveTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        ctx.stroke();
    });

    ctx.restore();
}

