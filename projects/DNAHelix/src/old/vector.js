const { Vector4 } = require("three/src/Three.js");

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Vector = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const Vector = {};

  class Vec2 {
    constructor(x = 0, y = 0) {
      if (!(this instanceof Vec2)) {
        return new Vec2(x, y);
      }
      this.x = x;
      this.y = y;
      return this;
    }
    scale(n) {
      this.x *= n;
      this.y *= n;
      return this;
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
    dot(v) {
      return this.x * v.x + this.y * v.y;
    }
    distanceTo(v) {
      const dx = this.x - v.x;
      const dy = this.y - v.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    div(v) {
      if (v.x === 0 || v.y === 0) {
        throw new Error("Division by zero");
      }
      this.x /= v.x;
      this.y /= v.y;
      return this;
    }
    magnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    unit() {
      const mag = this.magnitude();
      return mag === 0 ? new Vec2(0, 0) : this.scale(1 / mag);
    }
  }

  Object.defineProperty(Vec2, "I", {
    value: new Vec2(1, 0),
    writable: false,
    configurable: false,
  });

  Object.defineProperty(Vec2, "J", {
    value: new Vec2(0, 1),
    writable: false,
    configurable: false,
  });


  Vector.Vec2 = Vec2;
  class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    /**
       *
       * @param {*} num
       * @returns
       */
    scale(num) {
      this.x *= num;
      this.y *= num;
      this.z *= num;
      return this;
    }
    /**
       * Add a 3D Vector
       * @memberof Vec3
       * @param {*} obj
       * @returns
       */
    add(obj) {
      this.x += obj.x;
      this.y += obj.y;
      this.z += obj.z;
      return this;
    }
    /**
       *
       * @param {*} obj
       * @returns Vec3
       */
    sub(obj) {
      this.x -= obj.x;
      this.y -= obj.y;
      this.z -= obj.z;
      return this;
    }
    /**
       * Cross Product of a 3D Vector
       * @memberof Vec3
       * @param {object} obj  Vec3
       * @returns Vec3
       */
    cross(obj) {
      const newX = this.y * obj.z - this.z * obj.y;
      const newY = this.z * obj.x - this.x * obj.z;
      const newZ = this.x * obj.y - this.y * obj.x;
      this.x = newX;
      this.y = newY;
      this.z = newZ;
      return this;
    }
    /**
       * @
       * @memberof Vec3
       * @param {*}
       */
    dot(obj) {
      return this.x * obj.x + this.y * obj.y + this.z * obj.z;
    }
    div(obj) {
      this.x /= obj.x;
      this.y /= obj.y;
      this.z /= obj.z;
      return this;
    }

    mul(obj) {
      this.x *= obj.x;
      this.y *= obj.y;
      this.z *= obj.z;
      return this;
    }
    magnitude() {
      return Math.sqrt(
        Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2)
      );
    }
    distanceTo(obj) {
      const dx = this.x - obj.x;
      const dy = this.y - obj.y;
      const dz = this.z - obj.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    unit() {
      const mag = this.magnitude();
      this.x /= mag;
      this.y /= mag;
      this.z /= mag;
      return this;
    }
    rotX(theta) {
      const angleInRadian = (Math.PI / 180) * theta;
      const cosTheta = Math.cos(angleInRadian);
      const sinTheta = Math.sin(angleInRadian);
      const newY = this.y * cosTheta - this.z * sinTheta;
      const newZ = this.y * sinTheta + this.z * cosTheta;
      this.y = newY;
      this.z = newZ;
      return this;
    }
    rotY(theta) {
      const angleInRadian = (Math.PI / 180) * theta;
      const cosTheta = Math.cos(angleInRadian);
      const sinTheta = Math.sin(angleInRadian);
      const newX = this.x * cosTheta - this.z * sinTheta;
      const newZ = this.x * sinTheta + this.z * cosTheta;
      this.x = newX;
      this.z = newZ;
      return this;
    }
    rotZ(theta) {
      const angleInRadian = (Math.PI / 180) * theta;
      const cosTheta = Math.cos(angleInRadian);
      const sinTheta = Math.sin(angleInRadian);
      const newX = this.x * cosTheta - this.y * sinTheta;
      const newY = this.x * sinTheta + this.y * cosTheta;
      this.x = newX;
      this.y = newY;
      return this;
    }
    toArray() {
      return [this.x, this.y, this.z];
    }
    clone() {
      return new Vec3(this.x, this.y, this.z);
    }
    toString() {
      return `Vec3: { x: ${this.x}, y: ${this.y}, z: ${this.z} }`;
    }
    reflect(v) {
      var dot = this.dot(v);
      var len = v.magnitude();
      return v
        .clone()
        .dot(dot / len)
        .mul(2)
        .sub(this);
    }
    project;
  }

  Object.defineProperty(Vec3, "I", {
    value: new Vec3(1, 0, 0),
    configurable: false,
    writable: false,
  });

  Object.defineProperty(Vec3, "J", {
    value: new Vec3(0, 1, 0),
    configurable: false,
    writable: false,
  });

  Object.defineProperty(Vec3, "K", {
    value: new Vec3(0, 0, 1),
    configurable: false,
    writable: false,
  });

  Vector.Vec3 = Vec3;

  class Vec4 extends vec3 {
    constructor(x, y, z, w) {
      super(x, y, z);
      this.w = w || 0;
    }
  }

  Vector.Vec4 = Vec4;

  // Importing necessary libraries
import { Vector2, Vector3, Vector4 } from 'three';

// Quaternion class
class Quaternion extends Vector4 {
    constructor(x, y, z, w) {
        super(x, y, z, w);
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
    }

    multiply(other) {
        return new Quaternion(
            this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
            this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
            this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w,
            this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z
        );
    }

    divide(other) {
        return new Quaternion(
            this.w * other.x - this.x * other.w - this.y * other.z + this.z * other.y,
            this.w * other.y + this.x * other.z - this.y * other.w - this.z * other.x,
            this.w * other.z - this.x * other.y + this.y * other.x - this.z * other.w,
            this.w * other.w + this.x * other.x + this.y * other.y + this.z * other.z
        );
    }

    negate() {
        return new Quaternion(-this.x, -this.y, -this.z, -this.w);
    }

    equals(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    }

    conjugate() {
        return new Quaternion(-this.x, -this.y, -this.z, this.w);
    }

    inverse() {
        return this.conjugate().divide(this.dot(this));
    }

    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
    }

    normalize() {
        const len = this.dot(this);
        this.x /= len;
        this.y /= len;
        this.z /= len;
        this.w /= len;
    }

    rotateVector(vector) {
        return this.multiply(new Quaternion(vector.x, vector.y, vector.z, 0)).multiply(this.inverse()).toVector3();
    }

    rotatePoint(point) {
        return this.multiply(new Quaternion(point.x, point.y, point.z, 0)).multiply(this.inverse()).toVector3();
    }

    rotateQuaternion(quaternion) {
        return this.multiply(quaternion).multiply(this.inverse());
    }

    fromAxisAngle(axis, angle) {
        const halfAngle = angle / 2;
        const sin = Math.sin(halfAngle);
        this.x = axis.x * sin;
        this.y = axis.y * sin;
        this.z = axis.z * sin;
        this.w = Math.cos(halfAngle);
    }

    fromEulerAngles(roll, pitch, yaw) {
        const cr = Math.cos(roll / 2);
        const cp = Math.cos(pitch / 2);
        const cy = Math.cos(yaw / 2);
        const sr = Math.sin(roll / 2);
        const sp = Math.sin(pitch / 2);
        const sy = Math.sin(yaw / 2);
        this.x = sr * cp * cy - cr * sp * sy;
        this.y = cr * sp * cy + sr * cp * sy;
        this.z = cr * cp * sy - sr * sp * cy;
        this.w = cr * cp * cy + sr * sp * sy;
    }

    toAxisAngle() {
        const axis = new Vector3(this.x, this.y, this.z);
        const angle = 2 * Math.acos(this.w);
        axis.normalize();
        return [axis, angle];
    }

    toEulerAngles() {
        const roll = Math.atan2(2 * (this.w * this.x + this.y * this.z), 1 - 2 * (this.x * this.x + this.y * this.y));
        const pitch = Math.asin(2 * (this.w * this.y - this.z * this.x));
        const yaw = Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z));
        return [roll, pitch, yaw];
    }

    toMatrix() {
        const matrix = new Array(3).fill().map(() => new Array(3).fill(0));
        matrix[0][0] = 1 - 2 * (this.y * this.y + this.z * this.z);
        matrix[0][1] = 2 * (this.x * this.y + this.z * this.w);
        matrix[0][2] = 2 * (this.x * this.z - this.y * this.w);
        matrix[1][0] = 2 * (this.x * this.y - this.z * this.w);
        matrix[1][1] = 1 - 2 * (this.x * this.x + this.z * this.z);
        matrix[1][2] = 2 * (this.y * this.z + this.x * this.w);
        matrix[2][0] = 2 * (this.x * this.z + this.y * this.w);
        matrix[2][1] = 2 * (this.y * this.z - this.x * this.w);
        matrix[2][2] = 1 - 2 * (this.x * this.x + this.y * this.y);
        return matrix;
    }

    toArray() {
        return [this.x, this.y, this.z, this.w];
    }

    toVector3() {
        return new Vector3(this.x, this.y, this.z);
    }

    toVector2() {
        return new Vector2(this.x, this.y);
    }

    toVector4() {
        return new Vector4(this.x, this.y, this.z, this.w);
    }
}


  class Matrix {
    constructor(n, m) {
        this.data = Array(n).fill().map(() => Array(m).fill(0));
    }

    toString() {
        return this.data.map(row => row.join(' ')).join('\n');
    }

    static add(a, b) {
        let result = new Matrix(a.data.length, a.data[0].length);
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                result.data[i][j] = a.data[i][j] + b.data[i][j];
            }
        }
        return result;
    }

    static subtract(a, b) {
        let result = new Matrix(a.data.length, a.data[0].length);
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                result.data[i][j] = a.data[i][j] - b.data[i][j];
            }
        }
        return result;
    }

    static multiply(a, b) {
        let result = new Matrix(a.data.length, a.data[0].length);
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                result.data[i][j] = a.data[i][j] * b.data[i][j];
            }
        }
        return result;
    }

    static divide(a, b) {
        let result = new Matrix(a.data.length, a.data[0].length);
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                result.data[i][j] = a.data[i][j] / b.data[i][j];
            }
        }
        return result;
    }

    static negate(a) {
        let result = new Matrix(a.data.length, a.data[0].length);
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                result.data[i][j] = -a.data[i][j];
            }
        }
        return result;
    }

    static equals(a, b) {
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                if (a.data[i][j] !== b.data[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    static lessThan(a, b) {
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                if (a.data[i][j] >= b.data[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    static lessOrEqual(a, b) {
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                if (a.data[i][j] > b.data[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    static power(a, b) {
        let result = new Matrix(a.data.length, a.data[0].length);
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                result.data[i][j] = Math.pow(a.data[i][j], b.data[i][j]);
            }
        }
        return result;
    }

    static modulo(a, b) {
        let result = new Matrix(a.data.length, a.data[0].length);
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                result.data[i][j] = a.data[i][j] % b.data[i][j];
            }
        }
        return result;
    }

    static concat(a, b) {
        let result = new Matrix(a.data.length, a.data[0].length);
        for (let i = 0; i < a.data.length; i++) {
            for (let j = 0; j < a.data[i].length; j++) {
                result.data[i][j] = a.data[i][j].toString() + b.data[i][j].toString();
            }
        }
        return result;
    }

    get length() {
        return this.data.length * this.data[0].length;
    }

    call(...args) {
        let result = new Matrix(this.data.length, this.data[0].length);
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                result.data[i][j] = this.data[i][j](...args);
            }
        }
        return result;
    }

    get(i, j) {
        return this.data[i][j];
    }

    set(i, j, value) {
        this.data[i][j] = value;
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                yield this.data[i][j];
            }
        }
    }
}

return Vector;


}));
