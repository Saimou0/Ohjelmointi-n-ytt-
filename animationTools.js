export class objectManagement {
    constructor (ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        
        this.isAnimating = false;
        
        this.animationQueue = [];
        this.objects = [];

        
        this.squareSize = 70;
        this.numSquares = 10;
        this.totalSize = this.numSquares * this.squareSize;

        this.currentRow = 0;
        this.currentCol = 0;

        this.startX = (areaCanvas.width - this.totalSize) / 2;
        this.startY = (areaCanvas.height - this.totalSize) / 2;
    }

    setObjects(objectList) {
        this.objects = objectList;
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

    
    // Draws the object on the canvas
    drawObject(object) {
        switch(object.type) {
            case 'bracket':
                this.drawBracket(object.x, object.y, object.size, object.horizontal);
                console.log('drawing bracket');
                break;
            case 'text':
                this.drawText(object.x, object.y, object.text, object.font);
                console.log('drawing text');
                break;
            case 'square':
                this.drawSquare(object);
                console.log('drawing square');
                break;
        }
    }
    
    // Updates the object with the desired changes
    updateObject(object, changes) {
        Object.assign(object, changes);
    }
    
    addToTheQueue(object, changes, duration) {
        this.animationQueue.push({
            object: object,
            changes: changes,
            duration: duration
        });
    }

    rgbToObject(rgb) {
        let match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (match) {
            return { r: match[1], g: match[2], b: match[3] };
        } else {
            throw new Error(`Invalid color format: ${rgb}. Expected format is 'rgb(r, g, b)'.`);
        }
    }

    // Animates the object to smoothly transition to the desired changes
    animate(object, changes, duration) {
        this.isAnimating = true;
        let startState = Object.assign({}, object);
        let startTime = Date.now();
    
        const frame = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let elapsedTime = Date.now() - startTime;
            let progress = Math.min(elapsedTime / duration, 1);
    
            for(let key in changes) {
                let startValue = startState[key];
                let endValue = changes[key];
                // object[key] = startValue + (endValue - startValue) * progress;

                if (key === 'color') {
                    let startColor = this.rgbToObject(startValue);
                    let endColor = this.rgbToObject(endValue);
            
                    let r = Math.floor(startColor.r + (endColor.r - startColor.r) * progress);
                    let g = Math.floor(startColor.g + (endColor.g - startColor.g) * progress);
                    let b = Math.floor(startColor.b + (endColor.b - startColor.b) * progress);
            
                    object[key] = `rgb(${r},${g},${b})`;
                } else {
                    object[key] = startValue + (endValue - startValue) * progress;
                }
            }
    
            this.drawObject(object);
    
            if(progress < 1) {
                requestAnimationFrame(frame);
            } else {
                this.isAnimating = false;
            }
        }
    
        frame();

    }

    animateAll(sequence) {
        this.animationQueue.forEach(animation => {
            this.animate(animation.object, animation.changes, animation.duration);
        });

        this.animationQueue = [];

        const drawFrame = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.objects.forEach(object => {
                if(sequence == 2) {
                    this.drawGrid();
                }
                this.drawObject(object);
            });

            
            if(this.isAnimating && this.animationQueue.length == 0) {
                requestAnimationFrame(drawFrame);
            } 
        }

        drawFrame();
    }

    checkAnimationStatus() {
        return this.isAnimating;
    }

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
        this.drawSquareAt(this.currentCol, this.currentRow);
        this.currentCol++;
        if (this.currentCol >= this.numSquares) {
            this.currentCol = 0;
            this.currentRow++;
        }
        if (this.currentRow < this.numSquares) {
            setTimeout(() => requestAnimationFrame(this.animateGrid.bind(this)), 10);
        }
    }

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

    drawSquare(object) {
        if(object.border == true) {
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(object.x, object.y, object.size, object.size);
        }
        this.ctx.fillStyle = object.color;
        this.ctx.fillRect(object.x, object.y, object.size, object.size);
    }
}