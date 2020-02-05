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

// function from https://www.shadertoy.com/view/3ll3zr
float sdHeart(in vec2 p, float s) {
  p /= s;
  vec2 q = p;
  q.x *= 0.5 + .5 * q.y;
  q.y -= abs(p.x) * .63;
  return (length(q) - .7) * s;
}


float distanceField(vec2 p) {
  float d = 10000.0; 
  for (int i = 0; i < 10; i++) {
    vec2 point = vec2(cos(time *.1 + float(i) * .5) * 12.0, sin(time *.3 + float(i) * .5) * 13.0);
    d = min(d, sdHeart(p - point, 3.5));
  }
  return d;
}

vec3 shade(in vec2 p)
{
  vec3 background = vec3(.5, .2, .7);
  vec3 foreground = vec3(.8, .7, .9);
  float sdf = distanceField(p);
  if (sdf < 0.0) {
    return foreground;
  }

  vec3 col = background;
  
  // Darken around surface
  col = mix(col, col*1.0-exp(-10.0 * abs(sdf)), 0.4);
  
  // repeating lines
  col *= 0.8 + 0.2*cos(4.0*sdf - time * .5);
  return col;
}


void main () {
  vec2 p0 = coords();
  float zoom = 30.0 + sin(time * .5)*5.0;
  vec2 p1 = rotate(p0 * zoom, time * .01);
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