//..........SCROLL BUTTONS..........

const logo= document.querySelector('.logo img');
const nav= document.querySelector('nav');
const scrollToTop= document.querySelector('.scroll-to-top');

window.addEventListener("scroll", scrollFunction);

function scrollFunction() {
 
    if (window.pageYOffset > 40) { // Show scrollToTop
        logo.classList.add('small');
        nav.classList.add('highlight');
        // more.classList.add('fade');
      }
    else { // Hide scrollToTop
      logo.classList.remove('small');
      nav.classList.remove('highlight');
      // more.classList.remove('fade');
    }
    if (window.pageYOffset > 300) { // Show scrollToTop
        scrollToTop.classList.add('fade');
        // scrollToTop.style.display = "block";
    }
    else { // Hide scrollToTop
        scrollToTop.classList.remove('fade');
        // scrollToTop.style.display = "none";
    }
}

scrollToTop.addEventListener("click", smoothScrollBackToTop);


function smoothScrollBackToTop() {
  const targetPosition = 0;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 750;
  let start = null;
  
  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(step);
  }
}

function easeInOutCubic(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};