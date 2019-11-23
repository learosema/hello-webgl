export class Vec2 {

  constructor(x, y) {
    if (arguments.length === 0 && typeof x === 'number') {
      this.x = this.y = 0;
      return;
    }
    if (arguments.length === 1 && typeof x === 'number') {
      this.x = this.y = x;
      return;
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

  cross(otherVec) {
    return this.x * otherVec.y - otherVec.x * this.y;
  }

  dot(otherVec) {
    return this.x * otherVec.x + this.y * otherVec2.y;
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}

export class Vec3 {

  constructor(x, y, z) {
    if (arguments.length === 1) {
      if (typeof x === "number") {
        this.x = this.y = this.z = x;
        return;
      }
      if (typeof x === "object") {
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
      throw Error("ArgumentError");
    }
    if (arguments.length === 2) {
      if (typeof x === "number" && typeof y === "number") {
        this.x = x;
        this.y = y;
        this.z = 0;
        return;
      }
      if (x instanceof Vec2 && typeof y === "number") {
        this.x = x.x;
        this.y = x.y;
        this.z = y;
        return;
      }
      throw Error("ArgumentError");
    }
    if (arguments.length === 3) {
      if (typeof x === "number" &&
        typeof y === "number" &&
        typeof z === "number") {
        this.x = x;
        this.y = y;
        this.z = z;
        return;
      }
      throw Error("ArgumentError");
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
    return this.x * otherVec.x + this.y * otherVec2.y + this.z * otherVec.z;
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  get normalized() {
    return this.div(this.length);
  }

  get data() {
    return [this.x, this.y, this.z]
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

  valueAt(x,y) {
    return [x * 4 + y];
  }

  colAt(x) {
    return this.values.slice(y * 4, y * 4 + 4);
  }

  rowAt(y) {
    return Array(4).map((_, y) => this.array[y * 4 + x])
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
