// ══════════════════════════════════════
// booking.js — Bokningsflöde
// ══════════════════════════════════════

// ── BOKADE DATUM (byt ut mot API senare) ──
const BOOKED_DATES = [];

// ── BOKNINGSSTATE ──
let booking = {
  step: 1,
  packageIdx: null,
  date: null,
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  name: '',
  phone: '',
  email: '',
  guests: '',
  message: '',
  addons: { delivery: false, technician: false, extraDay: false },
};

function resetBooking() {
  booking = {
    step: 1, packageIdx: null, date: null,
    calYear: new Date().getFullYear(),
    calMonth: new Date().getMonth(),
    name: '', phone: '', email: '', guests: '', message: '',
    addons: { delivery: false, technician: false, extraDay: false },
  };
}

// ── HJÄLPFUNKTIONER ──
const SWEDISH_MONTHS = ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December'];
const SWEDISH_DAYS = ['Mån','Tis','Ons','Tor','Fre','Lör','Sön'];

function isBooked(dateStr) {
  return BOOKED_DATES.includes(dateStr);
}

function isPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

function isTooSoon(dateStr) {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  minDate.setHours(0, 0, 0, 0);
  return new Date(dateStr) < minDate;
}

function formatDateSwedish(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' });
}

function padDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// ── STEGINDIKATOR ──
function renderSteps() {
  const steps = ['Paket', 'Datum', 'Uppgifter', 'Skicka'];
  return `
    <div class="booking-steps">
      ${steps.map((s, i) => {
        const num = i + 1;
        const state = num < booking.step ? 'done' : num === booking.step ? 'active' : 'upcoming';
        return `
          <div class="booking-step ${state}" ${num < booking.step ? `onclick="booking.step=${num};renderBookingPage()"` : ''}>
            <div class="step-dot">${state === 'done' ? icon('check', 12) : num}</div>
            <span class="step-name">${s}</span>
          </div>
          ${num < 4 ? '<div class="step-line ' + (num < booking.step ? 'done' : '') + '"></div>' : ''}
        `;
      }).join('')}
    </div>
  `;
}

// ── STEG 1: VÄLJ PAKET ──
function renderBookingStep1() {
  return `
    <div class="section-label">${icon('package', 14)} Steg 1</div>
    <div class="section-title">Välj paket</div>
    <div class="section-subtitle" style="margin-bottom:20px">Vilket paket passar ditt event?</div>
    <div class="booking-packages">
      ${PACKAGES.map((p, i) => `
        <div class="booking-pkg ${booking.packageIdx === i ? 'selected' : ''}" onclick="booking.packageIdx=${i};renderBookingPage()">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <div class="package-tag ${p.tagStyle}" style="margin-bottom:0">${p.tag}</div>
            ${booking.packageIdx === i ? `<span style="margin-left:auto;color:#c8a84e;display:flex">${icon('check-circle', 16)}</span>` : ''}
          </div>
          <div class="package-name">${p.name}</div>
          <div class="package-desc">${p.desc}</div>
          <div style="display:flex;align-items:baseline;gap:6px;margin-top:8px">
            <span class="package-price" style="font-size:18px">${p.price} kr</span>
            <span class="package-price-note" style="margin-bottom:0">/ dygn</span>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="booking-nav">
      <button class="btn-outline" onclick="resetBooking();setView(previousView)">
        ${icon('arrow-left', 16)} Tillbaka
      </button>
      <button class="btn-gold" ${booking.packageIdx === null ? 'disabled style="opacity:.4;pointer-events:none"' : ''} onclick="booking.step=2;renderBookingPage()">
        Välj datum ${icon('arrow-right', 16)}
      </button>
    </div>
  `;
}

// ── STEG 2: VÄLJ DATUM ──
function renderCalendar() {
  const y = booking.calYear;
  const m = booking.calMonth;
  const firstDay = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  // Monday = 0, Sunday = 6
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const today = new Date();
  const canGoPrev = !(y === today.getFullYear() && m === today.getMonth());

  let cells = '';
  // Empty cells before first day
  for (let i = 0; i < startDay; i++) {
    cells += '<div class="cal-cell empty"></div>';
  }
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = padDate(y, m, d);
    const booked = isBooked(dateStr);
    const past = isPast(dateStr);
    const selected = booking.date === dateStr;
    const unavailable = booked || past;

    let cls = 'cal-cell day';
    if (selected) cls += ' selected';
    else if (booked) cls += ' booked';
    else if (past) cls += ' past';
    else cls += ' available';

    const onclick = unavailable ? '' : `onclick="booking.date='${dateStr}';renderBookingPage()"`;
    const title = booked ? 'Bokat' : (past ? '' : 'Ledigt — klicka för att välja');

    cells += `<div class="${cls}" ${onclick} title="${title}"><span>${d}</span></div>`;
  }

  return `
    <div class="cal-container">
      <div class="cal-header">
        <button class="cal-nav ${!canGoPrev ? 'disabled' : ''}" ${canGoPrev ? `onclick="booking.calMonth--;if(booking.calMonth<0){booking.calMonth=11;booking.calYear--;}renderBookingPage()"` : ''}>
          ${icon('chevron-left', 18)}
        </button>
        <div class="cal-month">${SWEDISH_MONTHS[m]} ${y}</div>
        <button class="cal-nav" onclick="booking.calMonth++;if(booking.calMonth>11){booking.calMonth=0;booking.calYear++;}renderBookingPage()">
          ${icon('chevron-right', 18)}
        </button>
      </div>
      <div class="cal-days-header">
        ${SWEDISH_DAYS.map(d => `<div class="cal-day-name">${d}</div>`).join('')}
      </div>
      <div class="cal-grid">
        ${cells}
      </div>
      <div class="cal-legend">
        <span class="cal-legend-item"><span class="cal-dot available"></span> Ledigt</span>
        <span class="cal-legend-item"><span class="cal-dot booked"></span> Bokat</span>
        <span class="cal-legend-item"><span class="cal-dot selected"></span> Ditt val</span>
      </div>
    </div>
  `;
}

function renderBookingStep2() {
  return `
    <div class="section-label">${icon('calendar', 14)} Steg 2</div>
    <div class="section-title">Välj datum</div>
    <div class="section-subtitle" style="margin-bottom:20px">
      Se tillgänglighet och välj ditt datum.
    </div>
    ${renderCalendar()}
    ${booking.date ? `
      <div class="booking-date-confirm">
        ${icon('calendar-check', 18)}
        <div>
          <div style="font-size:11px;color:#8a8a80;font-weight:600">Valt datum</div>
          <div style="font-size:14px;font-weight:700;color:#f5f5f0;text-transform:capitalize">${formatDateSwedish(booking.date)}</div>
        </div>
      </div>
    ` : ''}
    <div class="booking-nav">
      <button class="btn-outline" onclick="booking.step=1;renderBookingPage()">
        ${icon('arrow-left', 16)} Tillbaka
      </button>
      <button class="btn-gold" ${!booking.date ? 'disabled style="opacity:.4;pointer-events:none"' : ''} onclick="booking.step=3;renderBookingPage()">
        Fyll i uppgifter ${icon('arrow-right', 16)}
      </button>
    </div>
  `;
}

// ── STEG 3: UPPGIFTER ──
function renderBookingStep3() {
  return `
    <div class="section-label">${icon('user', 14)} Steg 3</div>
    <div class="section-title">Dina uppgifter</div>
    <div class="section-subtitle" style="margin-bottom:20px">Vi behöver kontaktuppgifter och lite info om ert event.</div>

    <div class="booking-form">
      <div class="bfield">
        <label class="blabel">Namn *</label>
        <input class="binput" type="text" placeholder="Ditt namn" value="${booking.name}" oninput="booking.name=this.value"/>
      </div>
      <div class="bfield-row">
        <div class="bfield">
          <label class="blabel">Telefon *</label>
          <input class="binput" type="tel" placeholder="070-123 45 67" value="${booking.phone}" oninput="booking.phone=this.value"/>
        </div>
        <div class="bfield">
          <label class="blabel">E-post *</label>
          <input class="binput" type="email" placeholder="din@email.se" value="${booking.email}" oninput="booking.email=this.value"/>
        </div>
      </div>
      <div class="bfield">
        <label class="blabel">Antal gäster (ungefär)</label>
        <input class="binput" type="text" placeholder="t.ex. 80" value="${booking.guests}" oninput="booking.guests=this.value"/>
      </div>
      <div class="bfield">
        <label class="blabel">Berätta om eventet</label>
        <textarea class="binput btextarea" placeholder="Typ av event, lokal, önskemål..." oninput="booking.message=this.value">${booking.message}</textarea>
      </div>

      <div class="bfield">
        <label class="blabel">Tillägg</label>
        <div class="addon-checks">
          <label class="bcheck ${booking.addons.delivery ? 'checked' : ''}" onclick="booking.addons.delivery=!booking.addons.delivery;renderBookingPage()">
            <span class="bcheck-box">${booking.addons.delivery ? icon('check', 12) : ''}</span>
            <div>
              <div class="bcheck-name">${icon('truck', 14)} Leverans & hämtning</div>
              <div class="bcheck-price">300–800 kr</div>
            </div>
          </label>
          <label class="bcheck ${booking.addons.technician ? 'checked' : ''}" onclick="booking.addons.technician=!booking.addons.technician;renderBookingPage()">
            <span class="bcheck-box">${booking.addons.technician ? icon('check', 12) : ''}</span>
            <div>
              <div class="bcheck-name">${icon('wrench', 14)} Tekniker på plats</div>
              <div class="bcheck-price">400–600 kr/h</div>
            </div>
          </label>
          <label class="bcheck ${booking.addons.extraDay ? 'checked' : ''}" onclick="booking.addons.extraDay=!booking.addons.extraDay;renderBookingPage()">
            <span class="bcheck-box">${booking.addons.extraDay ? icon('calendar-plus', 12) : ''}</span>
            <div>
              <div class="bcheck-name">${icon('calendar-plus', 14)} Extra dag</div>
              <div class="bcheck-price">50% av dygnspris</div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="booking-nav">
      <button class="btn-outline" onclick="booking.step=2;renderBookingPage()">
        ${icon('arrow-left', 16)} Tillbaka
      </button>
      <button class="btn-gold" ${!(booking.name && booking.phone && booking.email) ? 'disabled style="opacity:.4;pointer-events:none"' : ''} onclick="booking.step=4;renderBookingPage()">
        Granska ${icon('arrow-right', 16)}
      </button>
    </div>
  `;
}

// ── STEG 4: SAMMANFATTNING ──
function renderBookingStep4() {
  const pkg = PACKAGES[booking.packageIdx];
  const addonsText = [];
  if (booking.addons.delivery) addonsText.push('Leverans & hämtning');
  if (booking.addons.technician) addonsText.push('Tekniker på plats');
  if (booking.addons.extraDay) addonsText.push('Extra dag');

  return `
    <div class="section-label">${icon('check-circle', 14)} Steg 4</div>
    <div class="section-title">Granska & skicka</div>
    <div class="section-subtitle" style="margin-bottom:20px">Kontrollera att allt stämmer innan du skickar din förfrågan.</div>

    <div class="booking-summary">
      <div class="bsum-section">
        <div class="bsum-label">Paket</div>
        <div class="bsum-value">${pkg.name} — ${pkg.price} kr/dygn</div>
      </div>
      <div class="bsum-divider"></div>
      <div class="bsum-section">
        <div class="bsum-label">Datum</div>
        <div class="bsum-value" style="text-transform:capitalize">${formatDateSwedish(booking.date)}</div>
      </div>
      <div class="bsum-divider"></div>
      <div class="bsum-section">
        <div class="bsum-label">Kontakt</div>
        <div class="bsum-value">${booking.name}</div>
        <div class="bsum-detail">${booking.phone} · ${booking.email}</div>
      </div>
      ${booking.guests ? `
        <div class="bsum-divider"></div>
        <div class="bsum-section">
          <div class="bsum-label">Antal gäster</div>
          <div class="bsum-value">~${booking.guests} personer</div>
        </div>
      ` : ''}
      ${booking.message ? `
        <div class="bsum-divider"></div>
        <div class="bsum-section">
          <div class="bsum-label">Meddelande</div>
          <div class="bsum-detail">${booking.message}</div>
        </div>
      ` : ''}
      ${addonsText.length ? `
        <div class="bsum-divider"></div>
        <div class="bsum-section">
          <div class="bsum-label">Tillägg</div>
          ${addonsText.map(a => `<div class="bsum-addon">${icon('plus', 12)} ${a}</div>`).join('')}
        </div>
      ` : ''}
    </div>

    <div class="booking-note">
      ${icon('info', 16)}
      <span>Detta är en förfrågan — inte en bekräftad bokning. Vi kontaktar dig inom 24h för att bekräfta.</span>
    </div>

    <div class="booking-nav">
      <button class="btn-outline" onclick="booking.step=3;renderBookingPage()">
        ${icon('arrow-left', 16)} Tillbaka
      </button>
      <button class="btn-gold" onclick="submitBooking()">
        ${icon('send', 16)} Skicka förfrågan
      </button>
    </div>
  `;
}

// ── BEKRÄFTELSE ──
function renderBookingConfirmation() {
  return `
    <div class="booking-confirmation">
      <div class="confirm-icon">${icon('check-circle', 48)}</div>
      <div class="section-title" style="text-align:center">Förfrågan skickad!</div>
      <p style="font-size:14px;color:#b5b5aa;text-align:center;line-height:1.7;max-width:400px;margin:12px auto 28px">
        Tack, ${booking.name}! Vi har tagit emot din bokningsförfrågan och återkommer inom 24 timmar med bekräftelse.
      </p>
      <div class="booking-summary" style="max-width:400px;margin:0 auto 28px">
        <div class="bsum-section">
          <div class="bsum-label">Paket</div>
          <div class="bsum-value">${PACKAGES[booking.packageIdx].name}</div>
        </div>
        <div class="bsum-divider"></div>
        <div class="bsum-section">
          <div class="bsum-label">Datum</div>
          <div class="bsum-value" style="text-transform:capitalize">${formatDateSwedish(booking.date)}</div>
        </div>
      </div>
      <button class="btn-outline" onclick="resetBooking();setView('hem')">
        ${icon('home', 16)} Tillbaka till startsidan
      </button>
    </div>
  `;
}

// ── SUBMIT (placeholder — koppla till backend/mail senare) ──
function submitBooking() {
  // TODO: Ersätt med faktisk submission (Formspree, API, mailto, etc.)
  console.log('Bokningsförfrågan:', JSON.stringify(booking, null, 2));
  booking.step = 5; // confirmation
  renderBookingPage();
}

// ── RENDER BOOKING PAGE ──
function renderBookingPage() {
  let html = '<div class="section booking-section">';
  html += renderSteps();

  switch (booking.step) {
    case 1: html += renderBookingStep1(); break;
    case 2: html += renderBookingStep2(); break;
    case 3: html += renderBookingStep3(); break;
    case 4: html += renderBookingStep4(); break;
    case 5: html += renderBookingConfirmation(); break;
  }

  html += '</div>';

  const el = document.getElementById('content');
  el.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}
