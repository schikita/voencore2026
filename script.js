document.addEventListener('DOMContentLoaded', function () {
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
initTypewriter(reduceMotion);
initIntroSlideshow();
initDayNav();
initDaysNavScroll();
initScrollReveal(reduceMotion);
initSlider();
initParallax(reduceMotion);
initSectionTyping(reduceMotion);
initVideoPlayers();
initLightbox();
initBackToTop();
initProjectsCarousel(reduceMotion);
});
function initTypewriter(reduceMotion) {
var badge = document.querySelector('.hero__badge');
var textEls = document.querySelectorAll('.hero [data-text]');
if (!badge || !textEls.length) return;
if (reduceMotion) {
textEls.forEach(function (el) {
el.textContent = el.getAttribute('data-text') || el.textContent;
el.classList.add('typewriter-done');
});
return;
}
setTimeout(function () {
badge.classList.add('typewriter-active');
textEls.forEach(function (el) {
var text = el.getAttribute('data-text') || '';
var isBadgeText = el.classList.contains('hero__badge-text');
el.textContent = '';
var i = 0;
function typeChar() {
if (i < text.length) {
el.textContent = text.slice(0, i + 1);
i += 1;
setTimeout(typeChar, 40 + Math.random() * 120);
} else {
el.classList.add('typewriter-done');
if (isBadgeText) badge.classList.remove('typewriter-active');
}
}
typeChar();
});
}, 600);
var spoiler = document.querySelector('.intro__spoiler[data-text]');
if (!spoiler || !('IntersectionObserver' in window)) return;
var spoilerObs = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (!entry.isIntersecting || spoiler.dataset.typed) return;
spoiler.dataset.typed = 'true';
var text = spoiler.getAttribute('data-text') || '';
spoiler.textContent = '';
var i = 0;
function typeSpoiler() {
if (i < text.length) {
spoiler.textContent = text.slice(0, i + 1);
i += 1;
setTimeout(typeSpoiler, 35 + Math.random() * 90);
} else {
spoiler.classList.add('typewriter-done');
}
}
typeSpoiler();
spoilerObs.unobserve(spoiler);
});
}, { threshold: 0.4 });
spoilerObs.observe(spoiler);
}
function initIntroSlideshow() {
var stage = document.querySelector('.intro__photos-stage');
var photos = stage ? stage.querySelectorAll('.intro__photo') : [];
var counter = document.querySelector('.intro__photos-current');
if (!stage || !photos.length) return;
var current = 0;
var timer = null;
function showPhoto(index) {
photos.forEach(function (photo, i) {
photo.classList.toggle('intro__photo--active', i === index);
});
if (counter) counter.textContent = index + 1;
current = index;
}
function nextPhoto() {
showPhoto((current + 1) % photos.length);
}
function startAutoplay() {
stopAutoplay();
timer = setInterval(nextPhoto, 3200);
}
function stopAutoplay() {
if (timer) {
clearInterval(timer);
timer = null;
}
}
stage.addEventListener('mouseenter', stopAutoplay);
stage.addEventListener('mouseleave', startAutoplay);
stage.addEventListener('click', function (e) {
if (e.target.closest('figcaption') || e.target.closest('[data-lightbox] img')) return;
nextPhoto();
stopAutoplay();
});
stage.setAttribute('tabindex', '0');
stage.addEventListener('keydown', function (e) {
if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
e.preventDefault();
nextPhoto();
stopAutoplay();
}
if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
e.preventDefault();
showPhoto((current - 1 + photos.length) % photos.length);
stopAutoplay();
}
});
photos.forEach(function (photo, i) {
photo.setAttribute('data-frame', String(i + 1));
});
showPhoto(0);
startAutoplay();
}
function initDayNav() {
var navInner = document.querySelector('.days-nav__inner');
var links = document.querySelectorAll('.days-nav__link');
var sections = [];
links.forEach(function (link) {
var target = document.querySelector(link.getAttribute('href'));
if (target) sections.push({ link: link, section: target });
});
var lastId = '';
function setActive() {
var currentId = '';
var scrollPos = window.scrollY + 120;
sections.forEach(function (item) {
if (item.section.offsetTop <= scrollPos) {
currentId = item.section.id;
}
});
links.forEach(function (link) {
var active = currentId && link.getAttribute('href') === '#' + currentId;
link.classList.toggle('days-nav__link--active', active);
if (active && currentId !== lastId && navInner) {
var left = link.offsetLeft - (navInner.clientWidth - link.offsetWidth) / 2;
navInner.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
}
});
lastId = currentId;
}
window.addEventListener('scroll', setActive, { passive: true });
setActive();
}
function initDaysNavScroll() {
var nav = document.querySelector('.days-nav');
if (!nav) return;
function onScroll() {
requestAnimationFrame(function () {
nav.classList.toggle('days-nav--solid', window.scrollY > 10);
});
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
}
function initScrollReveal(reduceMotion) {
var revealEls = document.querySelectorAll('.day, .outro__quote, [data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
revealEls.forEach(function (el) {
el.style.opacity = '1';
el.style.transform = 'none';
});
return;
}
revealEls.forEach(function (el) {
el.style.opacity = '0';
el.style.transform = 'translateY(24px)';
el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});
var observer = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (!entry.isIntersecting) return;
entry.target.style.opacity = '1';
entry.target.style.transform = 'translateY(0)';
observer.unobserve(entry.target);
});
}, { threshold: 0.1 });
revealEls.forEach(function (el) {
observer.observe(el);
});
}
function initSlider() {
document.querySelectorAll('.slider').forEach(function (slider) {
var slides = slider.querySelectorAll('.slider__slide');
var prevBtn = slider.querySelector('.slider__btn--prev');
var nextBtn = slider.querySelector('.slider__btn--next');
var currentSpan = slider.querySelector('.slider__current');
var totalSpan = slider.querySelector('.slider__total');
var dotsContainer = slider.querySelector('.slider__dots');
var current = 0;
if (!slides.length) return;
if (totalSpan) totalSpan.textContent = slides.length;
if (dotsContainer) {
for (var i = 0; i < slides.length; i += 1) {
var dot = document.createElement('button');
dot.type = 'button';
dot.className = 'dot' + (i === 0 ? ' dot--active' : '');
dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
dot.addEventListener('click', goTo.bind(null, i));
dotsContainer.appendChild(dot);
}
}
function goTo(index) {
slides.forEach(function (slide, i) {
slide.classList.toggle('slider__slide--active', i === index);
});
if (currentSpan) currentSpan.textContent = index + 1;
var dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
dots.forEach(function (item, i) {
item.classList.toggle('dot--active', i === index);
});
current = index;
}
if (prevBtn) {
prevBtn.addEventListener('click', function () {
goTo((current - 1 + slides.length) % slides.length);
});
}
if (nextBtn) {
nextBtn.addEventListener('click', function () {
goTo((current + 1) % slides.length);
});
}
slider.setAttribute('tabindex', '0');
slider.addEventListener('keydown', function (e) {
if (e.key === 'ArrowLeft') {
e.preventDefault();
if (prevBtn) prevBtn.click();
}
if (e.key === 'ArrowRight') {
e.preventDefault();
if (nextBtn) nextBtn.click();
}
});
});
}
function initParallax(reduceMotion) {
if (reduceMotion) return;
var photoFulls = document.querySelectorAll('.photo-full');
if (!photoFulls.length) return;
window.addEventListener('scroll', function () {
photoFulls.forEach(function (el) {
var rect = el.getBoundingClientRect();
var img = el.querySelector('.photo-full__img img');
if (!img) return;
var visiblePart = Math.max(0, Math.min(1,
(window.innerHeight - rect.top) / (window.innerHeight + rect.height)
));
img.style.transform = 'scale(1.02) translateY(' + ((visiblePart - 0.5) * 20) + 'px)';
});
}, { passive: true });
}
function initSectionTyping(reduceMotion) {
var daySections = document.querySelectorAll('.day');
if (!daySections.length) return;
function typeTitle(title) {
var text = title.getAttribute('data-day-title') || '';
if (reduceMotion) {
title.textContent = text;
title.classList.add('typewriter-done');
return;
}
title.textContent = '';
var i = 0;
function typeChar() {
if (i < text.length) {
title.textContent = text.slice(0, i + 1);
i += 1;
setTimeout(typeChar, 50 + Math.random() * 150);
} else {
title.classList.add('typewriter-done');
}
}
typeChar();
}
if (!('IntersectionObserver' in window)) {
daySections.forEach(function (section) {
var title = section.querySelector('.day__title[data-day-title]');
if (title) typeTitle(title);
});
return;
}
var observer = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (!entry.isIntersecting) return;
var title = entry.target.querySelector('.day__title[data-day-title]');
if (title && !title.dataset.typed) {
title.dataset.typed = 'true';
typeTitle(title);
}
observer.unobserve(entry.target);
});
}, { threshold: 0.3 });
daySections.forEach(function (section) {
observer.observe(section);
});
}
function formatTime(sec) {
if (!Number.isFinite(sec)) return '0:00';
var m = Math.floor(sec / 60);
var s = Math.floor(sec % 60);
return m + ':' + String(s).padStart(2, '0');
}
function initVideoPlayers() {
document.querySelectorAll('[data-vplayer]').forEach(function (player) {
var frame = player.querySelector('.vplayer__frame');
var video = player.querySelector('.vplayer__video');
if (!frame || !video) return;
var videoSrc = video.dataset.src || video.getAttribute('src');
var videoReady = false;
var bigPlay = player.querySelector('.vplayer__big-play');
var playBtn = player.querySelector('.vplayer__btn--play');
var muteBtn = player.querySelector('.vplayer__btn--mute');
var progressWrap = player.querySelector('.vplayer__progress-wrap');
var progressFill = player.querySelector('.vplayer__progress-fill');
var timeEl = player.querySelector('.vplayer__time');
function ensureVideoSrc() {
if (videoReady || !videoSrc) return;
video.src = videoSrc;
video.load();
videoReady = true;
}
if ('IntersectionObserver' in window) {
var videoObserver = new IntersectionObserver(function (entries) {
if (entries[0].isIntersecting) {
ensureVideoSrc();
videoObserver.disconnect();
}
}, { rootMargin: '320px' });
videoObserver.observe(player);
}
function updateProgress() {
if (!video.duration || !progressFill || !progressWrap || !timeEl) return;
var pct = (video.currentTime / video.duration) * 100;
progressFill.style.width = pct + '%';
progressWrap.setAttribute('aria-valuenow', String(Math.round(pct)));
timeEl.textContent = formatTime(video.currentTime);
}
function setPlaying(playing) {
player.classList.toggle('is-playing', playing);
player.classList.toggle('is-paused', !playing);
}
function togglePlay() {
ensureVideoSrc();
if (video.paused) video.play().catch(function () {});
else video.pause();
}
if (bigPlay) bigPlay.addEventListener('click', togglePlay);
if (playBtn) playBtn.addEventListener('click', togglePlay);
video.addEventListener('play', function () { setPlaying(true); });
video.addEventListener('pause', function () { setPlaying(false); });
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('loadedmetadata', updateProgress);
video.addEventListener('ended', function () { setPlaying(false); });
if (muteBtn) {
muteBtn.addEventListener('click', function () {
video.muted = !video.muted;
player.classList.toggle('is-muted', video.muted);
muteBtn.setAttribute('aria-label', video.muted ? 'Включить звук' : 'Выключить звук');
});
}
if (progressWrap) {
progressWrap.addEventListener('click', function (e) {
var rect = progressWrap.getBoundingClientRect();
var ratio = (e.clientX - rect.left) / rect.width;
if (video.duration) video.currentTime = ratio * video.duration;
});
progressWrap.addEventListener('keydown', function (e) {
if (!video.duration) return;
var step = e.key === 'ArrowRight' ? 5 : e.key === 'ArrowLeft' ? -5 : 0;
if (!step) return;
e.preventDefault();
video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + step));
});
}
frame.addEventListener('click', function (e) {
if (e.target.closest('.vplayer__controls') || e.target.closest('.vplayer__big-play')) return;
togglePlay();
});
video.muted = true;
player.classList.add('is-muted', 'is-paused');
if (muteBtn) muteBtn.setAttribute('aria-label', 'Включить звук');
});
}
function initLightbox() {
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightbox-img');
var lightboxCap = document.getElementById('lightbox-cap');
var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
if (!lightbox || !lightboxImg || !items.length) return;
var gallery = items.map(function (el) {
var img = el.querySelector('img') || (el.tagName === 'IMG' ? el : null);
var cap = el.querySelector('figcaption');
return {
src: img ? img.currentSrc || img.src : '',
alt: img ? img.alt : '',
cap: cap ? cap.textContent : ''
};
}).filter(function (item) { return item.src; });
var index = 0;
function openLightbox(nextIndex) {
if (!gallery.length) return;
index = (nextIndex + gallery.length) % gallery.length;
var item = gallery[index];
lightboxImg.src = item.src;
lightboxImg.alt = item.alt;
if (lightboxCap) {
lightboxCap.textContent = item.cap || item.alt;
lightboxCap.hidden = !lightboxCap.textContent;
}
lightbox.hidden = false;
requestAnimationFrame(function () {
lightbox.classList.add('is-open');
});
document.body.classList.add('is-locked');
}
function closeLightbox() {
lightbox.classList.remove('is-open');
document.body.classList.remove('is-locked');
setTimeout(function () {
if (!lightbox.classList.contains('is-open')) lightbox.hidden = true;
}, 300);
}
items.forEach(function (el, i) {
el.addEventListener('click', function (e) {
if (e.target.closest('.slider__btn') || e.target.closest('.vplayer')) return;
e.preventDefault();
e.stopPropagation();
openLightbox(i);
});
});
var closeBtn = lightbox.querySelector('[data-lightbox-close]');
var prevBtn = lightbox.querySelector('[data-lightbox-prev]');
var nextBtn = lightbox.querySelector('[data-lightbox-next]');
if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (prevBtn) prevBtn.addEventListener('click', function () { openLightbox(index - 1); });
if (nextBtn) nextBtn.addEventListener('click', function () { openLightbox(index + 1); });
lightbox.addEventListener('click', function (e) {
if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', function (e) {
if (lightbox.hidden) return;
if (e.key === 'Escape') closeLightbox();
if (e.key === 'ArrowLeft') openLightbox(index - 1);
if (e.key === 'ArrowRight') openLightbox(index + 1);
});
}
function initBackToTop() {
var backToTop = document.getElementById('back-to-top');
if (!backToTop) return;
function onScroll() {
var show = window.scrollY > 480;
if (show) backToTop.hidden = false;
requestAnimationFrame(function () {
backToTop.classList.toggle('is-visible', show);
});
if (!show) {
window.setTimeout(function () {
if (!backToTop.classList.contains('is-visible')) backToTop.hidden = true;
}, 300);
}
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
backToTop.addEventListener('click', function () {
window.scrollTo({ top: 0, behavior: 'smooth' });
});
}
function initProjectsCarousel(reduceMotion) {
var viewport = document.querySelector('.projects-viewport');
if (!viewport) return;
var cards = Array.prototype.slice.call(viewport.querySelectorAll('.project-card'));
if (!cards.length) return;
var autoplay = viewport.dataset.autoplay === 'true';
var interval = parseInt(viewport.dataset.interval || '5000', 10);
var index = cards.findIndex(function (card) { return card.classList.contains('is-active'); });
if (index < 0) index = 0;
var timerId = 0;
function layout() {
var total = cards.length;
cards.forEach(function (card, i) {
card.classList.remove('is-active', 'is-prev', 'is-next');
if (i === index) card.classList.add('is-active');
else if (i === (index - 1 + total) % total) card.classList.add('is-prev');
else if (i === (index + 1) % total) card.classList.add('is-next');
});
}
function next() {
index = (index + 1) % cards.length;
layout();
}
function prev() {
index = (index - 1 + cards.length) % cards.length;
layout();
}
function startAutoplay() {
clearInterval(timerId);
if (!autoplay || reduceMotion || cards.length < 2) return;
timerId = setInterval(next, interval);
}
layout();
startAutoplay();
viewport.addEventListener('mouseenter', function () { clearInterval(timerId); });
viewport.addEventListener('mouseleave', startAutoplay);
viewport.addEventListener('focusin', function () { clearInterval(timerId); });
viewport.addEventListener('focusout', startAutoplay);
cards.forEach(function (card, i) {
card.addEventListener('click', function (e) {
if (card.classList.contains('is-active')) return;
e.preventDefault();
index = i;
layout();
startAutoplay();
});
});
var touchStartX = 0;
viewport.addEventListener('touchstart', function (e) {
touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
viewport.addEventListener('touchend', function (e) {
var dx = e.changedTouches[0].screenX - touchStartX;
if (Math.abs(dx) < 40) return;
if (dx < 0) next();
else prev();
startAutoplay();
}, { passive: true });
}

/* ---------- Карусель проектов ---------- */
document.querySelectorAll('.projects-viewport').forEach(function(viewport) {
  var stage = viewport.querySelector('.projects-stage');
  if (!stage) return;
  var cards = Array.from(stage.querySelectorAll('.project-card'));
  var autoplay = viewport.getAttribute('data-autoplay') === 'true';
  var interval = parseInt(viewport.getAttribute('data-interval'), 10) || 5000;
  var activeIndex = cards.findIndex(function(c) { return c.classList.contains('is-active'); });
  if (activeIndex < 0) activeIndex = 0;
  var timer = null;

  function setActive(index) {
    activeIndex = (index + cards.length) % cards.length;
    cards.forEach(function(card, i) {
      card.classList.remove('is-active', 'is-prev', 'is-next');
      var diff = (i - activeIndex + cards.length) % cards.length;
      if (diff === 0) card.classList.add('is-active');
      else if (diff === cards.length - 1) card.classList.add('is-prev');
      else if (diff === 1) card.classList.add('is-next');
    });
  }

  function startAutoplay() {
    if (!autoplay || cards.length < 2) return;
    stopAutoplay();
    timer = setInterval(function() { setActive(activeIndex + 1); }, interval);
  }

  function stopAutoplay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  cards.forEach(function(card, i) {
    card.addEventListener('click', function(e) {
      if (card.classList.contains('is-active')) return;
      e.preventDefault();
      setActive(i);
      stopAutoplay();
      startAutoplay();
    });
  });

  setActive(activeIndex);
  startAutoplay();
  viewport.addEventListener('mouseenter', stopAutoplay);
  viewport.addEventListener('mouseleave', startAutoplay);
});
