export class projection {
    constructor (ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.isAnimating = false;

        this.cubes = [];
        
        this.fov = 700;
        this.originalFov = 700;

        this.viewDistance = 3;
        this.originalViewDistance = 3;

        this.gap = 0.15;

        this.shouldAnimate = false;
    }

    // Creating a cube object
    createCubeObject(vertices, edges) {
        const faces = this.createCubeFaces(vertices);
        return {vertices, edges, faces};
    }

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

    // Updating a cube object
    updateCube(cube, changes) {
        Object.assign(cube, changes);
    }

    // Updates the cube faces
    updateCubeFaces(cube) {
        const updatedFaces = this.createCubeFaces(cube.vertices);
        cube.faces = updatedFaces;
        return cube;
    }

    // Drawing a cube object
    projectVertices(vertex) {
        return {
            x: (vertex.x * this.fov) / (vertex.z + this.viewDistance),
            y: (vertex.y * this.fov) / (vertex.z + this.viewDistance)
        };
    }

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
    // Rotating a cube around the x-axis
    rotateXAxis(cube, theta) {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        return cube.vertices.map(vertex => ({
            x: vertex.x * cos - vertex.z * sin,
            y: vertex.y,
            z: vertex.z * cos + vertex.x * sin
        }));

    }

    // Rotating a cube around the y-axis
    rotateYAxis(cube, theta) {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        return cube.vertices.map(vertex => ({
            x: vertex.x,
            y: vertex.y * cos - vertex.z * sin,
            z: vertex.z * cos + vertex.y * sin
        }));
    }

    // Increasing the field of view
    changeFov(value) {
        if(this.fov < value) {
            this.fov += 0.09;
            requestAnimationFrame(this.changeFov.bind(this, value));
        }
    }

    // Increasing the view distance
    changeViewDistance(value) {
        if(this.viewDistance < value) {
            this.viewDistance += 0.009;
            requestAnimationFrame(this.changeViewDistance.bind(this, value));
        }
    }

    animateCube(cube, changes) {
        const startTime = performance.now();
        let duration = 2000;
        const fixedTimeStamp = 16.67;
        let accumulatedTime = 0;

        let progress = 0;
        // do not change last time to 0, because current time will be like 6k when the animation starts if you leave the browser for to idle for a while
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

                //Debugging
                console.log("%cStartTime: %s", "color: yellow", startTime);
                console.log("%cCurrentTime: %s", "color: yellow", currentTime);
                console.log("%cProgress: %s", "color: green", progress);
                
                switch (changes.type) {
                    case 'vertices':
                        startValue = cube.vertices;
                        endValue = changes.vertices;
                        
                        // Map the new vertices to the cube based on the progress made
                        cube.vertices = startValue.map((vertex, index) => ({
                            x: vertex.x + (endValue[index].x - vertex.x) * progress,
                            y: vertex.y + (endValue[index].y - vertex.y) * progress,
                            z: vertex.z + (endValue[index].z - vertex.z) * progress
                        }));
    
                        let endFov = changes.fov;
                        let endViewDistance = changes.viewDistance;
    
                        // Increase the field of view and view distance 
                        this.changeFov(endFov);
                        this.changeViewDistance(endViewDistance);
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
                
                console.log("DT: " + deltaTime);
                
                if(progress >= 1) {
                    this.isAnimating = false;
                    return;
                }
                
            }

            console.log("%cCube Vertices: %s", "color: orange", cube.vertices.map(vertex => vertex.x));

            // Update the cube faces and render the cube
            this.updateCubeFaces(cube);
            this.renderCube(cube);
            
            if(this.isAnimating) {
                requestAnimationFrame(frame);
            }
            
        }

        this.isAnimating = true;
        requestAnimationFrame(frame);
    }

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

    animateCubeGrid() {
        let allFaces = this.collectAllFaces();
        let sortedFaces = this.sortFacesByDepth(allFaces);
        this.renderSortedFaces(sortedFaces);

        // setTimeout(() => {
        //     this.decreaseGap();
        // }, 1000);

        // this.rotateCubeGrid(0.05, 2000);
    }

    // Calculate the depth of a face
    calculateFaceDepth(face) {
        return face.vertices.reduce((sum, vertex) => sum + vertex.z, 0) / face.vertices.length;
    }

    // Collect all the faces of every cube in the grid and return a list of all of them
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

    // Sort all the faces in the grid by depth
    sortFacesByDepth(faces) {
        return faces.sort((a, b) => b.depth - a.depth);
    }

    // Render all the sorted faces
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

    decreaseGap() {
        const frame = () => {
            this.gap -= 0.01;
        
            this.cubes.splice(1, this.cubes.length - 1);

            this.createCubeGrid(this.cubes[0]);

            let allFaces = this.collectAllFaces();
            let sortedFaces = this.sortFacesByDepth(allFaces);
            this.renderSortedFaces(sortedFaces);

            if(this.gap > 0.09) {
                requestAnimationFrame(frame);
            }

        };

        frame();
    }

    // Rotating the cube grid
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

    rotateCubeGrid(wantedAngle, duration) {
        this.isAnimating = true;
        let progress = 0;
        const startTime = Date.now();

        const center = this.calculateGridCenter();
        const angle = wantedAngle; // 1.57 is exactly 90 degrees

        const frame = () => {
            const currentTime = Date.now();
            progress = (currentTime - startTime) / duration;
            console.log(progress);

            if(progress >= 1) {
                progress = 1;
                this.isAnimating = false;
            }

            // Make the center of the grid the origin of all the cubes in the grid
            this.cubes.forEach(cube => {
                cube.vertices.forEach(vertex => {
                    vertex.x -= center.x;
                    vertex.y -= center.y;
                    vertex.z -= center.z;
                });
            });

            this.cubes.forEach(cube => {
                cube.vertices.forEach(vertex => {
                    const x = vertex.x;
                    const z = vertex.z;
                    vertex.x = x * Math.cos(angle * progress) - z * Math.sin(angle * progress);
                    vertex.z = x * Math.sin(angle * progress) + z * Math.cos(angle * progress);
                });
                
            });

            // Move the all the cubes back to their original position with the rotation applied
            this.cubes.forEach(cube => {
                cube.vertices.forEach(vertex => {
                    vertex.x += center.x;
                    vertex.y += center.y;
                    vertex.z += center.z;
                });
            });
            
            // Render the cubes
            let allFaces = this.collectAllFaces();
            let sortedFaces = this.sortFacesByDepth(allFaces);
            this.renderSortedFaces(sortedFaces);

            console.log("Animating");

            if(progress < 1) {
                requestAnimationFrame(frame);
            } else {
                this.isAnimating = false;
            }

        }
        frame();
    }

    checkAnimationStatus() {
        return this.isAnimating;
    }
}