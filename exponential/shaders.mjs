// this is just for code highlighting in VSCode
// via the glsl-literal extension
const glsl = x => x;

export const frag = glsl`
precision highp float;
uniform float time;
uniform float width;
uniform float height;

const int ITERS = 120;
const float PI = 3.141592654;
const float DEG = PI / 180.0;

vec2 coords() {
  float vmin = min(width, height);
  return vec2((gl_FragCoord.x - width * .5) / vmin,
              (gl_FragCoord.y - height * .5) / vmin);
}

/*// normalize coords and correct for aspect ratio
vec2 normalizeScreenCoords() {
  float aspectRatio = width / height;
  vec2 result = 2.0 * (gl_FragCoord.xy / vec2(width, height) - 0.5);
  result.x *= aspectRatio; 
  return result;
}*/


vec2 rotate(vec2 p, float a) {
  return vec2(p.x * cos(a) - p.y * sin(a),
              p.x * sin(a) + p.y * cos(a));
}

vec2 repeat(in vec2 p, in vec2 c) {
  return mod(p, c) - 0.5 * c;
}

int gpf(int num) {
  int result = 1;
  int limit = int(sqrt(float(num)));
  for (int i = 0; i < ITERS; i++) {
    int factor = (i == 0) ? 2 : (1 + i * 2); 
    if (factor > limit) {
      break;
    }
    for (int j = 0; j < ITERS; j++) {
      if (int(mod(float(num), float(factor))) != 0) {
        break;
      }
      num = int(num / factor);
      result = factor;
    }
    if (factor > num) {
      break;
    }
  }
  if (num > 1) {
    result = num;
  }
  return result;
}

float floatGPF(float num) {
  float n0 = float(gpf(int(abs(num))));
  float n1 = float(gpf(int(abs(num)+1.0)));
  float fr = fract(abs(num));
  return mix(n0, n1, fr);
}

vec2 complexMul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.y * b.x + a.x * b.y);
}

vec2 complexPow(vec2 a, int n) {
  vec2 result = vec2(1.0, 0.0);
  for (int i = 0; i < ITERS; i++) {
    if (i == n) {
      break;
    }
    result = complexMul(result, a);
  }
  return result;
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

// exponential generating function EG(gpf; z) = Σn=1∞ gpf(n) zn / n!
vec2 exponential(vec2 p) {
  vec2 x = vec2(0.0, 0.0);
  int j = 1;
  for (int i = 0; i < 17; i++) {
    j = j * (i + 2);
    x = x + float(gpf(i)) * complexPow(p * 7.0, int(i + 1)) / float(j);
  }
  return x;
}

void main () {
  vec2 p0 = rotate(coords(), time *.01);
  vec2 exp = exponential(p0) *.1;
  vec3 col = hsl2rgb(vec3(sin(time*.1) * atan(exp.x, exp.y), 1.0, .7 - length(exp)));
  gl_FragColor = vec4(col, 1.0);
}
`

export const vert = glsl`
precision mediump float;
attribute vec2 position;

void main () {
  gl_Position = vec4(position, 0, 1.0);
}
`