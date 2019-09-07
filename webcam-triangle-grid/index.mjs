import { frag, vert } from './shaders.mjs';
import { grid } from './grid-geometry.mjs';
import GLea from '../lib/glea/glea.mjs';

let video = document.querySelector('video');
let fallbackImage = null;
let texture = null;

const mesh = grid(.05, .05);
const numVertices = mesh.length / 2;

const glea = new GLea({
  glOptions: {
    preserveDrawingBuffer: true
  },
  shaders: [
    GLea.fragmentShader(frag),
    GLea.vertexShader(vert)
  ],
  buffers: {
    'position': GLea.buffer(2, mesh),
    'direction': GLea.buffer(1, Array(numVertices).fill(0).map(_ => Math.random()))
  }
}).create();

function loop(time) {
  const { gl } = glea;
  // Upload the image into the texture.
  // void gl.texImage2D(target, level, internalformat, format, type, HTMLVideoElement? pixels);
  // void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, HTMLVideoElement? pixels);
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video || fallbackImage);

  // the use of texSubImage2D vs texImage2D is faster
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, video);
  glea.clear();
  glea.uni('width', glea.width);
  glea.uni('height', glea.height);
  glea.uni('time', time * .005);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
  requestAnimationFrame(loop);
}

function accessWebcam(video) {
  return new Promise((resolve, reject) => {
    const mediaConstraints = { audio: false, video: { width: 1280, height: 720 } };
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(mediaStream => {
      video.srcObject = mediaStream;
      video.onloadedmetadata = (e) => {
        video.play();
        resolve(video);
      }
    }).catch(err => {
      reject(err);
    });
  });
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(img);
    };
  });
}

async function setup() {
  const { gl } = glea;
  try {
    await accessWebcam(video);
  } catch (ex) {
    video = null;
    console.error(ex.message);
  }
  if (! video) {
    try {
      fallbackImage = await loadImage('https://placekitten.com/1280/720')
    } catch (ex) {
      console.error(ex.message);
      return false;
    }
  }
  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video || fallbackImage);

  window.addEventListener('resize', () => {
    glea.resize();
  });
  loop(0);
}

setup();

