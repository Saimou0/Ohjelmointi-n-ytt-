export class projection {
    constructor (ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.isAnimating = false;
        
        this.cubes = [];
        this.gridCopy = [];
        
        this.fov = 700;
        this.originalFov = 700;

        this.viewDistance = 3;
        this.originalViewDistance = 3;
     
        this.gap = 0.07;

        this.shouldAnimate = false;
    }

    // Creating a cube object
    createCubeObject(vertices, edges) {
        const faces = this.createCubeFaces(vertices);
        return {vertices, edges, faces};
    }

    // Creates the faces of a cube object
    createCubeFaces(vertices) {
        return [
            { vertices: [vertices[0], vertices[1], vertices[2], vertices[3]], color: 'rgb(0, 150, 255)' }, // Front face
            { vertices: [vertices[4], vertices[5], vertices[6], vertices[7]], color: 'rgb(0, 150, 0)' },   // Back face
            { vertices: [vertices[0], vertices[1], vertices[5], vertices[4]], color: 'rgb(255, 150, 0)' }, // Top face
            { vertices: [vertices[2], vertices[3], vertices[7], vertices[6]], color: 'rgb(255, 0, 0)' },   // Bottom face
            { vertices: [vertices[0], vertices[3], vertices[7], vertices[4]], color: 'rgb(255, 150, 255)' }, // Left face
            { vertices: [vertices[1], vertices[2], vertices[6], vertices[5]], color: 'rgb(0, 0, 255)' }    // Right face
        ];
    }

    // Updates a cube object
    updateCube(cube, changes) {
        Object.assign(cube, changes);
    }

    // Updates the cube object faces
    updateCubeFaces(cube) {
        const updatedFaces = this.createCubeFaces(cube.vertices);
        cube.faces = updatedFaces;
        return cube;
    }

    // Translates 3D vertices to 2D vertices
    projectVertices(vertex) {
        return {
            x: (vertex.x * this.fov) / (vertex.z + this.viewDistance),
            y: (vertex.y * this.fov) / (vertex.z + this.viewDistance)
        };
    }

    // Draws a cube object
    renderCube(cube) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        let cubeFaces = cube.faces;

        // Calculate the depth of each face of the cube
        cubeFaces.forEach(face => {
            face.depth = face.vertices.reduce((sum, vertex) => sum + vertex.z, 0) / face.vertices.length;
        });

        // Sort the faces by depth
        cubeFaces.sort((a, b) => b.depth - a.depth);

        // Draw edges
        cube.edges.forEach(edge => {
            const start = this.projectVertices(cube.vertices[edge[0]]);
            const end = this.projectVertices(cube.vertices[edge[1]]);
            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
        });

        // Draw faces
        cubeFaces.forEach(face => {
            this.ctx.beginPath();
            face.vertices.forEach((vertex, index) => {
                const projected = this.projectVertices(vertex);
                if (index === 0) {
                    this.ctx.moveTo(projected.x, projected.y);
                } else {
                    this.ctx.lineTo(projected.x, projected.y);
                }
            });
            this.ctx.closePath();
            this.ctx.fillStyle = face.color;
            this.ctx.fill();
        });

        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    }

    // Animating a cube object
    // Rotates a cube object around the x-axis
    rotateXAxis(cube, theta) {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        return cube.vertices.map(vertex => ({
            x: vertex.x * cos - vertex.z * sin,
            y: vertex.y,
            z: vertex.z * cos + vertex.x * sin
        }));

    }

    // Rotates a cube object around the y-axis
    rotateYAxis(cube, theta) {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        return cube.vertices.map(vertex => ({
            x: vertex.x,
            y: vertex.y * cos - vertex.z * sin,
            z: vertex.z * cos + vertex.y * sin
        }));
    }

    // Increases the field of view
    changeFov(value, progress) {
        this.fov = this.originalFov + (value - this.originalFov) * progress;
    }

    // Increases the view distance
    changeViewDistance(value, progress) {
        this.viewDistance = this.originalViewDistance + (value - this.originalViewDistance) * progress;
    }

    // Animates a cube object with the given changes and duration
    animateCube(cube, changes, duration) {
        const fixedTimeStamp = 6.06;
        let accumulatedTime = 0;

        let progress = 0;
        let lastTime = performance.now();

        let startValue;
        let endValue;

        // Animation frame
        const frame = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const currentTime = performance.now();
            let deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            accumulatedTime += deltaTime;

            while (accumulatedTime >= fixedTimeStamp) {
                progress += fixedTimeStamp / duration;
                accumulatedTime -= fixedTimeStamp;
                
                switch (changes.type) {
                    case 'vertices':
                        let endFov = changes.fov ;
                        let endViewDistance = changes.viewDistance;
    
                        // Increase the field of view and view distance 
                        this.changeFov(endFov, progress, deltaTime);
                        this.changeViewDistance(endViewDistance, progress, deltaTime);

                        startValue = cube.vertices;
                        endValue = changes.vertices;
                        
                        // Map the new vertices to the cube based on the progress made
                        cube.vertices = startValue.map((vertex, index) => ({
                            x: vertex.x + (endValue[index].x - vertex.x) * progress,
                            y: vertex.y + (endValue[index].y - vertex.y) * progress,
                            z: vertex.z + (endValue[index].z - vertex.z) * progress
                        }));
                        break;
                    case 'rotateX':
                        startValue = cube.vertices;
                        // Calculate the end value of the vertices after rotating the cube around the x-axis
                        endValue = this.rotateXAxis(cube, changes.angle);
                        // Map the new vertices to the cube based on the progress made
                        cube.vertices = startValue.map((vertex, index) => ({
                            x: vertex.x + (endValue[index].x - vertex.x) * progress,
                            y: vertex.y + (endValue[index].y - vertex.y) * progress,
                            z: vertex.z + (endValue[index].z - vertex.z) * progress
                        }));
                        break;
                    case 'rotateY':
                        startValue = cube.vertices;
                        // Calculate the end value of the vertices after rotating the cube around the y-axis
                        endValue = this.rotateYAxis(cube, changes.angle);
                        // Map the new vertices to the cube based on the progress made
                        cube.vertices = startValue.map((vertex, index) => ({
                            x: vertex.x + (endValue[index].x - vertex.x) * progress,
                            y: vertex.y + (endValue[index].y - vertex.y) * progress,
                            z: vertex.z + (endValue[index].z - vertex.z) * progress
                        }));
                        break;
                }

                this.updateCubeFaces(cube);
                this.renderCube(cube);

                // console.log("DT: " + deltaTime);
                
                if(progress >= 1) {
                    this.isAnimating = false;
                    return;
                }
            }
    
            if(this.isAnimating) {
                requestAnimationFrame(frame);
            }
        }
        this.isAnimating = true;
        requestAnimationFrame(frame);
    }

    // Fills an array with cube objects
    createCubeGrid(cube) {
        let cubeList = [];
        let cubeSize = 1;
        let gridSize = 10;

        let originalVertices = cube.vertices;

        for(let x = 0; x < gridSize; x++) {
            for(let y = 0; y < gridSize; y++) {
                for(let z = 0; z < gridSize; z++) {
                    let vertices = originalVertices.map(vertex => ({
                        x: vertex.x + x * (cubeSize + this.gap),
                        y: vertex.y + y * (cubeSize + this.gap),
                        z: vertex.z + z * (cubeSize + this.gap) 
                    }));

                    let newCube = this.createCubeObject(vertices, cube.edges);
                    cubeList.push(newCube);
                }
            }
        }
        
        this.cubes = cubeList;
    }

    // Calculates the depth of a face
    calculateFaceDepth(face) {
        return face.vertices.reduce((sum, vertex) => sum + vertex.z, 0) / face.vertices.length;
    }

    // Collects all the faces of every cube in the grid and return a list of all of them
    collectAllFaces() {
        let allFaces = [];
        this.cubes.forEach(cube => {
            cube.faces.forEach(face => {
                face.depth = this.calculateFaceDepth(face);
                allFaces.push(face);
            });
        });
        return allFaces;
    }

    // Sorts all the faces in the grid by depth
    sortFacesByDepth(faces) {
        return faces.sort((a, b) => b.depth - a.depth);
    }

    // Renders all the sorted faces
    renderSortedFaces(faces) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        faces.forEach(face => {
            this.ctx.beginPath();
            face.vertices.forEach((vertex, index) => {
                const projected = this.projectVertices(vertex);
                if (index === 0) {
                    this.ctx.moveTo(projected.x, projected.y);
                } else {
                    this.ctx.lineTo(projected.x, projected.y);
                }
            });
            this.ctx.closePath();
            this.ctx.fillStyle = face.color;
            this.ctx.fill();
        });

        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    }

    // Creates a copy of the cube grid
    createGridCopy() {
        this.gridCopy = this.cubes.map(cube => ({
            vertices: cube.vertices.map(vertex => ({ ...vertex })),
            edges: [...cube.edges],
            faces: cube.faces.map(face => ({ ...face }))
        }));
    }

    // Decreses the gap between the cubes in the grid
    decreaseGap() {
        const frame = () => {
            this.gap -= 0.005;

            this.cubes.splice(0, this.cubes.length);
            this.createCubeGrid(this.gridCopy[0]);

            let allFaces = this.collectAllFaces();
            let sortedFaces = this.sortFacesByDepth(allFaces);
            this.renderSortedFaces(sortedFaces);

            if(this.gap >= 0.005) {
                requestAnimationFrame(frame);
            }
        };

        requestAnimationFrame(frame);
    }

    // Calculates the center of the cube grid
    calculateGridCenter() {
        let totalVertices = 0;
        let center = { x: 0, y: 0, z: 0 };
    
        // add all x, y, z vertices of every cube in the grid together
        this.cubes.forEach(cube => {
            cube.vertices.forEach(vertex => {
                center.x += vertex.x;
                center.y += vertex.y;
                center.z += vertex.z;
                totalVertices++;
            });
        });
    
        // divide by the sum of all vertices to get the center
        center.x /= totalVertices;
        center.y /= totalVertices;
        center.z /= totalVertices;
        return center;
    }

    // Rotates the cube grid around the desired axis
    rotateCubeGrid(wantedAngle, duration, axis) {
        const fixedTimeStamp = 6.06;
        let accumulatedTime = 0;
        let lastTime = performance.now();
        let progress = 0;

        const gridCenter = this.calculateGridCenter();
        const angle = wantedAngle;
        const rotationMatrix = this.getRotationMatrix(angle, axis);

        const frame = () => {
            const currentTime = performance.now();
            let deltaTime = Math.floor(currentTime - lastTime);
            // let deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            accumulatedTime += deltaTime;

            while (accumulatedTime >= fixedTimeStamp) {    
                progress += fixedTimeStamp / duration;
                accumulatedTime -= fixedTimeStamp;

                this.cubes.forEach(cube => {
                    cube.vertices.forEach(vertex => {
                        const translatedVertex = [
                            vertex.x - gridCenter.x,
                            vertex.y - gridCenter.y,
                            vertex.z - gridCenter.z,
                            1
                        ];

                        const rotatedVertex = this.transformVector(rotationMatrix, translatedVertex);

                        vertex.x = rotatedVertex[0] + gridCenter.x;
                        vertex.y = rotatedVertex[1] + gridCenter.y;
                        vertex.z = rotatedVertex[2] + gridCenter.z;
                    });
                });
                
                // Render the cubes
                let allFaces = this.collectAllFaces();
                let sortedFaces = this.sortFacesByDepth(allFaces);
                this.renderSortedFaces(sortedFaces);
    
                if(progress >= 1) {
                    this.isAnimating = false;
                    return;
                }
            }

            if(this.isAnimating) {
                requestAnimationFrame(frame);
            }
        };
        this.isAnimating = true;
        requestAnimationFrame(frame);
    }

    // Returns the correct rotation matrix based on the wanted rotation axis
    getRotationMatrix(angle, axis) {
        switch (axis) {
            case 'x':
                return this.rotationMatrixX(angle);
            case 'y':
                return this.rotationMatrixY(angle);
            case 'z':
                return this.rotationMatrixZ(angle);
            default:
                console.error('Invalid axis');
        }
    }

    // Matrices for rotating the cube grid
    // Returns a new vector after applying a matrix transformation
    transformVector(matrix, vector) {
        const [x, y, z] = vector;

        return [
            matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
            matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
            matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]
        ];
    }

    // Returns a x-axis rotation matrix
    rotationMatrixX(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return [
            cos, 0, sin, 0,
            0, 1, 0, 0,
            -sin, 0, cos, 0,
            0, 0, 0, 1
        ];
    }

    // Returns a y-axis rotation matrix
    rotationMatrixY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return [
            1, 0, 0, 0,
            0, cos, -sin, 0,
            0, sin, cos, 0,
            0, 0, 0, 1
        ];
    }

    // Returns a z-axis rotation matrix
    rotationMatrixZ(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return [
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    // Draws the cube grid
    drawCubeGrid() {
        let allFaces = this.collectAllFaces();
        let sortedFaces = this.sortFacesByDepth(allFaces);
        this.renderSortedFaces(sortedFaces);
    }

    // Returns the current animation status
    checkAnimationStatus() {
        return this.isAnimating;
    }
}