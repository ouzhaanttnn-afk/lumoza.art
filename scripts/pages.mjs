// Generates index.html (English) and tr/index.html (Turkish) from one page template.
// Run with `node scripts/pages.mjs`; `npm run build` runs it first.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const STORE = {
  mihenk: 'https://apps.apple.com/app/mi-henkaynak/id6808742428',
  trade: 'https://apps.apple.com/app/tradeup-zero-to-home/id6811362281'
};
const SITE = { trade: 'https://trade-up-zero-to-home.vercel.app/', tray: 'https://tepsi-telasi.vercel.app/' };
const EMAIL = 'alpertosun@lumoza.art';

const shots = (name, count) => Array.from({ length: count }, (_, i) => `/assets/screens/${name}-${i + 1}.webp`);

const copy = {
  en: {
    lang: 'en', path: '/', other: { href: '/tr/', label: 'Türkçe', lang: 'tr', aria: 'Siteyi Türkçe görüntüle' },
    title: 'Lumoza — Independent game studio in Ankara',
    description: 'Lumoza is an independent game studio in Ankara, Türkiye, building with design, code and AI. MİHENKAYNAK and TradeUp are on the App Store; Hearthwalker: Son Ocak is coming soon.',
    ogDescription: 'Independent games and digital products built with design, code and AI. Based in Ankara, Türkiye.',
    ogAlt: 'Lumoza — independent games, built with care.',
    locale: 'en_US', otherLocale: 'tr_TR',
    skip: 'Skip to content', homeAria: 'Lumoza, back to top', navAria: 'Main navigation',
    nav: { games: 'Games', studio: 'Studio', contact: 'Contact' },
    h1: 'Lumoza, an independent game studio in Ankara',
    lead: 'Lumoza is an independent game studio in Ankara, Türkiye. Two of our games are on the App Store, and a third is on the way.',
    seeGames: 'See our games', newTab: ' (opens in a new tab)',
    heroLinks: [
      { href: STORE.mihenk, text: 'MİHENKAYNAK on the App Store' },
      { href: STORE.trade, text: 'TradeUp on the App Store' }
    ],
    heroArt: 'The MİHENKAYNAK loading screen with the gold logo on a purple jeweller’s counter.',
    shelfTitle: 'Our iOS games', shelfLead: 'Two games are out. A third is coming soon.',
    shelf: [
      { icon: 'mihenkaynak-icon', name: 'MİHENKAYNAK', line: 'Goldsmith shop simulation', action: 'View', href: STORE.mihenk, aria: 'View MİHENKAYNAK on the App Store' },
      { icon: 'tradeup-icon', name: 'TradeUp: Zero to Home', line: 'Secondhand trading simulation', action: 'View', href: STORE.trade, aria: 'View TradeUp: Zero to Home on the App Store' },
      { icon: 'son-ocak-icon', name: 'Hearthwalker: Son Ocak', line: 'Survival game', action: 'Coming soon' }
    ],
    gamesTitle: 'Our games',
    games: {
      mihenk: {
        id: 'mihenk', name: 'MİHENKAYNAK', tagline: 'Weigh the gold. Read the customer.',
        status: 'On the App Store since 14 September 2026.',
        text: 'A portrait goldsmith shop simulation. Test and weigh gold, bargain with customers whose patience and budgets differ, and grow your shop’s reputation in a market where gold and currency prices move.',
        facts: 'iOS · Simulation · Turkish and English · Free, with optional upgrades',
        store: 'View on the App Store', shots: shots('mihenk', 7), href: STORE.mihenk,
        alts: ['A customer asks for 7.5 grams of gold at the counter', 'The shop dashboard with cash, risks and the day’s sales', 'The finance view with cash, profit and stock lines', 'A restock dialog listing gram gold and Turkish gold coins', 'The stock list with price, margin and sell-through for each piece', 'The workshop with repairs and custom engraving orders', 'The market view with premium packs']
      },
      trade: {
        id: 'trade', name: 'TradeUp', tagline: 'Read the market. Trade your way up.',
        status: 'On the App Store since 14 October 2026.',
        text: 'Compare listings by price, condition, interest and seller behaviour. Bargain with two offers, prepare and relist what you buy, and work toward one of five homes in a secondhand market that keeps moving.',
        facts: 'iOS · Strategy, simulation · Turkish and English · Free, with optional upgrades',
        store: 'View on the App Store', site: 'Project website', shots: shots('trade', 5), href: STORE.trade, siteHref: SITE.trade,
        alts: ['The live market with listings, prices and a filter bar', 'The portfolio with items prepared for sale', 'The path to a first home with savings and house options', 'An item story with a haggle slider and a seller offer', 'Choosing a character and a career style']
      },
      son: {
        id: 'son', name: 'Hearthwalker', sub: 'Son Ocak · Kül Yolu', tagline: 'Keep the last fire burning.',
        status: 'Coming soon to the App Store.',
        text: 'A portrait survival game. It is not on the App Store yet, and we will announce the launch here first.',
        facts: 'iOS · Survival · Portrait', launch: 'Get launch news', launchSubject: 'Hearthwalker Son Ocak launch news',
        pane: 'We will announce the launch here first.', iconAlt: 'The Hearthwalker app icon, a copper stove with a glowing fire'
      },
      bim: {
        id: 'bim', name: 'BIMQUEST', tagline: 'Learn Revit by playing.',
        status: 'In development, in testing on TestFlight.',
        text: 'A mobile game that teaches Revit through play: seven chapters from BIM basics to views and documentation, with a live 2D plan and a 3D model to build.',
        facts: 'iOS · Educational · Turkish', shots: shots('bimquest', 4),
        alts: ['The mission dashboard with chapters and the first mission', 'The first mission with a 2D floor plan and a 3D model', 'A room-boundary mission with wall height and thickness fields', 'The mission guide with a Revit path and hints']
      }
    },
    heroStage: 'The Lumoza logo, a white L with a gold spark on an indigo tile, floating over a colour that changes with each of our games.',
    webTitle: 'On the web',
    web: {
      id: 'alvera', name: 'Alvera', tagline: 'Value is timeless.',
      status: 'Online at alverakuyumculuk.com.',
      text: 'A website for a jewellery store in Mamak, Ankara: its gold and diamond catalogue, today’s gold prices with a gram calculator, and the store’s details.',
      facts: 'Website · Ankara, Mamak · Turkish',
      store: 'Visit alverakuyumculuk.com', href: 'https://www.alverakuyumculuk.com/',
      pics: [
        { src: '/assets/screens/alvera-1.webp', alt: 'The Alvera Kuyumculuk home page with its gold logo and the line “Değer zamansızdır”', w: 1000, h: 625, cls: 'shot shot-wide' },
        { src: '/assets/screens/alvera-2.webp', alt: 'The same home page on a phone', w: 390, h: 844, cls: 'shot' }
      ]
    },
    next: 'Next screens', nextAria: 'Show the next screens',
    devTitle: 'In development',
    dev: [
      { id: 'bim', icon: 'bimquest-icon', name: 'BIMQUEST', genre: 'Educational game, in testing on TestFlight', text: 'A mobile game that teaches Revit through play: seven chapters from BIM basics to views and documentation, with a live 2D plan and a 3D model to build.' },
      { id: 'street', icon: 'street-striker-icon', name: 'Street Striker: Zero to Legend', genre: 'Arcade RPG', text: 'Street fighting meets RPG progression, with equipment, training and roguelite skills shaping each fight.' },
      { id: 'tray', icon: 'trayful-icon', name: 'Trayful Café', genre: 'Physics puzzle', text: 'One tray, one clamp and 24 café puzzles. Balance your ingredients and choose the order of every delivery.', link: SITE.tray, linkText: 'Project website' }
    ],
    studioTitle: 'A small studio in Ankara.',
    studioLead: 'We design, build and ship our own games, and a person makes every decision.',
    principles: [
      { h: 'Design with intent', p: 'Start with the experience. Give each idea a clear purpose, a considered form and a reason to exist.' },
      { h: 'Build with care', p: 'Turn ideas into working games and digital products. Test, refine and pay attention to the details.' },
      { h: 'Explore with AI', p: 'Use AI to explore possibilities and support iteration, with human judgment guiding the work.' }
    ],
    founder: 'Oğuzhan Alper Tosun', founderRole: 'Founder and product designer',
    photoAlt: 'Ankara at dusk, with the city’s rooftops and hills under an orange sky', photoCaption: 'Ankara at dusk.',
    contactTitle: 'Press, partnerships or a question about our games? Write to us.',
    city: 'Ankara, Türkiye', top: 'Back to top',
    footerPlaces: 'Reach the studio', footerGames: 'Games', footerSite: 'Site',
    footerLinks: { mihenk: 'MİHENKAYNAK on the App Store', trade: 'TradeUp on the App Store', son: 'Hearthwalker: Son Ocak, coming soon' },
    creditA: 'Photograph “Ankara Sunset” by Ömer Ünlü, via', creditB: ', cropped.',
    legal: '© 2026 Lumoza. Revit is a trademark of Autodesk, Inc. BIMQUEST is an independent project.'
  },
  tr: {
    lang: 'tr', path: '/tr/', other: { href: '/', label: 'English', lang: 'en', aria: 'View this site in English' },
    title: 'Lumoza — Ankara’da bağımsız oyun stüdyosu',
    description: 'Lumoza, Ankara merkezli bağımsız bir oyun stüdyosudur; tasarım, kod ve yapay zekâyla geliştirir. MİHENKAYNAK ve TradeUp App Store’da; Hearthwalker: Son Ocak yakında.',
    ogDescription: 'Tasarım, kod ve yapay zekâyla geliştirilen bağımsız oyunlar ve dijital ürünler. Ankara, Türkiye.',
    ogAlt: 'Lumoza — özenle yapılmış bağımsız oyunlar.',
    locale: 'tr_TR', otherLocale: 'en_US',
    skip: 'İçeriğe geç', homeAria: 'Lumoza, başa dön', navAria: 'Ana gezinme',
    nav: { games: 'Oyunlar', studio: 'Stüdyo', contact: 'İletişim' },
    h1: 'Lumoza, Ankara’da bağımsız bir oyun stüdyosu',
    lead: 'Lumoza, Ankara’da bağımsız bir oyun stüdyosu. Oyunlarımızdan ikisi App Store’da, üçüncüsü yolda.',
    seeGames: 'Oyunlarımızı keşfet', newTab: ' (yeni sekmede açılır)',
    heroLinks: [
      { href: STORE.mihenk, text: 'MİHENKAYNAK, App Store’da' },
      { href: STORE.trade, text: 'TradeUp, App Store’da' }
    ],
    heroArt: 'Mor bir kuyumcu tezgâhında altın logolu MİHENKAYNAK açılış ekranı.',
    shelfTitle: 'iOS oyunlarımız', shelfLead: 'İki oyun yayında. Üçüncüsü yakında.',
    shelf: [
      { icon: 'mihenkaynak-icon', name: 'MİHENKAYNAK', line: 'Kuyumcu dükkânı simülasyonu', action: 'Görüntüle', href: STORE.mihenk, aria: 'MİHENKAYNAK’ı App Store’da görüntüle' },
      { icon: 'tradeup-icon', name: 'TradeUp: Zero to Home', line: 'İkinci el ticaret simülasyonu', action: 'Görüntüle', href: STORE.trade, aria: 'TradeUp: Zero to Home’u App Store’da görüntüle' },
      { icon: 'son-ocak-icon', name: 'Hearthwalker: Son Ocak', line: 'Hayatta kalma oyunu', action: 'Yakında' }
    ],
    gamesTitle: 'Oyunlarımız',
    games: {
      mihenk: {
        id: 'mihenk', name: 'MİHENKAYNAK', tagline: 'Altını tart. Müşteriyi oku.',
        status: '14 Eylül 2026’dan beri App Store’da.',
        text: 'Dikey oynanan bir kuyumcu dükkânı simülasyonu. Altını test et ve tart, sabrı ve bütçesi farklı müşterilerle pazarlık et, altın ve döviz fiyatlarının oynadığı bir piyasada dükkânının itibarını büyüt.',
        facts: 'iOS · Simülasyon · Türkçe ve İngilizce · Ücretsiz, isteğe bağlı paketlerle',
        store: 'App Store’da görüntüle', shots: shots('mihenk', 7), href: STORE.mihenk,
        alts: ['Tezgâhta 7,5 gram altın isteyen bir müşteri', 'Nakit, riskler ve günün satışlarıyla dükkân paneli', 'Nakit, kâr ve stok satırlarıyla finans ekranı', 'Gram altın ve ziynet altınlarını listeleyen stok temin penceresi', 'Her parçanın fiyatı, marjı ve satış hızıyla stok listesi', 'Tamir ve özel gravür siparişleriyle atölye', 'Premium paketlerin göründüğü market ekranı']
      },
      trade: {
        id: 'trade', name: 'TradeUp', tagline: 'Piyasayı oku. Basamak basamak yüksel.',
        status: '14 Ekim 2026’dan beri App Store’da.',
        text: 'İlanları fiyat, kondisyon, ilgi ve satıcı davranışına göre karşılaştır. İki teklif hakkıyla pazarlık et, aldıklarını hazırla ve yeniden listele; durmadan akan bir ikinci el pazarında beş evden birine ulaş.',
        facts: 'iOS · Strateji, simülasyon · Türkçe ve İngilizce · Ücretsiz, isteğe bağlı paketlerle',
        store: 'App Store’da görüntüle', site: 'Proje sitesi', shots: shots('trade', 5), href: STORE.trade, siteHref: SITE.trade,
        alts: ['İlanlar, fiyatlar ve filtre çubuğuyla canlı pazar', 'Satışa hazırlanan ürünlerle portföy', 'Birikim ve ev seçenekleriyle ilk eve giden yol', 'Pazarlık çubuğu ve satıcı teklifiyle bir ürünün hikâyesi', 'Karakter ve kariyer tarzı seçimi']
      },
      son: {
        id: 'son', name: 'Hearthwalker', sub: 'Son Ocak · Kül Yolu', tagline: 'Son ateşi sönmekten koru.',
        status: 'Yakında App Store’da.',
        text: 'Dikey ekranda oynanan bir hayatta kalma oyunu. Henüz App Store’da değil; çıkışı önce burada duyuracağız.',
        facts: 'iOS · Hayatta kalma · Dikey', launch: 'Çıkış haberlerini al', launchSubject: 'Hearthwalker Son Ocak çıkış haberleri',
        pane: 'Çıkışı önce burada duyuracağız.', iconAlt: 'Hearthwalker uygulama ikonu: içinde ateş yanan bakır bir soba'
      },
      bim: {
        id: 'bim', name: 'BIMQUEST', tagline: 'Revit’i oynayarak öğren.',
        status: 'Geliştirme aşamasında, TestFlight’ta test ediliyor.',
        text: 'Revit’i oyun oynayarak öğreten bir mobil oyun: BIM temellerinden görünüm ve dokümantasyona yedi bölüm; kurabileceğin canlı bir 2B plan ve 3B model.',
        facts: 'iOS · Eğitici · Türkçe', shots: shots('bimquest', 4),
        alts: ['Bölümler ve ilk görevle görev paneli', '2B kat planı ve 3B modelle ilk görev', 'Duvar yüksekliği ve kalınlığı alanlarıyla oda sınırı görevi', 'Revit yolu ve ipuçlarıyla görev rehberi']
      }
    },
    heroStage: 'Lumoza logosu: indigo bir karoda beyaz bir L ve altın bir kıvılcım; arkasındaki renk oyunlarımızın renkleri arasında değişiyor.',
    webTitle: 'Web’de',
    web: {
      id: 'alvera', name: 'Alvera', tagline: 'Değer zamansızdır.',
      status: 'alverakuyumculuk.com’da yayında.',
      text: 'Ankara Mamak’taki bir kuyumcu dükkânı için web sitesi: altın ve pırlanta seçkisi, gram hesaplayıcılı güncel altın fiyatları ve mağaza bilgileri.',
      facts: 'Web sitesi · Ankara, Mamak · Türkçe',
      store: 'alverakuyumculuk.com’u ziyaret et', href: 'https://www.alverakuyumculuk.com/',
      pics: [
        { src: '/assets/screens/alvera-1.webp', alt: 'Altın logolu ve “Değer zamansızdır” başlıklı Alvera Kuyumculuk ana sayfası', w: 1000, h: 625, cls: 'shot shot-wide' },
        { src: '/assets/screens/alvera-2.webp', alt: 'Aynı ana sayfa telefonda', w: 390, h: 844, cls: 'shot' }
      ]
    },
    next: 'Sonraki ekranlar', nextAria: 'Sonraki ekranları göster',
    devTitle: 'Geliştirme aşamasında',
    dev: [
      { id: 'bim', icon: 'bimquest-icon', name: 'BIMQUEST', genre: 'Eğitici oyun, TestFlight’ta test ediliyor', text: 'Revit’i oyun oynayarak öğreten bir mobil oyun: BIM temellerinden görünüm ve dokümantasyona yedi bölüm; kurabileceğin canlı bir 2B plan ve 3B model.' },
      { id: 'street', icon: 'street-striker-icon', name: 'Street Striker: Zero to Legend', genre: 'Arcade RPG', text: 'Sokak dövüşü, RPG ilerlemesiyle buluşuyor; ekipman, antrenman ve roguelite yetenekler her dövüşü şekillendiriyor.' },
      { id: 'tray', icon: 'trayful-icon', name: 'Trayful Café', genre: 'Fizik bulmacası', text: 'Tek tepsi, tek kıskaç ve 24 kafe bulmacası. Malzemelerini dengele, her siparişin sırasını sen seç.', link: SITE.tray, linkText: 'Proje sitesi' }
    ],
    studioTitle: 'Ankara’da küçük bir stüdyo.',
    studioLead: 'Kendi oyunlarımızı tasarlıyor, geliştiriyor ve yayınlıyoruz; her kararı bir insan veriyor.',
    principles: [
      { h: 'Amaçla tasarla', p: 'Deneyimle başla. Her fikre net bir amaç, düşünülmüş bir biçim ve var olmak için bir neden ver.' },
      { h: 'Özenle geliştir', p: 'Fikirleri çalışan oyunlara ve dijital ürünlere dönüştür. Test et, iyileştir, ayrıntılara dikkat et.' },
      { h: 'Yapay zekâyla keşfet', p: 'Olasılıkları keşfetmek ve denemeleri hızlandırmak için yapay zekâyı kullan; yönü insan kararı belirlesin.' }
    ],
    founder: 'Oğuzhan Alper Tosun', founderRole: 'Kurucu ve ürün tasarımcısı',
    photoAlt: 'Turuncu bir gökyüzü altında Ankara’nın çatıları ve tepeleri, akşamüstü', photoCaption: 'Akşamüstü Ankara.',
    contactTitle: 'Basın, iş birliği ya da oyunlarımızla ilgili bir soru mu? Bize yazın.',
    city: 'Ankara, Türkiye', top: 'Başa dön',
    footerPlaces: 'Stüdyoya ulaşın', footerGames: 'Oyunlar', footerSite: 'Site',
    footerLinks: { mihenk: 'MİHENKAYNAK, App Store’da', trade: 'TradeUp, App Store’da', son: 'Hearthwalker: Son Ocak, yakında' },
    creditA: '“Ankara Sunset” fotoğrafı: Ömer Ünlü,', creditB: ', kırpılmıştır.',
    legal: '© 2026 Lumoza. Revit, Autodesk, Inc.’in ticari markasıdır. BIMQUEST bağımsız bir projedir.'
  }
};

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ext = (href, text, t, cls = '', aria = '') =>
  `<a${cls ? ` class="${cls}"` : ''} href="${href}" target="_blank" rel="noopener noreferrer"${aria ? ` aria-label="${esc(aria)}${esc(t.newTab)}"` : ''}>${text}${aria ? '' : `<span class="visually-hidden">${esc(t.newTab)}</span>`}</a>`;

function stage(t, key, o) {
  const g = key === 'alvera' ? t.web : t.games[key];
  const screens = g.shots;
  const left = screens ? `<img class="shot" data-shot src="${screens[0]}" alt="${esc(g.alts[0])}" width="540" height="1169" loading="lazy" decoding="async">` : '';
  const right = screens ? `<img class="shot" data-shot src="${screens[1]}" alt="${esc(g.alts[1])}" width="540" height="1169" loading="lazy" decoding="async">` : '';
  const data = screens ? ` data-screens='${JSON.stringify(screens.map((src, i) => ({ src, alt: g.alts[i] })))}'` : '';
  const pic = (x) => `<img class="${x.cls}" src="${x.src}" alt="${esc(x.alt)}" width="${x.w}" height="${x.h}" loading="lazy" decoding="async">`;
  const leftPane = key === 'alvera' ? pic(g.pics[0]) : key === 'son'
    ? `<img class="icon-lg" src="/assets/games/son-ocak-icon.webp" alt="${esc(g.iconAlt)}" width="512" height="512" loading="lazy" decoding="async">`
    : left;
  const rightPane = key === 'alvera' ? pic(g.pics[1]) : key === 'son' ? `<p class="pane-note">${esc(g.pane)}</p>` : right;
  const sub = g.sub ? `<p class="sub" lang="tr">${esc(g.sub)}</p>` : '';
  const actions = [];
  if (g.href) actions.push(ext(g.href, esc(g.store), t, 'button'));
  if (g.siteHref) actions.push(ext(g.siteHref, esc(g.site), t, 'text-link'));
  if (key === 'son') actions.push(`<a class="button" href="mailto:${EMAIL}?subject=${encodeURIComponent(g.launchSubject)}">${esc(g.launch)}</a>`);
  if (screens) actions.push(`<button class="next" type="button" data-next aria-label="${esc(t.nextAria)}">${esc(t.next)}</button>`);
  const word = Array.from(g.name.toUpperCase());
  const cut = { mihenk: 5, trade: 4, son: 6, bim: 4, alvera: 3 }[key];
  const half = [esc(word.slice(0, cut).join('')), esc(word.slice(cut).join(''))];
  return `
      <article class="game world-${key}" aria-labelledby="g-${key}"${data}>
        <div class="stage">
          <div class="pane pane-l">${leftPane}</div>
          <div class="pane pane-r">${rightPane}</div>
          <div class="info">
            ${sub}
            <p class="status">${esc(g.status)}</p>
            <p class="tagline">${esc(g.tagline)}</p>
            <p class="text">${esc(g.text)}</p>
            <p class="facts glass">${esc(g.facts)}</p>
          </div>
          <h3 class="tear" id="g-${key}" aria-label="${esc(g.name.toUpperCase())}"><span class="tear-a" aria-hidden="true">${half[0]}</span><span class="tear-b" aria-hidden="true">${half[1]}</span></h3>
          <div class="actions">${actions.join('\n            ')}</div>
        </div>
      </article>`;
}

function render(t) {
  const url = `https://lumoza.art${t.path}`;
  const sameAs = t.lang === 'en' ? 'https://lumoza.art/' : 'https://lumoza.art/tr/';
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Organization', name: 'Lumoza', url: sameAs,
    logo: 'https://lumoza.art/assets/brand/lumoza-app-icon.png', email: EMAIL,
    description: t.lang === 'en' ? 'Independent game and product studio.' : 'Bağımsız oyun ve ürün stüdyosu.',
    address: { '@type': 'PostalAddress', addressLocality: 'Ankara', addressCountry: 'TR' },
    founder: { '@type': 'Person', name: 'Oğuzhan Alper Tosun' }
  });
  return `<!doctype html>
<html lang="${t.lang}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="theme-color" content="#f3f5fb">
    <title>${esc(t.title)}</title>
    <meta name="description" content="${esc(t.description)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Lumoza">
    <meta property="og:locale" content="${t.locale}">
    <meta property="og:locale:alternate" content="${t.otherLocale}">
    <meta property="og:title" content="${esc(t.title)}">
    <meta property="og:description" content="${esc(t.ogDescription)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="https://lumoza.art/assets/og.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(t.ogAlt)}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="${url}">
    <link rel="alternate" hreflang="en" href="https://lumoza.art/">
    <link rel="alternate" hreflang="tr" href="https://lumoza.art/tr/">
    <link rel="alternate" hreflang="x-default" href="https://lumoza.art/">
    <link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48.png">
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
    <link rel="preload" href="/assets/fonts/instrument-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/styles.css">
${t.lang === 'en' ? `    <script>try{var l=localStorage.getItem('lumoza-lang');if(l==='tr'||(!l&&/^tr/i.test(navigator.language))){location.replace('/tr/'+location.hash)}}catch(e){}</script>\n` : ''}    <script type="application/ld+json">${jsonld}</script>
  </head>
  <body id="top">
    <a class="skip-link" href="#main">${esc(t.skip)}</a>

    <header class="bar">
      <nav class="bar-nav glass" aria-label="${esc(t.navAria)}">
        <a class="bar-mark" href="#top" aria-label="${esc(t.homeAria)}"><img src="/assets/brand/lumoza-icon-96.webp" alt="" width="36" height="36"></a>
        <a href="#games">${esc(t.nav.games)}</a>
        <a href="#studio">${esc(t.nav.studio)}</a>
        <a href="#contact">${esc(t.nav.contact)}</a>
        <a class="bar-lang" href="${t.other.href}" hreflang="${t.other.lang}" lang="${t.other.lang}" aria-label="${esc(t.other.aria)}">${esc(t.other.label)}</a>
      </nav>
    </header>

    <main id="main">
      <div class="run">

        <section class="panel hero" aria-label="${esc(t.h1)}">
          <div class="hero-copy">
            <h1 class="hero-title" aria-label="${esc(t.h1)}">Lumoza</h1>
            <p class="lead">${esc(t.lead)}</p>
            <a class="button" href="#games">${esc(t.seeGames)}</a>
            <ul class="hero-links">
              ${t.heroLinks.map(l => `<li>${ext(l.href, esc(l.text), t, 'text-link')}</li>`).join('\n              ')}
            </ul>
          </div>
          <div class="hero-stage" role="img" aria-label="${esc(t.heroStage)}">
            <span class="blob blob-a"></span><span class="blob blob-b"></span>
            <span class="ring ring-a"></span><span class="ring ring-b"></span>
            <img class="logo-float" src="/assets/brand/lumoza-app-icon-720.webp" alt="" width="720" height="720" decoding="async" fetchpriority="high">
          </div>
        </section>

        <section class="panel shelf" aria-labelledby="shelf-title">
          <div class="shelf-head">
            <h2 id="shelf-title">${esc(t.shelfTitle)}</h2>
            <p class="lead">${esc(t.shelfLead)}</p>
          </div>
          <div class="shelf-field">
          <ul class="shelf-list">
            ${t.shelf.map(s => `<li>
              <img src="/assets/games/${s.icon}.webp" alt="" width="512" height="512" loading="lazy" decoding="async">
              <div class="shelf-text"><strong>${esc(s.name)}</strong><span>${esc(s.line)}</span></div>
              ${s.href ? ext(s.href, esc(s.action), t, 'button', s.aria) : `<span class="shelf-soon">${esc(s.action)}</span>`}
            </li>`).join('\n            ')}
          </ul>
          </div>
        </section>
      </div>

      <section class="work" id="games" aria-labelledby="games-title">
        <h2 class="work-title" id="games-title">${esc(t.gamesTitle)}</h2>
${stage(t, 'mihenk')}
${stage(t, 'trade')}
${stage(t, 'son')}
      </section>

      <section class="dev" aria-labelledby="dev-title">
        <h2 id="dev-title">${esc(t.devTitle)}</h2>
        <div class="dev-grid">
          ${t.dev.map(d => `<article class="dev-card dev-${d.id}" aria-labelledby="d-${d.id}">
            <img src="/assets/games/${d.icon}.webp" alt="" width="${d.id === 'tray' ? 192 : 512}" height="${d.id === 'tray' ? 192 : 512}" loading="lazy" decoding="async">
            <div>
              <h3 id="d-${d.id}">${esc(d.name)}</h3>
              <p class="genre">${esc(d.genre)}</p>
              <p>${esc(d.text)}</p>
              ${d.link ? ext(d.link, esc(d.linkText), t, 'text-link') : ''}
            </div>
          </article>`).join('\n          ')}
        </div>
      </section>

      <section class="work work-web" aria-labelledby="web-title">
        <h2 class="work-title" id="web-title">${esc(t.webTitle)}</h2>
${stage(t, 'alvera')}
      </section>

      <section class="studio" id="studio" aria-labelledby="studio-title">
        <div class="studio-copy">
          <h2 id="studio-title">${esc(t.studioTitle)}</h2>
          <p class="statement">${esc(t.studioLead)}</p>
          <ul class="principles">
            ${t.principles.map(p => `<li><h3>${esc(p.h)}</h3><p>${esc(p.p)}</p></li>`).join('\n            ')}
          </ul>
          <p class="founder"><strong>${esc(t.founder)}</strong><span>${esc(t.founderRole)}</span></p>
        </div>
        <figure class="studio-photo">
          <img src="/assets/places/ankara-sunset.webp" alt="${esc(t.photoAlt)}" width="1920" height="907" loading="lazy" decoding="async">
          <figcaption>${esc(t.photoCaption)}</figcaption>
        </figure>
      </section>

      <section class="contact" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">${esc(t.contactTitle)}</h2>
        <a class="email" href="mailto:${EMAIL}"><span>${EMAIL.split('@')[0]}@</span><span>${EMAIL.split('@')[1]}</span></a>
        <div class="contact-side">
          <p class="contact-city">${esc(t.city)}</p>
          ${ext(STORE.mihenk, esc(t.footerLinks.mihenk), t, 'text-link')}
          ${ext(STORE.trade, esc(t.footerLinks.trade), t, 'text-link')}
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p class="footer-name" aria-hidden="true">Lumoza</p>
      <div class="footer-grid">
        <div class="footer-places">
          <p class="footer-label">${esc(t.footerPlaces)}</p>
          <a href="mailto:${EMAIL}">${EMAIL}</a>
          <p>${esc(t.city)}</p>
        </div>
        <nav class="footer-links" aria-label="${esc(t.footerGames)}">
          <p class="footer-label">${esc(t.footerGames)}</p>
          ${ext(STORE.mihenk, esc(t.footerLinks.mihenk), t)}
          ${ext(STORE.trade, esc(t.footerLinks.trade), t)}
          <a href="#g-son">${esc(t.footerLinks.son)}</a>
        </nav>
        <nav class="footer-links" aria-label="${esc(t.footerSite)}">
          <p class="footer-label">${esc(t.footerSite)}</p>
          <a href="#games">${esc(t.nav.games)}</a>
          <a href="#studio">${esc(t.nav.studio)}</a>
          <a href="${t.other.href}" hreflang="${t.other.lang}" lang="${t.other.lang}">${esc(t.other.label)}</a>
        </nav>
      </div>
      <div class="footer-legal">
        <p>${esc(t.legal)}</p>
        <p>${esc(t.creditA)} ${ext('https://commons.wikimedia.org/wiki/File:Ankara_Sunset_-_20904494950.jpg', 'Wikimedia Commons', t)}, ${ext('https://creativecommons.org/licenses/by/2.0/', 'CC BY 2.0', t)}${esc(t.creditB)}</p>
        <a class="to-top" href="#top">${esc(t.top)}</a>
      </div>
    </footer>
    <script type="module" src="/main.js"></script>
  </body>
</html>
`;
}

export async function writePages(root) {
  await mkdir(resolve(root, 'tr'), { recursive: true });
  await writeFile(resolve(root, 'index.html'), render(copy.en));
  await writeFile(resolve(root, 'tr/index.html'), render(copy.tr));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await writePages(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
  console.log('Wrote index.html and tr/index.html.');
}
