class App {

  constructor(el) {
    this.el = el || document.querySelector('main')
    this.md = new markdownit();
    this.handleScroll = this.handleScroll.bind(this);
    this.handleKeyStroke = this.handleKeyStroke.bind(this);
  }

  async getSlides() {
    const { md } = this;
    const response = await fetch("SLIDES.md", {cache: "no-cache"})
    const text = await response.text();
    this.slides = md.render(text).split('<hr>').map((slide, idx) => {
      const div = document.createElement('div');
      div.innerHTML = slide;
      const images = [...div.querySelectorAll('img')];
      images.forEach(image => {
        image.parentElement.setAttribute('class', 'slide__image');
      });
      const anchors = [...div.querySelectorAll('a')];
      anchors.forEach(anchor => {
        anchor.setAttribute('target', '_blank');
      });
      return {
        id: 'slide' + idx,
        title: (div.querySelector('h1') || {}).textContent,
        content: div.innerHTML
      };
    });
  }

  async run() {
    await this.getSlides();
    this.render();
    this.mounted();
  }

  mounted() {
    Prism.highlightAll();
    if (document.location.hash && document.querySelector(document.location.hash)) {
      this.goTo(document.location.hash);
    } else {
      window.scrollTo(0, 0);
    }
    this.el.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
    window.addEventListener('keyup', this.handleKeyStroke);
    this.timeLeft = 20 * 60;
  }

  startClock() {
    this.displayClock();
    if (! this.timer) {
      this.timer = window.setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft-= 1;
        }
        this.displayClock();
      }, 1000);
    }
  }


  displayClock() {
    const timeLeft = this.timeLeft || 0;
    document.querySelector('.clock').textContent =
      `${(timeLeft / 60)|0}:${(timeLeft % 60).toString().padStart(2, '0')}`;
  }

  getScrollPositions() {
    const scrollPositions = [
      ...document.querySelectorAll('.slide')
    ].map(slide => {
      const rect = slide.getBoundingClientRect();
      return rect.top;
    }).map(Math.round);
    return scrollPositions;
  }

  getScrollIndex() {
    const h = document.body.getBoundingClientRect().height;
    return this.getScrollPositions().findIndex(x => x > -h + 1 && x < h);
  }

  handleScroll() {
    const currentPos = this.getScrollIndex();
    const hash = '#slide' + currentPos;
    if (hash !== document.location.hash) {
      history.replaceState(null, null, hash);
    }
    const currentDot = document.querySelector('li.current');
    const newDot = document.querySelectorAll('nav li')[currentPos];
    if (newDot !== currentDot) {
      if (currentDot) {
        currentDot.setAttribute('class', '');
      }
      if (newDot) {
        newDot.setAttribute('class', 'current');
      }
      if (currentPos >= 1) {
        this.startClock();
      }
    }
  }

  handleKeyStroke(e) {
    const SPACE = 32;
    const ENTER = 13;
    const LEFT = 37;
    const RIGHT = 39;
    if (e.keyCode === SPACE || e.keyCode === ENTER || e.keyCode === RIGHT) {
      this.startClock();
      this.nextSlide();
      return;
    }
    if (e.keyCode === LEFT) {
      this.prevSlide();
      return;
    }
    e.preventDefault();
  }

  goTo(hash) {
    const hashElement = document.querySelector(hash);
    if (hashElement) {
      const position = Math.round(hashElement.getBoundingClientRect().top + this.el.scrollTop);
      this.el.scrollTo(0, position);
      if (hash !== document.location.hash) {
        history.replaceState(null, null, hash)
      }
    }
  }

  nextSlide() {
    const numSlides = document.querySelectorAll('.slide').length;
    const current = this.getScrollIndex();
    if (current + 1 < numSlides) {
      this.goTo('#slide' + (current + 1));
    }
  }

  prevSlide() {
    const current = this.getScrollIndex();
    if (current - 1 >= 0) {
      this.goTo('#slide' + (current - 1));
    }
  }

  render() {
    this.el.innerHTML = `
      <nav><ul>
        ${this.slides.map(slide =>
          `<li><a href="#${slide.id}" title="${slide.title}">${slide.title}</a></li>`
        ).join('')}
      </ul></nav>

      ${this.slides.map((slide) => `
      <div class="slide" id="${slide.id}">
        ${slide.content}
      </div>`).join('')}

      <div class="clock"></div>
    `;
  }

}

const app = new App();
app.run();