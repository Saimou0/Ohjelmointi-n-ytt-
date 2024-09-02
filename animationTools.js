export class objectManagement {
    constructor (ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        
        this.isAnimating = false;
        
        this.squareSize = 70;
        this.numSquares = 10;
        this.totalSize = this.numSquares * this.squareSize;

        this.currentRow = 0;
        this.currentCol = 0;

        this.startX = (areaCanvas.width - this.totalSize) / 2;
        this.startY = (areaCanvas.height - this.totalSize) / 2;
    }

    // Creates an object with x and y coordinates, size and color
    createObject(x, y, size, color, border) {
        return {x, y, size, color, border, type: 'square'}
    }
    createBracket(x, y, size, horizontal) {
        return {x, y, size, horizontal, type: 'bracket'}
    }
    createText(x, y, text, font = '20px Inter') {
        return {x, y, text, font, type: 'text'}
    }

    // Updates the object with the desired changes
    updateObject(object, changes) {
        Object.assign(object, changes);
    }

    // Draws the object on the canvas
    drawObject(object) {
        switch(object.type) {
            case 'bracket':
                this.drawBracket(object.x, object.y, object.size, object.horizontal);
                // console.log('drawing bracket');
                break;
            case 'text':
                this.drawText(object.x, object.y, object.text, object.font);
                // console.log('drawing text');
                break;
            case 'square':
                this.drawSquare(object);
                // console.log('drawing square');
                break;
        }
    }

    // Converts an rgb string to an object with r, g and b properties
    rgbToObject(rgb) {
        let match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (match) {
            return { r: parseInt(match[1], 10), g: parseInt(match[2], 10), b: parseInt(match[3], 10) };
        } else {
            throw new Error(`Invalid color format: ${rgb}. Expected format is 'rgb(r, g, b)'.`);
        }
    }

    // Animates the object to smoothly transition to the desired changes
    animate(object, changes, duration, shouldDrawGrid) {
        this.isAnimating = true;
        let startState = Object.assign({}, object);
        let startTime = Date.now();
    
        const frame = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let elapsedTime = Date.now() - startTime;
            let progress = Math.min(elapsedTime / duration, 1);
    
            for(let key in changes) {
                if (key === 'color') {
                    let startColor = this.rgbToObject(startState[key]);
                    let endColor = this.rgbToObject(changes[key]);

                    let rDiff = endColor.r - startColor.r;
                    let gDiff = endColor.g - startColor.g;
                    let bDiff = endColor.b - startColor.b;

                    let r = Math.floor(startColor.r + rDiff * progress);
                    let g = Math.floor(startColor.g + gDiff * progress);
                    let b = Math.floor(startColor.b + bDiff * progress);

                    r = Math.max(0, Math.min(255, r));
                    g = Math.max(0, Math.min(255, g));
                    b = Math.max(0, Math.min(255, b));

                    object[key] = `rgb(${r},${g},${b})`;
                } else {
                    let startValue = startState[key];
                    let endValue = changes[key];
                    object[key] = startValue + (endValue - startValue) * progress;
                }
            }
    
            this.drawObject(object);
    
            if(progress < 1) {
                requestAnimationFrame(frame);
            } else {
                this.isAnimating = false;
            }

            if(shouldDrawGrid) {
                this.drawGrid();
            }
        }
    
        frame();

    }

    // Returns the status of the animation
    checkAnimationStatus() {
        return this.isAnimating;
    }

    // Draws a bracket on the canvas at the given coordinates
    drawBracket(x, y, size, horizontal) {
        if(!horizontal) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - 10, y);            
            this.ctx.lineTo(x - 10, y + size);
            this.ctx.lineTo(x, y + size);
            this.ctx.stroke();
        }

        if(horizontal) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y - 10);
            this.ctx.lineTo(x + size, y - 10);
            this.ctx.lineTo(x + size, y);
            this.ctx.stroke();
        }
    }

    // Draws text on the canvas at the given coordinates
    drawText(x, y, text, font) {
        this.ctx.font = font;
        this.ctx.fillText(text, x, y);
    }

    // Draws a square at the given coordinates
    drawSquareAt(x, y) {
        this.ctx.beginPath();
        this.ctx.rect(this.startX + x * this.squareSize + 0.5, this.startY + y * this.squareSize + 1, this.squareSize, this.squareSize);
        this.ctx.stroke();
    }

    // Animates a grid by drawing each square one by one
    animateGrid() {
        if(this.currentRow >= this.numSquares) {
            return;
        }
        this.isAnimating = true;
        this.drawSquareAt(this.currentCol, this.currentRow);
        this.currentCol++;
        if (this.currentCol >= this.numSquares) {
            this.currentCol = 0;
            this.currentRow++;
        }
        if (this.currentRow < this.numSquares) {
            setTimeout(() => requestAnimationFrame(this.animateGrid.bind(this)), 10);
        } else {
            this.isAnimating = false;
            this.currentCol = 0;
            this.currentRow = 0;
        }
    }

    // Draws a grid on the canvas
    drawGrid() {
        let startX = (this.canvas.width - (10*70)) / 2;
        let startY = (this.canvas.height - (10*70)) / 2;
        let squareSize = 70;

        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                this.ctx.beginPath();
                this.ctx.rect(startX + i * squareSize + 0.5, startY + j * squareSize + 1, squareSize, squareSize);
                this.ctx.stroke();
            }
        }
    }

    // Draw a square object on the canvas
    drawSquare(object) {
        if(object.border == true) {
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(object.x, object.y, object.size, object.size);
        }
        this.ctx.fillStyle = object.color;
        this.ctx.fillRect(object.x, object.y, object.size, object.size);
    }
}