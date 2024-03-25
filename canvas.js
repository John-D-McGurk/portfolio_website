

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');
    const mouse = {
        x: undefined,
        y: undefined
    };
    class GravityPoint {
        constructor(x, y, F) {
            this.x = x;
            this.y = y;
            this.F = F;
        }

        draw() {
            c.beginPath();
            c.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
            c.fill();
            c.closePath();
        }
    }

    class Satellite {
        constructor(x, y, dx, dy, dIdeal) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.dIdeal = dIdeal;
            this.velocity;
            this.gravityPolar;
            this.mouseDistanceVector;
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
            const gravityDistanceVector = { x: gPoint.x - this.x, y: gPoint.y - this.y }
            this.gravityDistance = this.toMagnitude(gravityDistanceVector);
            this.gravityDirection = this.toDirection(gravityDistanceVector);
            this.gravityPolar = this.toPolar(gravityDistanceVector);
            // rubberband; increase gravity as distance from point increases (removed)
            this.dx += (gPoint.x - this.x) * gPoint.F;
            this.dy += (gPoint.y - this.y) * gPoint.F;
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
            c.beginPath();
            c.arc(this.x, this.y, 250, 0, Math.PI * 2, false);
            const gradient = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, 150);
            gradient.addColorStop(0, '#346369');
            gradient.addColorStop(1, '#151219');
            c.fillStyle = gradient;
            c.fill();
            c.closePath();
        }
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gPoint;
    let satellite;
    
    function init() {
        gPoint = new GravityPoint(1200, 800 / 2, 0.0005);
        satellite = new Satellite(100, 650, 2, -10, 6);

    }


    addEventListener('mousemove', (event) => {
        mouse.x = event.clientX
        mouse.y = event.clientY
    })

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        satellite.update();
    }

    init();
    animate();

})