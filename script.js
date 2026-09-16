document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');

function closeNav() {
  primaryNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', function () {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

primaryNav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', closeNav);
});

document.addEventListener('click', function (e) {
  if (!primaryNav.classList.contains('is-open')) return;
  if (primaryNav.contains(e.target) || navToggle.contains(e.target)) return;
  closeNav();
});

(function () {
  const track = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('testimonial-dots');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  if (cards.length === 0) return;

  cards.forEach(function (card, i) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'testimonial-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Pergi ke testimoni ' + (i + 1));
    dot.addEventListener('click', function () {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function updateActiveDot() {
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closestIndex = 0;
    let closestDist = Infinity;
    cards.forEach(function (card, i) {
      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < closestDist) { closestDist = dist; closestIndex = i; }
    });
    dots.forEach(function (d, i) { d.classList.toggle('is-active', i === closestIndex); });
  }

  function updateArrows() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = maxScroll <= 4 || track.scrollLeft >= maxScroll - 4;
  }

  function scrollByCard(direction) {
    const gapStr = getComputedStyle(track).columnGap || getComputedStyle(track).gap || '20';
    const gap = parseFloat(gapStr) || 20;
    const amount = (cards[0].getBoundingClientRect().width + gap) * direction;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', function () { scrollByCard(-1); });
  nextBtn.addEventListener('click', function () { scrollByCard(1); });

  let ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateActiveDot();
      updateArrows();
      ticking = false;
    });
  });

  window.addEventListener('resize', function () {
    updateActiveDot();
    updateArrows();
  });
  updateActiveDot();
  updateArrows();
})();

const WHATSAPP_NUMBER = '60189692946';

const form = document.getElementById('quotation-form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nama = form.nama.value.trim();
  const ic = form.ic.value.trim();
  const plate = form.plate.value.trim();
  const model = form.model.value.trim();
  const tahun = form.tahun.value.trim();
  const alamat = form.alamat.value.trim();

  const message =
    'Sila lengkapkan maklumat di bawah untuk dapatkan Quotation Percuma\n\n' +
    'Nama : ' + nama + '\n' +
    'No. IC : ' + ic + '\n' +
    'No Plate : ' + plate + '\n' +
    'Model : ' + model + '\n' +
    'Tahun: ' + tahun + '\n' +
    'Alamat penuh serta poskod: ' + alamat;

  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener');
});
