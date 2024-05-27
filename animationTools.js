export class objectManagement {

    constructor (ctx, canvas, isAnimating) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.isAnimating = isAnimating;
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
    
    // Animates the object to smoothly transition to the desired changes
    animate(object, changes, duration) {
        this.isAnimating = true;
        let startState = Object.assign({}, object);
        let startTime = Date.now();
    
        const frame = () => {
            this.ctx.clearRect(0, 0, areaCanvas.width, areaCanvas.height);
            let elapsedTime = Date.now() - startTime;
            let progress = Math.min(elapsedTime / duration, 1);
    
            for(let key in changes) {
                let startValue = startState[key];
                let endValue = changes[key];
                object[key] = startValue + (endValue - startValue) * progress;
            }
    
            this.drawObject(object);
    
            if(progress < 1) {
                requestAnimationFrame(frame);
            } else {
                this.isAnimating = false;
            }
        }
    
        requestAnimationFrame(frame);
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

    drawSquare(object) {
        if(object.border == true) {
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(object.x, object.y, object.size, object.size);
        }
        this.ctx.fillStyle = object.color;
        this.ctx.fillRect(object.x, object.y, object.size, object.size);
    }
}