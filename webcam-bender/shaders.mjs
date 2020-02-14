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
  return (1.0 - sqrt(p.x * p.x + p.y * p.y)) * (.125 + sin(time * .1) * .125);
}

vec4 invert(vec4 color) {
  return vec4(1.0 - color.x, 1.0 - color.y, 1.0 - color.z, 1.0);
}

void main() {
  vec2 p = normalizeScreenCoords();
  vec2 texCoords = 1.0 - gl_FragCoord.xy / vec2(width, height);
  vec4 texColor = texture2D(image, texCoords);
  gl_FragColor = invert(texColor);
}
`;
