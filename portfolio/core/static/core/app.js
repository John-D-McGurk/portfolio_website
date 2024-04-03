const mouse = {
    x: undefined,
    y: undefined
};

class GravityPoint {
    constructor(x, y, F) {
        this.set(x, y);
        this.F = F;
        // this.c = c;
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
    constructor(x, y, dx, dy, dIdeal, gPoint) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.dIdeal = dIdeal;
        this.velocity;
        this.gravityPolar;
        this.mouseDistanceVector;
        // this.c = c;
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
        const bg = document.querySelector('#orbital');
        bg.style.background = `radial-gradient(200px at ${this.x}px ${this.y}px, #3DC9F5 0%, #65E5D580 30%, transparent 70%)`


        // this.c.beginPath();
        // this.c.arc(this.x, this.y, 250, 0, Math.PI * 2, false);
        // const gradient = this.c.createRadialGradient(this.x, this.y, 0, this.x, this.y, 100);
        // gradient.addColorStop(0, '#3DC9F5');
        // gradient.addColorStop(0.6, '#65E5D580');
        // gradient.addColorStop(1, '#65E5D500');
        // this.c.fillStyle = gradient;
        // this.c.fill();
        // this.c.closePath();
    }
}

function navActivate() {
    const navBar = document.querySelector('#nav-bar');

    if (window.scrollY) {
        navBar.classList.add('active');
    } else {
        navBar.classList.remove('active');
    }
}

function mobileNavOpen() {
    body = document.querySelector('body');
    navLinks = document.querySelector('#nav-links');
    hamburgerIcon = document.querySelector('#hamburger-icon');


    hamburgerIcon.addEventListener('click', function () {

        setTimeout(() => {
            navToggle();
        }, 1);

    });

    const navListener = new AbortController();
    function navToggle() {
        navLinks.querySelectorAll('a').forEach((child) => {
            child.classList.toggle('transition');
        })
        if (navLinks.classList.contains('active')) {

            navListener.abort();
        } else {
            window.addEventListener('click', windowListener, { signal: navListener.signal });
        }


        function windowListener(e) {
            if (navLinks.classList.contains('active') && (!e.target.closest('.over-nav') && !e.target.closest('nav'))) {
                navToggle();
            }
        }



        navLinks.classList.toggle('active');
        hamburgerIcon.classList.toggle('active');
        hamburgerIcon.querySelectorAll('div').forEach((element) => element.classList.remove('animation-off'));

    }
}

function mobileNavTransition() {
    navLinks = document.querySelector('#nav-links');
    if (window.innerWidth < 769) {
        setTimeout(() => {
            navLinks.classList.add('nav-transition');
        }, 1);

    } else {
        navLinks.classList.remove('nav-transition');
    }
}

function circuitPositioner() {
    const containerMargin = getOffset(document.querySelector('.container')).left;
    const circuits = document.querySelectorAll('.circuit');

    const profilePic = document.querySelector('#profile-pic')
    const profileMiddle = getOffset(profilePic).left + profilePic.offsetWidth * 0.;
    circuits[0].style.left = `${containerMargin - 20}px`;

    const educationSection = document.querySelector('#education'),
        educationHeader = educationSection.querySelector('h2');
    circuits[1].style.cssText = `
        top: ${educationHeader.offsetTop + 34 - window.innerWidth / 90}px;
        width: ${getOffset(educationHeader).left - 20}px;`

    const skillsHeader = document.querySelector('#skills-header');

    circuits[2].style.cssText = `
    top: ${skillsHeader.offsetTop}px;
    width: ${containerMargin + skillsHeader.clientWidth + 25}px;`
    if (containerMargin < 100) {
        circuits[2].style.top = `${skillsHeader.offsetTop + (100 - containerMargin) / 2}px`;
    }

    const projectsHeader = document.querySelector('#projects-header')
    circuits[3].style.width = `${containerMargin + projectsHeader.clientWidth * 2}px`;
    if (containerMargin < 125) {
        circuits[3].style.left = `${containerMargin - 125}px`
    } else {
        circuits[3].style.left = '';
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
    // const canvas = document.querySelector('canvas');
    // const c = canvas.getContext('2d');

    // function canvasSize(canvas) {
    //     canvas.style.width = '100%';
    //     canvas.style.height = '100%';

    //     canvas.width = canvas.offsetWidth;
    //     canvas.height = canvas.offsetHeight;
    // }

    let gPoint;
    let satellite;

    function init() {
        let gPointLocation = gravityPointFinder();
        let c = 2;
        gPoint = new GravityPoint(gPointLocation[0], gPointLocation[1], 0.0005);
        satellite = new Satellite(100, 650, 2, -10, 6, gPoint);
    }

    function gravityPointFinder() {
        const scrollY = window.scrollY,

            header = document.querySelector('header'),
            headerHeight = header.offsetHeight,

            profilePic = document.querySelector('#profile-pic'),
            profilePicOffsets = getOffset(profilePic).top,

            aboutSection = document.querySelector('#about'),
            aboutOffset = getOffset(aboutSection).top,

            educationSection = document.querySelector('#education'),
            educationSectionOffset = getOffset(educationSection).top,

            skillsSection = document.querySelector('#skills'),
            skillsOffset = getOffset(skillsSection).top,

            projectsSection = document.querySelector('#projects'),
            projectsOffset = getOffset(projectsSection).top,
            projectsHalfway = projectsOffset + projectsSection.offsetHeight / 2,

            resumeButton = document.querySelector('#resume-button'),
            resumeOffset = getOffset(resumeButton).top,

            contactSection = document.querySelector('#contact'),
            contactOffset = getOffset(contactSection).top;

        if (scrollY < profilePicOffsets - window.innerHeight / 2) {
            return [window.innerWidth * 0.7, headerHeight * 0.5]
        } else if (scrollY < aboutOffset - window.innerHeight / 2) {
            return [window.innerWidth * 0.7, profilePicOffsets + profilePic.offsetHeight / 2]
        } else if (scrollY < educationSectionOffset - window.innerHeight / 2) {
            return [window.innerWidth * 0.3, aboutOffset + (educationSectionOffset - aboutOffset) / 2]
        } else if (scrollY < skillsOffset - window.innerHeight / 2) {
            return [window.innerWidth * 0.75, educationSectionOffset + educationSection.offsetHeight * 0.6]
        } else if (scrollY < projectsOffset - window.innerHeight / 2) {
            return [window.innerWidth * 0.25, skillsOffset + skillsSection.offsetHeight * 0.7]
        } else if (scrollY < projectsHalfway - window.innerHeight / 2) {
            return [window.innerWidth * 0.6, projectsOffset + projectsSection.offsetHeight / 4]
        } else if (scrollY < resumeOffset - window.innerHeight * 0.8) {
            return [window.innerWidth * 0.25, projectsHalfway + projectsSection.offsetHeight / 6]

        } else if (scrollY < contactOffset - window.innerHeight * 0.5) {
            return [window.innerWidth * 0.5, resumeOffset + resumeButton.offsetHeight / 2]
        }else {
            return [window.innerWidth * 0.4, contactOffset + contactSection.offsetHeight * 0.6]
        }
    }

    function gravityPointSetter() {
        const location = gravityPointFinder()
        gPoint.set(location[0], location[1])
    }


    addEventListener('mousemove', (event) => {
        mouse.x = event.clientX
        mouse.y = event.clientY + window.scrollY
    })

    window.addEventListener('load', () => {
        circuitPositioner();

    })

    window.addEventListener('resize', () => {
        // canvasSize(canvas);
        gravityPointSetter();
        circuitPositioner();
        mobileNavTransition();
    })

    window.addEventListener('scroll', () => {
        gravityPointSetter();
        navActivate();
    })

    function animate() {
        requestAnimationFrame(animate);
        // c.clearRect(0, 0, canvas.width, canvas.height);
        satellite.update();
    }

    // canvasSize(canvas);
    init();
    animate();
    mobileNavOpen();
    mobileNavTransition();
})
