# GLea.js - GL experimental assets

Glea.js is a WebGL library with a minimal footprint in modern modular JavaScript. It provides helper functions for creating a WebGL program, compiling shaders and passing data from JavaScript to the shader language.

## Usage

```
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
```