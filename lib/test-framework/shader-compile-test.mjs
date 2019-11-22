// todo: maybe look at github.com/node-3d/webgl-raub to get it headless?

export function compileTest(frag, vert, contextType) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext(contextType || ("webgl" || "experimental-webgl"));
  const program = gl.createProgram();
  gl.attachShader(program, shader);
  gl.linkProgram(program);
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    throw "Could not compile WebGL program. \n\n" + info;
  }
}