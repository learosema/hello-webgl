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

// dumb closest color strategy
vec4 closestColor(vec4 color) {
  return vec4(
    clamp(floor(color.x * 4. + .5) * 85., 0., 255.) / 255.,
    clamp(floor(color.y * 4. + .5) * 85., 0., 255.) / 255.,
    clamp(floor(color.z * 4. + .5) * 85., 0., 255.) / 255.,
    1.
  );
}

// luminance strategy: (TODO)
float luminance(vec4 color) {
  return 0.2126*color.x + 0.7152*color.y + 0.0722*color.z;
}

vec4 getEgaColor(int index) {
  float fi = float(index);
  float b = clamp((2. * mod(fi, 2.) + mod(floor(fi / 8.), 2.)) * (1./3.), 0., 1.);
  float g = clamp((2. * mod(floor(fi / 2.), 2.) + mod(floor(fi / 16.), 2.)) * (1./3.), 0., 1.);
  float r = clamp((2. * mod(floor(fi / 4.), 2.) + mod(floor(fi / 32.), 2.)) * .333, 0., 1.);
  return vec4(r, g, b, 1.);
}

vec4 closestColorLum(vec4 color) {
  float l = luminance(color);
  float lResult = 9999.0;
  vec4 result = vec4(0.);
  for (int i = 0; i < 64; i++) {
    vec4 colorI = getEgaColor(i);
    float lI = luminance(colorI);
    if (abs(lI - l) < abs(lResult - l)) {
      lResult = lI;
      result = colorI;
    }
  }
  return result;
}


// hue distance strategy (TODO)



void main() {
  vec2 p = normalizeScreenCoords();
  vec2 coord = 1.0 - gl_FragCoord.xy / vec2(width, height);
  bool isEven = mod(gl_FragCoord.x + gl_FragCoord.y, 2.) < 1.;
  gl_FragColor = closestColor(step(
    texture2D(texture0, gl_FragCoord.xy / 8.).r,
    isEven ? closestColor(texture2D(texture1, coord)) : 
             closestColorLum(texture2D(texture1, coord))
  ));
}
`;
