import GLea from '../lib/glea/glea.mjs';

import { frag, vert } from './shaders.mjs';
import { primeSieve } from './prime-sieve.mjs';

let texture = null;

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

function setup() {
  const { gl } = glea;
  const primes = primeSieve(400);
  const imageData = new ImageData(primes.length, 1);
  for (let i = 0; i < primes.length; i++) {
    imageData.data[i * 4 + 0] = primes[i] ? 0xff : 0x00;
    imageData.data[i * 4 + 1] = primes[i] ? 0xff : 0x00;
    imageData.data[i * 4 + 2] = primes[i] ? 0xff : 0x00;
    imageData.data[i * 4 + 3] = 0xff;
  }
  texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

  window.addEventListener('resize', () => {
    glea.resize();
  });
  loop(0);
}

setup();
