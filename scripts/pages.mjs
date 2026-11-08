// Generates index.html (English) and tr/index.html (Turkish) from one page template.
// Run with `node scripts/pages.mjs`; `npm run build` runs it first.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const STORE = {
  mihenk: 'https://apps.apple.com/app/mi-henkaynak/id6808742428',
  trade: 'https://apps.apple.com/app/tradeup-zero-to-home/id6811362281',
  son: 'https://apps.apple.com/app/hearthwalker/id6818167497'
};
const EMAIL = 'alpertosun@lumoza.art';

// Landscape games: theme art is shared, in-game screens follow the page language when the game has both.
const wide = (list, lang) => list.map(n => `/assets/screens/${n.replace('{lang}', lang)}.webp`);
const shots = (name, count) => Array.from({ length: count }, (_, i) => `/assets/screens/${name}-${i + 1}.webp`);

const copy = {
  en: {
    lang: 'en', path: '/', other: { href: '/tr/', label: 'Türkçe', lang: 'tr', aria: 'Siteyi Türkçe görüntüle' },
    title: 'Lumoza Studio — Little games from Ankara',
    description: 'Lumoza Studio is a tiny game studio in Ankara, Türkiye. MİHENKAYNAK, TradeUp and Hearthwalker are on the App Store, with more on the way.',
    ogDescription: 'Little phone games from a tiny studio in Ankara, Türkiye.',
    ogAlt: 'Lumoza Studio — little games from Ankara.',
    locale: 'en_US', otherLocale: 'tr_TR',
    skip: 'Skip to content', homeAria: 'Lumoza, back to top', navAria: 'Main navigation',
    nav: { games: 'Games', studio: 'Studio', contact: 'Contact' },
    h1: 'Lumoza Studio',
    heroLine: 'Little worlds for your phone, made by a tiny studio in Ankara.',
    outTitle: 'Out now', soonTitle: 'Coming soon',
    contactText: 'We read every email, and we love hearing what you played.', contactAction: 'Write to us',
    photoAlt: 'Ankara at dusk: lit windows and a lakeside pavilion in a city park',
    photoCredit: 'Photo of Ankara: “Ankara by night 2013” by OscarKosy, CC BY-SA 3.0, via Wikimedia Commons.',
    footerLine: 'Lumoza Studio, a tiny game studio in Ankara',
    lead: 'A tiny studio in Ankara. We make phone games you can sink into: a goldsmith’s counter, a secondhand market, a hearth that walks.',
    headline: [['Lumoza', ''], ['icon', 'mihenkaynak-icon'], ['makes', ''], ['little', 'rose'], ['icon', 'tradeup-icon'], ['worlds.', 'teal']],
    marquee: 'Our games',
    news: { tag: 'New', text: 'Hearthwalker is out' },
    seeGames: 'See the games', newTab: ' (opens in a new tab)',
    heroArt: 'The MİHENKAYNAK loading screen with the gold logo on a purple jeweller’s counter.',
    gamesTitle: 'Our games',
    games: {
      mihenk: {
        id: 'mihenk', name: 'MİHENKAYNAK', tagline: 'Weigh the gold. Read the customer.',
        status: 'On the App Store since 14 September 2026.',
        text: 'Run a little goldsmith’s shop. Test and weigh the gold, haggle with every customer and make a name for yourself in a market where prices never sit still.',
        facts: 'iOS · Simulation · Turkish and English · Free, with optional upgrades', tags: ['Simulation', 'iOS', 'Android soon'],
        store: 'View on the App Store', shots: shots('mihenk', 7), href: STORE.mihenk,
        alts: ['A customer asks for 7.5 grams of gold at the counter', 'The shop dashboard with cash, risks and the day’s sales', 'The finance view with cash, profit and stock lines', 'A restock dialog listing gram gold and Turkish gold coins', 'The stock list with price, margin and sell-through for each piece', 'The workshop with repairs and custom engraving orders', 'The market view with premium packs']
      },
      trade: {
        id: 'trade', name: 'TradeUp', tagline: 'Read the market. Trade your way up.',
        status: 'On the App Store since 14 October 2026.',
        text: 'Start with almost nothing in a busy secondhand market. Spot the good deals, haggle, fix things up, sell them on and climb all the way to a home of your own.',
        facts: 'iOS · Strategy, simulation · Turkish and English · Free, with optional upgrades', tags: ['Strategy', 'Simulation', 'iOS'],
        store: 'View on the App Store', shots: shots('trade', 5), href: STORE.trade,
        alts: ['The live market with listings, prices and a filter bar', 'The portfolio with items prepared for sale', 'The path to a first home with savings and house options', 'An item story with a haggle slider and a seller offer', 'Choosing a character and a career style']
      },
      son: {
        id: 'son', name: 'Hearthwalker', sub: 'Son Ocak', tagline: 'You don’t carry the fire. You are the fire.',
        status: 'On the App Store since 5 November 2026.',
        text: 'You are a living hearth, born in an Anatolian tile workshop. Walk to gather embers, stop to guard, then send a wave of fire through the ash. Twelve maps, 57 powers, ten hearths.',
        tags: ['Action', 'Survival', 'iOS'], facts: 'iOS · Action, strategy · English, Turkish and three more · First six maps free, no ads',
        store: 'View on the App Store', href: STORE.son, shots: shots('hearth', 6), video: { src: '/assets/screens/hearth-play.mp4', poster: '/assets/screens/hearth-play.webp', alt: 'A short clip of Hearthwalker being played' },
        alts: ['The hearth sending a wave of fire into a horde of ash creatures', 'A tile guardian blocking the road on one of the twelve maps', 'Choosing a power such as Ember Stove or Forked Ember', 'The map picker with twelve maps from Ash Forest to the Mother Hearth', 'The Son Ocak home screen with the hearth, its rank and the Endless Road', 'A late run with cracks of fire across the ground']
      },
      stove: {
        id: 'stove', name: 'Little Stove', sub: 'Ocakçı', tagline: 'Keep the little stove burning.',
        status: 'Coming soon to the App Store.',
        text: 'Carry a living stove up from the bottom of the earth. Grab coal in the dark, hurry back before the fire goes out and keep the light alive across five chapters.',
        tags: ['Roguelite', 'Cozy', 'iOS'], facts: 'iPhone · Roguelite, action · English and Turkish · First chapter free, no ads',
        launch: 'Tell me at launch', launchSubject: 'Little Stove launch',
        wide: wide(['stove-1-{lang}', 'stove-2', 'stove-3-{lang}', 'stove-4', 'stove-5-{lang}', 'stove-6'], 'en'),
        alts: ['The keeper beside the little stove and its ring of light on the first floor', 'Chapter art: the keeper and the stove between giant blue crystals', 'Choosing one of three parts to add to the stove', 'Chapter art: a river of lava through a dark cave', 'The opening of chapter one, the Ash Cellar', 'Chapter art: a mossy cave with glowing mushrooms']
      },
      sparkle: {
        id: 'sparkle', name: 'Sparkle Fleet', sub: 'Son Vapur', tagline: 'Every old ferry deserves to shine again.',
        status: 'Coming soon to the App Store, in testing on TestFlight.',
        text: 'Scrape, brush and pressure-wash old passenger ferries until they gleam. Earn better tools in the workshop and send each ferry back out to sea. Strangely relaxing.',
        tags: ['Cleaning', 'Relaxing', 'iOS'], facts: 'iPhone · Cleaning simulation · Turkish · Played in landscape',
        launch: 'Tell me at launch', launchSubject: 'Sparkle Fleet launch',
        wide: wide(['sparkle-1', 'sparkle-2', 'sparkle-3', 'sparkle-4'], 'en'),
        alts: ['Scraping dirt off the wooden deck by a cabin door', 'The passenger saloon with rows of benches, still dirty', 'Pressure-washing the deck around a mooring bollard', 'The bow of the ferry with the sea and the sky ahead']
      },
      bim: {
        id: 'bim', name: 'BIMQUEST', tagline: 'Learn Revit by playing.',
        status: 'In development, in testing on TestFlight.',
        text: 'A mobile game that teaches Revit through play: seven chapters from BIM basics to views and documentation, with a live 2D plan and a 3D model to build.',
        facts: 'iOS · Educational · Turkish', shots: shots('bimquest', 4),
        alts: ['The mission dashboard with chapters and the first mission', 'The first mission with a 2D floor plan and a 3D model', 'A room-boundary mission with wall height and thickness fields', 'The mission guide with a Revit path and hints']
      }
    },
    heroStage: 'The Lumoza logo on a card that hangs from a cord like a lamp in a dark room.',
    webTitle: 'On the web',
    web: {
      id: 'alvera', name: 'Alvera', tagline: 'Value is timeless.',
      status: 'Online at alverakuyumculuk.com.',
      text: 'A website for a jewellery shop in Mamak, Ankara: the collection, today’s gold prices with a gram calculator, and a small panel where the shop updates its own catalogue.',
      facts: 'Website · Ankara, Mamak · Turkish', tags: ['Website', 'Catalogue panel', 'Gold prices'],
      store: 'Visit alverakuyumculuk.com', href: 'https://www.alverakuyumculuk.com/',
      pics: [
        { src: '/assets/screens/alvera-1.webp', alt: 'The Alvera Kuyumculuk home page with its gold logo and the line “Değer zamansızdır”', w: 1000, h: 625, cls: 'shot shot-wide' },
        { src: '/assets/screens/alvera-2.webp', alt: 'The same home page on a phone', w: 390, h: 844, cls: 'shot' }
      ]
    },
    next: 'Next screens', nextAria: 'Show the next screens',
    devTitle: 'Still in the oven',
    dev: [
      { id: 'bim', icon: 'bimquest-icon', name: 'BIMQUEST', pill: 'In TestFlight', genre: 'Educational game', text: 'Learn Revit by playing: seven chapters, a live 2D plan and a 3D model you build yourself.' },
      { id: 'street', icon: 'street-striker-icon', name: 'Street Striker: Zero to Legend', pill: 'Coming soon', genre: 'Arcade RPG', text: 'Street fights with RPG progression: gear up, train and pick roguelite skills between fights.' },
      { id: 'tray', icon: 'trayful-icon', name: 'Trayful Café', pill: 'In development', genre: 'Physics puzzle', text: 'One tray, one clamp, 24 café puzzles. Balance every order and get each delivery there in one piece.' }
    ],
    studioTitle: 'Hi, we’re Lumoza.',
    studioLead: 'A tiny studio in Ankara. We make the kind of small games we’d happily play on the bus home.',
    principles: [
      { h: 'Small worlds', p: 'A goldsmith’s counter, a secondhand market, a hearth that walks. Each game is one small place you can learn in a minute.' },
      { h: 'Free to try', p: 'Every game is free to download, and you decide whether you want more.' },
      { h: 'Played a lot', p: 'We play every build on a real phone and keep fixing it until it feels right.' }
    ],
    founder: 'Oğuzhan Alper Tosun', founderRole: 'Founder, designs the games',
    wallLabel: 'Our games', wallOut: 'out now', wallNext: 'coming soon',
    contactTitle: 'Say hello.',
    city: 'Ankara, Türkiye', top: 'Back to top',
    footerPlaces: 'Write to us', footerGames: 'Games', footerSite: 'Site',
    footerLinks: { mihenk: 'MİHENKAYNAK on the App Store', trade: 'TradeUp on the App Store', son: 'Hearthwalker on the App Store' },
    legal: '© 2026 Lumoza Studio. Revit is a trademark of Autodesk, Inc. BIMQUEST is an independent project.'
  },
  tr: {
    lang: 'tr', path: '/tr/', other: { href: '/', label: 'English', lang: 'en', aria: 'View this site in English' },
    title: 'Lumoza Studio — Ankara’dan küçük oyunlar',
    description: 'Lumoza Studio, Ankara’da küçük bir oyun stüdyosu. MİHENKAYNAK, TradeUp ve Hearthwalker App Store’da, yenileri yolda.',
    ogDescription: 'Ankara’daki küçük bir stüdyodan telefon oyunları.',
    ogAlt: 'Lumoza Studio — Ankara’dan küçük oyunlar.',
    locale: 'tr_TR', otherLocale: 'en_US',
    skip: 'İçeriğe geç', homeAria: 'Lumoza, başa dön', navAria: 'Ana gezinme',
    nav: { games: 'Oyunlar', studio: 'Stüdyo', contact: 'İletişim' },
    h1: 'Lumoza Studio',
    heroLine: 'Telefonun için küçük dünyalar. Ankara’da küçük bir stüdyo yapıyor.',
    outTitle: 'Yayında', soonTitle: 'Yakında',
    contactText: 'Her e-postayı okuyoruz; ne oynadığını duymak hoşumuza gider.', contactAction: 'Bize yaz',
    photoAlt: 'Akşamüstü Ankara: bir şehir parkında göl kenarında ışıklı pencereler ve bir köşk',
    photoCredit: 'Ankara fotoğrafı: “Ankara by night 2013”, OscarKosy, CC BY-SA 3.0, Wikimedia Commons.',
    footerLine: 'Lumoza Studio, Ankara’da küçük bir oyun stüdyosu',
    lead: 'Ankara’da küçük bir stüdyoyuz. İçinde kaybolacağın telefon oyunları yapıyoruz: bir kuyumcu tezgâhı, bir ikinci el pazarı, yürüyen bir ocak.',
    headline: [['Lumoza', ''], ['icon', 'mihenkaynak-icon'], ['küçük', 'rose'], ['icon', 'tradeup-icon'], ['dünyalar', 'teal'], ['kurar.', '']],
    marquee: 'Oyunlarımız',
    news: { tag: 'Yeni', text: 'Hearthwalker çıktı' },
    seeGames: 'Oyunlara bak', newTab: ' (yeni sekmede açılır)',
    heroArt: 'Mor bir kuyumcu tezgâhında altın logolu MİHENKAYNAK açılış ekranı.',
    gamesTitle: 'Oyunlarımız',
    games: {
      mihenk: {
        id: 'mihenk', name: 'MİHENKAYNAK', tagline: 'Altını tart. Müşteriyi oku.',
        status: '14 Eylül 2026’dan beri App Store’da.',
        text: 'Küçük bir kuyumcu dükkânı işlet. Altını test et, tart, her müşteriyle pazarlık yap ve fiyatların hiç durmadığı bir piyasada adını duyur.',
        facts: 'iOS · Simülasyon · Türkçe ve İngilizce · Ücretsiz, isteğe bağlı paketlerle', tags: ['Simülasyon', 'iOS', 'Android yakında'],
        store: 'App Store’da görüntüle', shots: shots('mihenk', 7), href: STORE.mihenk,
        alts: ['Tezgâhta 7,5 gram altın isteyen bir müşteri', 'Nakit, riskler ve günün satışlarıyla dükkân paneli', 'Nakit, kâr ve stok satırlarıyla finans ekranı', 'Gram altın ve ziynet altınlarını listeleyen stok temin penceresi', 'Her parçanın fiyatı, marjı ve satış hızıyla stok listesi', 'Tamir ve özel gravür siparişleriyle atölye', 'Premium paketlerin göründüğü market ekranı']
      },
      trade: {
        id: 'trade', name: 'TradeUp', tagline: 'Piyasayı oku. Basamak basamak yüksel.',
        status: '14 Ekim 2026’dan beri App Store’da.',
        text: 'Hareketli bir ikinci el pazarına neredeyse sıfırdan gir. İyi fırsatları yakala, pazarlık et, eşyaları toparlayıp yeniden sat ve kendi evine kadar yüksel.',
        facts: 'iOS · Strateji, simülasyon · Türkçe ve İngilizce · Ücretsiz, isteğe bağlı paketlerle', tags: ['Strateji', 'Simülasyon', 'iOS'],
        store: 'App Store’da görüntüle', shots: shots('trade', 5), href: STORE.trade,
        alts: ['İlanlar, fiyatlar ve filtre çubuğuyla canlı pazar', 'Satışa hazırlanan ürünlerle portföy', 'Birikim ve ev seçenekleriyle ilk eve giden yol', 'Pazarlık çubuğu ve satıcı teklifiyle bir ürünün hikâyesi', 'Karakter ve kariyer tarzı seçimi']
      },
      son: {
        id: 'son', name: 'Hearthwalker', sub: 'Son Ocak', tagline: 'Ateşi taşımıyorsun. Ateş sensin.',
        status: '5 Kasım 2026’dan beri App Store’da.',
        text: 'Anadolu’da bir çini atölyesinde doğmuş canlı bir ocaksın. Yürüyüp köz topla, durup korun, sonra ateş dalgasını külün içine gönder. 12 harita, 57 güç, 10 ocak.',
        tags: ['Aksiyon', 'Hayatta kalma', 'iOS'], facts: 'iOS · Aksiyon, strateji · Türkçe, İngilizce ve üç dil daha · İlk altı harita ücretsiz, reklamsız',
        store: 'App Store’da görüntüle', href: STORE.son, shots: shots('hearth', 6), video: { src: '/assets/screens/hearth-play.mp4', poster: '/assets/screens/hearth-play.webp', alt: 'Hearthwalker’dan kısa bir oynanış videosu' },
        alts: ['Ocağın kül yaratıklarından oluşan sürüye ateş dalgası göndermesi', 'On iki haritadan birinde yolu kesen bir çini muhafızı', 'Köz Sobası veya Çatallı Köz gibi bir güç seçimi', 'Kül Ormanı’ndan Ana Ocak’a on iki haritalık harita seçimi', 'Ocak, rütbesi ve Sonsuz Yol ile Son Ocak ana ekranı', 'Yerde ateş çatlaklarıyla ilerlemiş bir oyun']
      },
      stove: {
        id: 'stove', name: 'Little Stove', sub: 'Ocakçı', tagline: 'Küçük ocağı söndürme.',
        status: 'Yakında App Store’da.',
        text: 'Yaşayan bir ocağı yerin dibinden yukarı taşı. Karanlıkta kömür kap, ateş sönmeden geri koş ve beş bölüm boyunca ışığı yaşat.',
        tags: ['Roguelite', 'Sıcacık', 'iOS'], facts: 'iPhone · Roguelite, aksiyon · Türkçe ve İngilizce · İlk bölüm ücretsiz, reklamsız',
        launch: 'Çıkınca haber ver', launchSubject: 'Little Stove çıkış haberi',
        wide: wide(['stove-1-{lang}', 'stove-2', 'stove-3-{lang}', 'stove-4', 'stove-5-{lang}', 'stove-6'], 'tr'),
        alts: ['İlk katta küçük ocak, ışık halkası ve yanındaki ocakçı', 'Bölüm resmi: dev mavi kristallerin arasında ocakçı ve ocak', 'Ocağa eklenecek üç parçadan birini seçmek', 'Bölüm resmi: karanlık bir mağaradan akan lav nehri', 'Birinci bölüm Kül Mahzeni’nin açılışı', 'Bölüm resmi: parlayan mantarlarla yosunlu bir mağara']
      },
      sparkle: {
        id: 'sparkle', name: 'Sparkle Fleet', sub: 'Son Vapur', tagline: 'Her eski vapur yeniden parlamayı hak eder.',
        status: 'Yakında App Store’da, TestFlight’ta test ediliyor.',
        text: 'Eski yolcu vapurlarını pırıl pırıl olana kadar kazı, fırçala, basınçlı suyla yıka. Atölyede daha iyi aletler kazan, her vapuru yeniden denize gönder. Tuhaf biçimde rahatlatıcı.',
        tags: ['Temizlik', 'Rahatlatıcı', 'iOS'], facts: 'iPhone · Temizlik simülasyonu · Türkçe · Yatay oynanır',
        launch: 'Çıkınca haber ver', launchSubject: 'Sparkle Fleet çıkış haberi',
        wide: wide(['sparkle-1', 'sparkle-2', 'sparkle-3', 'sparkle-4'], 'tr'),
        alts: ['Kabin kapısının önünde ahşap güverteden kir kazımak', 'Sıra sıra banklarıyla henüz kirli yolcu salonu', 'Halat babasının çevresini basınçlı suyla yıkamak', 'Önünde deniz ve gökyüzüyle vapurun başı']
      },
      bim: {
        id: 'bim', name: 'BIMQUEST', tagline: 'Revit’i oynayarak öğren.',
        status: 'Geliştirme aşamasında, TestFlight’ta test ediliyor.',
        text: 'Revit’i oyun oynayarak öğreten bir mobil oyun: BIM temellerinden görünüm ve dokümantasyona yedi bölüm; kurabileceğin canlı bir 2B plan ve 3B model.',
        facts: 'iOS · Eğitici · Türkçe', shots: shots('bimquest', 4),
        alts: ['Bölümler ve ilk görevle görev paneli', '2B kat planı ve 3B modelle ilk görev', 'Duvar yüksekliği ve kalınlığı alanlarıyla oda sınırı görevi', 'Revit yolu ve ipuçlarıyla görev rehberi']
      }
    },
    heroStage: 'Karanlık bir odada lamba gibi ipten sarkan, Lumoza logolu bir kart.',
    webTitle: 'Web’de',
    web: {
      id: 'alvera', name: 'Alvera', tagline: 'Değer zamansızdır.',
      status: 'alverakuyumculuk.com’da yayında.',
      text: 'Mamak’taki bir kuyumcu için web sitesi: koleksiyon, gram hesaplayıcılı güncel altın fiyatları ve dükkânın kendi kataloğunu güncellediği küçük bir panel.',
      facts: 'Web sitesi · Ankara, Mamak · Türkçe', tags: ['Web sitesi', 'Katalog paneli', 'Altın fiyatları'],
      store: 'alverakuyumculuk.com’u ziyaret et', href: 'https://www.alverakuyumculuk.com/',
      pics: [
        { src: '/assets/screens/alvera-1.webp', alt: 'Altın logolu ve “Değer zamansızdır” başlıklı Alvera Kuyumculuk ana sayfası', w: 1000, h: 625, cls: 'shot shot-wide' },
        { src: '/assets/screens/alvera-2.webp', alt: 'Aynı ana sayfa telefonda', w: 390, h: 844, cls: 'shot' }
      ]
    },
    next: 'Sonraki ekranlar', nextAria: 'Sonraki ekranları göster',
    devTitle: 'Fırında pişenler',
    dev: [
      { id: 'bim', icon: 'bimquest-icon', name: 'BIMQUEST', pill: 'TestFlight’ta', genre: 'Eğitici oyun', text: 'Revit’i oynayarak öğren: yedi bölüm, canlı bir 2B plan ve kendi kuracağın bir 3B model.' },
      { id: 'street', icon: 'street-striker-icon', name: 'Street Striker: Zero to Legend', pill: 'Yakında', genre: 'Arcade RPG', text: 'RPG ilerlemeli sokak dövüşleri: donan, antrenman yap, dövüşler arasında roguelite yetenekler seç.' },
      { id: 'tray', icon: 'trayful-icon', name: 'Trayful Café', pill: 'Geliştiriliyor', genre: 'Fizik bulmacası', text: 'Tek tepsi, tek kıskaç, 24 kafe bulmacası. Siparişi dengele, her teslimatı tek parça ulaştır.' }
    ],
    studioTitle: 'Merhaba, biz Lumoza.',
    studioLead: 'Ankara’da küçük bir stüdyoyuz. Eve dönerken otobüste seve seve oynayacağımız küçük oyunlar yapıyoruz.',
    principles: [
      { h: 'Küçük dünyalar', p: 'Bir kuyumcu tezgâhı, bir ikinci el pazarı, yürüyen bir ocak. Her oyun bir dakikada öğrenilen küçük bir yer.' },
      { h: 'Denemesi ücretsiz', p: 'Her oyunu ücretsiz indirirsin; devamını isteyip istemediğine sen karar verirsin.' },
      { h: 'Bol bol oynandı', p: 'Her sürümü gerçek bir telefonda oynuyor, içimize sinene kadar düzeltiyoruz.' }
    ],
    founder: 'Oğuzhan Alper Tosun', founderRole: 'Kurucu, oyunları tasarlıyor',
    wallLabel: 'Oyunlarımız', wallOut: 'yayında', wallNext: 'yakında',
    contactTitle: 'Merhaba de.',
    city: 'Ankara, Türkiye', top: 'Başa dön',
    footerPlaces: 'Bize yazın', footerGames: 'Oyunlar', footerSite: 'Site',
    footerLinks: { mihenk: 'MİHENKAYNAK, App Store’da', trade: 'TradeUp, App Store’da', son: 'Hearthwalker, App Store’da' },
    legal: '© 2026 Lumoza Studio. Revit, Autodesk, Inc.’in ticari markasıdır. BIMQUEST bağımsız bir projedir.'
  }
};

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ext = (href, text, t, cls = '', aria = '') =>
  `<a${cls ? ` class="${cls}"` : ''} href="${href}" target="_blank" rel="noopener noreferrer"${aria ? ` aria-label="${esc(aria)}${esc(t.newTab)}"` : ''}>${text}${aria ? '' : `<span class="visually-hidden">${esc(t.newTab)}</span>`}</a>`;

// Hearthwalker's embers: fixed positions and timings so the page is the same on every build.
const EMBERS = Array.from({ length: 32 }, (_, i) => {
  const x = (i * 37 + 11) % 100, size = [5, 7, 9, 6, 11, 8][i % 6], dur = 6 + ((i * 7) % 6), delay = -((i * 1.37) % dur), drift = ((i * 23) % 80) - 40;
  return `<span style="--x:${x}%;--s:${size}px;--t:${dur}s;--d:${delay.toFixed(2)}s;--dx:${drift}px"></span>`;
}).join('');

// A small ambient layer for every world, taken from what the game is about:
// gold leaf falling in the goldsmith's shop, price ticks rising in TradeUp, stones catching the light for Alvera.
const particles = (n, seed) => Array.from({ length: n }, (_, i) => {
  const k = i * seed;
  const x = (k * 37 + 11) % 100, y = (k * 53 + 7) % 90, s = [6, 9, 12, 8, 14, 10][i % 6], t = 7 + ((k * 7) % 7), d = -((k * 1.37) % t), dx = ((k * 23) % 80) - 40, r = (k * 47) % 360;
  return `<span style="--x:${x}%;--y:${y}%;--s:${s}px;--t:${t}s;--d:${d.toFixed(2)}s;--dx:${dx}px;--r:${r}deg"></span>`;
}).join('');
const FX = { mihenk: particles(26, 1), trade: particles(22, 3), alvera: particles(30, 5), stove: particles(24, 7), sparkle: particles(22, 11), hero: particles(16, 13) };

// Each game is a lit window in the dark room: its own colour, its own light, its real screens.
const FLIP = new Set(['trade', 'sparkle']);
function exhibit(t, key) {
  const g = key === 'alvera' ? t.web : t.games[key];
  const screens = g.shots || g.wide;
  const phone = (src, i) => `<img class="frame" data-shot src="${src}" alt="${esc(g.alts[i])}" width="540" height="1169" loading="lazy" decoding="async">`;
  const land = (src, i, cls = '') => `<img class="frame-land${cls}" data-shot src="${src}" alt="${esc(g.alts[i])}" width="960" height="444" loading="lazy" decoding="async">`;
  let media;
  if (key === 'alvera') {
    media = `<div class="media media-web"><img class="frame-web" src="${g.pics[0].src}" alt="${esc(g.pics[0].alt)}" width="1000" height="625" loading="lazy" decoding="async"><img class="frame" src="${g.pics[1].src}" alt="${esc(g.pics[1].alt)}" width="390" height="844" loading="lazy" decoding="async"></div>`;
  } else if (g.wide) {
    media = `<div class="media media-land">${land(g.wide[0], 0, ' is-big')}${land(g.wide[1], 1)}${land(g.wide[2], 2)}</div>`;
  } else if (g.video) {
    media = `<div class="media media-phone">${phone(g.shots[0], 0)}<video class="frame" src="${g.video.src}" poster="${g.video.poster}" width="540" height="960" muted loop playsinline autoplay preload="metadata" aria-label="${esc(g.video.alt)}"></video>${phone(g.shots[1], 1)}</div>`;
  } else {
    media = `<div class="media media-phone">${phone(g.shots[0], 0)}${phone(g.shots[1], 1)}${phone(g.shots[2], 2)}</div>`;
  }
  const slots = key === 'alvera' ? 0 : g.wide ? 3 : g.video ? 2 : 3;
  const data = slots && screens.length > slots ? ` data-screens='${JSON.stringify(screens.map((src, i) => ({ src, alt: g.alts[i] })))}'` : '';
  const actions = [];
  if (g.href) actions.push(ext(g.href, esc(g.store), t, 'button'));
  if (g.launch) actions.push(`<a class="button" href="mailto:${EMAIL}?subject=${encodeURIComponent(g.launchSubject)}">${esc(g.launch)}</a>`);
  if (data) actions.push(`<button class="next" type="button" data-next aria-label="${esc(t.nextAria)}">${esc(t.next)}</button>`);
  const word = Array.from(g.name.toUpperCase());
  const cut = { mihenk: 5, trade: 4, son: 6, stove: 7, sparkle: 8, alvera: 3 }[key];
  // A space at the seam would collapse; keep it as a no-break space so two-word names stay apart.
  const half = [word.slice(0, cut).join(''), word.slice(cut).join('')].map(h => esc(h.replace(/ /g, ' ')));
  const fx = key === 'son' ? `<div class="embers" aria-hidden="true">${EMBERS}</div>` : FX[key] ? `<div class="fx fx-${key}" aria-hidden="true">${FX[key]}</div>` : '';
  return `
        <article class="exhibit world-${key}${FLIP.has(key) ? ' is-flip' : ''}${g.wide ? ' is-land' : ''}" aria-labelledby="g-${key}"${data}>
          <h3 class="tear" id="g-${key}" aria-label="${esc(g.name)}"><span class="tear-a" aria-hidden="true">${half[0]}</span><span class="tear-b" aria-hidden="true">${half[1]}</span></h3>
          <div class="window">
            ${fx}
            ${media}
            <div class="info">
              ${g.sub ? `<p class="sub" lang="tr">${esc(g.sub)}</p>` : ''}
              ${g.tags ? `<ul class="tags">${g.tags.map((tag, i) => `<li class="tag tag-${i % 3}">${esc(tag)}</li>`).join('')}</ul>` : ''}
              <p class="tagline">${esc(g.tagline)}</p>
              <p class="text">${esc(g.text)}</p>
              <p class="facts glass">${esc(g.status)} ${esc(g.facts)}</p>
              <div class="actions">${actions.join('')}</div>
            </div>
          </div>
        </article>`;
}

function render(t) {
  const url = `https://lumoza.art${t.path}`;
  const sameAs = t.lang === 'en' ? 'https://lumoza.art/' : 'https://lumoza.art/tr/';
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Organization', name: 'Lumoza Studio', alternateName: 'Lumoza', url: sameAs,
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
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="#2f2826">
    <meta name="apple-itunes-app" content="app-id=${NEWEST_APP}">
    <title>${esc(t.title)}</title>
    <meta name="description" content="${esc(t.description)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Lumoza Studio">
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
    <link rel="icon" type="image/svg+xml" href="/assets/brand/lumoza-mark.svg">
    <link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48.png">
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
    <link rel="preload" href="/assets/fonts/instrument-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
    <link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
    <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap">
    <link rel="stylesheet" href="/assets/vendor/lenis.css">
    <link rel="stylesheet" href="/styles.css">
${t.lang === 'en' ? `    <script>try{var l=localStorage.getItem('lumoza-lang');if(l==='tr'||(!l&&/^tr/i.test(navigator.language))){location.replace('/tr/'+location.hash)}}catch(e){}</script>\n` : ''}    <script type="application/ld+json">${jsonld}</script>
    <script defer src="https://cloud.umami.is/script.js" data-website-id="${UMAMI_ID}" data-domains="lumoza.art,www.lumoza.art"></script>
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
      <section class="hero" aria-labelledby="hero-title">
        <div class="fx fx-stove fx-hero" aria-hidden="true">${FX.hero}</div>
        <div class="hero-stage" role="img" aria-label="${esc(t.heroStage)}">
          <div class="badge"><span class="cord"></span><span class="clip"></span><span class="card"><span class="card-slot"></span><svg class="card-logo" viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="115" fill="#B87076"/><path d="M170 116 V334 Q170 374 210 374 H356" fill="none" stroke="#f4ece0" stroke-width="80" stroke-linecap="round" stroke-linejoin="round"/><path class="card-spark" d="M330 136 C335 200 346 211 410 216 C346 221 335 232 330 296 C325 232 314 221 250 216 C314 211 325 200 330 136 Z" fill="#70B8A9"/></svg><span class="card-name">Lumoza</span><span class="card-line">Ankara · 2026</span><span class="card-games">${['mihenkaynak-icon', 'tradeup-icon', 'son-ocak-icon', 'little-stove-icon', 'sparkle-fleet-icon'].map(i => `<img src="/assets/games/${i}.webp" alt="" width="512" height="512" decoding="async">`).join('')}</span></span></div>
        </div>
        <div class="rail">
          <h1 id="hero-title">${esc(t.h1)}</h1>
          <p class="rail-line">${esc(t.heroLine)}</p>
          <div class="rail-actions">
            <a class="news" href="${STORE.son}" target="_blank" rel="noopener noreferrer"><img src="/assets/games/son-ocak-icon.webp" alt="" width="28" height="28" decoding="async"><span><strong>${esc(t.news.tag)}:</strong> ${esc(t.news.text)}</span><span class="visually-hidden">${esc(t.newTab)}</span></a>
            <a class="button" href="#games">${esc(t.seeGames)}</a>
          </div>
        </div>
      </section>

      <section class="room" id="games" aria-labelledby="out-title">
        <h2 class="room-title" id="out-title">${esc(t.outTitle)}</h2>
${exhibit(t, 'mihenk')}
${exhibit(t, 'trade')}
${exhibit(t, 'son')}
      </section>

      <section class="room" aria-labelledby="soon-title">
        <h2 class="room-title" id="soon-title">${esc(t.soonTitle)}</h2>
${exhibit(t, 'stove')}
${exhibit(t, 'sparkle')}
      </section>

      <section class="room oven" aria-labelledby="dev-title">
        <h2 class="room-title" id="dev-title">${esc(t.devTitle)}</h2>
        <ul class="oven-list">
          ${t.dev.map(d => `<li class="oven-row">
            <img src="/assets/games/${d.icon}.webp" alt="" width="${d.id === 'tray' ? 192 : 512}" height="${d.id === 'tray' ? 192 : 512}" loading="lazy" decoding="async">
            <div class="oven-name"><h3>${esc(d.name)}</h3><p>${esc(d.text)}</p></div>
            <p class="oven-genre">${esc(d.genre)}</p>
            <p class="oven-status">${esc(d.pill)}</p>
          </li>`).join('\n          ')}
        </ul>
      </section>

      <section class="room" aria-labelledby="web-title">
        <h2 class="room-title" id="web-title">${esc(t.webTitle)}</h2>
${exhibit(t, 'alvera')}
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
        <ul class="studio-wall" aria-label="${esc(t.wallLabel)}">
          <li><img src="/assets/games/mihenkaynak-icon.webp" alt="MİHENKAYNAK" width="512" height="512" loading="lazy" decoding="async"></li>
          <li><img src="/assets/games/tradeup-icon.webp" alt="TradeUp: Zero to Home" width="512" height="512" loading="lazy" decoding="async"></li>
          <li class="wall-count"><strong>3</strong><span>${esc(t.wallOut)}</span></li>
          <li><img src="/assets/games/son-ocak-icon.webp" alt="Hearthwalker" width="512" height="512" loading="lazy" decoding="async"></li>
          <li class="wall-logo"><img src="/assets/brand/lumoza-app-icon-720.webp" alt="Lumoza" width="720" height="720" loading="lazy" decoding="async"></li>
          <li><img src="/assets/games/little-stove-icon.webp" alt="Little Stove" width="512" height="512" loading="lazy" decoding="async"></li>
          <li class="wall-count"><strong>3</strong><span>${esc(t.wallNext)}</span></li>
          <li><img src="/assets/games/street-striker-icon.webp" alt="Street Striker: Zero to Legend" width="512" height="512" loading="lazy" decoding="async"></li>
          <li><img src="/assets/games/sparkle-fleet-icon.webp" alt="Sparkle Fleet" width="512" height="512" loading="lazy" decoding="async"></li>
        </ul>
      </section>

      <section class="contact" id="contact" aria-labelledby="contact-title">
        <img class="contact-photo" src="/assets/screens/ankara-dusk.webp" alt="${esc(t.photoAlt)}" width="1600" height="1041" loading="lazy" decoding="async">
        <div class="visit-card">
          <h2 id="contact-title">${esc(t.contactTitle)}</h2>
          <p>${esc(t.contactText)}</p>
          <a class="visit-email" href="mailto:${EMAIL}">${EMAIL}</a>
          <p class="visit-city">${esc(t.city)}</p>
          <a class="button visit-button" href="mailto:${EMAIL}">${esc(t.contactAction)}</a>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p class="footer-what">${esc(t.footerLine)}</p>
      <nav class="footer-links" aria-label="${esc(t.footerSite)}">
        <a href="#games">${esc(t.nav.games)}</a>
        <a href="#studio">${esc(t.nav.studio)}</a>
        <a href="#contact">${esc(t.nav.contact)}</a>
        <a href="${t.other.href}" hreflang="${t.other.lang}" lang="${t.other.lang}">${esc(t.other.label)}</a>
        <a href="#top">${esc(t.top)}</a>
      </nav>
      <p class="footer-legal">${esc(t.legal)}</p>
      <p class="footer-credit">${esc(t.photoCredit)}</p>
    </footer>
    <script defer src="/assets/vendor/gsap.min.js"></script>
    <script defer src="/assets/vendor/ScrollTrigger.min.js"></script>
    <script defer src="/assets/vendor/lenis.min.js"></script>
    <script defer src="/assets/vendor/matter.min.js"></script>
    <script type="module" src="/main.js"></script>
  </body>
</html>
`;
}

// The newest game: iPhone Safari shows Apple's own App Store banner for it, and the hero carries a small "New" link.
// When the next game ships, change NEWEST_APP, the news copy and the link above.
const NEWEST_APP = '6818167497';

// Umami (cookie-free visitor statistics). Only counts on the live domain, so local previews stay out of the numbers.
const UMAMI_ID = '3e47b2d9-33f6-4f79-bcc1-4573aa4d9d38';

// Name the clicks worth counting: which game's store page, project sites, launch news, email, language.
const GAME_OF = { id6808742428: 'mihenkaynak', id6811362281: 'tradeup', id6818167497: 'hearthwalker' };
function track(html, lang) {
  return html.replace(/<(a|button)\b([^>]*)>/g, (tag, name, attrs) => {
    if (attrs.includes('data-umami-event')) return tag;
    const href = (attrs.match(/href="([^"]+)"/) || [])[1] || '';
    let event = '', extra = '';
    const store = href.match(/apps\.apple\.com\/[^"]*(id\d+)/);
    if (store) { event = 'app-store'; extra = ` data-umami-event-game="${GAME_OF[store[1]] || store[1]}"`; }
    else if (href.startsWith('mailto:') && href.includes('subject=')) event = 'launch-news';
    else if (href.startsWith('mailto:')) event = 'email';
    else if (/alverakuyumculuk/.test(href)) { event = 'project-site'; extra = ` data-umami-event-site="${new URL(href).hostname}"`; }
    else if (attrs.includes('hreflang=')) event = 'language';
    else if (attrs.includes('data-next')) event = 'next-screens';
    if (!event) return tag;
    return `<${name}${attrs} data-umami-event="${event}"${extra} data-umami-event-lang="${lang}">`;
  });
}

export async function writePages(root) {
  await mkdir(resolve(root, 'tr'), { recursive: true });
  await writeFile(resolve(root, 'index.html'), track(render(copy.en), 'en'));
  await writeFile(resolve(root, 'tr/index.html'), track(render(copy.tr), 'tr'));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await writePages(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
  console.log('Wrote index.html and tr/index.html.');
}
