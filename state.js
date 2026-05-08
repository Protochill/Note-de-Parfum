const brandCatalog = {
  "Chanel": {
    country: "Франция",
    foundedYear: 1910,
    description: "Chanel — французский дом моды и парфюмерии, основанный Габриэль Шанель. Ароматы бренда считаются классикой люксовой парфюмерии."
  },
  "Dior": {
    country: "Франция",
    foundedYear: 1946,
    description: "Dior — один из ключевых французских домов haute couture и парфюмерии, известный линейками Miss Dior, J'adore и Sauvage."
  },
  "Guerlain": {
    country: "Франция",
    foundedYear: 1828,
    description: "Guerlain — исторический парижский парфюмерный дом с богатым наследием и узнаваемыми композициями от Shalimar до современных коллекций."
  },
  "Tom Ford": {
    country: "США",
    foundedYear: 2005,
    description: "Tom Ford Beauty — премиальная парфюмерная линия, известная насыщенными, смелыми и вечерними композициями."
  },
  "Maison Francis Kurkdjian": {
    country: "Франция",
    foundedYear: 2009,
    description: "Maison Francis Kurkdjian — нишевый французский дом, основанный парфюмером Франсисом Кюркджяном; знаменит ароматом Baccarat Rouge 540."
  },
  "Creed": {
    country: "Франция",
    foundedYear: 1760,
    description: "Creed — старинный парфюмерный дом, известный люксовыми композициями Aventus и Silver Mountain Water."
  },
  "Byredo": {
    country: "Швеция",
    foundedYear: 2006,
    description: "Byredo — шведский нишевый бренд, сочетающий минимализм дизайна и современное парфюмерное звучание."
  },
  "Jo Malone London": {
    country: "Великобритания",
    foundedYear: 1994,
    description: "Jo Malone London — британский бренд, популярный благодаря чистым композициям и идее layering (наслаивания ароматов)."
  },
  "Hermes": {
    country: "Франция",
    foundedYear: 1837,
    description: "Hermes — французский дом с сильной парфюмерной школой, где особое внимание уделяется натуральности и элегантной сдержанности."
  },
  "Yves Saint Laurent": {
    country: "Франция",
    foundedYear: 1961,
    description: "Yves Saint Laurent Beauty — узнаваемый французский бренд с популярными ароматами Libre, Black Opium и Y."
  },
  "Prada": {
    country: "Италия",
    foundedYear: 1913,
    description: "Prada — итальянский модный дом, в парфюмерии известный утонченными композициями серии Infusion и Luna Rossa."
  }
};

const perfumeMediaCatalog = {
  1: { imageFile: "Chanel No. 5 .png", priceByn: 420 },
  2: { imageFile: "Bleu de Chanel.png", priceByn: 390 },
  3: { imageFile: "Sauvage Dior.png", priceByn: 365 },
  4: { imageFile: "J'adore Dior.png", priceByn: 350 },
  5: { imageFile: "Shalimar Guerlain.png", priceByn: 325 },
  6: { imageFile: "Mon Guerlain Guerlain.png", priceByn: 330 },
  7: { imageFile: "Baccarat Rouge 540.png", priceByn: 990 },
  8: { imageFile: "Aventus Creed.png", priceByn: 1020 },
  9: { imageFile: "Silver Mountain Water Creed.png", priceByn: 860 },
  10: { imageFile: "Black Orchid Tom Ford.png", priceByn: 470 },
  11: { imageFile: "Tobacco Vanille Tom Ford.png", priceByn: 540 },
  12: { imageFile: "Gypsy Water Byredo.png", priceByn: 580 },
  13: { imageFile: "Wood Sage & Sea SaltJo Malone London.png", priceByn: 320 },
  14: { imageFile: "Terre d'Hermes .png", priceByn: 345 },
  15: { imageFile: "Libre Yves Saint Laurent .png", priceByn: 340 }
};

function imageUrlByFile(fileName) {
  return fileName ? encodeURI(`image/${fileName}`) : "";
}

const perfumes = [
  {
    id: 1,
    name: "Chanel No. 5",
    brand: "Chanel",
    gender: "female",
    releaseYear: 1921,
    rating: 4.7,
    topNotes: ["Альдегиды", "Нероли", "Иланг-иланг"],
    middleNotes: ["Жасмин", "Роза"],
    baseNotes: ["Сандал", "Ветивер", "Ваниль"],
    description: "Легендарный альдегидно-цветочный аромат, ставший символом классической парфюмерии.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[1].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[1].priceByn
  },
  {
    id: 2,
    name: "Bleu de Chanel",
    brand: "Chanel",
    gender: "male",
    releaseYear: 2010,
    rating: 4.6,
    topNotes: ["Грейпфрут", "Лимон", "Мята"],
    middleNotes: ["Имбирь", "Мускатный орех", "Жасмин"],
    baseNotes: ["Ладан", "Кедр", "Сандал"],
    description: "Древесно-ароматическая композиция с чистым, современным характером.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[2].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[2].priceByn
  },
  {
    id: 3,
    name: "Sauvage",
    brand: "Dior",
    gender: "male",
    releaseYear: 2015,
    rating: 4.5,
    topNotes: ["Бергамот Калабрии", "Перец"],
    middleNotes: ["Лаванда", "Герань"],
    baseNotes: ["Амброксан", "Кедр", "Лабданум"],
    description: "Свежий и пряный бестселлер Dior с ярким шлейфом.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[3].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[3].priceByn
  },
  {
    id: 4,
    name: "J'adore",
    brand: "Dior",
    gender: "female",
    releaseYear: 1999,
    rating: 4.4,
    topNotes: ["Груша", "Дыня"],
    middleNotes: ["Жасмин", "Роза", "Ландыш"],
    baseNotes: ["Мускус", "Ваниль"],
    description: "Сияющий цветочно-фруктовый аромат с узнаваемой женственной базой.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[4].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[4].priceByn
  },
  {
    id: 5,
    name: "Shalimar",
    brand: "Guerlain",
    gender: "female",
    releaseYear: 1925,
    rating: 4.3,
    topNotes: ["Цитрусы", "Бергамот"],
    middleNotes: ["Ирис", "Жасмин", "Роза"],
    baseNotes: ["Ваниль", "Бобы тонка", "Ладан"],
    description: "Икона восточной парфюмерии: тёплый, пудровый, чувственный.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[5].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[5].priceByn
  },
  {
    id: 6,
    name: "Mon Guerlain",
    brand: "Guerlain",
    gender: "female",
    releaseYear: 2017,
    rating: 4.2,
    topNotes: ["Лаванда", "Бергамот"],
    middleNotes: ["Жасмин самбак", "Ирис"],
    baseNotes: ["Ваниль", "Сандал"],
    description: "Мягкий аромат с лавандово-ванильным акцентом.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[6].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[6].priceByn
  },
  {
    id: 7,
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    gender: "unisex",
    releaseYear: 2015,
    rating: 4.8,
    topNotes: ["Шафран", "Жасмин"],
    middleNotes: ["Амбра", "Амбервуд"],
    baseNotes: ["Еловая смола", "Кедр"],
    description: "Плотный и сияющий унисекс-аромат с фирменным амброво-сахарным эффектом.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[7].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[7].priceByn
  },
  {
    id: 8,
    name: "Aventus",
    brand: "Creed",
    gender: "male",
    releaseYear: 2010,
    rating: 4.7,
    topNotes: ["Ананас", "Черная смородина", "Бергамот"],
    middleNotes: ["Береза", "Пачули", "Жасмин"],
    baseNotes: ["Дубовый мох", "Амбра", "Мускус"],
    description: "Один из самых известных мужских нишевых ароматов.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[8].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[8].priceByn
  },
  {
    id: 9,
    name: "Silver Mountain Water",
    brand: "Creed",
    gender: "unisex",
    releaseYear: 1995,
    rating: 4.4,
    topNotes: ["Бергамот", "Мандарин"],
    middleNotes: ["Зеленый чай", "Черная смородина"],
    baseNotes: ["Мускус", "Сандал", "Петитгрейн"],
    description: "Свежий чайно-мускусный аромат, вдохновленный альпийским воздухом.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[9].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[9].priceByn
  },
  {
    id: 10,
    name: "Black Orchid",
    brand: "Tom Ford",
    gender: "unisex",
    releaseYear: 2006,
    rating: 4.3,
    topNotes: ["Трюфель", "Черная смородина", "Иланг-иланг"],
    middleNotes: ["Орхидея", "Специи"],
    baseNotes: ["Пачули", "Ваниль", "Шоколад"],
    description: "Темный, насыщенный и вечерний аромат в узнаваемом стиле Tom Ford.",
    country: "США",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[10].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[10].priceByn
  },
  {
    id: 11,
    name: "Tobacco Vanille",
    brand: "Tom Ford",
    gender: "unisex",
    releaseYear: 2007,
    rating: 4.6,
    topNotes: ["Табачный лист", "Специи"],
    middleNotes: ["Ваниль", "Какао"],
    baseNotes: ["Сухофрукты", "Древесные ноты"],
    description: "Теплая табачно-ванильная композиция из Private Blend.",
    country: "США",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[11].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[11].priceByn
  },
  {
    id: 12,
    name: "Gypsy Water",
    brand: "Byredo",
    gender: "unisex",
    releaseYear: 2008,
    rating: 4.2,
    topNotes: ["Бергамот", "Лимон", "Перец"],
    middleNotes: ["Ладан", "Ирис", "Хвоя"],
    baseNotes: ["Ваниль", "Сандал", "Амбра"],
    description: "Свежо-древесный аромат с легким дымным оттенком.",
    country: "Швеция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[12].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[12].priceByn
  },
  {
    id: 13,
    name: "Wood Sage & Sea Salt",
    brand: "Jo Malone London",
    gender: "unisex",
    releaseYear: 2014,
    rating: 4.1,
    topNotes: ["Амбретта"],
    middleNotes: ["Морская соль"],
    baseNotes: ["Шалфей"],
    description: "Легкий минерально-соленый аромат с чистым морским настроением.",
    country: "Великобритания",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[13].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[13].priceByn
  },
  {
    id: 14,
    name: "Terre d'Hermes",
    brand: "Hermes",
    gender: "male",
    releaseYear: 2006,
    rating: 4.5,
    topNotes: ["Апельсин", "Грейпфрут"],
    middleNotes: ["Кремний", "Перец"],
    baseNotes: ["Ветивер", "Кедр", "Бензоин"],
    description: "Элегантный цитрусово-землистый мужской аромат от Hermes.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[14].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[14].priceByn
  },
  {
    id: 15,
    name: "Libre",
    brand: "Yves Saint Laurent",
    gender: "female",
    releaseYear: 2019,
    rating: 4.4,
    topNotes: ["Мандарин", "Лаванда", "Черная смородина"],
    middleNotes: ["Жасмин", "Апельсиновый цвет"],
    baseNotes: ["Ваниль", "Кедр", "Мускус"],
    description: "Современный цветочно-ароматический аромат с выразительной лавандовой нотой.",
    country: "Франция",
    imageUrl: imageUrlByFile(perfumeMediaCatalog[15].imageFile),
    volumeMl: 100,
    priceByn: perfumeMediaCatalog[15].priceByn
  }
];

const reviews = [
  { id: 1, perfumeId: 1, userLogin: "lena", rating: 5, text: "Классика, которая всегда звучит уместно.", createdAt: "2026-03-28" },
  { id: 2, perfumeId: 7, userLogin: "max", rating: 5, text: "Очень стойкий и шлейфовый.", createdAt: "2026-03-29" },
  { id: 3, perfumeId: 14, userLogin: "anna", rating: 4, text: "Идеально на каждый день.", createdAt: "2026-04-01" }
];

const users = [
  { id: 1, login: "admin", phone: "+375291111111", role: "admin" },
  { id: 2, login: "user", phone: "+375331111111", role: "user" }
];

const state = {
  currentUser: null,
  favorites: new Set(),
  perfumes: [],
  reviews: [],
  users: [],
  isLoadingPerfumes: false,
  isLoadingReviews: false,
  lastError: ""
};

export function getState() {
  return state;
}

export async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "request_failed");
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function refreshAuthState() {
  try {
    const data = await apiRequest("/api/auth/check");
    state.currentUser = data.authenticated ? data.user : null;
    if (state.currentUser) {
      await refreshFavorites();
    } else {
      state.favorites.clear();
    }
  } catch (_err) {
    state.currentUser = null;
    state.favorites.clear();
  }
}

export async function logoutUser() {
  await apiRequest("/api/auth/logout", { method: "POST" });
  state.currentUser = null;
  state.favorites.clear();
}

export function listPerfumes(filters = {}) {
  const { q = "", brand = "", gender = "", year = "" } = filters;
  return state.perfumes.filter((p) => {
    const query = q.trim().toLowerCase();
    const byQuery = !query || p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query);
    const byBrand = !brand || p.brand === brand;
    const byGender = !gender || p.gender === gender;
    const byYear = !year || String(p.releaseYear) === String(year);
    return byQuery && byBrand && byGender && byYear;
  });
}

export function getPerfumeById(id) {
  return state.perfumes.find((p) => p.id === Number(id)) || null;
}

export async function addPerfume(payload) {
  const brandInfo = brandCatalog[payload.brand] || {};
  const data = await apiRequest("/api/perfumes", {
    method: "POST",
    body: {
      name: payload.name,
      brand: payload.brand,
      gender: payload.gender || "unisex",
      releaseYear: Number(payload.releaseYear) || new Date().getFullYear(),
      description: payload.description || "",
      imageUrl: payload.imageUrl || "",
      volumeMl: Number(payload.volumeMl) || 100,
      priceByn: Number(payload.priceByn) || 0,
      country: payload.country || brandInfo.country || "Не указано"
    }
  });
  await refreshPerfumes();
  return data.item || null;
}

export async function updatePerfume(id, payload) {
  const data = await apiRequest(`/api/perfumes/${Number(id)}`, {
    method: "PATCH",
    body: payload
  });
  await refreshPerfumes();
  return data.item || null;
}

export async function deletePerfume(id) {
  await apiRequest(`/api/perfumes/${Number(id)}`, { method: "DELETE" });
  await refreshPerfumes();
  state.favorites.delete(Number(id));
  return true;
}

export function listBrands() {
  const uniqueBrands = [...new Set(state.perfumes.map((p) => p.brand))];
  return uniqueBrands.map((brandName) => {
    const info = brandCatalog[brandName] || {};
    const firstPerfume = state.perfumes.find((p) => p.brand === brandName);
    return {
      name: brandName,
      country: info.country || firstPerfume?.country || "Не указано",
      foundedYear: info.foundedYear || null,
      description: info.description || `Парфюмерный дом ${brandName}.`
    };
  });
}

export function listReviews(perfumeId) {
  return state.reviews.filter((r) => r.perfumeId === Number(perfumeId));
}

export async function addReview(payload) {
  const data = await apiRequest("/api/reviews", {
    method: "POST",
    body: {
      perfumeId: Number(payload.perfumeId),
      rating: Number(payload.rating),
      text: String(payload.text || "").trim()
    }
  });
  return data.item || null;
}

export async function refreshFavorites() {
  if (!state.currentUser) {
    state.favorites.clear();
    return state.favorites;
  }

  const data = await apiRequest("/api/favorites");
  const ids = Array.isArray(data.favoriteIds) ? data.favoriteIds.map(Number) : [];
  state.favorites = new Set(ids.filter((id) => Number.isInteger(id) && id > 0));
  return state.favorites;
}

export async function toggleFavorite(perfumeId) {
  const targetId = Number(perfumeId);
  if (!Number.isInteger(targetId) || targetId <= 0) return;

  if (!state.currentUser) {
    if (state.favorites.has(targetId)) state.favorites.delete(targetId);
    else state.favorites.add(targetId);
    return;
  }

  const data = await apiRequest(`/api/favorites/${targetId}/toggle`, { method: "POST" });
  const ids = Array.isArray(data.favoriteIds) ? data.favoriteIds.map(Number) : [];
  state.favorites = new Set(ids.filter((id) => Number.isInteger(id) && id > 0));
}

export function listFavoritePerfumes() {
  return state.perfumes.filter((p) => state.favorites.has(p.id));
}

export async function refreshPerfumes(filters = {}) {
  state.isLoadingPerfumes = true;
  state.lastError = "";
  try {
    const params = new URLSearchParams(
      Object.entries({
        q: filters.q || "",
        brand: filters.brand || "",
        gender: filters.gender || "",
        year: filters.year || "",
        sort: filters.sort || "popular"
      }).filter(([, value]) => value)
    );
    const data = await apiRequest(`/api/perfumes${params.toString() ? `?${params.toString()}` : ""}`);
    state.perfumes = Array.isArray(data.items) ? data.items : [];
    return state.perfumes;
  } catch (error) {
    state.lastError = error.message || "request_failed";
    throw error;
  } finally {
    state.isLoadingPerfumes = false;
  }
}

export async function refreshReviews(perfumeId) {
  state.isLoadingReviews = true;
  state.lastError = "";
  try {
    const data = await apiRequest(`/api/reviews?perfumeId=${encodeURIComponent(Number(perfumeId))}`);
    state.reviews = Array.isArray(data.items) ? data.items : [];
    return state.reviews;
  } catch (error) {
    state.lastError = error.message || "request_failed";
    throw error;
  } finally {
    state.isLoadingReviews = false;
  }
}

export async function bootstrapAppData() {
  await refreshPerfumes({ sort: "popular" });
}
