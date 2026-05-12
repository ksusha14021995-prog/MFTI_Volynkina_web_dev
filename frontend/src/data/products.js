export const products = [
  {
    id: 'tom-ford-lost-cherry',
    brand: 'Tom Ford',
    name: 'Lost Cherry',
    country: 'США',
    category: 'unisex',
    image: '/images/products/lost-cherry.png',
    badges: ['hit'],
    discountPct: 0,
    description: 'Lost Cherry — гурманский унисекс-аромат от Tom Ford. Он построен вокруг ноты сочной чёрной вишни, обволакивающей шлейфом ликёра и миндаля.\n\nВ верхних нотах — спелая вишня с маслянистым акцентом турецкой розы. Сердце аромата раскрывается миндальным ликёром и ноткой жасмина самбак. База — сандал, тонка, перуанский бальзам и пачули.\n\nАромат стойкий, шлейфистый, подходит для прохладных сезонов и вечерних выходов.',
    variants: [
      { id: 'v1', volume: 5, price: 990, stock: 10 },
      { id: 'v2', volume: 10, price: 1790, stock: 2 },
      { id: 'v3', volume: 30, price: 4490, stock: 0 },
    ],
  },
  {
    id: 'mfk-baccarat-rouge-540',
    brand: 'Maison Francis Kurkdjian',
    name: 'Baccarat Rouge 540',
    country: 'Франция',
    category: 'unisex',
    image: '/images/products/baccarat-rouge.jpg',
    badges: ['hit'],
    discountPct: 0,
    description: 'Baccarat Rouge 540 — культовый аромат Maison Francis Kurkdjian, созданный в честь 250-летия Baccarat. Аромат объединяет шафран, жасмин самбак, амброксан и кедр.\n\nЭто аромат с невероятной стойкостью и шлейфом. Сладко-древесная основа с лёгкой минеральностью делает его абсолютно уникальным.\n\nПодходит для любого случая и любого сезона.',
    variants: [
      { id: 'v1', volume: 5, price: 1210, stock: 8 },
      { id: 'v2', volume: 10, price: 2190, stock: 5 },
      { id: 'v3', volume: 30, price: 5990, stock: 1 },
    ],
  },
  {
    id: 'creed-aventus',
    brand: 'Creed',
    name: 'Aventus',
    country: 'Франция',
    category: 'men',
    image: '/images/products/creed-aventus.jpg',
    badges: [],
    discountPct: 0,
    description: 'Aventus — легендарный мужской аромат от Creed, вдохновлённый жизнью Наполеона Бонапарта. Верхние ноты: ананас, бергамот, чёрная смородина, яблоко.\n\nСердце: берёзовый дым, роза, жасмин, пачули. База: мускус, оак мосс, амбра, ваниль.\n\nАромат силы, успеха и харизмы. Один из самых копируемых и желанных в мире.',
    variants: [
      { id: 'v1', volume: 5, price: 2290, stock: 6 },
      { id: 'v2', volume: 10, price: 3990, stock: 3 },
      { id: 'v3', volume: 30, price: 9990, stock: 1 },
    ],
  },
  {
    id: 'chanel-no5',
    brand: 'Chanel',
    name: '№5 Eau de Parfum',
    country: 'Франция',
    category: 'women',
    image: '/images/products/chanel-no5.jpg',
    badges: ['sale'],
    discountPct: 20,
    description: 'Chanel №5 — самый известный парфюм в истории. Создан в 1921 году Эрнестом Бо для Коко Шанель. Альдегидный флоральный аромат с нотами иланг-иланга, жасмина и розы.\n\nПервый в истории абстрактный аромат, использующий синтетические альдегиды. Ставший символом женственности и элегантности на весь XX век.\n\nВеликая классика, которая никогда не устаревает.',
    variants: [
      { id: 'v1', volume: 5, price: 990, stock: 15 },
      { id: 'v2', volume: 10, price: 1790, stock: 7 },
      { id: 'v3', volume: 30, price: 4990, stock: 2 },
    ],
  },
  {
    id: 'dior-sauvage',
    brand: 'Dior',
    name: 'Sauvage',
    country: 'Франция',
    category: 'men',
    image: '/images/products/dior-sauvage.png',
    badges: [],
    discountPct: 0,
    description: 'Dior Sauvage — свежий и дикий аромат, вдохновлённый бескрайними пустынями и вечерним небом. Верхние ноты: калабрийский бергамот, перец.\n\nСердце: лаванда, гераниум, элеми. База: амброксан, пачули, лабданум.\n\nМощный, радикально свежий аромат с характерной пряностью — бестселлер Dior.',
    variants: [
      { id: 'v1', volume: 5, price: 1090, stock: 20 },
      { id: 'v2', volume: 10, price: 1990, stock: 10 },
      { id: 'v3', volume: 30, price: 4990, stock: 4 },
    ],
  },
  {
    id: 'ysl-black-opium',
    brand: 'YSL',
    name: 'Black Opium',
    country: 'Франция',
    category: 'women',
    image: '/images/products/ysl-black-opium.png',
    badges: ['hit'],
    discountPct: 0,
    description: 'YSL Black Opium — соблазнительный и дерзкий аромат для современной женщины. Кофейно-ванильное сердце с нотами белого чая и жасмина.\n\nВерхние ноты: розовый перец, груша, апельсин. Сердце: кофе, жасмин, белый чай. База: ваниль, кашемировое дерево, пачули.\n\nЗахватывающий и противоречивый — для тех, кто не боится быть собой.',
    variants: [
      { id: 'v1', volume: 5, price: 1190, stock: 12 },
      { id: 'v2', volume: 10, price: 2090, stock: 6 },
      { id: 'v3', volume: 30, price: 5490, stock: 3 },
    ],
  },
  {
    id: 'givenchy-linterdit',
    brand: 'Givenchy',
    name: "L'Interdit",
    country: 'Франция',
    category: 'women',
    image: '/images/products/givenchy-linterdit.jpg',
    badges: [],
    discountPct: 0,
    description: "L'Interdit — аромат запретного притяжения от Givenchy. Первоначально создан для Одри Хепбёрн, переосмыслен в 2018 году.\n\nПронзительно белый флоральный букет с тёмной базой: оранжевый цвет, жасмин, тубероза, пачули и ветивер.\n\nДвойственный и притягивающий аромат — для смелых женщин с характером.",
    variants: [
      { id: 'v1', volume: 5, price: 990, stock: 9 },
      { id: 'v2', volume: 10, price: 1790, stock: 4 },
      { id: 'v3', volume: 30, price: 4490, stock: 0 },
    ],
  },
  {
    id: 'prada-paradoxe',
    brand: 'Prada',
    name: 'Paradoxe',
    country: 'Италия',
    category: 'women',
    image: '/images/products/prada-paradoxe.png',
    badges: ['sale'],
    discountPct: 15,
    description: 'Prada Paradoxe — аромат противоречий, объединяющий несочетаемое. Флоральная мускусная композиция на базе нероли, жасмина самбак, амброксана.\n\nВерхние ноты: нероли, пачули, амбра. Сердце: жасмин самбак, жасмин гранд. База: амброксан, мускус, сандал.\n\nДля женщины, которая не выбирает между противоположностями — она воплощает обе.',
    variants: [
      { id: 'v1', volume: 5, price: 1190, stock: 7 },
      { id: 'v2', volume: 10, price: 2090, stock: 3 },
      { id: 'v3', volume: 30, price: 5490, stock: 2 },
    ],
  },
  {
    id: 'guerlain-shalimar',
    brand: 'Guerlain',
    name: 'Shalimar',
    country: 'Франция',
    category: 'women',
    image: '/images/products/guerlain-shalimar.jpg',
    badges: [],
    discountPct: 0,
    description: 'Guerlain Shalimar — один из первых восточных ароматов, созданный в 1925 году. Вдохновлён легендой о саде Шалимар и вечной любви Шах Джахана.\n\nВерхние ноты: бергамот, лимон. Сердце: роза, ирис, жасмин. База: ваниль, ладан, ветивер, мускус.\n\nКлассика ориентальной парфюмерии — монументальный и вне времени.',
    variants: [
      { id: 'v1', volume: 5, price: 1390, stock: 5 },
      { id: 'v2', volume: 10, price: 2490, stock: 2 },
      { id: 'v3', volume: 30, price: 5990, stock: 1 },
    ],
  },
];

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getMinPrice(product) {
  const available = product.variants.filter((v) => v.stock > 0);
  const prices = (available.length ? available : product.variants).map((v) => v.price);
  return Math.min(...prices);
}

export function getDiscountedPrice(price, discountPct) {
  if (!discountPct) return price;
  return Math.round(price * (1 - discountPct / 100));
}
