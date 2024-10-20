// DynoEngine: A dynamic and modular math/physics engine for 3D applications

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

    class Engine {
        constructor() {
            this.entities = [];  // Hold all entities
            this.lastTime = 0;   // To track time for delta updates
        }

        // Utility to get current time for consistent delta calculation
        getTime() {
            return (window.performance && window.performance.now) ? window.performance.now() : Date.now();
        }

        // Add an entity to the engine
        addEntity(entity) {
            if (entity instanceof Destroyable) {
                this.entities.push(entity);
            } else {
                console.warn('Only Destroyable entities can be added to DynoEngine.');
            }
        }

        // Remove an entity from the engine
        removeEntity(entity) {
            const index = this.entities.indexOf(entity);
            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }

        // Update each entity based on deltaTime
        update(deltaTime) {
            this.entities.forEach(entity => {
                if (typeof entity.update === 'function') {
                    entity.update(deltaTime);
                }
            });
        }

        // Render entities (if applicable)
        render() {
            this.entities.forEach(entity => {
                if (typeof entity.render === 'function') {
                    entity.render();
                }
            });
        }

        // The main simulation loop
        loop(currentTime) {
            const deltaTime = (currentTime - this.lastTime) / 1000;  // Calculate delta in seconds
            this.lastTime = currentTime;

            // Update and render entities
            this.update(deltaTime);
            this.render();

            // Request the next animation frame for smooth updating
            requestAnimationFrame(this.loop.bind(this));  // Ensure 'this' context is bound
        }

        // Start the simulation loop
        start() {
            this.lastTime = this.getTime();
            requestAnimationFrame(this.loop.bind(this));  // Start the loop
        }

        // Stop and clear entities
        clear() {
            this.entities.forEach(entity => {
                entity.destroy();  // Trigger any after-hooks
            });
            this.entities = [];  // Clear all entities
        }
    }

    DynoEngine.Engine = Engine;

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
            this.elements.set(result);
            return this;
        }

        translate(x, y, z) {
            const te = this.elements;
            te[12] += x; te[13] += y; te[14] += z;
            return this;
        }

        scale(x, y, z) {
            const te = this.elements;
            te[0] *= x; te[5] *= y; te[10] *= z;
            return this;
        }

        rotateX(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            const te = this.elements;

            const m10 = te[4];
            const m11 = te[5];
            const m12 = te[6];
            const m13 = te[7];
            te[4] = m10 * c + te[8] * s;
            te[5] = m11 * c + te[9] * s;
            te[6] = m12 * c + te[10] * s;
            te[7] = m13 * c + te[11] * s;

            te[8] = m10 * -s + te[8] * c;
            te[9] = m11 * -s + te[9] * c;
            te[10] = m12 * -s + te[10] * c;
            te[11] = m13 * -s + te[11] * c;

            return this;
        }

        rotateY(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            const te = this.elements;

            const m00 = te[0];
            const m01 = te[1];
            const m02 = te[2];
            const m03 = te[3];

            te[0] = m00 * c - te[8] * s;
            te[1] = m01 * c - te[9] * s;
            te[2] = m02 * c - te[10] * s;
            te[3] = m03 * c - te[11] * s;

            te[8] = m00 * s + te[8] * c;
            te[9] = m01 * s + te[9] * c;
            te[10] = m02 * s + te[10] * c;
            te[11] = m03 * s + te[11] * c;

            return this;
        }

        rotateZ(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            const te = this.elements;

            const m00 = te[0];
            const m01 = te[1];
            const m02 = te[2];
            const m03 = te[3];

            te[0] = m00 * c + m01 * s;
            te[1] = m01 * -s + m01 * c;
            te[2] = m02;
            te[3] = m03;

            return this;
        }
    }

    //============================
    // Component System
    //============================
    class Component {
        constructor(entity) {
            this.entity = entity;  // Reference to the entity this component is attached to
        }
        update(deltaTime) {
            // Default update method; can be overridden in subclasses
        }
    }

    class Entity {
        constructor() {
            this.components = [];  // Hold components
            this.position = new Vector3();  // Entity's position
            this.rotation = new Vector3();  // Entity's rotation
            this.scale = new Vector3(1, 1, 1);  // Entity's scale
        }

        addComponent(component) {
            this.components.push(component);
            component.entity = this;  // Set the entity reference
        }

        removeComponent(component) {
            const index = this.components.indexOf(component);
            if (index > -1) {
                this.components.splice(index, 1);
            }
        }

        update(deltaTime) {
            this.components.forEach(component => {
                if (typeof component.update === 'function') {
                    component.update(deltaTime);
                }
            });
        }

        // Render entities if necessary
        render() {
            // Placeholder for rendering logic
        }

        // Convert entity to JSON
        toJSON() {
            return {
                position: this.position.toArray(),
                rotation: this.rotation.toArray(),
                scale: this.scale.toArray(),
                components: this.components.map(component => component.constructor.name)
            };
        }

        // Static method to create an entity from JSON
        static fromJSON(data) {
            const entity = new Entity();
            entity.position = new Vector3(...data.position);
            entity.rotation = new Vector3(...data.rotation);
            entity.scale = new Vector3(...data.scale);
            data.components.forEach(componentName => {
                // Instantiate and add components based on componentName
            });
            return entity;
        }
    }

    //============================
    // Physics Component
    //============================
    class PhysicsComponent extends Component {
        constructor(entity, mass) {
            super(entity);
            this.mass = mass;
            this.velocity = new Vector3();
            this.acceleration = new Vector3();
        }

        update(deltaTime) {
            // Update velocity and position based on physics calculations
            this.velocity.add(this.acceleration.scale(deltaTime));
            this.entity.position.add(this.velocity.scale(deltaTime));
            this.acceleration.scale(0);  // Reset acceleration for the next frame
        }

        applyForce(force) {
            this.acceleration.add(force.scale(1 / this.mass));  // F = m*a -> a = F/m
        }
    }

    //============================
    // Event System
    //============================
    class EventEmitter {
        constructor() {
            this.events = {};
        }

        on(event, listener) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(listener);
        }

        emit(event, ...args) {
            if (this.events[event]) {
                this.events[event].forEach(listener => listener(...args));
            }
        }
    }

    //============================
    // Input Handling
    //============================
    class InputHandler {
        constructor() {
            this.keys = {};  // Track key states
            window.addEventListener('keydown', (event) => {
                this.keys[event.code] = true;
            });
            window.addEventListener('keyup', (event) => {
                this.keys[event.code] = false;
            });
        }

        isKeyPressed(key) {
            return this.keys[key] || false;
        }
    }

    // Export the DynoEngine
    return DynoEngine;
}));

// Usage Example
const engine = new DynoEngine.Engine();
engine.start();
