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

uniform sampler2D texture0;
uniform sampler2D texture1;

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

vec4 closestColor(vec4 color) {
  return vec4(
    clamp(floor(color.x * 8. + .5) * 42.5, 0., 255.) / 255.,
    clamp(floor(color.y * 8. + .5) * 42.5, 0., 255.) / 255.,
    clamp(floor(color.z * 8. + .5) * 42.5, 0., 255.) / 255.,
    1.
  );
}

void main() {
  vec2 p = normalizeScreenCoords();
  vec2 coord = 1.0 - gl_FragCoord.xy / vec2(width, height);
  gl_FragColor = step(
    texture2D(texture0, gl_FragCoord.xy / 8.).r,
    closestColor(texture2D(texture1, coord))
  );
}
`;
