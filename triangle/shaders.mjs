const glsl = x => x.trim();

export const frag = glsl`
precision highp float;
varying vec3 vcolor;

void main() {
  gl_FragColor = vec4(vcolor, 1.0); //vec4(1.0, 0, 0, 1.0);
}
`;

export const vert = glsl`
precision highp float;
attribute vec2 position;
attribute vec3 color;
uniform float time;
varying vec3 vcolor;

void main () {
  vcolor = color; //vec3(1.0, 0, 1.0);
  gl_Position = vec4(position + sin(position.x - position.y + time) * .3, 0, 1.0);
}
`;