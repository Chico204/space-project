const hamburger = document.querySelector('.hamburger')
const mobile = document.querySelector('.mobile-menu')
hamburger.addEventListener('click',function(){
    mobile.classList.toggle('active')
})





const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = document.querySelectorAll('.dot');

// Clone first and last slides
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = 'first-clone';
lastClone.id = 'last-clone';

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

const updatedSlides = document.querySelectorAll('.slide');
let currentIndex = 1; // Start at the "real" first slide
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let isDragging = false;
let slideWidth = updatedSlides[0].clientWidth;

track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

updatedSlides.forEach((slide, index) => {
  // Touch events
  slide.addEventListener('touchstart', touchStart(index));
  slide.addEventListener('touchend', touchEnd);
  slide.addEventListener('touchmove', touchMove);

  // Mouse events
  slide.addEventListener('mousedown', touchStart(index));
  slide.addEventListener('mouseup', touchEnd);
  slide.addEventListener('mouseleave', touchEnd);
  slide.addEventListener('mousemove', touchMove);
});

window.addEventListener('resize', () => {
  slideWidth = updatedSlides[0].clientWidth;
  setPositionByIndex();
});

track.addEventListener('transitionend', () => {
  if (updatedSlides[currentIndex].id === 'first-clone') {
    track.style.transition = 'none';
    currentIndex = 1;
    setPositionByIndex();
  } else if (updatedSlides[currentIndex].id === 'last-clone') {
    track.style.transition = 'none';
    currentIndex = slides.length;
    setPositionByIndex();
  }
});

function touchStart(index) {
  return function (event) {
    startPos = getPositionX(event);
    isDragging = true;
    track.classList.add('grabbing');
  };
}

function touchEnd() {
  if (!isDragging) return;
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100) currentIndex += 1;
  if (movedBy > 100) currentIndex -= 1;

  setPositionByIndex();
  updateDots();
  track.classList.remove('grabbing');
}

function touchMove(event) {
  if (!isDragging) return;
  const currentPosition = getPositionX(event);
  currentTranslate = prevTranslate + currentPosition - startPos;
  track.style.transition = 'none';
  track.style.transform = `translateX(${currentTranslate}px)`;
}

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function setPositionByIndex() {
  track.style.transition = 'transform 0.4s ease';
  currentTranslate = -slideWidth * currentIndex;
  prevTranslate = currentTranslate;
  track.style.transform = `translateX(${currentTranslate}px)`;
}

function updateDots() {
  const visibleIndex = (currentIndex - 1 + slides.length) % slides.length;
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[visibleIndex]) dots[visibleIndex].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    currentIndex = parseInt(dot.getAttribute('data-slide')) + 1;
    setPositionByIndex();
    updateDots();
  });
});
// Existing variables...
let autoSlideInterval = setInterval(nextSlide, 4000); // Auto-slide every 4 seconds

function nextSlide() {
  if (currentIndex >= updatedSlides.length - 1) return; // Prevent overflow
  currentIndex++;
  setPositionByIndex();
  updateDots();
}

// Reset interval on interaction
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 4000);
}

// Update dot clicks to reset timer
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    currentIndex = parseInt(dot.getAttribute('data-slide')) + 1;
    setPositionByIndex();
    updateDots();
    resetAutoSlide();
  });
});

// Update drag events to reset timer
function touchStart(index) {
  return function (event) {
    startPos = getPositionX(event);
    isDragging = true;
    track.classList.add('grabbing');
    resetAutoSlide();
  };
}

// Update transitionend to handle loop
track.addEventListener('transitionend', () => {
  if (updatedSlides[currentIndex].id === 'first-clone') {
    track.style.transition = 'none';
    currentIndex = 1;
    setPositionByIndex();
  } else if (updatedSlides[currentIndex].id === 'last-clone') {
    track.style.transition = 'none';
    currentIndex = slides.length;
    setPositionByIndex();
  }
});

const carouselConatiner = document.querySelector('.carousel');
carouselConatiner.addEventListener('mouseenter', ()=> clearInterval(autoSlideInterval) )
carouselConatiner.addEventListener('mouseleave', function(){
    autoSlideInterval = setInterval(nextSlide, 4000);
})
