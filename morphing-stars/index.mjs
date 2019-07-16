import { Vec2, Vec3 } from '../lib/glea/math3d.mjs';
import { frag, vert } from './shaders.mjs';
import GLea from '../lib/glea/glea.mjs';

const code = (id) => document.getElementById(id).textContent || 'void main(){}';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
gl.enable(gl.DEPTH_TEST)
gl.depthFunc(gl.LEQUAL)

const setSize = () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', () => {
  setSize();
});
setSize();


const glea = new GLea({
  gl,
  shaders: [
    GLea.fragmentShader(gl, frag),
    GLea.vertexShader(gl, vert)
  ],
  attribs: [
    'position'
  ]
}).create();

const positionBuffer = glea.createBuffer([
  1, 1, 0,
 -1, 1, 0,
  1,-1, 0,
 -1,-1, 0]);

function loop(time) {
  glea.clear();
  glea.bindAttrib('position', positionBuffer, 3);
  glea.uni('width', canvas.width);
  glea.uni('height', canvas.height);
  glea.uni('time', time * .005);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(loop);
}

loop(0);
