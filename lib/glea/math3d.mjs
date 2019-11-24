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

export class Mat2 {

  constructor(...values) {
    this.values = values;
    this.numCols = 2;
    this.numRows = 2;
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

  determinant() {
    const { values } = this;
    return values[0] * values[3] - values[1] * values[2];
  }

  equals(otherMatrix) {
    if (this.values.length !== otherMatrix.values.length) {
      return false;
    }
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] !== otherMatrix.values[i]) {
        return false;
      }
    }
    return true;
  }

  add(param) {
    if (param instanceof Mat2) {
      return Mat2.fromArray(
        this.values.map((value, i) => {
          return value + param.values[i];
        })
      );
    }
    throw Error('ArgumentError');
  }

  sub(param) {
    if (param instanceof Mat2) {
      return Mat2.fromArray(
        this.values.map((value, i) => {
          return value - param.values[i];
        })
      );
    }
    throw Error('ArgumentError');
  }

  mul(param) {
    if (typeof param === "number") {
      return Mat2.fromArray(this.values.map(value => value * param));
    }
    if (param instanceof Mat2) {
      const mat = param;
      const { numRows, numCols } = this;
      return Mat2.fromArray(Array(numRows * numCols).fill(0).map((_, idx) => {
        const y = (idx % numRows);
        const x = (idx / numCols)|0;
        const row = this.rowAt(y);
        const col = mat.colAt(x);
        return row
          .map((value, i) => value * col[i])
          .reduce((a, b) => a + b);
      }));
    }
    throw Error("ArgumentError");
  }

  toString() {
    return `mat2(${this.values.join(', ')})`;
  }

}


export class Mat4 {
  constructor(...values) {
    // input is like in glsl mat4:
    // column0: row 0, row 1, row 2, row 3 
    // column1: row 0, row 1, row 2, row 3
    // column2: row 0, row 1, row 2, row 3
    // column3: row 0, row 1, row 2, row 3
    this.values = values;
  }

  toArray() {
    return this.values;
  }

  static get Identity() {
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

  valueAt(row, column) {
    return this.values[column * 4 + row];
  }

  colAt(column) {
    return this.values.slice(column * 4, column * 4 + 4);
  }

  rowAt(row) {
    return Array(4).map((_, column) => this.values[row * 4 + column]);
  }

  mul(mat4) {
    return new Mat4(Array(16).fill(0).map((_, idx) => {
      const y = (idx % 4);
      const x = (idx / 4)|0;
      const row = this.rowAt(y);
      const col = mat4.colAt(x);
      return row
        .map(value, i => value * col[i])
        .reduce(a, b => a + b);
    }));
  }
}
