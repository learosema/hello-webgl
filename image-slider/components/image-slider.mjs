import GLea from '../../lib/glea/glea.mjs';
import { easeInOutCubic } from './easings.mjs';
import { frag, vert } from './shaders.mjs';

/**
 * JavaScript implementation of GLSL clamp, clamps the value to [min, max]
 * @param {number} value value to be clamped 
 * @param {number} min minimum value 
 * @param {number} max maximum value
 */
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const html = x => x;

export default class ImageSlider extends HTMLElement {

  constructor() {
    super();
    this.imageContainer = this.querySelector('[slot]');
    this.animationLoop = this.animationLoop.bind(this);
    this.onContextLost = this.onContextLost.bind(this);
    this.onContextRestored = this.onContextRestored.bind(this);
    this.attachShadow({ mode: 'open' });
    this.initialized = false;
    this.prevIndex = 1;
    this.indexChangedTime = 0;
  }

  /**
   * registers the <image-slider /> custom web component
   * @returns {void}
   */
  static register() {
    customElements.define('image-slider', ImageSlider);
  }

  /**
   * returns the attributes ovserved by the component
   * @returns {string[]}
   */
  static get observedAttributes() {
    return ['index', 'autoplay'];
  }

  /**
   * get autoplay
   */
  get autoplay() {
    return this.hasAttribute('autoplay');
  }

  /**
   * set autoplay attribute
   */
  set autoplay(value) {
    if (Boolean(value) === true) {
      this.setAttribute('autoplay', 'autoplay');
    } else {
      this.removeAttribute('autoplay');
    }
  }

  /**
   * set index attribute
   */
  get index() {
    if (this.hasAttribute('index')) {
      const imageIndex = parseInt(this.getAttribute('index') || '1', 10);
      return isNaN(imageIndex) ? 1 : imageIndex;
    }
    return null;
  }

  /**
   * get index attribute
   */
  set index(value) {
    if (value === null || typeof value === 'undefined') {
      this.removeAttribute('index');
      return;
    }
    if (typeof value !== 'number') {
      value = clamp(parseInt(value, 10), 1, this.images.length);
      if (isNaN(value)) {
        value = 1;
      }
    }
    this.setAttribute('index', value.toString(10));
  }

  /**
   * Called when an attribute is changed
   * 
   * @param {string} name 
   * @param {string} oldValue 
   * @param {string} newValue 
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'index' && oldValue !== null && oldValue !== newValue) {
      // keep track of the time the index is changed
      // so we can pass it to the shader
      this.indexChangedTime = performance.now();
      const prev = parseInt(oldValue || '1', 10);
      this.prevIndex = isNaN(prev) ? 1 : prev; 
      this.updateTextures();
    }
  }

  /**
   * Load images
   * @returns {Promise<Image[]>} returns image objects when they are loaded
   */
  async loadImages() {
    const imgs = [...this.imageContainer.querySelectorAll('img')];
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

  /**
   * load CSS
   * 
   * @returns {Promise<string>} css embedded in style tag
   */
  async loadCss() {
    const cssResponse = await fetch('./components/image-slider.css');
    const css = await cssResponse.text();
    return `<style>${css}</style>`;
  }

  /**
   * called when the component is attached to the dom
   */
  async connectedCallback() {
    if (! this.initialized) {
      this.initialized = true;
      this.css = await this.loadCss();
      this.images = await this.loadImages();
      this.render();
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.initWebGL();
      this.canvas.addEventListener('webglcontextlost', this.onContextLost);
      this.canvas.addEventListener('webglcontextrestored', this.onContextRestored);
    }
  }

  /**
   * called when the component is detached from the dom
   */
  disconnectedCallback() {
    cancelAnimationFrame(this.frame);
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
    this.glea.destroy();
    this.initialized = false;
  }

  /**
   * creates the WebGLRenderingContext, buffers, attributes, shaders and uploads images as textures
   */
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
    const image1 = this.images[this.index - 1];
    const image2 = this.images[this.index - 1];
    this.sameTextures = true;
    this.texture1 = glea.createTexture(0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    
    this.texture2 = glea.createTexture(1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);

    glea.uniI('texture1', 0);
    glea.uniI('texture2', 1);
  
    glea.uniIV('textureSize1', [image1.width, image1.height]);
    glea.uniIV('textureSize2', [image2.width, image2.height]);

    glea.uni('animationStep', 0);

    window.addEventListener('resize', () => {
      glea.resize();
    });
    this.animationLoop();
  }


  updateTextures() {
    const { glea, images, index, prevIndex } = this;
    const { gl } = glea;
    if (this.texture1 && this.texture2) {
      const image1 = images[prevIndex - 1];
      const image2 = images[index - 1];
      this.sameTextures = (prevIndex === index);
      if (image1 && image1.complete) {
        glea.setActiveTexture(0, this.texture1);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
      }
      if (image2 && image2.complete) {
        glea.setActiveTexture(1, this.texture2);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
      }
      glea.uni('animationStep', 0);
    }
  }

  animationLoop(time = 0) {
    const { glea } = this;
    const { gl } = glea;
    glea.clear();
    glea.uni('width', glea.width);
    glea.uni('height', glea.height);
    glea.uni('time', time * .005);
    glea.uni('animationStep', this.sameTextures ? 0 : 
     easeInOutCubic(clamp((performance.now() - this.indexChangedTime) / 1000, 0, 1)));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.frame = requestAnimationFrame(this.animationLoop);
  }

  onContextLost(e) {
    e.preventDefault();
    cancelAnimationFrame(this.frame);
  }

  onContextRestored() {
    this.initWebGL();
  }

  /**
   * render component's the shadow root
   */
  render() {
    const { css } = this;
    this.shadowRoot.innerHTML = css + html`
      <canvas></canvas>
      <slot name="images"></slot>
    `;
  }
  
}