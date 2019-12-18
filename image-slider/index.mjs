import ImageSlider from './components/image-slider.mjs';

ImageSlider.register();

const nav = document.querySelector('nav');
const imageSlider = document.querySelector('image-slider');

nav.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.nodeName === 'A') {
    const a = e.target;
    const newIndex = a.getAttribute('href').slice(-1);
    imageSlider.setAttribute('index', newIndex);
  }
});

function prevImage() {
  const currentIndex = parseInt(imageSlider.getAttribute('index'), 10) || 1;
  const numImages = [...imageSlider.querySelectorAll('img')].length;
  const newIndex = (currentIndex > 1) ? (currentIndex-1) : numImages;
  imageSlider.setAttribute('index', newIndex);
}

function nextImage() {
  const currentIndex = parseInt(imageSlider.getAttribute('index'), 10) || 1;
  const numImages = [...imageSlider.querySelectorAll('img')].length;
  const newIndex = (currentIndex < numImages) ? (currentIndex + 1) : 1;
  imageSlider.setAttribute('index', newIndex);
}

window.addEventListener('keyup', (e) => {
  if (e.keyCode === 37) {
    prevImage();
  }
  if (e.keyCode === 39) {
    nextImage();
  }
});