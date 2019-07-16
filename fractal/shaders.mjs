const glsl = x => x;

export const frag = glsl`
precision highp float;
uniform vec3 color;

uniform float time;
uniform float width;
uniform float height;

#define PI 3.141592654
#define ITERS 100

// taken from wikipedia and adapted to GLSL
// https://en.wikipedia.org/wiki/Julia_set
float julia(vec2 p, vec2 c, float n) {
  float x = p.x;
  float y = p.y;
  for (int i = 0; i < ITERS; i++) {
    if (x * x + y * y >= 4.0) {
      return float(i);
    }
    float x1 = x * x - y * y;
    float y1 = 2.0 * x * y;
    x = x1 + c.x;
    y = y1 + c.y;
  }
  return -1.0;
}

// by @mattdesl
float hue2rgb(float f1, float f2, float hue) {
    if (hue < 0.0)
        hue += 1.0;
    else if (hue > 1.0)
        hue -= 1.0;
    float res;
    if ((6.0 * hue) < 1.0)
        res = f1 + (f2 - f1) * 6.0 * hue;
    else if ((2.0 * hue) < 1.0)
        res = f2;
    else if ((3.0 * hue) < 2.0)
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
        res = f1;
    return res;
}

vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;
    if (hsl.y == 0.0) {
        rgb = vec3(hsl.z); // Luminance
    } else {
        float f2;
        if (hsl.z < 0.5)
            f2 = hsl.z * (1.0 + hsl.y);
        else
            f2 = hsl.z + hsl.y - hsl.y * hsl.z;
        float f1 = 2.0 * hsl.z - f2;
        rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
        rgb.g = hue2rgb(f1, f2, hsl.x);
        rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
    }
    return rgb;
}

void main () {
  float vmin = min(width, height);
  vec3 black = vec3(0.0);
  vec3 white = vec3(1.0);
  vec3 c = vec3(1.0, 0.0, 1.0);
  vec2 p = vec2((gl_FragCoord.x - width * .5) / vmin,
                (gl_FragCoord.y - height * .5) / vmin);
  float t = sin(time / 100.0) * PI;
  float j = julia(p, 0.7885 * vec2(cos(t), sin(t)), 2.0);
  vec3 color = j < 0.0 ? black :
    hsl2rgb(vec3(mod(time / 1e2 + j * 2.0 / float(ITERS), 1.0), 1.0, .7 - 2.0 * j / float(ITERS)));
  gl_FragColor = vec4(vec3(color), 1.0);
}
`;

export const vert = glsl`
precision mediump float;
attribute vec3 aPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;

void main () {
  gl_Position = vec4(aPosition, 1.0);
}
`