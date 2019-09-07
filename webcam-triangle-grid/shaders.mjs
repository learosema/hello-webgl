// for syntax highlighting (glsl-literal extension)
const glsl = x => x;

export const vert = glsl`
precision highp float;
attribute vec2 position;
attribute float direction;

uniform float time;
uniform float width;
uniform float height;
uniform sampler2D image;

varying vec4 vTexColor;

const float PI = 3.1415926535;

vec4 invert(vec4 color) {
  return vec4(1.0 - color.x, 1.0 - color.y, 1.0 - color.z, 1.0);
}

vec4 shuffleRB(vec4 color) {
  return vec4(color.z, color.y, color.x, 1.0);
}


void main() {
  vec2 randomVector = vec2(cos(direction * 2.0 * PI), sin(direction * 2.0 * PI)) * sin(time * .1) * .05;
  vec2 texCoords = (1.0 - position) * .5 + randomVector;
  vTexColor = shuffleRB(texture2D(image, texCoords));
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const frag = glsl`
precision highp float;

uniform float width;
uniform float height;
uniform float time;

varying vec4 vTexColor;

void main() {
  gl_FragColor = vTexColor;
}
`;
