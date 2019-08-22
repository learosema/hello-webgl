import { cube } from '../lib/glea/geometry.mjs';
import { frag, vert } from './shaders.mjs';
import GLea from '../lib/glea/glea.mjs';

const Color = {
  red: [1, 0, 0],
  green: [0, 1, 0],
  blue: [0, 0, 1],
  yellow: [1, 1, 0],
  pink: [1,0,1],
  cyan: [0, 1, 1],
  white: [1, 1, 1]
};

const { red, green, blue, yellow, pink, cyan } = Color;

const glea = new GLea({
  onCreate: (gl) => {
    gl.clearColor(1/6, 1/6, 1/6, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST)
  },
  shaders: [
    GLea.vertexShader(vert), GLea.fragmentShader(frag)
  ],
  buffers: {
    position: GLea.buffer(3, cube(0.25)),
    color: GLea.buffer(3, [
      ...Array(6).fill(red),
      ...Array(6).fill(green),
      ...Array(6).fill(blue),
      ...Array(6).fill(pink),
      ...Array(6).fill(cyan),
      ...Array(6).fill(yellow)
    ].flat())
  }
}).create();

window.addEventListener('resize', () => {
  glea.resize();
});


function loop(time) {
  const { gl } = glea;
  const { sin, cos } = Math;
  glea.clear();
  glea.uni('width', glea.width);
  glea.uni('height', glea.height);
  glea.uni('time', time * .01);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  requestAnimationFrame(loop);
}

loop(0);