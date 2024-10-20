(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS-like environments
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.DynoEngine = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Core DynoEngine Object
    const DynoEngine = {};

    // Extend the Camera class with keyboard controls
class Camera {
    constructor(x = 0, y = 0, zoom = 1, rotation = 0) {
        this.position = new Vector2(x, y);
        this.zoom = zoom;
        this.rotation = rotation;
        this.dragging = false;
        this.lastMousePos = null;
    }

    // Start dragging
    startDragging(mousePos) {
        this.dragging = true;
        this.lastMousePos = mousePos;
    }

    // Stop dragging
    stopDragging() {
        this.dragging = false;
        this.lastMousePos = null;
    }

    // Update camera position based on mouse movement
    pan(mousePos) {
        if (this.dragging && this.lastMousePos) {
            const dx = mousePos.x - this.lastMousePos.x;
            const dy = mousePos.y - this.lastMousePos.y;

            this.position.x -= dx; // Move camera left/right
            this.position.y -= dy; // Move camera up/down
        }
        this.lastMousePos = mousePos; // Update last mouse position
    }

    // Pan using keyboard inputs
    panWithKeyboard(keys) {
        const moveSpeed = 5; // Adjust the speed as needed
        if (keys['ArrowUp']) this.position.y -= moveSpeed;
        if (keys['ArrowDown']) this.position.y += moveSpeed;
        if (keys['ArrowLeft']) this.position.x -= moveSpeed;
        if (keys['ArrowRight']) this.position.x += moveSpeed;
    }

    // Existing methods...
}

// Extend the Engine class to support keyboard controls
class Engine {
    constructor() {
        this.entities = [];
        this.lastTime = 0;

        this.canvas = document.getElementById('dynoCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.worker = new Worker('rendererWorker.js');
        this.worker.onmessage = this.handleRenderData.bind(this);

        this.camera = new Camera();

        this.keys = {}; // Store currently pressed keys

        // Bind event handlers
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('wheel', this.handleZoom.bind(this));

        // Keyboard event listeners
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleMouseDown(event) {
        this.camera.startDragging(new Vector2(event.clientX, event.clientY));
    }

    handleMouseUp() {
        this.camera.stopDragging();
    }

    handleMouseMove(event) {
        const mousePos = new Vector2(event.clientX, event.clientY);
        this.camera.pan(mousePos);
    }

    handleKeyDown(event) {
        this.keys[event.key] = true; // Set the key as pressed
    }

    handleKeyUp(event) {
        this.keys[event.key] = false; // Reset the key as released
    }

    // The main simulation loop
    loop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000; // Calculate delta in seconds
        this.lastTime = currentTime;

        // Update camera position based on keyboard input
        this.camera.panWithKeyboard(this.keys);

        // Update and render entities
        this.update(deltaTime);
        this.render();

        // Request the next animation frame for smooth updating
        requestAnimationFrame(this.loop.bind(this)); // Ensure 'this' context is bound
    }

    // ... [rest of the Engine class methods remain unchanged]

    render() {
        this.worker.postMessage({ entities: this.entities, camera: this.camera });
    }

    // Handle rendering data from the worker
    handleRenderData(e) {
        const renderData = e.data;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        renderData.entities.forEach(data => {
            const screenCoords = this.camera.toScreenCoords(data.x, data.y);
            this.ctx.fillStyle = data.color;
            this.ctx.fillRect(screenCoords.x, screenCoords.y, data.width * this.camera.zoom, data.height * this.camera.zoom);
        });
    }
}


    //============================
    // Vector2: 2D Vector Class
    //============================
    class Vector2 {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        add(v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        }

        sub(v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }

        scale(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }

        dot(v) {
            return this.x * v.x + this.y * v.y;
        }

        magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        normalize() {
            const mag = this.magnitude();
            if (mag === 0) return new Vector2(0, 0);
            return this.scale(1 / mag);
        }

        // Convert vector to array
        toArray() {
            return [this.x, this.y];
        }

        // String representation
        toString() {
            return `Vector2(${this.x}, ${this.y})`;
        }
    }

    //============================
    // Vector3: 3D Vector Class
    //============================
    class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        add(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        }

        sub(v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        }

        scale(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            return this;
        }

        dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }

        cross(v) {
            return new Vector3(
                this.y * v.z - this.z * v.y,
                this.z * v.x - this.x * v.z,
                this.x * v.y - this.y * v.x
            );
        }

        magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }

        normalize() {
            const mag = this.magnitude();
            if (mag === 0) return new Vector3(0, 0, 0);
            return this.scale(1 / mag);
        }

        toArray() {
            return [this.x, this.y, this.z];
        }

        toString() {
            return `Vector3(${this.x}, ${this.y}, ${this.z})`;
        }
    }

    //============================
    // Matrix4: 4x4 Matrix Class for Transformations
    //============================
    class Matrix4 {
        constructor() {
            this.elements = new Float32Array(16).fill(0);
            this.identity();
        }

        identity() {
            this.elements[0] = 1; this.elements[5] = 1;
            this.elements[10] = 1; this.elements[15] = 1;
            return this;
        }

        multiplyMatrix(m) {
            const e = this.elements;
            const a = this.elements;
            const b = m.elements;

            // Row-major multiplication
            const result = new Float32Array(16);
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    result[row * 4 + col] =
                        a[row * 4 + 0] * b[0 * 4 + col] +
                        a[row * 4 + 1] * b[1 * 4 + col] +
                        a[row * 4 + 2] * b[2 * 4 + col] +
                        a[row * 4 + 3] * b[3 * 4 + col];
                }
            }
            this.elements = result;
            return this;
        }

        // Additional transformation methods can be added (e.g., translation, scaling, rotation)

        // Rotate around the Z-axis
        rotateZ(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            const te = this.elements;

            const m00 = te[0];
            const m01 = te[1];
            te[0] = m00 * c + m01 * s;
            te[1] = m01 * -s + m00 * c;

            return this;
        }

        // Convert matrix to array
        toArray() {
            return Array.from(this.elements);
        }

        // String representation
        toString() {
            return this.elements.toString();
        }
    }

    //============================
    // Quaternion Class for 3D Rotations
    //============================
    class Quaternion {
        constructor(x = 0, y = 0, z = 0, w = 1) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        // Normalize the quaternion
        normalize() {
            const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
            if (length === 0) return this;
            this.x /= length;
            this.y /= length;
            this.z /= length;
            this.w /= length;
            return this;
        }

        // Multiply with another quaternion
        multiply(q) {
            const x = this.x, y = this.y, z = this.z, w = this.w;
            this.x = x * q.w + w * q.x + y * q.z - z * q.y;
            this.y = y * q.w + w * q.y + z * q.x - x * q.z;
            this.z = z * q.w + w * q.z + x * q.y - y * q.x;
            this.w = w * q.w - x * q.x - y * q.y - z * q.z;
            return this;
        }

        // Convert quaternion to rotation matrix
        toRotationMatrix() {
            const x = this.x, y = this.y, z = this.z, w = this.w;
            const xx = x * x, yy = y * y, zz = z * z;
            const xy = x * y, xz = x * z;
            const yz = y * z;
            const wx = w * x, wy = w * y, wz = w * z;

            return new Matrix4().set(
                1 - 2 * (yy + zz), 2 * (xy - wz), 2 * (xz + wy), 0,
                2 * (xy + wz), 1 - 2 * (xx + zz), 2 * (yz - wx), 0,
                2 * (xz - wy), 2 * (yz + wx), 1 - 2 * (xx + yy), 0,
                0, 0, 0, 1
            );
        }

        // Set values of the matrix
        set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
            this.elements = new Float32Array([
                m00, m01, m02, m03,
                m10, m11, m12, m13,
                m20, m21, m22, m23,
                m30, m31, m32, m33
            ]);
            return this;
        }

        // Convert quaternion to array
        toArray() {
            return [this.x, this.y, this.z, this.w];
        }

        // String representation
        toString() {
            return `Quaternion(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
        }
    }

    //============================
    // Destroyable Base Class
    //============================
    class Destroyable {
        destroy() {
            // Clean up logic, if necessary
            console.log('Entity destroyed');
        }
    }

    // Expose Engine and other classes
    DynoEngine.Engine = Engine;
    DynoEngine.Vector2 = Vector2;
    DynoEngine.Vector3 = Vector3;
    DynoEngine.Matrix4 = Matrix4;
    DynoEngine.Quaternion = Quaternion;
    DynoEngine.Destroyable = Destroyable;

    return DynoEngine;
}));

