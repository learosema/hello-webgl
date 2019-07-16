///<reference path="../lib/phenomenon-1.5.1/index.d.ts" />

import Phenomenon from '../lib/phenomenon-1.5.1/phenomenon.mjs';
import { frag, vert } from './shaders.mjs'
const canvas = document.querySelector('canvas');
const phenomenon = new Phenomenon({
  canvas,
  contextType: 'webgl',
  settings: {
    devicePixelRatio: window.devicePixelRatio
  }
});

phenomenon.add('first', {
  uniforms: {
    time: {
      type: 'float',
      value: 0.0
    },
    width: {
      type: 'float',
      value: canvas.width * window.devicePixelRatio
    },
    height: {
      type: 'float',
      value: canvas.height * window.devicePixelRatio
    }
  },
  vertex: vert,
  fragment: frag,
  mode: 4,
  geometry: {vertices: [
      {x: -1, y: -1, z: 0},
      {x: -1, y:  1, z: 0},
      {x:  1, y: -1, z: 0},
      {x:  1, y: -1, z: 0},
      {x: -1, y:  1, z: 0},
      {x:  1, y:  1, z: 0}
  ]},
  onRender: instance => {
    instance.uniforms.time.value += 0.1;
  }
});