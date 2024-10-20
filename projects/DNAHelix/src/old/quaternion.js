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
