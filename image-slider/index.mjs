import ImageSlider from './components/image-slider.mjs';

ImageSlider.register();

const nav = document.querySelector('nav');
const imageSlider = document.querySelector('image-slider');

nav.addEventListener('click', (e) => {
  e.preventDefault();
  const active = nav.querySelector('.active');
  if (active) {
    active.classList.remove('active');
  }
  if (e.target.nodeName === 'A') {
    const a = e.target;
    const newIndex = a.getAttribute('href').slice(-1);
    a.classList.add('active');
    imageSlider.setAttribute('index', newIndex);
  }
});

function prevImage() {
  const active = nav.querySelector('.active');
  if (active) {
    active.classList.remove('active');
  }
  const currentIndex = parseInt(imageSlider.getAttribute('index'), 10) || 1;
  const numImages = [...imageSlider.querySelectorAll('img')].length;
  const newIndex = (currentIndex > 1) ? (currentIndex-1) : numImages;
  document.querySelector(`[href="#image${newIndex}"]`).classList.add('active');
  imageSlider.setAttribute('index', newIndex);
}

function nextImage() {
  const active = nav.querySelector('.active');
  if (active) {
    active.classList.remove('active');
  }
  const currentIndex = parseInt(imageSlider.getAttribute('index'), 10) || 1;
  const numImages = [...imageSlider.querySelectorAll('img')].length;
  const newIndex = (currentIndex < numImages) ? (currentIndex + 1) : 1;
  document.querySelector(`[href="#image${newIndex}"]`).classList.add('active');
  imageSlider.setAttribute('index', newIndex);
}

window.addEventListener('keyup', (e) => {
  if (imageSlider.fading === true) {
    return;
  }
  if (e.keyCode === 37) {
    prevImage();
  }
  if (e.keyCode === 39) {
    nextImage();
  }
});