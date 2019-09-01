// for syntax highlighting (glsl-literal extension)
const glsl = x => x;

export const vert = glsl`
precision highp float;
attribute vec2 position;

uniform float time;
uniform float width;
uniform float height;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const frag = glsl`
precision highp float;

uniform float width;
uniform float height;
uniform float time;

uniform sampler2D image;

// normalize coords and correct for aspect ratio
vec2 normalizeScreenCoords()
{
  float aspectRatio = width / height;
  vec2 result = 2.0 * (gl_FragCoord.xy / vec2(width, height) - 0.5);
  result.x *= aspectRatio; 
  return result;
}

float deform(vec2 p) {
  return sin(time * .1 + p.x) * cos(time * .1 + p.y) * 0.1;
}

vec4 invert(vec4 color) {
  return vec4(1.0 - color.x, 1.0 - color.y, 1.0 - color.z, 1.0);
}

void main() {
  vec2 p = normalizeScreenCoords();
  vec2 texCoords = 1.0 - gl_FragCoord.xy / vec2(width, height);
  vec4 texColor = texture2D(image, texCoords + deform(p));  
  vec4 rainbowColor = vec4(.5 + .5 * sin(time * .3 + p.x * 3.0 - p.y * 2.0) * .5, .5 + .5 * sin(.5 + time * .2 + p.y * p.x * 3.0), .5 + sin(.6 + time * .1 + p.x * p.y * 1.5), 1.0);
  gl_FragColor = mix(mix(texColor, invert(texColor), .5 + .5 * sin(time + sin(p.x * 4.0) + p.y * 8.0)), rainbowColor, .5 + sin(time + p.x * p.y) * .25);
  // vec4(1.0, 0, 0, 1.0);
}
`;
