// for syntax highlighting (glsl-literal extension)
const glsl = x => x[0].trim();

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

uniform sampler2D texture1;
uniform sampler2D texture2;

uniform ivec2 textureSize1;
uniform ivec2 textureSize2;

// normalize coords and correct for aspect ratio
vec2 normalizeScreenCoords()
{
  float aspectRatio = width / height;
  vec2 result = 2.0 * (gl_FragCoord.xy / vec2(width, height) - 0.5);
  result.x *= aspectRatio; 
  return result;
}

vec4 invert(vec4 color) {
  return vec4(1.0 - color.x, 1.0 - color.y, 1.0 - color.z, 1.0);
}

float rand() {
  return fract(sin(dot(gl_FragCoord.xy + sin(time),vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 p = normalizeScreenCoords();
  float x = .5 + .5 * sin(time * .25);
  float y = 1.0 - x;
  float deform = rand() * sin(time * 1.2 + p.x * 17.0 - p.y * sin(p.x * 4.0) * 13.0) * .02;
  vec2 texCoords = vec2(gl_FragCoord.x / width, 1.0 - (gl_FragCoord.y / height)); 
  vec4 tex1Color = texture2D(texture1, texCoords + x * deform);  
  vec4 tex2Color = texture2D(texture2, texCoords + y * deform);
  gl_FragColor = mix(tex1Color, tex2Color, x);
}
`;
