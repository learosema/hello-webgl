import GLea from '../lib/glea/glea.mjs';
import { frag, vert } from './shaders.mjs';

const glea = new GLea({
  shaders: [
    GLea.fragmentShader(frag),
    GLea.vertexShader(vert)
  ],
  buffers: {
    'position': GLea.buffer(2, [0.0, 0.7,  -.9, -.8,  .8, -.7]),
    'color': GLea.buffer(3, [1, 0, 0, 0, 1, 0, 1,0, 1])
  }
}).create();

window.addEventListener('resize', () => {
  glea.resize();
});

function loop(time) {
  const { gl, program } = glea;
  glea.clear();
  glea.uni('width', glea.width);
  glea.uni('height', glea.height);
  glea.uni('time', time * .005);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  requestAnimationFrame(loop);
}

loop(0);
