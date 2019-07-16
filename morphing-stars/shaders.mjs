// this is just for code highlighting in VSCode
// via the glsl-literal extension
const glsl = x => x;

export const frag = glsl`
precision highp float;
uniform float time;
uniform float width;
uniform float height;

const float PI = 3.141592654;
const float DEG = PI / 180.0;

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
  return length(p - pos) - radius;
}

float box(in vec2 p, in vec2 pos, in vec2 b) {
  vec2 d = abs(p - pos) - b;
  return length(max(d, vec2(0))) + min(max(d.x, d.y), 0.0);
}

float triangle(in vec2 p, in float h) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - h;
  p.y = p.y + h / k;
  if( p.x + k*p.y > 0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
  p.x -= clamp( p.x, -2.0, 0.0 );
  return -length(p)*sign(p.y);
}

float hexagon(in vec2 p, in vec2 pos, in float r) {
  const vec3 k = vec3(-0.866025404,0.5,0.577350269);
  p = abs(p - pos);
  p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
  p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
  return length(p) * sign(p.y);
}

float hexagram(in vec2 p, in vec2 pos, in float r) {
  const vec4 k=vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
  p = abs(p - pos);
  p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
  p -= 2.0*min(dot(k.yx,p),0.0)*k.yx;
  p -= vec2(clamp(p.x,r*k.z,r*k.w),r);
  return length(p)*sign(p.y);
}

float distanceField(vec2 p) {
  float hexa = hexagon(p, vec2(0, 0), 1.5);
  float star = hexagram(p, vec2(0, 0), .5);
  float x = (1.0 + sin(time * 0.5)) * .5;
  return mix(hexa, star, x);
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

vec3 Stars(in vec2 p, in vec3 background) {
  float sdf = distanceField(p);
  float hue = floor(10.0 * (1.0 + 0.98 * cos(time * .125 + sdf))) / 10.0;
  vec3 fill = hsl2rgb(vec3(hue, 1.0, .5));
  //vec3 fill = vec3(1.0, clamp(cos(time * 2.0 - sdf * 20.0) * .5, 0.0, .25) * 4.0, 0.0);
  return sdf < 0.0 ? fill : background;
}

void main () {
  vec2 p0 = coords();
  float zoom = 4.0;
  vec2 p1 = rotate(p0 * zoom, 45.0 * DEG);
  vec2 p2 = rotate(repeat(p1, vec2(1.75, 2.0)), 0.0 * DEG);
  vec3 background = vec3(0, 0, 0);
  vec3 col = Stars(p2, background);
  gl_FragColor = vec4(col, 1.0);
}
`

export const vert = glsl`
precision mediump float;
attribute vec3 position;

void main () {
  gl_Position = vec4(position, 1.0);
}
`