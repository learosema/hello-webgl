import { frag, vert } from './shaders.mjs';
import GLea from '../lib/glea/glea.mjs';

let video = document.querySelector('video');
let fallbackImage = null;

let texture0 = null;
let texture1 = null;

const glea = new GLea({
  glOptions: {
    preserveDrawingBuffer: true
  },
  shaders: [
    GLea.fragmentShader(frag),
    GLea.vertexShader(vert)
  ],
  buffers: {
    'position': GLea.buffer(2, [1, 1,  -1, 1,  1,-1,  -1,-1])
  }
}).create();

window.addEventListener('resize', () => {
  glea.resize();
});

function loop(time) {
  const { gl } = glea;
  // Upload the image into the texture.
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video || fallbackImage);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, video || fallbackImage);
  glea.clear();
  glea.uni('width', glea.width);
  glea.uni('height', glea.height);
  glea.uni('time', time * .005);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(loop);
}

function accessWebcam(video) {
  return new Promise((resolve, reject) => {
    const mediaConstraints = { audio: false, video: { width: 1280, height: 720, brightness: {ideal: 2} } };
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

function takeScreenshot() {
  const { canvas } = glea;
  const anchor = document.createElement('a');
  anchor.setAttribute('download', 'selfie.jpg');
  anchor.setAttribute('href', canvas.toDataURL('image/jpeg', 0.92));
  anchor.click();
}

function createBayerImageData() {
  const imageData = new ImageData(8, 8);
  // TODO: figure out the wikipedia pseudocode for generating this
  // https://en.wikipedia.org/wiki/Ordered_dithering
  const bayer = [
    0 , 48 , 12 , 60 ,  3 , 51 , 15 , 63,
    32 , 16 , 44 , 28 , 35 , 19 , 47 , 31,
    8 , 56 ,  4 , 52 , 11 , 59 ,  7 , 55,
    40 , 24 , 36 , 20 , 43 , 27 , 39 , 23,
    2 , 50 , 14 , 62 ,  1 , 49 , 13 , 61,
    34 , 18 , 46 , 30 , 33 , 17 , 45 , 29,
    10 , 58 ,  6 , 54 ,  9 , 57 ,  5 , 53,
    42 , 26 , 38 , 22 , 41 , 25 , 37 , 21
  ];
  for (let i = 0; i < 64; i++) {
    imageData.data[i * 4 + 0] = bayer[i] * 4;
    imageData.data[i * 4 + 1] = bayer[i] * 4;
    imageData.data[i * 4 + 2] = bayer[i] * 4;
    imageData.data[i * 4 + 3] = 255;
  }
  return imageData;
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
  texture0 = glea.createTexture(0, {
    textureWrapS: 'repeat',
    textureWrapT: 'repeat',
    textureMinFilter: 'nearest',
    textureMagFilter: 'nearest'
  });
  const bayerData = createBayerImageData();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bayerData);
  texture1 = glea.createTexture(1);

  glea.uniI('texture0', 0);
  glea.uniI('texture1', 1);
  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video || fallbackImage);
  loop(0);
}

setup();

