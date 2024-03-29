const mouse = {
    x: undefined,
    y: undefined
};

class GravityPoint {
    constructor(x, y, F, c) {
        this.set(x, y);
        this.F = F;
        this.c = c;
    }

    set(x, y) {
        this.x = x;
        this.y = y;

    }

    draw() {
        this.c.beginPath();
        this.c.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
        this.c.fill();
        this.c.closePath();
    }
}


class Satellite {
    constructor(x, y, dx, dy, dIdeal, c, gPoint) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.dIdeal = dIdeal;
        this.velocity;
        this.gravityPolar;
        this.mouseDistanceVector;
        this.c = c;
        this.gPoint = gPoint
    }

    calculateAcceleration() {
        this.velocity = this.toPolar({ x: this.dx, y: this.dy })
        this.calculateGravity();
        this.mouseReaction();
        this.idealiseVelocity();
    }

    mouseReaction() {
        this.mouseDistanceVector = { x: mouse.x - this.x, y: mouse.y - this.y };
        if (this.mouseDistanceVector.x < 100 && this.mouseDistanceVector.x > -100 && this.mouseDistanceVector.y < 100 && this.mouseDistanceVector.y > -100) {
            this.dx -= this.mouseDistanceVector.x / 50;
            this.dy -= this.mouseDistanceVector.y / 50;

        }
    }

    calculateGravity() {
        const gravityDistanceVector = { x: this.gPoint.x - this.x, y: this.gPoint.y - this.y }
        this.gravityDistance = this.toMagnitude(gravityDistanceVector);
        this.gravityDirection = this.toDirection(gravityDistanceVector);
        this.gravityPolar = this.toPolar(gravityDistanceVector);
        // rubberband; increase gravity as distance from point increases (removed)
        this.dx += (this.gPoint.x - this.x) * this.gPoint.F;
        this.dy += (this.gPoint.y - this.y) * this.gPoint.F;
    }

    idealiseVelocity() {
        // forces circular orbit
        let dVelocity;
        let dVelocityXY = { x: 0, y: 0 };
        // if velocity magnitude is greater than delta ideal reduce magnitude
        if (this.velocity.mag > this.dIdeal) {
            dVelocity = { mag: (this.dIdeal - this.velocity.mag) / 50, dir: this.velocity.dir }
            dVelocityXY = this.toVector(dVelocity)
            // else if velocity greater than delta ideal add clockwise vector 
        } else if (this.velocity.mag < this.dIdeal) {
            dVelocity = { mag: (this.dIdeal - this.velocity.mag) / 50, dir: this.gravityPolar.dir - Math.PI / 2 }
            dVelocityXY = this.toVector(dVelocity);
        }
        this.dx += dVelocityXY.x;
        this.dy += dVelocityXY.y;

    }

    toVector({ mag, dir }) {
        return {
            x: Math.cos(dir) * mag,
            y: Math.sin(dir) * mag
        }
    }


    toPolar({ x, y }) {
        return {
            mag: this.toMagnitude({ x: x, y: y }),
            dir: this.toDirection({ x: x, y: y })
        }
    }

    toDirection({ x, y }) {
        return Math.atan2(y, x);
    }

    toMagnitude({ x, y }) {
        return Math.hypot(x, y)
    }

    update() {
        this.calculateAcceleration();

        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }

    draw() {
        this.c.beginPath();
        this.c.arc(this.x, this.y, 250, 0, Math.PI * 2, false);
        const gradient = this.c.createRadialGradient(this.x, this.y, 0, this.x, this.y, 100);
        gradient.addColorStop(0, '#3DC9F5');
        gradient.addColorStop(0.6, '#65E5D580');
        gradient.addColorStop(1, '#15214288');
        this.c.fillStyle = gradient;
        this.c.fill();
        this.c.closePath();
    }
}

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    function canvasSize(canvas) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    let gPoint;
    let satellite;

    function init() {
        let gPointLocation = gravityPointFinder();
        gPoint = new GravityPoint(gPointLocation[0], gPointLocation[1], 0.0005, c);
        satellite = new Satellite(100, 650, 2, -10, 6, c, gPoint);
    }

    function gravityPointFinder() {
        const scrollY = window.scrollY,
        
            header = document.querySelector('header'),
            headerHeight = header.offsetHeight,

            aboutSection = document.querySelector('#about'),
            aboutOffset = getOffset(aboutSection).top,
            aboutHeight = aboutSection.offsetHeight;

        if (scrollY < aboutOffset) {
            return [window.innerWidth * 0.7, headerHeight *0.5]
        }
        else {
            return [window.innerWidth * 0.3, aboutOffset + aboutHeight * 0.5];
        }
    }

    function gravityPointSetter() {
        const location = gravityPointFinder()
        console.log(location)
        console.log(gPoint.x, gPoint.y)
        gPoint.set(location[0], location[1])
    }


    addEventListener('mousemove', (event) => {
        mouse.x = event.clientX
        mouse.y = event.clientY + window.scrollY
    })

    window.addEventListener('resize', () => {
        canvasSize(canvas);
    })

    window.addEventListener('scroll', () => {
        gravityPointSetter();
    })

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        satellite.update();
    }

    canvasSize(canvas);
    init();
    animate();

})