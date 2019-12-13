import GLea from '../lib/glea/glea.mjs';

import { frag, vert } from './shaders.mjs';

let texture1 = null;
let texture2 = null;

let image1 = null;
let image2 = null;

const glea = new GLea({
  shaders: [
    GLea.fragmentShader(frag),
    GLea.vertexShader(vert)
  ],
  buffers: {
    'position': GLea.buffer(2, [1, 1,  -1, 1,  1,-1,  -1,-1])
  }
}).create();

function loop(time) {
  const { gl } = glea;
  glea.clear();
  glea.uni('width', glea.width);
  glea.uni('height', glea.height);
  glea.uni('time', time * .005);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(loop);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onerror = reject;
    img.onload = () => resolve(img);
  });
}

async function setup() {
  const { gl } = glea;
  // todo: wie ging das nochmal? await Promise.all ?
  const image1 = await loadImage('modv.jpg');
  const image2 = await loadImage('vizra.jpg');

  texture1 = glea.createTexture(0);
  // Upload the image into the texture. (todo: maybe integrate that into glea.createTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);

  texture2 = glea.createTexture(1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2); 

  glea.uniI('texture1', 0);
  glea.uniI('texture2', 1);

  window.addEventListener('resize', () => {
    glea.resize();
  });
  loop(0);
}

setup();
