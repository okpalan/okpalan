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
            if (entity instanceof Tearable) {
                this.entities.push(entity);
            } else {
                console.warn('Only Tearable entities can be added to DynoEngine.');
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
  
        te[0] = m00 * c + te[4] * s;
        te[1] = m01 * c + te[5] * s;
        te[2] = m02 * c + te[6] * s;
        te[3] = m03 * c + te[7] * s;
  
        te[4] = m00 * -s + te[4] * c;
        te[5] = m01 * -s + te[5] * c;
        te[6] = m02 * -s + te[6] * c;
        te[7] = m03 * -s + te[7] * c;
  
        return this;
      }
  
      toString() {
        return `Matrix4(${this.elements.join(", ")})`;
      }
    }
  
    //============================
    // Quaternion Class
    //============================
    class Quaternion {
      constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
      }
  
      multiply(q) {
        return new Quaternion(
          this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
          this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
          this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w,
          this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
        );
      }
  
      normalize() {
        const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        if (length === 0) return new Quaternion(0, 0, 0, 1);
        const invLength = 1 / length;
        this.x *= invLength;
        this.y *= invLength;
        this.z *= invLength;
        this.w *= invLength;
        return this;
      }
  
      toString() {
        return `Quaternion(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
      }
    }
  
    DynoEngine.Utils = { };
     class TearableLifecycle {
        constructor() {
            if (new.target === TearableLifecycle) {
                throw new Error('TearableLifecycle is an abstract class and cannot be instantiated directly.');
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
    
    
    // Expose public API
    DynoEngine.Vector2 = Vector2;
    DynoEngine.Vector3 = Vector3;
    DynoEngine.Matrix4 = Matrix4;
    DynoEngine.Quaternion = Quaternion;
    
   
    return DynoEngine;
  }));
  
  