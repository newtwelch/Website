// "use strict";
// /*
// * Table of Contents:
// *
// *   types:
// *   - vec2 [0, 0]
// *   - vec3 [0, 0, 0]
// *
// *   classes:
// *   - Star
// *   - StarField
// *
// *   helper functions:
// *   - randRange
// *   - mapRange
// *   - distance
// *   - limitToCircle
// *   - isInEllipse
// *   - getPointerInput // sends mouse or touch data to a callback
// *   - setup // where we initialize the Starfield.
// *
// *   ENV Vars:
// *   - IS_HIGH_RES // sort of an environment variable for detecting retina type screens
// *   - IS_MOBILE // detect if it's android, ios, or other common mobile devices
// *   - IS_HIGH_RES_AND_MOBILE // just combines the two above for convenience
// */
// // am I weird for enjoying writing functions like this by hand? lol
// function randRange(min, max) {
//     return Math.random() * (max - min) + min;
// }
// function mapRange(value, low1, high1, low2, high2) {
//     return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
// }
// function distance(dot1, dot2) {
//     let [x1, y1, x2, y2] = [dot1[0], dot1[1], dot2[0], dot2[1]];
//     return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
// }

// function limitToCircle(x, y, a, b, r) {
//     let dist = distance([x, y], [a, b]);
//     if (dist <= r) {
//         return [x, y];
//     }
//     else {
//         x = x - a;
//         y = y - b;
//         let radians = Math.atan2(y, x);
//         return [Math.cos(radians) * r + a, Math.sin(radians) * r + b];
//     }
// }
// function isInEllipse(mouseX, mouseY, ellipseX, ellipseY, ellipseW, ellipseH) {
//     let dx = mouseX - ellipseX;
//     var dy = mouseY - ellipseY;
//     return ((dx * dx) / (ellipseW * ellipseW) + (dy * dy) / (ellipseH * ellipseH) <= 1);
// }
// const IS_HIGH_RES = window.matchMedia(`
//     (-webkit-min-device-pixel-ratio: 2),
//     (min--moz-device-pixel-ratio: 2),
//     (-moz-min-device-pixel-ratio: 2),
//     (-o-min-device-pixel-ratio: 2/1),
//     (min-device-pixel-ratio: 2),
//     (min-resolution: 192dpi),
//     (min-resolution: 2dppx)
//   `);
// const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// const IS_HIGH_RES_AND_MOBILE = (IS_HIGH_RES.matches && IS_MOBILE);
// class Star {
//     constructor(container) {
//         let [size, depth] = container;
//         this.FORWARD_SPEED = 300;
//         this.SIDEWAYS_SPEED = 100;
//         if (IS_HIGH_RES_AND_MOBILE) {
//             this.FORWARD_SPEED *= 2;
//             this.SIDEWAYS_SPEED *= 2;
//         }
//         this.container = container;
//         this.x = randRange(-size, size);
//         this.y = randRange(-size, size);
//         this.z = randRange(0, depth);
//         // previous position for the trails
//         this.px = this.x;
//         this.py = this.y;
//         this.pz = this.z;
//         // purple, green, and blue, but randomized ^.^
//         this.color = `rgb(250, 223, 165)`;
//     }
//     resetX() {
//         let [size, _] = this.container;
//         this.x = randRange(-size, size);
//         this.px = this.x;
//     }
//     resetY() {
//         let [size, _] = this.container;
//         this.y = randRange(-size, size);
//         this.py = this.y;
//     }
//     resetZ() {
//         let [_, depth] = this.container;
//         this.z = randRange(0, depth);
//         this.pz = this.z;
//     }
//     update(deltaTime, container, xSpeed, zSpeed) {
//         this.container = container;
//         let [size, depth] = container;
//         let sizeAndAQuarter = size + size / 4;
//         let depthMinusAQuarter = depth - depth / 4;
//         let defaultSpeed = this.FORWARD_SPEED;
//         let defaultSideSpeed = this.SIDEWAYS_SPEED;
//         if (zSpeed > 0) {
//             let slowBy = mapRange(this.z, 0, depth, 1, 0.01);
//             defaultSpeed *= slowBy;
//         }
//         else if (zSpeed < 0) {
//             let slowBy = mapRange(this.z, 0, depth, 1, 0.1);
//             defaultSpeed *= slowBy;
//         }
//         if (Math.abs(xSpeed) > 0) {
//             let slowBy = mapRange(this.z, 0, size, 0.3, 0.4);
//             defaultSideSpeed *= slowBy;
//         }
//         /*
//         * Easter Egg #1 ^.^
//         * uncomment the snippet below to make 'em wiggle
//         */
//          let movementFuzz = Math.sin(deltaTime) * randRange(-50, 50);
//          this.y -= movementFuzz;
//         // move forward, obvi
//         this.z -= (defaultSpeed * zSpeed * deltaTime);
//         // and sideways
//         this.x -= defaultSideSpeed * xSpeed * deltaTime;
//         // keep within bounds on z axis
//         let fuzzyDepth = randRange(depth, depthMinusAQuarter);
//         // keep within bounds on x axis
//         let fuzzySize = randRange(size, sizeAndAQuarter);
//         if (this.z < 1) { // z negative
//             this.z = fuzzyDepth;
//             this.pz = this.z;
//             this.resetX();
//             this.resetY();
//         }
//         else if (this.z > depth) { // z positive
//             this.z = 0;
//             this.pz = this.z;
//             this.resetX();
//             this.resetY();
//         }
//         else if (this.x < -fuzzySize) { // x negative
//             this.x = size;
//             this.px = this.x;
//             this.resetY();
//             this.resetZ();
//         }
//         else if (this.x > fuzzySize) { // x positive
//             this.x = -size;
//             this.px = this.x;
//             this.resetY();
//             this.resetZ();
//         }
//         else if (this.y < -fuzzySize) { // y negative
//             this.y = size;
//             this.py = this.y;
//             this.resetX();
//             this.resetZ();
//         }
//         else if (this.y > fuzzySize) { // y positive
//             this.y = -size;
//             this.py = this.y;
//             this.resetX();
//             this.resetZ();
//         }
//     }
//     draw(context, container, screen, mouseX, mouseY) {
//         let [width, height] = screen;
//         let [size, depth] = container;
//         let sx = mapRange(this.x / this.z, 0, 1, 0, width);
//         let sy = mapRange(this.y / this.z, 0, 1, 0, height);
//         let px = mapRange(this.px / this.pz, 0, 1, 0, width);
//         let py = mapRange(this.py / this.pz, 0, 1, 0, height);
//         const maxRadius = (IS_HIGH_RES.matches && IS_MOBILE) ? 10 : 5;
//         let radius = Math.min(Math.abs(mapRange(this.z, 0, depth, maxRadius, 0.01)), maxRadius);
//         // star point
//         context.beginPath();
//         context.arc(sx, sy, radius, 0, 2 * Math.PI);
//         context.fillStyle = this.color;
//         context.fill();
//         this.px = this.x;
//         this.py = this.y;
//         this.pz = this.z;
//         // star trail
//         context.beginPath();
//         context.moveTo(px, py);
//         context.lineTo(sx, sy);
//         context.lineWidth = radius;
//         context.strokeStyle = this.color;
//         context.stroke();
//         /*
//         * Easter Egg #2 ^.^
//         * uncomment the snippet below to add little tracer lines that follow the mouse/touch
//         */
//         // if (Math.min(width, height)/2 > distance([mouseX, mouseY], [sx, sy]) && this.z < depth/2) {
//         //   context.beginPath();
//         //   context.moveTo(sx, sy);
//         //   let [mX, mY] = limitToCircle(mouseX, mouseY, sx, sy, 50);
//         //   context.lineTo(mX, mY);
//         //   context.lineWidth = radius;
//         //   context.strokeStyle = this.color.replace(')', `, ${mapRange(this.z, 0, depth, 0.1, 0.6)})`);
//         //   context.stroke();
//         // }
//     }
// }
// const getPointerInput = (callback, element = document, delay = 600) => {
//     // use a noop if there's no callback, but like, there should be a callback lol
//     callback = callback || ((pointer) => {
//         console.error(`PointerInput is missing a callback as the first argument`);
//     });
//     let pointer = {
//         x: false,
//         y: false,
//         hasMoved: false,
//         isMoving: false,
//         wasMoving: false
//     };
//     let timer = false; // used to track when pointer motion stops
//     let animFrame = false; // debounces pointer motion so we don't do extra work needlessly
//     // this fn is called on touch and mouse events
//     const handlePointer = (event) => {
//         // if there's an animation frame already for this handler, cancel it
//         if (animFrame) {
//             animFrame = window.cancelAnimationFrame(animFrame);
//         }
//         // and instead it'll run the latest animation frame
//         animFrame = window.requestAnimationFrame(() => {
//             let x, y;
//             // handle mobile first, otherwise desktop/laptop
//             if (event.touches) {
//                 [x, y] = [event.touches[0].clientX, event.touches[0].clientY];
//             }
//             else {
//                 [x, y] = [event.clientX, event.clientY];
//             }
//             pointer.x = x;
//             pointer.y = y;
//             // pointer has moved at least once
//             if (!pointer.hasMoved) {
//                 pointer.hasMoved = true;
//             }
//             // pointer is currently moving
//             pointer.wasMoving = pointer.isMoving;
//             pointer.isMoving = true;
//             // send the current pointer data to it's consumers
//             callback(pointer);
//             // if timer already exists, clear it
//             if (timer) {
//                 timer = clearTimeout(timer);
//             }
//             // start a new timer and store it
//             timer = setTimeout(() => {
//                 // pointer is no longer moving
//                 pointer.wasMoving = pointer.isMoving;
//                 pointer.isMoving = false;
//                 // send the current pointer data to it's consumers again because we stopped moving
//                 callback(pointer);
//             }, delay);
//         });
//     };
//     // set up the handlers ^.^
//     element.addEventListener('touchstart', (e) => handlePointer(e), true);
//     element.addEventListener('touchmove', (e) => handlePointer(e), true);
//     element.addEventListener('mousemove', (e) => handlePointer(e), true);
//     return false;
// };
// class StarField {
//     constructor(howManyStars, canvas, depth = 2, UIFadeDelay = 1) {
//         this.canvas = canvas;
//         this.context = canvas.getContext('2d');
//         this.resizeTimer = false;
//         this.isResizing = false;
//         this.wasResizing = false;
//         this.containerDepth = depth;
//         this.setCanvasSize();
//         this.howManyStars = howManyStars;
//         this.stars = new Array(howManyStars);
//         this.populateStarField();
//         this.prevTime = 0;
//         this.deltaTime = 0.1;
//         this.xSpeed = 0;
//         this.zSpeed = 1;
//         this.mouseX = 0;
//         this.mouseY = (canvas.offsetHeight * 0.25) - 66;
//         this.UIFadeDelay = UIFadeDelay;
//         // this is where the pointer data affects the animation via xSpeed and zSpeed
//         let handlePointer = (pointer) => {
//             let [width, height] = this.screen;
//             this.mouseX = pointer.x - width / 2;
//             this.mouseY = pointer.y - height / 2;
//             this.mouseMoved = pointer.hasMoved;
//             this.mouseMoving = pointer.isMoving;
//             this.zSpeed = mapRange(pointer.y, 0, height, 12, -4);
//             this.xSpeed = mapRange(pointer.x, 0, width, -10, 10);
//             if (Math.abs(this.xSpeed) > 2) {
//                 this.zSpeed /= (Math.abs(this.xSpeed) / 2);
//             }
//             if (this.mouseY > 0) {
//                 this.zSpeed /= 2;
//             }
//         };
//         // getPointerInput doesn't control the animation, just passes pointer data to the callback
//         getPointerInput(handlePointer);
//         this.mouseMoved = false;
//         this.mouseMoving = false;
//         this.mouseControlAlpha = 0.1;
//         this.showMouseControls = true;
//         this.pauseAnimation = false;
//         // just the initial render, doesn't start the loop
//         this.render();
//         window.addEventListener('resize', () => this.handleResize(), true);
//         // helps when you navigate away from the page for a while, prevents stars grouping up into one big wall
//         // #fuckthewall lol
//         window.addEventListener("beforeunload", () => this.rePopulateStarField());
//         // not in use yet
//         // document.addEventListener("deviceorientation", (e) => this.handleOrientation(e), true);
//     }
//     // where the magic happens
//     startRenderLoop() {
//         const renderLoop = (timestamp) => {
//             timestamp *= 0.001; // convert to seconds
//             this.deltaTime = timestamp - this.prevTime;
//             this.prevTime = timestamp;
//             if (!this.pauseAnimation) {
//                 this.clearCanvas();
//                 this.render();
//             }
//             window.requestAnimationFrame(renderLoop);
//         };
//         window.requestAnimationFrame(renderLoop);
//     }
//     pause() {
//         this.pauseAnimation = true;
//     }
//     play() {
//         this.pauseAnimation = false;
//     }
//     setCanvasSize() {
//         // fit canvas to parent
//         this.canvas.width = this.canvas.parentElement.offsetWidth;
//         this.canvas.height = this.canvas.parentElement.offsetHeight;
//         let width = canvas.offsetWidth, height = canvas.offsetHeight, size = Math.max(width, height), depth = size * this.containerDepth, screen = [width, height], container = [size, depth];
//         // set latest sizes
//         this.container = container;
//         this.screen = screen;
//         // center
//         this.context.translate(width / 2, height / 2);
//     }
//     populateStarField() {
//         // fill an array with Star instances
//         for (let i = 0; i < this.stars.length; i++) {
//             this.stars[i] = new Star(this.container);
//         }
//     }
//     emptyStarField() {
//         this.stars = new Array(this.howManyStars);
//     }
//     rePopulateStarField() {
//         this.emptyStarField();
//         this.populateStarField();
//         return null;
//     }
//     clearCanvas() {
//         let [size, depth] = this.container;
//         this.context.clearRect(-size / 2, -size / 2, size, size);
//     }
//     drawMouseControl() {
//         let context = this.context;
//         let [width, height] = this.screen;
//         let ellipseX = 0, ellipseY = height * 0.25;
//         let ellipseW = 50, ellipseH = 21;
//         ellipseH *= mapRange(this.mouseY, -height / 2 + ellipseY, height / 2 + ellipseY, 0.8, 1.2);
//         let pointIsInEllipse = isInEllipse(this.mouseX, this.mouseY, ellipseX, ellipseY, ellipseW, ellipseH);
//         if (pointIsInEllipse) {
//             this.xSpeed = 0;
//             this.zSpeed = 0;
//         }
//         let xSpin = this.mouseX / width;
//         // ellipse
//         context.beginPath();
//         context.ellipse(ellipseX, ellipseY, ellipseW, ellipseH, xSpin, 0, 2 * Math.PI);
//         context.strokeStyle = `rgba(255, 255, 255, ${this.mouseControlAlpha})`;
//         context.lineWidth = 5;
//         context.stroke();
//         let scaleFactor = 1;
//         if (-this.mouseY > 0) {
//             scaleFactor = mapRange(Math.abs(this.mouseX / width), 0, 1, 2, 0);
//         }
//         let lineDist = distance([ellipseX, ellipseY], [this.mouseX, this.mouseY * scaleFactor]);
//         let [limitedMouseX, limitedMouseY] = limitToCircle(this.mouseX, this.mouseY, ellipseX, ellipseY, lineDist / 2);
//         // input-tracking line
//         context.beginPath();
//         context.moveTo(ellipseX, ellipseY);
//         context.lineTo(limitedMouseX, limitedMouseY);
//         context.stroke();
//     }
//     render() {
//         if (this.showMouseControls) {
//             if (!this.mouseMoved || this.mouseMoving) {
//                 // when mouse is moving, make controls visible instantly
//                 this.mouseControlAlpha = 0.3;
//                 this.drawMouseControl();
//             }
//             else {
//                 // when mouse stops moving, start fading out the opacity slowly
//                 // TODO: make it actually time based so it fades out over the period you pass it
//                 // just kinda hacked in a rough approximation by feel on my machine lol
//                 // good enough for now
//                 this.mouseControlAlpha -= (0.25 * this.deltaTime) / this.UIFadeDelay;
//                 this.drawMouseControl();
//             }
//         }
//         // update and draw all the stars
//         for (let i = 0; i < this.stars.length; i++) {
//             if (!this.pauseAnimation) {
//                 this.stars[i].update(this.deltaTime, this.container, this.xSpeed, this.zSpeed);
//             }
//             this.stars[i].draw(this.context, this.container, this.screen, this.mouseX, this.mouseY);
//         }
//     }
//     rePopOnResizeStop() {
//         if (this.isResizing && !this.wasResizing) {
//             // console.log('started');
//         }
//         if (!this.isResizing && this.wasResizing) {
//             // console.log('stopped');
//             this.rePopulateStarField();
//         }
//     }
//     handleResize() {
//         this.pause();
//         // if a resizing timer exists already clear it out
//         if (this.resizeTimer) {
//             this.resizeTimer = clearTimeout(this.resizeTimer);
//         }
//         this.wasResizing = this.isResizing;
//         if (!this.isResizing) {
//             this.isResizing = true;
//         }
//         this.rePopOnResizeStop();
//         if (this.pauseAnimation) {
//             window.requestAnimationFrame(() => {
//                 this.setCanvasSize();
//                 this.render();
//             });
//         }
//         this.resizeTimer = setTimeout(() => {
//             this.wasResizing = this.isResizing;
//             this.isResizing = false;
//             this.rePopOnResizeStop();
//             this.setCanvasSize();
//             this.play();
//         }, 200);
//     }
//     handleOrientation(event) {
//         // TODO: uh, implement this lol
//     }
// }
// function setup() {
//     let canvas = document.getElementById('canvas');
//     const howManyStars = 1000;
//     if (IS_MOBILE)
//         howManyStars = 500;
//     let starfield = new StarField(howManyStars, canvas);
//     starfield.startRenderLoop();
//     let UIToggleButton = document.getElementById('mouse-control-control');
//     starfield.showMouseControls = false;
//     UIToggleButton.classList.add('off');
//     UIToggleButton.addEventListener('click', (e) => {
//         starfield.showMouseControls = !starfield.showMouseControls;
//         if (starfield.showMouseControls) {
//             starfield.mouseControlAlpha = 0.3;
//             UIToggleButton.classList.remove('off');
//         }
//         else {
//             UIToggleButton.classList.add('off');
//         }
//         e.preventDefault();
//     }, true);
// }
// window.onload = setup();



"use strict";
/*
* Table of Contents:
*
*   types:
*   - vec2 [0, 0]
*   - vec3 [0, 0, 0]
*
*   classes:
*   - Star
*   - StarField
*
*   helper functions:
*   - randRange
*   - mapRange
*   - distance
*   - limitToCircle
*   - isInEllipse
*   - getPointerInput // sends mouse or touch data to a callback
*   - setup // where we initialize the Starfield.
*
*   ENV Vars:
*   - IS_HIGH_RES // sort of an environment variable for detecting retina type screens
*   - IS_MOBILE // detect if it's android, ios, or other common mobile devices
*   - IS_HIGH_RES_AND_MOBILE // just combines the two above for convenience
*/
// am I weird for enjoying writing functions like this by hand? lol
function randRange(min, max) {
    return Math.random() * (max - min) + min;
}
function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function distance(dot1, dot2) {
    var _a = [dot1[0], dot1[1], dot2[0], dot2[1]], x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
// not used, but fun to write after figuring out the 2D version
// function distance3D(dot1, dot2) {
//   let [x1, y1, z1, x2, y2, z2] = [dot1[0], dot1[1], dot1[2], dot2[0], dot2[1], dot2[2]];
//   return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
// }
function limitToCircle(x, y, a, b, r) {
    var dist = distance([x, y], [a, b]);
    if (dist <= r) {
        return [x, y];
    }
    else {
        x = x - a;
        y = y - b;
        var radians = Math.atan2(y, x);
        return [Math.cos(radians) * r + a, Math.sin(radians) * r + b];
    }
}
function isInEllipse(mouseX, mouseY, ellipseX, ellipseY, ellipseW, ellipseH) {
    var dx = mouseX - ellipseX;
    var dy = mouseY - ellipseY;
    return ((dx * dx) / (ellipseW * ellipseW) + (dy * dy) / (ellipseH * ellipseH) <= 1);
}
var IS_HIGH_RES = window.matchMedia("\n      (-webkit-min-device-pixel-ratio: 2),\n      (min--moz-device-pixel-ratio: 2),\n      (-moz-min-device-pixel-ratio: 2),\n      (-o-min-device-pixel-ratio: 2/1),\n      (min-device-pixel-ratio: 2),\n      (min-resolution: 192dpi),\n      (min-resolution: 2dppx)\n    ");
var IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var IS_HIGH_RES_AND_MOBILE = (IS_HIGH_RES.matches && IS_MOBILE);
var Star = /** @class */ (function () {
    function Star(container) {
        var size = container[0], depth = container[1];
        this.FORWARD_SPEED = 500;
        this.SIDEWAYS_SPEED = 100;
        if (IS_HIGH_RES_AND_MOBILE) {
            this.FORWARD_SPEED *= 2;
            this.SIDEWAYS_SPEED *= 2;
        }
        this.container = container;
        this.x = randRange(-size, size);
        this.y = randRange(-size, size);
        this.z = randRange(0, depth);
        // previous position for the trails
        this.px = this.x;
        this.py = this.y;
        this.pz = this.z;
        // purple, green, and blue, but randomized ^.^
        this.color = 'rgb(250, 223, 165)';
        }
    Star.prototype.resetX = function () {
        var _a = this.container, size = _a[0], _ = _a[1];
        this.x = randRange(-size, size);
        this.px = this.x;
    };
    Star.prototype.resetY = function () {
        var _a = this.container, size = _a[0], _ = _a[1];
        this.y = randRange(-size, size);
        this.py = this.y;
    };
    Star.prototype.resetZ = function () {
        var _a = this.container, _ = _a[0], depth = _a[1];
        this.z = randRange(0, depth);
        this.pz = this.z;
    };
    Star.prototype.update = function (deltaTime, container, xSpeed, zSpeed) {
        this.container = container;
        var size = container[0], depth = container[1];
        var sizeAndAQuarter = size + size / 4;
        var depthMinusAQuarter = depth - depth / 4;
        var defaultSpeed = this.FORWARD_SPEED;
        var defaultSideSpeed = this.SIDEWAYS_SPEED;
        if (zSpeed > 0) {
            var slowBy = mapRange(this.z, 0, depth, 1, 0.01);
            defaultSpeed *= slowBy;
        }
        else if (zSpeed < 0) {
            var slowBy = mapRange(this.z, 0, depth, 1, 0.1);
            defaultSpeed *= slowBy;
        }
        if (Math.abs(xSpeed) > 0) {
            var slowBy = mapRange(this.z, 0, size, 0.3, 0.4);
            defaultSideSpeed *= slowBy;
        }
        /*
        * Easter Egg #1 ^.^
        * uncomment the snippet below to make 'em wiggle
        */
        // let movementFuzz = Math.sin(deltaTime) * randRange(-50, 50);
        // this.y -= movementFuzz;
        // move forward, obvi
        this.z -= (defaultSpeed * zSpeed * deltaTime);
        // and sideways
        this.x -= defaultSideSpeed * xSpeed * deltaTime;
        // keep within bounds on z axis
        var fuzzyDepth = randRange(depth, depthMinusAQuarter);
        // keep within bounds on x axis
        var fuzzySize = randRange(size, sizeAndAQuarter);
        if (this.z < 1) { // z negative
            this.z = fuzzyDepth;
            this.pz = this.z;
            this.resetX();
            this.resetY();
        }
        else if (this.z > depth) { // z positive
            this.z = 0;
            this.pz = this.z;
            this.resetX();
            this.resetY();
        }
        else if (this.x < -fuzzySize) { // x negative
            this.x = size;
            this.px = this.x;
            this.resetY();
            this.resetZ();
        }
        else if (this.x > fuzzySize) { // x positive
            this.x = -size;
            this.px = this.x;
            this.resetY();
            this.resetZ();
        }
        else if (this.y < -fuzzySize) { // y negative
            this.y = size;
            this.py = this.y;
            this.resetX();
            this.resetZ();
        }
        else if (this.y > fuzzySize) { // y positive
            this.y = -size;
            this.py = this.y;
            this.resetX();
            this.resetZ();
        }
    };
    Star.prototype.draw = function (context, container, screen, mouseX, mouseY) {
        var width = screen[0], height = screen[1];
        var size = container[0], depth = container[1];
        var sx = mapRange(this.x / this.z, 0, 1, 0, width);
        var sy = mapRange(this.y / this.z, 0, 1, 0, height);
        var px = mapRange(this.px / this.pz, 0, 1, 0, width);
        var py = mapRange(this.py / this.pz, 0, 1, 0, height);
        var maxRadius = (IS_HIGH_RES.matches && IS_MOBILE) ? 2 : 4;
        var radius = Math.min(Math.abs(mapRange(this.z, 0, depth, maxRadius, 0.01)), maxRadius);
        // star point
        context.beginPath();
        context.arc(sx, sy, radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        this.px = this.x;
        this.py = this.y;
        this.pz = this.z;
        // star trail
        context.beginPath();
        context.moveTo(px, py);
        context.lineTo(sx, sy);
        context.lineWidth = radius;
        context.strokeStyle = this.color;
        context.stroke();
        /*
        * Easter Egg #2 ^.^
        * uncomment the snippet below to add little tracer lines that follow the mouse/touch
        */
        // if (Math.min(width, height)/2 > distance([mouseX, mouseY], [sx, sy]) && this.z < depth/2) {
        //   context.beginPath();
        //   context.moveTo(sx, sy);
        //   let [mX, mY] = limitToCircle(mouseX, mouseY, sx, sy, 50);
        //   context.lineTo(mX, mY);
        //   context.lineWidth = radius;
        //   context.strokeStyle = this.color.replace(')', `, ${mapRange(this.z, 0, depth, 0.1, 0.6)})`);
        //   context.stroke();
        // }
    };
    return Star;
}());
var getPointerInput = function (callback, element, delay) {
    if (element === void 0) { element = document; }
    if (delay === void 0) { delay = 600; }
    // use a noop if there's no callback, but like, there should be a callback lol
    callback = callback || (function (pointer) {
        console.error("PointerInput is missing a callback as the first argument");
    });
    var pointer = {
        x: false,
        y: false,
        hasMoved: false,
        isMoving: false,
        wasMoving: false
    };
    var timer = false; // used to track when pointer motion stops
    var animFrame = false; // debounces pointer motion so we don't do extra work needlessly
    // this fn is called on touch and mouse events
    var handlePointer = function (event) {
        // if there's an animation frame already for this handler, cancel it
        if (animFrame) {
            animFrame = window.cancelAnimationFrame(animFrame);
        }
        // and instead it'll run the latest animation frame
        animFrame = window.requestAnimationFrame(function () {
            var _a, _b;
            var x, y;
            // handle mobile first, otherwise desktop/laptop
            if (event.touches) {
                _a = [event.touches[0].clientX, event.touches[0].clientY], x = _a[0], y = _a[1];
            }
            else {
                _b = [event.clientX, event.clientY], x = _b[0], y = _b[1];
            }
            pointer.x = x;
            pointer.y = y;
            // pointer has moved at least once
            if (!pointer.hasMoved) {
                pointer.hasMoved = true;
            }
            // pointer is currently moving
            pointer.wasMoving = pointer.isMoving;
            pointer.isMoving = true;
            // send the current pointer data to it's consumers
            callback(pointer);
            // if timer already exists, clear it
            if (timer) {
                timer = clearTimeout(timer);
            }
            // start a new timer and store it
            timer = setTimeout(function () {
                // pointer is no longer moving
                pointer.wasMoving = pointer.isMoving;
                pointer.isMoving = false;
                // send the current pointer data to it's consumers again because we stopped moving
                callback(pointer);
            }, delay);
        });
    };
    // set up the handlers ^.^
    element.addEventListener('touchstart', function (e) { return handlePointer(e); }, true);
    element.addEventListener('touchmove', function (e) { return handlePointer(e); }, true);
    element.addEventListener('mousemove', function (e) { return handlePointer(e); }, true);
    return false;
};
var StarField = /** @class */ (function () {
    function StarField(howManyStars, canvas, depth, UIFadeDelay) {
        var _this = this;
        if (depth === void 0) { depth = 2; }
        if (UIFadeDelay === void 0) { UIFadeDelay = 1; }
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.resizeTimer = false;
        this.isResizing = false;
        this.wasResizing = false;
        this.containerDepth = depth;
        this.setCanvasSize();
        this.howManyStars = howManyStars;
        this.stars = new Array(howManyStars);
        this.populateStarField();
        this.prevTime = 0;
        this.deltaTime = 0.1;
        this.xSpeed = 0;
        this.zSpeed = 1;
        this.mouseX = 0;
        this.mouseY = (canvas.offsetHeight * 0.25) - 66;
        this.UIFadeDelay = UIFadeDelay;
        // this is where the pointer data affects the animation via xSpeed and zSpeed
        var handlePointer = function (pointer) {
            var _a = _this.screen, width = _a[0], height = _a[1];
            _this.mouseX = pointer.x - width / 2;
            _this.mouseY = pointer.y - height / 2;
            _this.mouseMoved = pointer.hasMoved;
            _this.mouseMoving = pointer.isMoving;
            _this.zSpeed = mapRange(pointer.y, 0, height, 12, -4);
            _this.xSpeed = mapRange(pointer.x, 0, width, -10, 10);
            if (Math.abs(_this.xSpeed) > 2) {
                _this.zSpeed /= (Math.abs(_this.xSpeed) / 2);
            }
            if (_this.mouseY > 0) {
                _this.zSpeed /= 2;
            }
        };
        // getPointerInput doesn't control the animation, just passes pointer data to the callback
        getPointerInput(handlePointer);
        this.mouseMoved = false;
        this.mouseMoving = false;
        this.mouseControlAlpha = 0.1;
        this.showMouseControls = true;
        this.pauseAnimation = false;
        // just the initial render, doesn't start the loop
        this.render();
        window.addEventListener('resize', function () { return _this.handleResize(); }, true);
        // helps when you navigate away from the page for a while, prevents stars grouping up into one big wall
        // #fuckthewall lol
        window.addEventListener("beforeunload", function () { return _this.rePopulateStarField(); });
        // not in use yet
        // document.addEventListener("deviceorientation", (e) => this.handleOrientation(e), true);
    }
    // where the magic happens
    StarField.prototype.startRenderLoop = function () {
        var _this = this;
        var renderLoop = function (timestamp) {
            timestamp *= 0.001; // convert to seconds
            _this.deltaTime = timestamp - _this.prevTime;
            _this.prevTime = timestamp;
            if (!_this.pauseAnimation) {
                _this.clearCanvas();
                _this.render();
            }
            window.requestAnimationFrame(renderLoop);
        };
        window.requestAnimationFrame(renderLoop);
    };
    StarField.prototype.pause = function () {
        this.pauseAnimation = true;
    };
    StarField.prototype.play = function () {
        this.pauseAnimation = false;
    };
    StarField.prototype.setCanvasSize = function () {
        // fit canvas to parent
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
        var width = canvas.offsetWidth, height = canvas.offsetHeight, size = Math.max(width, height), depth = size * this.containerDepth, screen = [width, height], container = [size, depth];
        // set latest sizes
        this.container = container;
        this.screen = screen;
        // center
        this.context.translate(width / 2, height / 2);
    };
    StarField.prototype.populateStarField = function () {
        // fill an array with Star instances
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i] = new Star(this.container);
        }
    };
    StarField.prototype.emptyStarField = function () {
        this.stars = new Array(this.howManyStars);
    };
    StarField.prototype.rePopulateStarField = function () {
        this.emptyStarField();
        this.populateStarField();
        return null;
    };
    StarField.prototype.clearCanvas = function () {
        var _a = this.container, size = _a[0], depth = _a[1];
        this.context.clearRect(-size / 2, -size / 2, size, size);
    };
    StarField.prototype.drawMouseControl = function () {
        var context = this.context;
        var _a = this.screen, width = _a[0], height = _a[1];
        var ellipseX = 0, ellipseY = height * 0.25;
        var ellipseW = 50, ellipseH = 21;
        ellipseH *= mapRange(this.mouseY, -height / 2 + ellipseY, height / 2 + ellipseY, 0.8, 1.2);
        var pointIsInEllipse = isInEllipse(this.mouseX, this.mouseY, ellipseX, ellipseY, ellipseW, ellipseH);
        if (pointIsInEllipse) {
            this.xSpeed = 0;
            this.zSpeed = 0;
        }
        var xSpin = this.mouseX / width;
        // ellipse
        context.beginPath();
        context.ellipse(ellipseX, ellipseY, ellipseW, ellipseH, xSpin, 0, 2 * Math.PI);
        context.strokeStyle = "rgba(255, 255, 255, ".concat(this.mouseControlAlpha, ")");
        context.lineWidth = 2;
        context.stroke();
        var scaleFactor = 1;
        if (-this.mouseY > 0) {
            scaleFactor = mapRange(Math.abs(this.mouseX / width), 0, 1, 2, 0);
        }
        var lineDist = distance([ellipseX, ellipseY], [this.mouseX, this.mouseY * scaleFactor]);
        var _b = limitToCircle(this.mouseX, this.mouseY, ellipseX, ellipseY, lineDist / 2), limitedMouseX = _b[0], limitedMouseY = _b[1];
        // input-tracking line
        context.beginPath();
        context.moveTo(ellipseX, ellipseY);
        context.lineTo(limitedMouseX, limitedMouseY);
        context.stroke();
    };
    StarField.prototype.render = function () {
        if (this.showMouseControls) {
            if (!this.mouseMoved || this.mouseMoving) {
                // when mouse is moving, make controls visible instantly
                this.mouseControlAlpha = 0.3;
                this.drawMouseControl();
            }
            else {
                // when mouse stops moving, start fading out the opacity slowly
                // TODO: make it actually time based so it fades out over the period you pass it
                // just kinda hacked in a rough approximation by feel on my machine lol
                // good enough for now
                this.mouseControlAlpha -= (0.25 * this.deltaTime) / this.UIFadeDelay;
                this.drawMouseControl();
            }
        }
        // update and draw all the stars
        for (var i = 0; i < this.stars.length; i++) {
            if (!this.pauseAnimation) {
                this.stars[i].update(this.deltaTime, this.container, this.xSpeed, this.zSpeed);
            }
            this.stars[i].draw(this.context, this.container, this.screen, this.mouseX, this.mouseY);
        }
    };
    StarField.prototype.rePopOnResizeStop = function () {
        if (this.isResizing && !this.wasResizing) {
            // console.log('started');
        }
        if (!this.isResizing && this.wasResizing) {
            // console.log('stopped');
            this.rePopulateStarField();
        }
    };
    StarField.prototype.handleResize = function () {
        var _this = this;
        this.pause();
        // if a resizing timer exists already clear it out
        if (this.resizeTimer) {
            this.resizeTimer = clearTimeout(this.resizeTimer);
        }
        this.wasResizing = this.isResizing;
        if (!this.isResizing) {
            this.isResizing = true;
        }
        this.rePopOnResizeStop();
        if (this.pauseAnimation) {
            window.requestAnimationFrame(function () {
                _this.setCanvasSize();
                _this.render();
            });
        }
        this.resizeTimer = setTimeout(function () {
            _this.wasResizing = _this.isResizing;
            _this.isResizing = false;
            _this.rePopOnResizeStop();
            _this.setCanvasSize();
            _this.play();
        }, 200);
    };
    StarField.prototype.handleOrientation = function (event) {
        // TODO: uh, implement this lol
    };
    return StarField;
}());
function setup() {
    var canvas = document.getElementById('canvas');
    var howManyStars = 1000;
    if (IS_MOBILE)
        howManyStars = 500;
    var starfield = new StarField(howManyStars, canvas);
    starfield.startRenderLoop();
    var UIToggleButton = document.getElementById('mouse-control-control');
    starfield.showMouseControls = false;
    UIToggleButton.classList.add('off');
    UIToggleButton.addEventListener('click', function (e) {
        starfield.showMouseControls = !starfield.showMouseControls;
        if (starfield.showMouseControls) {
            starfield.mouseControlAlpha = 0.3;
            UIToggleButton.classList.remove('off');
        }
        else {
            UIToggleButton.classList.add('off');
        }
        e.preventDefault();
    }, true);
}
window.onload = setup();
