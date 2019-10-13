// this is just for code highlighting in VSCode
// via the glsl-literal extension
const glsl = x => x;

export const frag = glsl`
precision highp float;
uniform float time;
uniform float width;
uniform float height;
uniform sampler2D texture;
const float PI = 3.141592654;
const float DEG = PI / 180.0;
const int ITERS = 10000;


vec2 coords() {
  float vmin = min(width, height);
  return vec2((gl_FragCoord.x - width * .5) / vmin,
              (gl_FragCoord.y - height * .5) / vmin);
}

vec2 rotate(vec2 p, float a) {
  return vec2(p.x * cos(a) - p.y * sin(a),
              p.x * sin(a) + p.y * cos(a));
}

vec2 repeat(in vec2 p, in vec2 c) {
  return mod(p, c) - 0.5 * c;
}

// Distance functions by Inigo Quilez
// https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float circle(in vec2 p, in vec2 pos, float radius) {
  return length((p - pos)) - radius;
}

float distanceField(vec2 p) {
  float d = 10000.0; 
  for (int i = 0; i < 400; i++) {
    vec2 point = vec2(cos(float(i)) * float(i), sin(float(i)) * float(i));
    d = min(d, circle(p, point, 3.0));
  }
  return d;
}

// check if is prime, works for numbers 1 .. 900
bool isPrime(int n) {
  if (n <= 3) {
    return (n > 1) ? true : false;
  }
  if (mod(float(n), 2.0) == 0.0 || mod(float(n), 3.0) == 0.0) {
    return false;
  }
  int i = 5;
  for (int j = 0; j < 30; j++) {
    if (i * i > n) {
      return true;
    }
    if (mod(float(n), float(i)) == 0.0 || mod(float(n), float(i + 2)) == 0.0) {
      return false;
    }
    i += 6;
  } 
  return false;
}

float primeDistanceField(vec2 p) {
  float d = 10000.0; 
  for (int i = 0; i < 250; i++) {
    if (isPrime(i)) {
      vec2 point = vec2(cos(float(i)) * float(i), sin(float(i)) * float(i));
      d = min(d, circle(p, point, 3.0));
    }
  }
  return d;
}

vec3 shade(in vec2 p)
{
  vec3 background = vec3(.1, .3, .7);
  vec3 foreground = vec3(.7, .3, .1);
  float sdf = distanceField(p);
  if (sdf < 0.0) {
    return foreground;
  }

  vec3 col = background;
  
  // Darken around surface
  col = mix(col, col*1.0-exp(-10.0 * abs(sdf)), 0.4);
  
  // repeating lines
  col *= 0.8 + 0.2*cos(.5*sdf - time * .5);
  return col;
}


void main () {
  vec2 p0 = coords();
  float zoom = 300.0 + sin(time * .05)*200.0;
  vec2 p1 = rotate(p0 * zoom, time * DEG);
  vec3 col = shade(p1);
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