// ── STATE ──
let currentView = 'hem';
let previousView = 'hem';
let flippedPackages = new Set();

// ── NAVIGATION ──
function setView(view) {
  previousView = currentView;
  currentView = view;
  renderContent();
  updateNav();
  closeDrawer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNav() {
  document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
    const isActive = btn.dataset.view === currentView;
    btn.className = 'nav-btn ' + (isActive ? 'active' : 'inactive');
  });
}

// ── DRAWER ──
function toggleDrawer() {
  const d = document.getElementById('drawer');
  const o = document.getElementById('drawer-overlay');
  const open = d.classList.toggle('open');
  open ? o.classList.add('open') : o.classList.remove('open');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
}

// ── SMOOTH SCROLL TO SECTION ──
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── FAQ TOGGLE ──
function toggleFaq(el) {
  el.closest('.faq-item').classList.toggle('open');
}

// ── LUCIDE ICON HELPER ──
function icon(name, size = 18) {
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
}

// ── PACKAGES DATA ──
const PACKAGES = [
  {
    name: 'Topp-paket',
    tag: 'Grund',
    tagStyle: 'neutral',
    desc: 'Perfekt för mindre tillställningar och tal.',
    price: '900–1 200',
    suited: 'Tal, mingel och bakgrundsmusik. Passar medelstora lokaler med upp till 80 personer — t.ex. kalas, konferenser eller vernissage.',
    features: [
      '2x Alto TS415 (15", 2000W)',
      'Högtalarstativ',
      'Kablage ingår',
      'Passar upp till ~80 pers'
    ],
    featured: false,
  },
  {
    name: 'Festpaket S',
    tag: 'Populär',
    tagStyle: 'gold',
    desc: 'Mellanstort paket med rejäl bas — för fester med sting.',
    price: '1 800–2 500',
    suited: 'Det mest bokade paketet. Födelsedagar, studentfester och mindre bröllopsfester. Subwoofern ger dansgolvet den bas som behövs.',
    features: [
      'Allt i Topp-paket',
      '1x Subwoofer (15", 1500W)',
      'Mixer medföljer',
      'Passar upp till ~150 pers'
    ],
    featured: true,
  },
  {
    name: 'Festpaket L',
    tag: 'Full rigg',
    tagStyle: 'gold',
    desc: 'Komplett PA-system för stora fester och event.',
    price: '3 000–4 000',
    suited: 'Stora bröllop, företagsfester och event. Full rigg med dubbla subwoofers som fyller hela lokalen med kraftfullt, tydligt ljud.',
    features: [
      '2x Alto TS415 toppar',
      '2x Subwoofers',
      'Mixer ingår',
      'Kablage & stativ',
      'Upp till ~250 pers inomhus'
    ],
    featured: false,
  },
  {
    name: 'Dansbands\u00ADpaket',
    tag: 'Unik',
    tagStyle: 'gold',
    desc: 'Full rigg med danbandspinnar — skapt för dansband och föreningsliv.',
    price: '3 500–5 000',
    suited: 'Skräddarsytt för dansband och föreningar. Danbandspinnar ger den klassiska uppställningen som banden förväntar sig. Perfekt i bygdegård och folkpark.',
    features: [
      'Allt i Festpaket L',
      'Danbandspinnar (topp på sub)',
      'Optimerat för dansband',
      'Perfekt för bygdegård & folkpark'
    ],
    featured: false,
  },
];

function toggleFlip(idx) {
  if (flippedPackages.has(idx)) flippedPackages.delete(idx);
  else flippedPackages.add(idx);
  // Re-render without scroll
  const el = document.getElementById('content');
  if (currentView === 'hem') el.innerHTML = renderHomePage();
  else el.innerHTML = renderPackages() + renderHowItWorks() + renderFooter();
  if (window.lucide) lucide.createIcons();
}

const ADDONS = [
  { name: 'Leverans & hämtning', price: '300–800 kr', icon: 'truck', desc: 'Vi kör ut och hämtar utrustningen. Pris beroende på avstånd.' },
  { name: 'Tekniker på plats', price: '400–600 kr/h', icon: 'wrench', desc: 'Vi hjälper till med uppsättning, ljudcheck och support under eventet.' },
  { name: 'Extra dag', price: '50% av pris', icon: 'calendar-plus', desc: 'Behöver du utrustningen en extra dag? Halva dygnspriset tillkommer.' },
];

const STEPS = [
  { title: 'Välj paket', desc: 'Titta igenom våra paket och välj det som passar ditt event. Osäker? Kontakta oss så hjälper vi dig.', icon: 'package' },
  { title: 'Boka datum', desc: 'Hör av dig via telefon eller mail med önskat datum. Vi bekräftar tillgänglighet inom ett dygn.', icon: 'calendar-check' },
  { title: 'Hämta eller leverans', desc: 'Hämta utrustningen hos oss eller boka leverans. Vi visar dig snabbt hur allt kopplas in.', icon: 'map-pin' },
];

const EQUIPMENT = [
  { name: 'Alto TS415', spec: '15" aktiv topp — 2 000W peak. Klarar kraftig volym med tydligt ljud.', icon: 'speaker' },
  { name: 'Behringer Sub', spec: '15" aktiv subwoofer — 1 500W peak. Ger djup, fyllig bas till dansgolvet.', icon: 'audio-lines' },
  { name: 'Behringer Mixer', spec: '16-kanalsmixer. Hanterar flera ljudkällor parallellt med ease.', icon: 'sliders-horizontal' },
  { name: 'Danbandspinnar', spec: 'Monteringsfäste för topp direkt på sub — klassisk dansbandsuppställning.', icon: 'combine' },
];

const FAQ = [
  { q: 'Vad ingår i priset?', a: 'Alla paket inkluderar nödvändiga kablar och stativ. Mixer ingår i Festpaket S och uppåt. Deposition på 1 000–2 000 kr tillkommer och återbetalas efter avslutat event.' },
  { q: 'Hur långt i förväg ska jag boka?', a: 'Gärna minst en vecka i förväg, särskilt under högsäsong (maj–september). Kortare framförhållning kan ofta fungera — hör av dig så kollar vi.' },
  { q: 'Kan ni leverera utrustningen?', a: 'Ja, vi erbjuder leverans och upphämtning. Priset beror på avstånd (300–800 kr). Vi hjälper även till att ställa upp utrustningen om det önskas.' },
  { q: 'Behöver jag vara tekniskt kunnig?', a: 'Nej, systemen är plug-and-play. Vi går igenom allt vid utlämning och du får en enkel guide med. Det tar ca 10 minuter att sätta upp.' },
  { q: 'Vad händer om något går sönder?', a: 'Normalt slitage ingår. Vid skador utöver normalt användande används depositionen. Vi har försäkring som täcker oförutsedda händelser.' },
  { q: 'Hur stora event klarar utrustningen?', a: 'Full rigg med subwoofers hanterar bekvämt 200–250 personer inomhus. För utomhusevent beror det på förhållandena men upp till ~200 pers fungerar.' },
];

// ── RENDER: HERO ──
function renderHero() {
  return `
    <div class="hero">
      <div class="hero-badge"><span class="dot"></span> Ljuduthyrning för alla event</div>
      <h1 class="hero-title">Proffsljud till<br>din <span class="gold">fest</span></h1>
      <p class="hero-desc">Hyr kvalitetsljudutrustning för din fest, förening eller företagsevent. Enkelt, prisvärt och med personlig service.</p>
      <div class="hero-actions">
        <button class="btn-gold" onclick="setView('boka')">${icon('calendar-check')} Boka nu</button>
        <button class="btn-outline" onclick="setView('paket')">${icon('package')} Se paket & priser</button>
      </div>

    </div>
  `;
}

// ── RENDER: HOME PACKAGES (flip cards) ──
function renderHomePackages() {
  return `
    <div class="section" id="paket-section">
      <div class="section-label">${icon('package', 14)} Våra paket</div>
      <div class="section-title">Hitta rätt ljud för ditt event</div>
      <div class="section-subtitle">Tryck på ett paket för att se vad det passar till.</div>

      <div class="packages-grid">
        ${PACKAGES.map((p, idx) => {
          const flipped = flippedPackages.has(idx);
          return `
          <div class="package-card flip-card${p.featured ? ' featured' : ''}${flipped ? ' flipped' : ''}" onclick="toggleFlip(${idx})">
            ${!flipped ? `
              <div class="package-tag ${p.tagStyle}">${p.featured ? icon('star', 10) + ' ' : ''}${p.tag}</div>
              <div class="package-name">${p.name}</div>
              <div class="package-desc">${p.desc}</div>
              <div style="display:flex;align-items:baseline;gap:6px;margin-top:auto;padding-top:12px">
                <span class="package-price" style="font-size:18px">${p.price} kr</span>
                <span class="package-price-note" style="margin-bottom:0">/ dygn</span>
              </div>
              <div style="font-size:11px;color:#8a8a80;margin-top:10px;display:flex;align-items:center;gap:4px">${icon('rotate-cw', 12)} Tryck för mer info</div>
            ` : `
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
                <div class="package-tag ${p.tagStyle}" style="margin-bottom:0">${p.name}</div>
              </div>
              <div style="font-size:12px;font-weight:700;color:#f5f5f0;margin-bottom:6px">Passar till</div>
              <div style="font-size:12px;color:#b5b5aa;line-height:1.7;margin-bottom:14px">${p.suited}</div>
              <button class="package-btn primary" onclick="event.stopPropagation();booking.packageIdx=${idx};booking.step=2;setView('boka')">
                ${icon('calendar-check', 14)} Boka detta paket
              </button>
              <div style="font-size:11px;color:#8a8a80;margin-top:8px;display:flex;align-items:center;gap:4px;justify-content:center">${icon('rotate-cw', 12)} Tryck för att vända tillbaka</div>
            `}
          </div>`;
        }).join('')}
      </div>

      <div style="margin-top:28px">
        <div style="font-size:13px;font-weight:700;color:#f5f5f0;margin-bottom:12px">Tillägg</div>
        <div class="addons-row">
          ${ADDONS.map(a => `
            <div class="addon-info">
              <div class="addon-info-header">
                <div class="addon-icon">${icon(a.icon, 16)}</div>
                <div>
                  <div class="addon-name">${a.name}</div>
                  <div class="addon-price">${a.price}</div>
                </div>
              </div>
              <div class="addon-desc">${a.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ── RENDER: PAKET PAGE (full details) ──
function renderPackages() {
  return `
    <div class="section" id="paket-section">
      <div class="section-label">${icon('package', 14)} Paket & Priser</div>
      <div class="section-title">Välj rätt paket för ditt event</div>
      <div class="section-subtitle">Alla priser gäller per dygn exklusive moms. Deposition tillkommer och återbetalas efter avslutat event.</div>

      <div class="packages-grid">
        ${PACKAGES.map((p, idx) => `
          <div class="package-card${p.featured ? ' featured' : ''}">
            <div class="package-tag ${p.tagStyle}">${p.featured ? icon('star', 10) + ' ' : ''}${p.tag}</div>
            <div class="package-name">${p.name}</div>
            <div class="package-desc">${p.desc}</div>
            <div class="package-price">${p.price} kr</div>
            <div class="package-price-note">per dygn · ex. moms</div>
            <ul class="package-features">
              ${p.features.map(f => `<li>${icon('check', 14)} ${f}</li>`).join('')}
            </ul>
            <button class="package-btn ${p.featured ? 'primary' : 'secondary'}" onclick="booking.packageIdx=${idx};booking.step=2;setView('boka')">
              ${icon('calendar-check', 14)} Boka detta paket
            </button>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:28px">
        <div style="font-size:13px;font-weight:700;color:#f5f5f0;margin-bottom:12px">Tillägg</div>
        <div class="addons-row">
          ${ADDONS.map(a => `
            <div class="addon-info">
              <div class="addon-info-header">
                <div class="addon-icon">${icon(a.icon, 16)}</div>
                <div>
                  <div class="addon-name">${a.name}</div>
                  <div class="addon-price">${a.price}</div>
                </div>
              </div>
              <div class="addon-desc">${a.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ── RENDER: HOW IT WORKS ──
function renderHowItWorks() {
  return `
    <div class="section" id="hur-section">
      <div class="section-label">${icon('list-checks', 14)} Så funkar det</div>
      <div class="section-title">Boka på tre enkla steg</div>
      <div class="section-subtitle">Från val av paket till ljud i lokalen — vi gör det smidigt.</div>
      <div class="steps-grid">
        ${STEPS.map((s, i) => `
          <div class="step-card">
            <div class="step-number">${i + 1}</div>
            <div class="step-title">${s.title}</div>
            <div class="step-desc">${s.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── RENDER: EQUIPMENT ──
function renderEquipment() {
  return `
    <div class="section" id="utrustning-section">
      <div class="section-label">${icon('cpu', 14)} Utrustning</div>
      <div class="section-title">Vad du får</div>
      <div class="section-subtitle">Professionell ljudutrustning som levererar kristallklart ljud.</div>
      <div class="equipment-grid">
        ${EQUIPMENT.map(e => `
          <div class="equip-card">
            <div class="equip-icon">${icon(e.icon, 18)}</div>
            <div>
              <div class="equip-name">${e.name}</div>
              <div class="equip-spec">${e.spec}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── RENDER: FAQ ──
function renderFaq() {
  return `
    <div class="section" id="faq-section">
      <div class="section-label">${icon('help-circle', 14)} Vanliga frågor</div>
      <div class="section-title">Frågor & svar</div>
      <div class="faq-list">
        ${FAQ.map(f => `
          <div class="faq-item">
            <div class="faq-q" onclick="toggleFaq(this)">
              <div class="faq-q-icon">${icon('help-circle', 14)}</div>
              <div class="faq-q-text">${f.q}</div>
              <div class="faq-q-arrow">${icon('chevron-down', 16)}</div>
            </div>
            <div class="faq-a"><p>${f.a}</p></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── RENDER: CONTACT ──
function renderContact() {
  return `
    <div class="section" id="kontakt-section">
      <div class="section-label">${icon('message-circle', 14)} Kontakt</div>
      <div class="section-title">Hör av dig</div>
      <div class="section-subtitle">Ring, maila eller skicka ett meddelande. Vi svarar vanligtvis inom ett par timmar.</div>
      <div class="contact-grid">
        <a class="contact-card" href="tel:+46701234567">
          <div class="contact-icon">${icon('phone', 20)}</div>
          <div>
            <div class="contact-label">Telefon</div>
            <div class="contact-value">070-123 45 67</div>
          </div>
        </a>
        <a class="contact-card" href="mailto:info@dittforetag.se">
          <div class="contact-icon">${icon('mail', 20)}</div>
          <div>
            <div class="contact-label">E-post</div>
            <div class="contact-value">info@dittetforetag.se</div>
          </div>
        </a>
      </div>
      <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:20px 18px;margin-top:14px">
        <div style="display:flex;align-items:flex-start;gap:14px">
          <div class="contact-icon" style="background:rgba(200,168,78,0.06)">
            ${icon('clock', 20)}
          </div>
          <div>
            <div style="font-size:13px;font-weight:700;color:#f5f5f0;margin-bottom:4px">Svarstider</div>
            <div style="font-size:12px;color:#8a8a80;line-height:1.7">
              Vardagar: samma dag<br>
              Helger: vanligtvis inom ett par timmar<br>
              Bokningsbekräftelse inom 24h
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── RENDER: FOOTER ──
function renderFooter() {
  return `
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Ljuduthyrning · Alla rättigheter reserverade</p>
    </div>
  `;
}

// ── PAGE RENDERERS ──
function renderHomePage() {
  return renderHero() + renderHomePackages() + renderHowItWorks() + renderEquipment() + renderFaq() + renderContact() + renderFooter();
}

function renderPackagePage() {
  return renderPackages() + renderHowItWorks() + renderFooter();
}

function renderEquipmentPage() {
  return renderEquipment() + renderFooter();
}

function renderFaqPage() {
  return renderFaq() + renderFooter();
}

function renderContactPage() {
  return renderContact() + renderFooter();
}

// ── MAIN RENDER ──
function renderContent() {
  const el = document.getElementById('content');
  switch (currentView) {
    case 'hem':        el.innerHTML = renderHomePage(); break;
    case 'paket':      el.innerHTML = renderPackagePage(); break;
    case 'utrustning': el.innerHTML = renderEquipmentPage(); break;
    case 'faq':        el.innerHTML = renderFaqPage(); break;
    case 'boka':       renderBookingPage(); return;
    case 'kontakt':    el.innerHTML = renderContactPage(); break;
    default:           el.innerHTML = renderHomePage();
  }
  // Reinitialize Lucide icons after render
  if (window.lucide) lucide.createIcons();
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  renderContent();
  updateNav();
});
