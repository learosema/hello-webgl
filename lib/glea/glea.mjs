// GLEA - GL experimental assets
// Like glutz.js but a little cleaner.
// (c) 2019 Lea Rosema
// License: WTFPL v2.0

export default class GLea {
  constructor({ gl, shaders, attribs, buffers }) {
    this.gl = gl;
    this.shaders = shaders;
    this.attribs = attribs;
    this.buffers = buffers;
  }

  static shader(gl, code, shaderType) {
    const sh = gl.createShader(
      /frag/.test(shaderType) ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER
    );
    gl.shaderSource(sh, code);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw "Could not compile Shader.\n\n" + gl.getShaderInfoLog(s);
    }
    return sh;
  }

  static vertexShader(gl, code) {
    return GLea.shader(gl, code, 'vertex');
  }

  static fragmentShader(gl, code) {
    return GLea.shader(gl, code, 'fragment');
  }

  create() {
    const { gl, shaders } = this;
    this.program = gl.createProgram();
    const { program } = this;
    shaders.map(shader => {
      gl.attachShader(program, shader);
    });
    gl.linkProgram(program);
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw "Could not compile WebGL program. \n\n" + info;
    }
    this.use();
    this.enableAttribs();
    return this;
  }

  use() {
    this.gl.useProgram(this.program);
    return this;
  }

  enableAttribs() {
    this.attribs.map(attrib => this.enableAttrib(attrib));
    return this;
  }

  disableAttribs() {
    this.attribs.map(attrib => this.disableAttrib(attrib));
    return this;
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

  createBuffer(data) {
    const { gl } = this;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
  }

  bindAttrib(
    attribName,
    buffer,
    size = 1,
    type = WebGLRenderingContext.FLOAT,
    normalized = false
  ) {
    const { gl, program } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
      gl.getAttribLocation(program, attribName),
      size,
      type,
      normalized,
      0,
      0
    );
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
      gl.uniform1f(loc, data)
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
