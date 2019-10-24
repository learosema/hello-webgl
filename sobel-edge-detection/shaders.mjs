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

float deform(vec2 p, float factor) {
  return sin(time * .1 + factor * p.x) * cos(time * .1 + factor * p.y);
}

vec4 invert(vec4 color) {
  return vec4(1.0 - color.rgb, 1.0);
}

vec4 grey(vec4 color) {
  float val = (color.x + color.y + color.z) / 3.0;

  return vec4(vec3(pow(val, .125)), 1.0);
}

vec2 getTexCoords(vec2 position) {
  return 1.0 - position.xy / vec2(width, height);
}

vec4 sobel(in sampler2D tex, in vec2 coord) {
  float w = 1.0 / width;
  float h = 1.0 / height;
  vec4 n0 = texture2D(tex, coord + vec2(-w, -h));
  vec4 n1 = texture2D(tex, coord + vec2( 0, -h));
  vec4 n2 = texture2D(tex, coord + vec2( w, -h));
  vec4 n3 = texture2D(tex, coord + vec2(-w,  0));
  vec4 n4 = texture2D(tex, coord);
  vec4 n5 = texture2D(tex, coord + vec2( w, 0));
  vec4 n6 = texture2D(tex, coord + vec2(-w, h));
  vec4 n7 = texture2D(tex, coord + vec2( 0, h));
  vec4 n8 = texture2D(tex, coord + vec2( w, h));
  vec4 edgeH = n2 + (2.0 * n5) + n8 - (n0 + (2.0 * n3) + n6);
  vec4 edgeV = n0 + (2.0 * n1) + n2 - (n6 + (2.0 * n7) + n8);
  vec4 sobel = sqrt((edgeH * edgeH) + (edgeV * edgeV));
  return sobel;
}

void main() {
  vec2 p = normalizeScreenCoords();
  vec2 coord = 1.0 - gl_FragCoord.xy / vec2(width, height);
  vec4 result = sobel(image, coord);
  gl_FragColor = invert(result);
}
`;
