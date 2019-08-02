const glsl = x => x;

export const vert = glsl`
precision highp float;
attribute vec3 position;
attribute vec3 color;

varying vec4 vpos;
varying vec4 vcolor;
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
  vpos = vec4(position, 1.0);
  mat4 perspectiveMat = perspective(45.0, width / height, 0.1, 1000.0);
  mat4 translateMat = translate(vec3(sin(2.0 * time * 1e-2) * 0.05, sin(3.0 * time * 1e-2) * .1, -1.6 + sin(time * .1)));
  mat4 M = perspectiveMat * translateMat * rotX(time * 0.1) * rotY(time * 0.1) * rotZ(time * 0.25);
  vM = M;
  gl_Position = M * vec4(position, 1.0);
  vcolor = vec4(color, 1.0);
}
`;

export const frag = glsl`
precision highp float;
varying vec4 vcolor;
varying vec4 vpos;
varying mat4 vM;
uniform float width;
uniform float height;
uniform float time;

void main() {
  vec4 v = vM * vpos;
  gl_FragColor = (vcolor + normalize(v) - (1.0 - cos(v.x + time * 0.1) * sin(v.y * v.z * 2.5 + time * .01) * .5)*.25);
}
`;
