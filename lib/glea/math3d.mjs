export class Vec2 {

  constructor(x, y) {
    if (arguments.length === 0) {
      this.x = this.y = 0;
      return;
    }
    if (arguments.length === 1) {
      if (typeof x === 'number') {
        this.x = this.y = x;
        return;
      }
      if (x instanceof Vec2) {
        this.x = x.x;
        this.y = x.y;
        return;
      }
      if (x instanceof Array) {
        this.x = x[0] || 0;
        this.y = x[1] || 0;
        return;
      }
    }
    if (typeof x === 'number' && typeof y === 'number') {
      this.x = x;
      this.y = y;
      return;
    }
    throw Error('ArgumentError');
  }

  add(otherVec) {
    return new Vec2(this.x + otherVec.x, this.y + otherVec.y);
  }

  sub(otherVec) {
    return new Vec2(this.x - otherVec.x, this.y - otherVec.y);
  }

  mul(value) {
    return new Vec2(this.x * value, this.y * value);
  }

  div(value) {
    return new Vec2(this.x / value, this.y / value);
  }

  dot(otherVec) {
    return this.x * otherVec.x + this.y * otherVec.y;
  }

  equals(otherVec) {
    return (this.x === otherVec.x && this.y === otherVec.y);
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  toArray() {
    return [this.x, this.y];
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

export class Vec3 {

  constructor(x, y, z) {
    if (arguments.length === 1) {
      if (typeof x === 'number') {
        this.x = this.y = this.z = x;
        return;
      }
      if (typeof x === "object") {
        if (x instanceof Vec3) {
          this.x = x.x;
          this.y = x.y;
          this.z = x.z;
          return;
        }
        if (x instanceof Vec2) {
          this.x = x.x;
          this.y = x.y;
          this.z = 0;
          return;
        }
        if (x instanceof Array) {
          this.x = x[0] || 0;
          this.y = x[1] || 0;
          this.z = x[2] || 0;
          return;
        }
      }
      throw Error('ArgumentError');
    }
    if (arguments.length === 2) {
      if (typeof x === 'number' && typeof y === 'number') {
        this.x = x;
        this.y = y;
        this.z = 0;
        return;
      }
      if (x instanceof Vec2 && typeof y === 'number') {
        this.x = x.x;
        this.y = x.y;
        this.z = y;
        return;
      }
      if (typeof x === 'number' && y instanceof Vec2) {
        this.x = x;
        this.y = y.x;
        this.z = y.y;
        return;
      } 
      throw Error('ArgumentError');
    }
    if (arguments.length === 3) {
      if (typeof x === 'number' &&
        typeof y === 'number' &&
        typeof z === 'number') {
        this.x = x;
        this.y = y;
        this.z = z;
        return;
      }
      throw Error('ArgumentError');
    }
  }

  get r() {
    return this.x;
  }

  set r(value) {
    this.x = value;
  }

  get g() {
    return this.y;
  }

  set g(value) {
    this.y = value;
  }

  get b() {
    return this.z;
  }

  set b(value) {
    this.z = value;
  }

  get xy() {
    return new Vec2(this.x, this.y);
  }

  get yz() {
    return new Vec2(this.y, this.z);
  }

  get xz() {
    return new Vec2(this.x, this.z);
  }

  add(otherVec) {
    return new Vec3(
      this.x + otherVec.x,
      this.y + otherVec.y,
      this.z + otherVec.z
    );
  }

  sub(otherVec) {
    return new Vec3(
      this.x - otherVec.x,
      this.y - otherVec.y,
      this.z - otherVec.z
    );
  }

  mul(value) {
    return new Vec3(this.x * value, this.y * value, this.z * value);
  }

  div(value) {
    return new Vec3(this.x / value, this.y / value, this.z / value);
  }

  cross(otherVec) {
    return new Vec3(
      this.y * otherVec.z - this.z * otherVec.y,
      this.z * otherVec.x - this.x * otherVec.z,
      this.x * otherVec.y - this.y * otherVec.x);
  }

  dot(otherVec) {
    return this.x * otherVec.x + this.y * otherVec.y + this.z * otherVec.z;
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  get normalized() {
    return this.div(this.length);
  }

  toArray() {
    return [this.x, this.y, this.z]
  }
  
  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }

  equals(otherVec) {
    return otherVec instanceof Vec3 &&
      this.x === otherVec.x && 
      this.y === otherVec.y && 
      this.z === otherVec.z; 
  }
}

export class Mat {

  constructor(...values) {
    const MxN = (typeof values[0] === "string" && /^\d+x\d+$/.test(values[0])) ? 
      values[0].split('x').map(num => parseInt(num, 10)) : null;
    this.values = MxN !== null ? values.slice(1) : values;
    if (MxN !== null && MxN[0] > 0 && MxN[1] > 0) {
      this.numRows = MxN[0];
      this.numCols = MxN[1];  
    } else {
      const dimension = Math.sqrt(values.length);
      if (Number.isInteger(dimension)) {
        this.numColumns = this.numRows = dimension; 
        return;
      }
      throw Error("ArgumentError");
    }
  }

  toArray() {
    const { numRows, numCols, values } = this;
    if (numCols !== numRows) {
      return [`${numRows}x${numCols}`, ...values];
    }
    return this.values;
  }

  static fromArray(values) {
    return new Mat2(...values);
  }

  valueAt(row, column) {
    return this.values[column * this.numRows + row];
  }
  
  colAt(column) {
    const { numRows } = this;
    return this.values.slice(column * numRows, column * numRows + numRows);
  }

  rowAt(row) {
    return Array(2).fill(0).map((_, column) => this.values[column * 2 + row]);
  }

  equals(otherMatrix) {
    if (this.values.length !== otherMatrix.values.length ||
        this.numCols !== otherMatrix.numCols ||
        this.numRows !== otherMatrix.numRows) {
      return false;
    }
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] !== otherMatrix.values[i]) {
        return false;
      }
    }
    return true;
  }

  add(otherMatrix) {
    if (this.numCols === otherMatrix.numCols &&
        this.numRows === otherMatrix.numRows &&
        this.values.length === otherMatrix.values.length) {
      const newValues = this.values.map((value, i) => value + otherMatrix.values[i]);
      if (this.numRows !== this.numCols) {
        newValues.unshift(`${this.numRows}x${this.numCols}`);
      }
      return Mat.fromArray(newValues);
    }
    throw Error('ArgumentError');
  }

  sub(otherMatrix) {
    if (this.numCols === otherMatrix.numCols &&
        this.numRows === otherMatrix.numRows &&
        this.values.length === otherMatrix.values.length) {
      const newValues = this.values.map((value, i) => value - otherMatrix.values[i]);
      if (this.numRows !== this.numCols) {
        newValues.unshift(`${this.numRows}x${this.numCols}`);
      }
      return Mat.fromArray(newValues);
    }
    throw Error('ArgumentError');
  }

  mul(param) {
    if (typeof param === "number") {
      const multipliedValues = this.values.map(value => value * param);
      if (this.numRows !== this.numCols) {
        multipliedValues.unshift(`${this.numRows}x${this.numCols}`);
      }
      return Mat.fromArray(multipliedValues);
    }
    if (param instanceof Mat) {
      const mat = param;
      const { numRows } = this;
      const { numCols } = mat;
      const multipliedValues = Array(numRows * numCols).fill(0).map((_, idx) => {
        const y = (idx % numRows);
        const x = (idx / numCols)|0;
        const row = this.rowAt(y);
        const col = mat.colAt(x);
        return row
          .map((value, i) => value * col[i])
          .reduce((a, b) => a + b);
      });
      if (numRows !== numCols) {
        multipliedValues.unshift(`${numRows}x${numCols}`);
      }
      return Mat.fromArray(multipliedValues);
    }
    throw Error("ArgumentError");
  }

  toString() {
    const { numRows, numCols, values } = this;
    return `mat${numRows}x${numCols}(${values.join(', ')})`;
  }
}


export class Mat2 extends Mat {

  constructor(...values) {
    super(...values);
    this.numRows = 2;
    this.numCols = 2;
  }

  toArray() {
    return this.values;
  }

  static fromArray(values) {
    return new Mat2(...values);
  }

  static identity() {
    return new Mat2(
      1, 0,  // column1
      0, 1); // column2
  }

  determinant() {
    const { values } = this;
    return values[0] * values[3] - values[1] * values[2];
  }

  toString() {
    return `mat2(${this.values.join(', ')})`;
  }

}

export class Mat4 extends Mat {
  constructor(...values) {
    // input is like in glsl mat4:
    // column0: row 0, row 1, row 2, row 3 
    // column1: row 0, row 1, row 2, row 3
    // column2: row 0, row 1, row 2, row 3
    // column3: row 0, row 1, row 2, row 3
    super(...values);
    this.numCols = 4;
    this.numRows = 4;
  }

  toArray() {
    return this.values;
  }

  static fromArray(values) {
    return new Mat4(...values);
  }

  static Identity() {
    return new Mat4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1);
  }

  static Translate(x, y, z) {
    return new Mat4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    );
  }

  static RotX(angle) {
    const { sin, cos } = Math;
    const S = sin(angle);
    const C = cos(angle);
    return new Mat4(
      1, 0, 0, 0,
      0, C, S, 0,
      0,-S, C, 0,
      0, 0, 0, 1
    );
  }

  static RotY(angle) {
    const { sin, cos } = Math;
    const S = sin(angle);
    const C = cos(angle);
    return new Mat4(
      C, 0,-S, 0,
      0, 1, 0, 0,
      S, 0, C, 0,
      0, 0, 0, 1);
  }

  static RotZ(angle) {
    const { sin, cos } = Math;
    const S = sin(angle);
    const C = cos(angle);
    return new Mat4(
      C, S, 0, 0,
	   -S, C, 0, 0,
	    0, 0, 1, 0,
	    0, 0, 0, 1
    );
  }
}
