// this is just for code highlighting in VSCode
// via the glsl-literal extension
const glsl = x => x;

export const frag = glsl`
precision highp float;
#define ITERS 64

uniform float width;
uniform float height;
uniform float time;

vec2 repeat(in vec2 p, in vec2 c) {
  return mod(p, c) - 0.5 * c;
}

// normalize coords and correct for aspect ratio
vec2 normalizeScreenCoords() {
  float aspectRatio = width / height;
  vec2 result = 2.0 * (gl_FragCoord.xy / vec2(width, height) - 0.5);
  result.x *= aspectRatio; 
  return result;
}

float rand() {
  return fract(sin(dot(gl_FragCoord.xy + sin(time),vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 p0 = normalizeScreenCoords();
  vec2 p = repeat(p0, vec2(0.25));
  gl_FragColor = vec4(.5 + .5 * sin(p.x * p.y * 180.0 + time * .5), 0.0, 0.0, 1.0);
}
`

export const vert = glsl`
precision mediump float;
attribute vec2 position;

void main () {
  gl_Position = vec4(position, 0, 1.0);
}
`