import { cube } from "../lib/glea/geometry.mjs";
import { loadImage } from "./image-loader.mjs";
import { frag, vert } from "./shaders.mjs";
import GLea from "../lib/glea/glea.mjs";

const Color = {
  red: [1, 0, 0],
  green: [0, 1, 0],
  blue: [0, 0, 1],
  yellow: [1, 1, 0],
  pink: [1, 0, 1],
  cyan: [0, 1, 1],
  white: [1, 1, 1],
  orange: [1, 0.5, 0],
  skyblue: [0.25, 0.5, 1],
};

const { red, green, blue, yellow, pink, cyan, skyblue, orange } = Color;

const glea = new GLea({
  shaders: [GLea.vertexShader(vert), GLea.fragmentShader(frag)],
  buffers: {
    position: GLea.buffer(3, cube(0.5)),
    texCoord: GLea.buffer(
      2,
      Array(6)
        .fill([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0])
        .flat()
    ),
    color: GLea.buffer(
      3,
      [
        ...Array(6).fill(red),
        ...Array(6).fill(green),
        ...Array(6).fill(blue),
        ...Array(6).fill(pink),
        ...Array(6).fill(skyblue),
        ...Array(6).fill(orange),
      ].flat()
    ),
  },
}).create();

function setup() {
  const { gl } = glea;
  gl.clearColor(1 / 6, 1 / 6, 1 / 6, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  window.addEventListener("resize", () => {
    glea.resize();
  });
}

function loop(time) {
  const { gl } = glea;
  glea.clear();
  glea.uni("width", glea.width);
  glea.uni("height", glea.height);
  glea.uni("time", time * 0.01);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  requestAnimationFrame(loop);
}

setup();
loadImage("js.png").then((image) => {
  const { gl } = glea;
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  loop(0);
});
