// GLEA - GL experimental assets
//
// (c) 2019 Lea Rosema

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

function convertArray(data = [], type = WebGLRenderingContext.FLOAT) {
  if (type === WebGLRenderingContext.FLOAT) {
    return new Float32Array(data);
  }
  if (type === WebGLRenderingContext.BYTE) {
    return new Uint8Array(data);
  }
  return data;
}


export default class GLea {

  constructor({ canvas, gl, shaders, buffers, onCreate, devicePixelRatio = 1, glOptions }) {
    this.canvas = canvas || document.querySelector('canvas');
    this.gl = gl;
    if (!this.gl && this.canvas) {
      this.gl = this.canvas.getContext('webgl', glOptions) ||
        this.canvas.getContext('experimental-webgl', glOptions);
    }
    this.shaders = shaders;
    this.buffers = buffers;
    this.onCreate = onCreate;
    this.devicePixelRatio = devicePixelRatio;
  }

  static vertexShader(code) {
    return gl => shader(code, 'vertex')(gl);
  }

  static fragmentShader(code) {
    return gl => shader(code, 'fragment')(gl);
  }

  static buffer(size, data,
    usage = WebGLRenderingContext.STATIC_DRAW,
    type = WebGLRenderingContext.FLOAT, normalized = false, stride = 0, offset = 0) {
    return (name, gl, program) => {
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      // create buffer:
      const id = gl.createBuffer();
      const bufferData = data instanceof Array ? convertArray(data, type) : data;
      gl.bindBuffer(gl.ARRAY_BUFFER, id);
      gl.bufferData(gl.ARRAY_BUFFER, bufferData, usage);
      gl.vertexAttribPointer(
        loc,
        size,
        type,
        normalized,
        stride,
        offset
      );
      return {
        id, name, data: bufferData, loc, type, size
      }
    }
  }

  create() {
    const { gl, shaders } = this;
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
    if (typeof this.onCreate === "function") {
      this.onCreate(gl);
    }
    return this;
  }

  updateBuffer(name, offset = 0) {
    const buffer = this.buffers[name];
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.id);
    gl.bufferSubData(gl.ARRAY_BUFFER, offset, buffer.data);
  }

  resize() {
    const { canvas, gl, devicePixelRatio } = this;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
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
