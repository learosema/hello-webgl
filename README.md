# Hello Webgl World!

This [repository](https://github.com/terabaud/hello-webgl/) features my experiments with WebGL.

 * Live demos here: https://terabaud.github.io/hello-webgl/

 * [Morphing Stars](morphing-stars/), using [Glea](lib/glea/)
 * [Fractal](fractal/), using [Phenomenon](https://github.com/vaneenige/phenomenon/)

# Older Demos

The older demos use an esoteric coding style library I wrote in the 2015s. It is very low level and provides helper functions for compiling shaders. The code itself is horrible, but the examples may be useful. Most of the examples just draw a square to the fullscreen and let the
fragment shader do its work.

A rewrite of the ugly libary is in progress, still providing low level helper functions in WebGL, but in clean modular JS. See: [GLea](lib/glea/)

* [Glitchy Mandelbrot](fractal.html)
* [Black Line Weekend](blacklineweekend.html)
* [Pastel Flower Weekend](pastelflowerweekend.html)
* [Moire](moire.html)
* [Moire 2](moire2.html)
* [3D Cube](hello-3d.html)
* [Shapes](shapes.html)
* [Multiple Shaders](multiple-shaders.html)
* [Relaxing Cubes](relaxing-cubes)