import { Vec2, Vec3 } from '../lib/glea/math3d.mjs';
import { frag, vert } from './shaders.mjs';
import GLea from '../lib/glea/glea.mjs';

const glea = new GLea({
  /*onCreate: gl => {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }, */
  shaders: [
    GLea.fragmentShader(frag),
    GLea.vertexShader(vert)
  ],
  attribs: [
    'position'
  ]
}).create();

window.addEventListener('resize', () => {
  glea.resize();
});

const positionBuffer = glea.createBuffer([
  1, 1, 0,
 -1, 1, 0,
  1,-1, 0,
 -1,-1, 0]);

glea.bindAttrib('position', positionBuffer, 3);

function loop(time) {
  const { gl } = glea;
  glea.clear();
  glea.uni('width', glea.width);
  glea.uni('height', glea.height);
  glea.uni('time', time * .005);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(loop);
}

loop(0);
