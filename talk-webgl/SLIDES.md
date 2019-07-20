# Creative Coding with WebGL
-----------------------------------------------
# Creative Coding with WebGL

![Lea Rosema](https://avatars0.githubusercontent.com/u/949950?s=460&v=4)

## Hi! I'm Lea Rosema

I'm a Junior Frontend Developer
at SinnerSchrader

-------------------------------------------------
# What is WebGL

- It's a Graphics Library in JS :)
- It drawing lines, shapes, triangles
- It's an API to run code on the GPU

-------------------------------------------------
# Code on the GPU: WebGL Shaders

- Vertex shader
- Fragment shader

-------------------------------------------------
# Code on the GPU: WebGL Shaders

- Vertex Shader => computes vertex positions
- Fragment Shader => handles rasterization
- together, they are called WebGL Program

-------------------------------------------------
# GL Shader Language

- GPU-specific language GL Shader language (GLSL)
- It's like C with a `void main()`
- but with built-in datatypes useful for 2d/3d

----------------------------------------------------
# Vertex Shader Code

```glsl
attribute vec3 position;

void main() {
  gl_Position = vec4(position, 1.0);
}
```

- Via the position attribute, the shader gets a position from a buffer
- the shader is run for each position in the position buffer

----------------------------------------------------
# Fragment Shader Code

```glsl
precision highp float;

void main() {
  // rgba
  gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
}
```
- The fragment shader is run for each fragment
- For each pixel in the triangle (or line, or point)

-------------------------------------------------
# GL Shader Language

## Datatype

- primitives (bool, int, float)
- vectors (vec2, vec3, vec4)
- matrices (mat2, mat3, mat4)
- texture data (sampler2D)

------------------------------------------------
# Passing Data from JS

- `attribute`: the variable pulls a value from a buffer
- `uniform`: like a global variables you set before you execute the shader
- `varying`: a variable that is passed from the vertex to the fragment shader

-------------------------------------------------
# GL Shader Language
## Cool built-in functions

- `sin`, `cos`, `atan`
- Linear Interpolation (`mix`)
- Vector arithmetics (`+`, `-`, `*`, `/`, `dot`, `cross`, `length`)
- Matrix arithmetics (`+`, `-`, `*`)

----------------------------------------------------
# Running it in JS

## Get the WebGL Context

```js
const gl = canvas.getContext('webgl')
```

----------------------------------------------------
# Running it in JS

## Compile the Shaders

```js
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentCode);
gl.compileShader();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(fragmentShader, vertexCode);
gl.compileShader();
```

-----------------------------------------------------
# Running it in JS

## Create the program

```js
const program = gl.createProgram()
program.attachShader(vertexShader)
program.attachShader(fragmentShader)
program.linkProgram()
```
------------------------------------------------------
# Running it in JS

## Defining attributes for the vertex shader

```js
// enable the position attribute
const positionAttrib = this.gl.getAttribLocation(program, 'position');
this.gl.enableVertexAttribArray(program, positionAttrib);
```

------------------------------------------------------
# Running it in JS

## Assign Data to attributes

```js
// provide 2D data for a triangle
const data = [-1, -1,  -1,  1,  1, -1],
const buffer = gl.createBuffer();
gl.bufferData(gl.ARRAY_BUFFER,
  new Float32Array(data), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0,0);
```

-----------------------------------------------------
# Running it in JS

## Passing uniform variables

```js
const uTime = gl.getUniformLocation(program, 'time');
gl.uniform1f(loc, tickCount);
```

------------------------------------------------------
# Running it in JS

## Draw
```js

function animLoop(time = 0) {
  setUniforms();
  gl.drawArrays(gl.TRIANGLES);
  requestAnimationFrame(animLoop);
}

animLoop();
```
------------------------------------------------------
# Putting it all together

* [Lets do it on Codepen](https://codepen.io/terabaud)