# Hello Webgl World!

This [repository](https://github.com/terabaud/hello-webgl/) features my experiments with WebGL.

 * Live demos here: [https://terabaud.github.io/hello-webgl/](https://terabaud.github.io/hello-webgl/)

 * [Morphing Stars](morphing-stars/), using [GLea](lib/glea/)
 * [Fractal](fractal/), using [Phenomenon](https://github.com/vaneenige/phenomenon/)
 * [Cube](cube/), using [GLea](lib/glea/)
 * [Raymarching](raymarching/), using [GLea](lib/glea/)

# Running it locally

Type `npm install` and `npm start` to start a local development server. 

Currently, there is no transpiling/bundling toolchain like Webpack and Babel/TypeScript.

It's just node [express](https://expressjs.com) serving static files. As other out-of-the-box web servers require some additional configuration, I made a simple server.js on my own. 

# Older Demos

The older demos use an esoteric coding style library I wrote in the 2015s. It provides helper functions for compiling shaders and matrix/vector maths. The code itself of the library is hard to read, but the examples may be useful. Most of the examples just draw a square to the fullscreen and let the fragment shader do its work.

A rewrite of the esoteric libary is in progress, still providing low level helper functions in WebGL, but in clean modular JS. See: [GLea](lib/glea/)

* [Glitchy Mandelbrot](fractal.html)
* [Black Line Weekend](blacklineweekend.html)
* [Pastel Flower Weekend](pastelflowerweekend.html)
* [Moire](moire.html)
* [Moire 2](moire2.html)
* [3D Cube](hello-3d.html)
* [Shapes](shapes.html)
* [Multiple Shaders](multiple-shaders.html)
* [Relaxing Cubes](relaxing-cubes)
