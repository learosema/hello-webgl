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


float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
	
float noise(vec2 n) {
	vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n);
  vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

vec2 radial(float x) {
  return vec2(cos(x), sin(x));
}

void main() {
  vec2 posDistortion = radial(rand(position) * 2.0 * PI) * sin(time * .1) * .05;
  vec2 texDistortion = radial(direction * 2.0 * PI) * sin(1.0 + time * .1) * .05;
  vec2 texCoords = (1.0 - position) * .5 + texDistortion;
  vTexColor = shuffleRB(texture2D(image, texCoords));
  gl_Position = vec4(1.5 * (position + posDistortion), 0.0, 1.0);
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
