import GLea from '../../lib/glea/glea.mjs';
import { frag, vert } from './shaders.mjs';

// syntax highlighting via the lit-html vscode extension
const html = x => x;

export default class ImageSlider extends HTMLElement {

  constructor() {
    super();
    this.animationLoop = this.animationLoop.bind(this);
    this.attachShadow({ mode: 'open' });
    this.initialized = false;
  }

  static register() {
    customElements.define('image-slider', ImageSlider);
  }

  async loadImages() {
    const imgs = [...this.querySelectorAll('img')];
    console.log(imgs);
    return await Promise.all(imgs.map(img => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = img.src;
        image.onload = () => resolve(image);
        image.onerror = reject;
      })
    }));
  }

  async connectedCallback() {
    if (! this.initialized) {
      this.initialized = true;
      this.render();
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.prevButton = this.shadowRoot.querySelector('.button--prev');
      this.nextButton = this.shadowRoot.querySelector('.button--next');
      this.images = await this.loadImages();
      console.log(this.images);
      this.initWebGL();
    }
  }

  disconnectedCallback() {
    this.glea.destroy();
  }

  initWebGL() {
    this.glea = new GLea({
      canvas: this.canvas,
      shaders: [
        GLea.fragmentShader(frag),
        GLea.vertexShader(vert)
      ],
      buffers: {
        'position': GLea.buffer(2, [1, 1,  -1, 1,  1,-1,  -1,-1])
      }
    }).create();
    const { glea } = this;
    const { gl } = glea;
    const image1 = this.images[0];
    const image2 = this.images[1];
    this.texture1 = glea.createTexture(0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    
    this.texture2 = glea.createTexture(1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);

    glea.uniI('texture1', 0);
    glea.uniI('texture2', 1);
  
    glea.uniIV('textureSize1', [image1.width, image1.height]);
    glea.uniIV('textureSize2', [image2.width, image2.height]);

    window.addEventListener('resize', () => {
      glea.resize();
    });
    this.animationLoop();
  }

  animationLoop(time = 0) {
    const { glea } = this;
    const { gl } = glea;
    glea.clear();
    glea.uni('width', glea.width);
    glea.uni('height', glea.height);
    glea.uni('time', time * .005);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(this.animationLoop);
  }

  render() {
    this.shadowRoot.innerHTML = html`
      <link rel="stylesheet" href="./components/image-slider.css">
      <canvas></canvas>
      <button class="button--prev"> previous </button>
      <button class="button--next"> next </button>
      <slot name="images"></slot>
    `
  }
  
}