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

const WHATSAPP_NUMBER = '601167995758';

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

/* FAQ accordion: animated open/close, one answer at a time */
(function () {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  if (items.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function collapse(item) {
    const answer = item.querySelector('.faq-answer');
    item.dataset.state = 'closing';
    if (!answer || reduceMotion) { item.open = false; return; }
    answer.style.height = answer.scrollHeight + 'px';
    requestAnimationFrame(function () {
      if (item.dataset.state !== 'closing') return;
      answer.style.height = '0px';
    });
    answer.addEventListener('transitionend', function done(e) {
      if (e.propertyName !== 'height') return;
      answer.removeEventListener('transitionend', done);
      answer.style.height = '';
      if (item.dataset.state === 'closing') item.open = false;
    });
  }

  function expand(item) {
    const answer = item.querySelector('.faq-answer');
    item.dataset.state = 'opening';
    item.open = true;
    if (!answer || reduceMotion) return;
    answer.style.height = '0px';
    requestAnimationFrame(function () {
      if (item.dataset.state !== 'opening') return;
      answer.style.height = answer.scrollHeight + 'px';
    });
    answer.addEventListener('transitionend', function done(e) {
      if (e.propertyName !== 'height') return;
      answer.removeEventListener('transitionend', done);
      if (item.dataset.state === 'opening') answer.style.height = '';
    });
  }

  items.forEach(function (item) {
    const summary = item.querySelector('summary');
    if (!summary) return;
    if (item.open) item.dataset.state = 'opening';
    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.open && item.dataset.state !== 'closing') {
        collapse(item);
        return;
      }
      items.forEach(function (other) {
        if (other !== item && other.open) collapse(other);
      });
      expand(item);
    });
  });
})();

/* Status "Buka Sekarang / Tutup" untuk seksyen Lokasi (waktu Malaysia) */
(function () {
  const wrap = document.getElementById('location-status');
  if (!wrap) return;
  const textEl = wrap.querySelector('.location-status-text');
  if (!textEl) return;

  const OPEN_MIN = 9 * 60;        // 9:00 AM
  const CLOSE_MIN = 16 * 60;      // 4:00 PM
  const OPEN_DAYS = [0, 1, 2, 3, 4, 5, 6]; // Isnin – Ahad
  const ONLINE_NOTE = ' · WhatsApp online 24 jam';
  const DAY_NAMES = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function malaysiaNow() {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kuala_Lumpur',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).formatToParts(new Date());
      const get = function (type) {
        const part = parts.find(function (p) { return p.type === type; });
        return part ? part.value : '';
      };
      const day = WEEKDAY_INDEX[get('weekday')];
      const hour = parseInt(get('hour'), 10) % 24;
      const minute = parseInt(get('minute'), 10);
      if (day === undefined || isNaN(hour) || isNaN(minute)) throw new Error('bad parts');
      return { day: day, minutes: hour * 60 + minute };
    } catch (e) {
      const d = new Date();
      return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function note(text) {
    const span = document.createElement('span');
    span.className = 'location-status-note';
    span.textContent = text;
    return span;
  }

  function nextOpenDay(today) {
    for (let i = 1; i <= 7; i++) {
      const day = (today + i) % 7;
      if (OPEN_DAYS.indexOf(day) !== -1) return day;
    }
    return today;
  }

  function render() {
    const now = malaysiaNow();
    const isBusinessDay = OPEN_DAYS.indexOf(now.day) !== -1;
    const isOpen = isBusinessDay && now.minutes >= OPEN_MIN && now.minutes < CLOSE_MIN;

    wrap.classList.toggle('is-closed', !isOpen);
    textEl.textContent = '';

    if (isOpen) {
      textEl.appendChild(document.createTextNode('Buka Sekarang'));
      textEl.appendChild(note(' · Tutup 4:00 PM'));
      textEl.appendChild(note(ONLINE_NOTE));
    } else {
      textEl.appendChild(document.createTextNode('Pejabat Tutup'));
      if (isBusinessDay && now.minutes < OPEN_MIN) {
        textEl.appendChild(note(' · Buka 9:00 AM hari ini'));
      } else {
        textEl.appendChild(note(' · Buka semula ' + DAY_NAMES[nextOpenDay(now.day)] + ' 9:00 AM'));
      }
      textEl.appendChild(note(ONLINE_NOTE));
    }

    wrap.hidden = false;
  }

  render();
  setInterval(render, 60000);
})();
