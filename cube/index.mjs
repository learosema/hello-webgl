import { cube } from '../lib/glea/geometry.mjs';
import { frag, vert } from './shaders.mjs';
import { perspective } from '../lib/glea/perspective.mjs';
import GLea from '../lib/glea/glea.mjs';
import { Mat4 } from '../lib/glea/math3d.mjs';

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
    gl.clearColor(1/5, 1/5, 1/5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST)
  },
  shaders: [
    GLea.vertexShader(vert), GLea.fragmentShader(frag)
  ],
  buffers: {
    position: GLea.buffer(3, cube(0.1)),
    color: GLea.buffer(3, [
      ...red, ...red, ...red, ...red, ...red, ...red,
      ...green, ...green, ...green, ...green, ...green, ...green,
      ...blue, ...blue, ...blue, ...blue, ...blue, ...blue,
      ...pink, ...pink, ...pink, ...pink, ...pink, ...pink,
      ...cyan, ...cyan, ...cyan, ...cyan, ...cyan, ...cyan,
      ...yellow, ...yellow, ...yellow, ...yellow, ...yellow, ...yellow
    ])
  }
}).create();

window.addEventListener('resize', () => {
  glea.resize();
});


function loop(time) {
  const { gl } = glea;
  const { sin, cos } = Math;
  glea.clear();
  const p = perspective(45.0, glea.width / glea.height, 0.1, 1000.0);
  const t = Mat4.Translate(sin(2 * time * 1e-3) * .3, sin(3*time * 1e-3) * .3, -.6).toArray();
  glea.uni('width', glea.width);
  glea.uni('height', glea.height);
  glea.uni('time', time * .01);
  glea.uniM('translateMat', t);
  glea.uniM('perspectiveMat', p);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  requestAnimationFrame(loop);
}

loop(0);