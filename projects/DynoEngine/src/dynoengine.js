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
class LRUCache {
    constructor(limit) {
        this.limit = limit;
        this.cache = new Map(); // Using a Map to maintain the order of keys
    }

    get(key) {
        if (!this.cache.has(key)) {
            return null; // Return null if the asset is not in the cache
        }
        const value = this.cache.get(key);
        // Move the accessed item to the end (most recently used)
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    set(key, value) {
        if (this.cache.has(key)) {
            // If the item is already in the cache, delete it
            this.cache.delete(key);
        } else if (this.cache.size >= this.limit) {
            // If the cache is full, remove the least recently used item (first item)
            this.cache.delete(this.cache.keys().next().value);
        }
        // Add the new item to the cache
        this.cache.set(key, value);
    }

    has(key) {
        return this.cache.has(key);
    }

    delete(key) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}

class AssetManager {
    constructor(cacheLimit = 10) {
        this.cache = new LRUCache(cacheLimit); // Initialize the LRU cache
        this.loadingPromises = {};
        this.references = {}; // Track references to loaded assets
    }

    loadAsset(type, path) {
        if (this.cache.has(path)) {
            // If the asset is in the cache, increment reference count
            this.references[path] = (this.references[path] || 0) + 1;
            return Promise.resolve(this.cache.get(path));
        }

        if (this.loadingPromises[path]) {
            return this.loadingPromises[path];
        }

        let loadPromise;

        switch (type) {
            case 'image':
                loadPromise = this.loadImage(path);
                break;
            case 'audio':
                loadPromise = this.loadAudio(path);
                break;
            case 'json':
                loadPromise = this.loadJSON(path);
                break;
            default:
                throw new Error(`Unsupported asset type: ${type}`);
        }

        this.loadingPromises[path] = loadPromise;

        return loadPromise.then(asset => {
            this.cache.set(path, asset); // Add asset to the LRU cache
            this.references[path] = 1; // Initialize reference count
            delete this.loadingPromises[path]; // Clean up loading promise
            return asset;
        });
    }

    unloadAsset(path) {
        if (this.cache.has(path)) {
            this.references[path] = (this.references[path] || 0) - 1;
            if (this.references[path] <= 0) {
                this.cache.delete(path); // Remove asset from cache
                delete this.references[path]; // Remove reference count
                console.log(`Asset unloaded: ${path}`);
            }
        } else {
            console.warn(`Attempted to unload non-loaded asset: ${path}`);
        }
    }

    // Load image
    loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = path;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
        });
    }

    // Load audio
    loadAudio(path) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = path;
            audio.onloadeddata = () => resolve(audio);
            audio.onerror = () => reject(new Error(`Failed to load audio: ${path}`));
        });
    }

    // Load JSON
    loadJSON(path) {
        return fetch(path)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load JSON: ${path}`);
                return response.json();
            })
            .then(data => {
                this.cache.set(path, data); // Add data to the LRU cache
                this.references[path] = 1; // Initialize reference count
                return data;
            });
    }

    // Get asset
    getAsset(path) {
        return this.cache.get(path);
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
        constructor() {
            if (new.target === Destroyable) {
                throw new Error('Destroyable is an abstract class and cannot be instantiated directly.');
            }
            this.state = "initialized"; // Track state
            this.beforeHooks = [];
            this.afterHooks = [];
        }
    
        // Register a 'before' hook, returning the instance to allow chaining
        before(callback) {
            if (this.state === "initialized") {
                this.beforeHooks.push(callback);
            }
            return this; // Chainable
        }
    
        // Register an 'after' hook, returning the instance to allow chaining
        after(callback) {
            if (this.state === "initialized") {
                this.afterHooks.push(callback);
            }
            return this; // Chainable
        }
    
        // Initialize the object and run 'before' hooks
        initialize(...args) {
            if (this.state === "initialized") {
                this.beforeHooks.forEach(hook => hook(...args));  // Execute all 'before' hooks
                this.beforeHooks = [];  // Clear the before hooks
                this.state = "constructed"; // Move to constructed state
                console.log("Initialized");
            }
        }
    
        // Tear down and run 'after' hooks
        destroy(...args) {
            if (this.state === "constructed") {
                this.afterHooks.forEach(hook => hook(...args));  // Execute all 'after' hooks
                this.afterHooks = [];  // Clear the after hooks
                this.state = "deleted";  // Set state to deleted
                console.log("Destroyed");
            }
        }
    }

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
    
        // Main simulation loop
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
    
        // Update all entities in the engine
        update(deltaTime) {
            for (const entity of this.entities) {
                if (entity.update) {
                    entity.update(deltaTime); // Call entity's update method
                }
            }
        }
    
        render() {
            // Send entities and camera info to the worker for rendering
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
    
        // Optional method to add entities to the engine
        addEntity(entity) {
            this.entities.push(entity);
        }
    
        // Optional method to remove entities from the engine
        removeEntity(entity) {
            const index = this.entities.indexOf(entity);
            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    
        // Optional method for handling zoom (if needed)
        handleZoom(event) {
            const zoomSpeed = 0.1;
            if (event.deltaY < 0) {
                this.camera.zoom += zoomSpeed; // Zoom in
            } else {
                this.camera.zoom -= zoomSpeed; // Zoom out
            }
            this.camera.zoom = Math.max(0.1, this.camera.zoom); // Prevent zooming out too far
            event.preventDefault(); // Prevent default scrolling behavior
        }
    }
    
    class Entity {
    constructor(x, y, width, height, color) {
        this.position = new Vector2(x, y);
        this.width = width;
        this.height = height;
        this.color = color;
    }

    update(deltaTime) {
        // Example movement logic (move right every second)
        this.position.x += 100 * deltaTime; // Move at 100 units per second
    }
}

    // Expose Engine and other classes
    DynoEngine.Engine = Engine;
    DynoEngine.Vector2 = Vector2;
    DynoEngine.Vector3 = Vector3;
    DynoEngine.Matrix4 = Matrix4;
    DynoEngine.Entity = Entity;
    DynoEngine.Quaternion = Quaternion;
    DynoEngine.Destroyable = Destroyable;

    return DynoEngine;
}));

