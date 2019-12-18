# Hello WebGL World!

[![Build Status](https://travis-ci.org/terabaud/hello-webgl.svg?branch=master)](https://travis-ci.org/terabaud/hello-webgl)

This [repository](https://github.com/terabaud/hello-webgl/) features my experiments with WebGL. 
Most demos are using [GLea](lib/glea/), a minimalistic WebGL library written by myself.

 * [Live Demos](https://terabaud.github.io/hello-webgl/)
 * [Slides of my talk about WebGL](https://terabaud.github.io/hello-webgl/talk-webgl/)

# Demos

 * [Triangle](triangle/)
 * [Patterns using modulo](patterns/) 
 * [Morphing Stars](morphing-stars/)
 * [Fractal](fractal/), using [Phenomenon](https://github.com/vaneenige/phenomenon/)
 * [Cube](cube/)
 * [Texture mapping](texture-mapping/)
 * [Access the webcam via webgl and apply distortions](webcam/)
 * [Webcam Triangle Grid](webcam-triangle-grid/)
 * [Webcam Triangle Grid variation with additional vertex motion](webcam-triangle-grid-2/)
 * [Webcam Sobel edge detection](sobel-edge-detection/) ([check out the wikipedia article](https://en.wikipedia.org/wiki/Sobel_operator))
 * [Raymarching](raymarching/)
 * [Infinite rocks (raymarching with shadows)](raymarching-shadows/)
 * [Shape morphing 3D geometries via glsl mix](shape-morph-3d/)
 * [Rainbow fractal with complex numbers and the series of greatest prime factors](exponential/)
 * [Image Slider component](image-slider/)

# Running it locally

Type `npm install` and `npm start` to start a local development server. 

Currently, there is no transpiling/bundling toolchain like Webpack and Babel/TypeScript.

It's just node [express](https://expressjs.com) serving static files. As other out-of-the-box web servers require some additional configuration, I made a simple server.js on my own. 

# Older Demos

The older demos use an esoteric coding style library I wrote in the 2015s. It provides helper functions for compiling shaders and matrix/vector maths. The code itself of the library is hard to read, but the examples may be useful. Most of the examples just draw a square to the fullscreen and let the fragment shader do its work.

* [Glitchy Mandelbrot](fractal.html)
* [Black Line Weekend](blacklineweekend.html)
* [Pastel Flower Weekend](pastelflowerweekend.html)
* [Moire](moire.html)
* [Moire 2](moire2.html)
* [3D Cube](hello-3d.html)
* [Shapes](shapes.html)
* [Multiple Shaders](multiple-shaders.html)
* [Relaxing Cubes](relaxing-cubes.html)
