import { cube } from '../lib/glea/geometry.mjs';
import { loadImage } from './image-loader.mjs';
import { frag, vert } from './shaders.mjs';
import GLea from '../lib/glea/glea.mjs';

const glea = new GLea({
  shaders: [
    GLea.vertexShader(vert), GLea.fragmentShader(frag)
  ],
  buffers: {
    position: GLea.buffer(3, cube(0.075)),
    texCoord: GLea.buffer(2, 
      Array(6).fill([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0
      ]).flat()
    )
  }
}).create();

function setup() {
  const { gl } = glea;
  gl.clearColor(1/6, 1/6, 1/6, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  window.addEventListener('resize', () => {
    glea.resize();
  });
}

function loop(time) {
  const { gl } = glea;
  glea.clear();
  glea.uni('width', glea.width);
  glea.uni('height', glea.height);
  glea.uni('time', time * .01);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  requestAnimationFrame(loop);
}

setup();
loadImage('js.png').then(image => {
  const { gl } = glea;
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
 
  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  loop(0);
});
