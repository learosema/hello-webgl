// GLEA - GL experimental assets
//
// (c) 2019 Lea Rosema
// License: WTFPL v2.0

function shader(code, shaderType) {
  return gl => {
    const sh = gl.createShader(
      /frag/.test(shaderType) ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER
    );
    gl.shaderSource(sh, code);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw "Could not compile Shader.\n\n" + gl.getShaderInfoLog(sh);
    }
    return sh;
  }
}

export default class GLea {

  constructor({ canvas, gl, shaders, buffers }) {
    this.canvas = canvas || document.querySelector('canvas');
    this.gl = gl;
    if (!this.gl && this.canvas) {
      this.gl = this.canvas.getContext('webgl') ||
        this.canvas.getContext('experimental-webgl');
    }
    this.shaders = shaders;
    this.buffers = buffers;
  }

  static vertexShader(code) {
    return gl => shader(code, 'vertex')(gl);
  }

  static fragmentShader(code) {
    return gl => shader(code, 'fragment')(gl);
  }

  static buffer(data, usage = WebGLRenderingContext.STATIC_DRAW) {
    return (name, gl, program) => {
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(this.program, loc);
      // create buffer:
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);

      return buffer;
    }
  }

  create() {
    const { gl, shaders } = this;
    if (typeof this.onCreate === "function") {
      this.onCreate(gl);
    }
    this.program = gl.createProgram();
    const { program } = this;
    shaders.map(shaderFunc => shaderFunc(gl)).map(shader => {
      gl.attachShader(program, shader);
    });
    gl.linkProgram(program);
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw "Could not compile WebGL program. \n\n" + info;
    }
    this.use();
    Object.keys(this.buffers).forEach(name => {
      const bufferFunc = this.buffers[name];
      this.buffers[name] = bufferFunc(name, gl, program);
    });
    this.resize();
    return this;
  }

  resize() {
    const { canvas, gl } = this;
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  use() {
    this.gl.useProgram(this.program);
    return this;
  }

  setAttribPointer(name, size, type = WebGLRenderingContext.FLOAT, normalized = false, stride = 0, offset = 0) {
    const { gl, program } = this;
    const loc = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(program, loc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[name]);
    // bind buffer to attribute:
    gl.vertexAttribPointer(
      loc,
      size,
      type,
      normalized,
      stride,
      offset
    );
  }

  enableAttrib(name) {
    const loc = this.gl.getAttribLocation(this.program, name);
    this.gl.enableVertexAttribArray(this.program, loc);
    return this;
  }

  disableAttrib(name) {
    const loc = this.gl.getAttribLocation(this.program, name);
    this.gl.disableVertexAttribArray(this.program, loc);
    return this;
  }

  // set uniform matrix
  uniM(name, data) {
    const { gl, program } = this;
    const { sqrt } = Math;
    const loc = gl.getUniformLocation(program, name);
    gl["uniformMatrix" + sqrt(data.length) + "fv"](loc, false, new Float32Array(data));
    return loc;
  }

  // set uniform vector
  uniV(name, data) {
    const { gl, program } = this;
    const loc = gl.getUniformLocation(program, name);
    gl["uniform" + data.length + "fv"](loc, new Float32Array(data));
    return loc;
  }

  // set uniform float
  uni(name, data) {
    const { gl, program } = this;
    const loc = gl.getUniformLocation(program, name);
  	if(typeof(data) === "number") {
      gl.uniform1f(loc, data);
    }
  	return loc;
  }

  clear(clearColor = null) {
    const { gl } = this;
    if (clearColor) {
      gl.clearColor(clearColor[0], clearColor[1], clearColor[2], 1);
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }
}
