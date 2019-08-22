// for syntax highlighting (glsl-literal extension)
const glsl = x => x;

export const vert = glsl`
precision highp float;
attribute vec3 position;
attribute vec2 texCoord;
attribute vec3 color;

varying vec3 vcolor;
varying vec4 vpos;
varying vec2 vtexCoord;
varying mat4 vM;
uniform float time;
uniform float width;
uniform float height;

const float PI = 3.1415926535;

mat4 translate(vec3 p) {
  return mat4(
    vec4(1.0, 0.0, 0.0, 0.0),
    vec4(0.0, 1.0, 0.0, 0.0),
    vec4(0.0, 0.0, 1.0, 0.0),
    vec4(p.x, p.y, p.z, 1.0)
  );
}


mat4 rotX(float angle) {
  float S = sin(angle);
  float C = cos(angle);
  return mat4(
    vec4(1.0, 0, 0, 0),
    vec4(0  , C, S, 0),
    vec4(0  ,-S, C, 0),
    vec4(0  , 0, 0, 1.0)
  );
}

mat4 rotY(float angle) {
  float S = sin(angle);
  float C = cos(angle);
  return mat4(
    vec4(C, 0  ,-S, 0),
    vec4(0, 1.0, 0, 0),
    vec4(S, 0  , C, 0),
    vec4(0, 0  , 0, 1.0)
  );
}

mat4 rotZ(float angle) {
  float S = sin(angle);
  float C = cos(angle);
  return mat4(
    vec4( C, S, 0  , 0),
    vec4(-S, C, 0  , 0),
    vec4( 0, 0, 1.0, 0),
    vec4( 0, 0, 0  , 1.0)
  );
}

// glFrustum(left, right, bottom, top, zNear, zFar)
mat4 frustum(float left, float right, float bottom, float top, float zNear, float zFar) {
  float t1 = 2.0 * zNear;
  float t2 = right - left;
  float t3 = top - bottom;
  float t4 = zFar - zNear;
	return mat4(
    vec4(t1 / t2, 0, 0, 0),
	  vec4(0, t1 / t3, 0, 0),
	  vec4((right + left) / t2, (top + bottom) / t3, (-zFar - zNear) / t4, -1.0),
	  vec4(0, 0, (-t1*zFar) / t4, 0));
}

// gluPerspective(fieldOfView, aspectRatio, zNear, zFar)
mat4 perspective(float fieldOfView, float aspectRatio, float zNear, float zFar) {
  float y = zNear * tan(fieldOfView * PI / 360.0);
  float x = y * aspectRatio;
	return frustum(-x, x, -y, y, zNear, zFar);
}

void main() {
  mat4 perspectiveMat = perspective(45.0, width / height, 0.1, 1000.0);
  mat4 translateMat = translate(vec3(sin(2.0 * time * 1e-2) * 0.05, sin(3.0 * time * 1e-2) * .1, -1.6 + sin(time * .1)));
  mat4 M = perspectiveMat * translateMat * rotX(time * 0.1) * rotY(time * 0.1) * rotZ(time * 0.01);

  vM = M;
  vpos = vec4(position, 1.0);
  vtexCoord = texCoord;
  vcolor = color;
  gl_Position = M * vec4(position, 1.0);
}
`;

export const frag = glsl`
precision highp float;
varying vec4 vpos;
varying mat4 vM;
varying vec2 vtexCoord;
varying vec3 vcolor;

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


void main() {
  vec2 p = normalizeScreenCoords();
  vec4 a = texture2D(image, vtexCoord);
  vec4 b = vec4(a.x * vcolor, 1.0);
  gl_FragColor = mix(a, b, vec4(.5 * (1.0 + sin(p.x * p.y * (3.0 + 2.0 * sin(time)) + time * .25))));
}
`;
