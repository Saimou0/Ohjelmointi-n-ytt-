export class animation {

    constructor (ctx, canvas, isAnimating) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.isAnimating = isAnimating;
    }

    // Creates an object with x and y coordinates, size and color
    createObject(x, y, size, color, border) {
        return {x, y, size, color, border}
    }
    
    // Draws the object on the canvas
    drawObject(object) {
        if(object.border == true) {
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(object.x, object.y, object.size, object.size);
        }
        this.ctx.fillStyle = object.color;
        this.ctx.fillRect(object.x + 0.5, object.y + 1, object.size, object.size);
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
}