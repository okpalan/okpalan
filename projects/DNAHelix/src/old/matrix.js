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
