const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3000;

const ADMIN_EMAIL = "admin@noteparfum.local";
const ADMIN_NAME = "admin";
const ADMIN_PASSWORD = "111111";
const ADMIN_PHONE = "+375291111111";
const ADMIN_ROLE = "admin";
const ADMIN_RECOVERY_KEYWORD = "admin-keyword";

const seedPerfumes = [
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
    imageUrl: "/image/Chanel%20No.%205%20.png",
    volumeMl: 100,
    priceByn: 420
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
    imageUrl: "/image/Bleu%20de%20Chanel.png",
    volumeMl: 100,
    priceByn: 390
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
    imageUrl: "/image/Sauvage%20Dior.png",
    volumeMl: 100,
    priceByn: 365
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
    imageUrl: "/image/J'adore%20Dior.png",
    volumeMl: 100,
    priceByn: 350
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
    imageUrl: "/image/Shalimar%20Guerlain.png",
    volumeMl: 100,
    priceByn: 325
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
    imageUrl: "/image/Mon%20Guerlain%20Guerlain.png",
    volumeMl: 100,
    priceByn: 330
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
    imageUrl: "/image/Baccarat%20Rouge%20540.png",
    volumeMl: 100,
    priceByn: 990
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
    imageUrl: "/image/Aventus%20Creed.png",
    volumeMl: 100,
    priceByn: 1020
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
    imageUrl: "/image/Silver%20Mountain%20Water%20Creed.png",
    volumeMl: 100,
    priceByn: 860
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
    imageUrl: "/image/Black%20Orchid%20Tom%20Ford.png",
    volumeMl: 100,
    priceByn: 470
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
    imageUrl: "/image/Tobacco%20Vanille%20Tom%20Ford.png",
    volumeMl: 100,
    priceByn: 540
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
    imageUrl: "/image/Gypsy%20Water%20Byredo.png",
    volumeMl: 100,
    priceByn: 580
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
    imageUrl: "/image/Wood%20Sage%20%26%20Sea%20SaltJo%20Malone%20London.png",
    volumeMl: 100,
    priceByn: 320
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
    imageUrl: "/image/Terre%20d'Hermes%20.png",
    volumeMl: 100,
    priceByn: 345
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
    imageUrl: "/image/Libre%20Yves%20Saint%20Laurent%20.png",
    volumeMl: 100,
    priceByn: 340
  }
];

const seedReviews = [
  { perfumeId: 1, userLogin: "lena", rating: 5, text: "Классика, которая всегда звучит уместно.", createdAt: "2026-03-28" },
  { perfumeId: 7, userLogin: "max", rating: 5, text: "Очень стойкий и шлейфовый.", createdAt: "2026-03-29" },
  { perfumeId: 14, userLogin: "anna", rating: 4, text: "Идеально на каждый день.", createdAt: "2026-04-01" }
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "primer.html"));
});

app.get(["/auth/login", "/auth/register", "/auth/forgot-password"], (req, res) => {
  res.redirect(302, `/#${req.path}`);
});

app.use(
  session({
    secret: "твоя_секретная_строка",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: "lax" }
  })
);

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1111",
  database: "perfumes_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use((req, _res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
});

app.get(["/profile", "/favorites", "/admin"], (req, res) => {
  if (!req.session.user) {
    return res.redirect(302, "/auth/login");
  }
  return res.redirect(302, `/#${req.path}`);
});

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "unauthorized" });
  }
  return next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "forbidden" });
  }
  return next();
}

function normalizePerfumeRow(row) {
  const parseJson = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch (_err) {
        return [];
      }
    }
    return [];
  };

  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    gender: row.gender,
    releaseYear: row.release_year,
    rating: Number(row.rating || 0),
    topNotes: parseJson(row.top_notes),
    middleNotes: parseJson(row.middle_notes),
    baseNotes: parseJson(row.base_notes),
    description: row.description || "",
    country: row.country || "Не указано",
    imageUrl: row.image_url || "",
    volumeMl: Number(row.volume_ml || 100),
    priceByn: Number(row.price_byn || 0)
  };
}

function normalizeReviewRow(row) {
  const rawDate = row.created_at instanceof Date
    ? row.created_at.toISOString().slice(0, 10)
    : String(row.created_at || "").slice(0, 10);

  return {
    id: row.id,
    perfumeId: row.perfume_id,
    userLogin: row.user_login,
    rating: Number(row.rating || 0),
    text: row.text || "",
    createdAt: rawDate
  };
}

function isLikelyEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function normalizeUserRow(row) {
  const name = String(row.name || row.login || "").trim();
  const email = String(row.email || "").trim();
  const createdAt = row.created_at instanceof Date
    ? row.created_at.toISOString()
    : String(row.created_at || "");

  return {
    id: row.id,
    email,
    name,
    login: name,
    phone: row.phone || null,
    role: row.role || "user",
    createdAt
  };
}

async function initDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE,
      password_hash VARCHAR(255),
      name VARCHAR(255),
      login VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      phone VARCHAR(50) UNIQUE,
      role ENUM('user', 'admin') DEFAULT 'user',
      recovery_keyword VARCHAR(255),
      favorites JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS perfumes (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(255) NOT NULL,
      gender ENUM('female', 'male', 'unisex') DEFAULT 'unisex',
      release_year INT,
      rating DECIMAL(3,2) DEFAULT 0,
      top_notes JSON,
      middle_notes JSON,
      base_notes JSON,
      description TEXT,
      country VARCHAR(255),
      image_url TEXT,
      volume_ml INT DEFAULT 100,
      price_byn DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT PRIMARY KEY AUTO_INCREMENT,
      perfume_id INT NOT NULL,
      user_id INT NULL,
      user_login VARCHAR(255) NOT NULL,
      rating TINYINT NOT NULL,
      text TEXT NOT NULL,
      created_at DATE NOT NULL,
      INDEX idx_reviews_perfume_id (perfume_id)
    )
  `);

  const ensureColumn = async (tableName, columnName, definition) => {
    const [rows] = await db.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [tableName, columnName]
    );
    if (rows.length === 0) {
      await db.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`);
    }
  };

  await ensureColumn("users", "email", "VARCHAR(255) NULL");
  await ensureColumn("users", "password_hash", "VARCHAR(255) NULL");
  await ensureColumn("users", "name", "VARCHAR(255) NULL");
  await ensureColumn("users", "login", "VARCHAR(255) NULL");
  await ensureColumn("users", "password", "VARCHAR(255) NULL");
  await ensureColumn("users", "phone", "VARCHAR(50) NULL");
  await ensureColumn("users", "role", "ENUM('user','admin') DEFAULT 'user'");
  await ensureColumn("users", "recovery_keyword", "VARCHAR(255) NULL");
  await ensureColumn("users", "favorites", "JSON");
  await ensureColumn("users", "created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
  await ensureColumn("users", "updated_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

  await db.query(`
    UPDATE users
    SET name = COALESCE(NULLIF(name, ''), NULLIF(login, ''), 'user')
    WHERE name IS NULL OR name = ''
  `);

  await db.query(`
    UPDATE users
    SET email = CASE
      WHEN email IS NOT NULL AND email <> '' THEN email
      WHEN login IS NOT NULL AND login LIKE '%@%' THEN login
      WHEN login IS NOT NULL AND login <> '' THEN CONCAT(login, '+', id, '@local.test')
      ELSE CONCAT('user', id, '@local.test')
    END
    WHERE email IS NULL OR email = ''
  `);

  await db.query(`
    UPDATE users
    SET password_hash = COALESCE(NULLIF(password_hash, ''), NULLIF(password, ''))
    WHERE password_hash IS NULL OR password_hash = ''
  `);

  await db.query(`
    UPDATE users
    SET login = COALESCE(NULLIF(login, ''), NULLIF(name, ''), CONCAT('user', id))
    WHERE login IS NULL OR login = ''
  `);

  await db.query(`
    UPDATE users
    SET favorites = JSON_ARRAY()
    WHERE favorites IS NULL
  `);

  try {
    await db.query("ALTER TABLE users ADD UNIQUE INDEX uq_users_email (email)");
  } catch (_error) {
    // index already exists
  }

  await ensureColumn("perfumes", "rating", "DECIMAL(3,2) DEFAULT 0");
  await ensureColumn("perfumes", "top_notes", "JSON");
  await ensureColumn("perfumes", "middle_notes", "JSON");
  await ensureColumn("perfumes", "base_notes", "JSON");
  await ensureColumn("perfumes", "description", "TEXT");
  await ensureColumn("perfumes", "country", "VARCHAR(255)");
  await ensureColumn("perfumes", "image_url", "TEXT");
  await ensureColumn("perfumes", "volume_ml", "INT DEFAULT 100");
  await ensureColumn("perfumes", "price_byn", "DECIMAL(10,2) DEFAULT 0");

  await ensureColumn("reviews", "perfume_id", "INT NOT NULL");
  await ensureColumn("reviews", "user_id", "INT NULL");
  await ensureColumn("reviews", "user_login", "VARCHAR(255) NOT NULL");
  await ensureColumn("reviews", "rating", "TINYINT NOT NULL");
  await ensureColumn("reviews", "text", "TEXT NOT NULL");
  await ensureColumn("reviews", "created_at", "DATE NOT NULL");
}

async function ensureAdminUser() {
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const [rows] = await db.execute(
    "SELECT id FROM users WHERE email = ? OR login = ? OR name = ? LIMIT 1",
    [ADMIN_EMAIL, ADMIN_NAME, ADMIN_NAME]
  );

  if (rows.length === 0) {
    await db.execute(
      `
      INSERT INTO users (email, password_hash, name, login, password, phone, role, recovery_keyword, favorites)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, JSON_ARRAY())
      `,
      [ADMIN_EMAIL, adminHash, ADMIN_NAME, ADMIN_NAME, adminHash, ADMIN_PHONE, ADMIN_ROLE, ADMIN_RECOVERY_KEYWORD]
    );
    return;
  }

  await db.execute(
    `
    UPDATE users
    SET email = ?, password_hash = ?, name = ?, login = ?, password = ?, phone = ?, role = ?, recovery_keyword = ?
    WHERE id = ?
    `,
    [ADMIN_EMAIL, adminHash, ADMIN_NAME, ADMIN_NAME, adminHash, ADMIN_PHONE, ADMIN_ROLE, ADMIN_RECOVERY_KEYWORD, rows[0].id]
  );
}

async function seedPerfumesIfEmpty() {
  const [rows] = await db.query("SELECT COUNT(*) as count FROM perfumes");
  if (Number(rows[0].count) > 0) return;

  for (const perfume of seedPerfumes) {
    await db.execute(
      `
      INSERT INTO perfumes (
        id, name, brand, gender, release_year, rating, top_notes, middle_notes, base_notes,
        description, country, image_url, volume_ml, price_byn
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        perfume.id,
        perfume.name,
        perfume.brand,
        perfume.gender,
        perfume.releaseYear,
        perfume.rating,
        JSON.stringify(perfume.topNotes || []),
        JSON.stringify(perfume.middleNotes || []),
        JSON.stringify(perfume.baseNotes || []),
        perfume.description,
        perfume.country,
        perfume.imageUrl,
        perfume.volumeMl,
        perfume.priceByn
      ]
    );
  }
}

async function seedReviewsIfEmpty() {
  const [rows] = await db.query("SELECT COUNT(*) as count FROM reviews");
  if (Number(rows[0].count) > 0) return;

  const [adminRows] = await db.execute(
    "SELECT id FROM users WHERE email = ? OR login = ? OR name = ? LIMIT 1",
    [ADMIN_EMAIL, ADMIN_NAME, ADMIN_NAME]
  );
  const adminId = adminRows[0]?.id || 1;

  for (const review of seedReviews) {
    const [authorRows] = await db.execute(
      "SELECT id FROM users WHERE name = ? OR login = ? OR email = ? LIMIT 1",
      [review.userLogin, review.userLogin, review.userLogin]
    );
    const authorId = authorRows[0]?.id || adminId;

    await db.execute(
      "INSERT INTO reviews (perfume_id, user_id, user_login, rating, text, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [review.perfumeId, authorId, review.userLogin, review.rating, review.text, review.createdAt]
    );
  }
}

app.get("/api/health", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ ok: true, db: "connected" });
  } catch (_error) {
    res.status(500).json({ ok: false, error: "database_unavailable" });
  }
});

app.get("/api/perfumes", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();
    const brand = String(req.query.brand || "").trim();
    const gender = String(req.query.gender || "").trim();
    const year = Number(req.query.year || 0);
    const sort = String(req.query.sort || "popular").trim();

    const where = [];
    const params = [];

    if (q) {
      where.push("(LOWER(name) LIKE ? OR LOWER(brand) LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (brand) {
      where.push("brand = ?");
      params.push(brand);
    }
    if (["female", "male", "unisex"].includes(gender)) {
      where.push("gender = ?");
      params.push(gender);
    }
    if (Number.isInteger(year) && year > 0) {
      where.push("release_year = ?");
      params.push(year);
    }

    let orderBy = "rating DESC, id ASC";
    if (sort === "new") orderBy = "release_year DESC, id DESC";
    if (sort === "name") orderBy = "name ASC, id ASC";

    const sql = `
      SELECT * FROM perfumes
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY ${orderBy}
    `;
    const [rows] = await db.execute(sql, params);
    return res.json({ success: true, items: rows.map(normalizePerfumeRow) });
  } catch (error) {
    console.error("Perfumes read error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.post("/api/perfumes", requireAdmin, async (req, res) => {
  try {
    const { name, brand, gender, releaseYear, description, imageUrl, volumeMl, priceByn } = req.body;
    if (!name || !brand) {
      return res.status(400).json({ success: false, message: "name_and_brand_required" });
    }

    const [result] = await db.execute(
      `
      INSERT INTO perfumes (name, brand, gender, release_year, rating, top_notes, middle_notes, base_notes, description, country, image_url, volume_ml, price_byn)
      VALUES (?, ?, ?, ?, ?, JSON_ARRAY(), JSON_ARRAY(), JSON_ARRAY(), ?, ?, ?, ?, ?)
      `,
      [
        String(name).trim(),
        String(brand).trim(),
        ["female", "male", "unisex"].includes(gender) ? gender : "unisex",
        Number(releaseYear) || new Date().getFullYear(),
        0,
        "Не указано",
        String(imageUrl || "").trim(),
        Number(volumeMl) || 100,
        Number(priceByn) || 0
      ]
    );

    const [rows] = await db.execute("SELECT * FROM perfumes WHERE id = ? LIMIT 1", [result.insertId]);
    return res.status(201).json({ success: true, item: normalizePerfumeRow(rows[0]) });
  } catch (error) {
    console.error("Perfume create error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.patch("/api/perfumes/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "invalid_id" });
    }

    const [rows] = await db.execute("SELECT * FROM perfumes WHERE id = ? LIMIT 1", [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "perfume_not_found" });
    }

    const current = normalizePerfumeRow(rows[0]);
    const next = {
      name: String(req.body.name ?? current.name).trim(),
      brand: String(req.body.brand ?? current.brand).trim(),
      gender: ["female", "male", "unisex"].includes(req.body.gender) ? req.body.gender : current.gender,
      releaseYear: Number(req.body.releaseYear) || current.releaseYear,
      description: String(req.body.description ?? current.description).trim(),
      imageUrl: String(req.body.imageUrl ?? current.imageUrl).trim(),
      volumeMl: Number(req.body.volumeMl) || current.volumeMl || 100,
      priceByn: Number(req.body.priceByn) || 0,
      country: String(req.body.country ?? current.country).trim()
    };

    if (!next.name || !next.brand) {
      return res.status(400).json({ success: false, message: "name_and_brand_required" });
    }

    await db.execute(
      `
      UPDATE perfumes
      SET name = ?, brand = ?, gender = ?, release_year = ?, description = ?, image_url = ?, volume_ml = ?, price_byn = ?, country = ?
      WHERE id = ?
      `,
      [next.name, next.brand, next.gender, next.releaseYear, next.description, next.imageUrl, next.volumeMl, next.priceByn, next.country, id]
    );

    const [updatedRows] = await db.execute("SELECT * FROM perfumes WHERE id = ? LIMIT 1", [id]);
    return res.json({ success: true, item: normalizePerfumeRow(updatedRows[0]) });
  } catch (error) {
    console.error("Perfume update error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.delete("/api/perfumes/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "invalid_id" });
    }

    const [existsRows] = await db.execute("SELECT id FROM perfumes WHERE id = ? LIMIT 1", [id]);
    if (!existsRows.length) {
      return res.status(404).json({ success: false, message: "perfume_not_found" });
    }

    await db.execute("DELETE FROM reviews WHERE perfume_id = ?", [id]);
    await db.execute("DELETE FROM perfumes WHERE id = ?", [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error("Perfume delete error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.get("/api/reviews", async (req, res) => {
  try {
    const perfumeId = Number(req.query.perfumeId || 0);
    if (perfumeId > 0) {
      const [rows] = await db.execute("SELECT * FROM reviews WHERE perfume_id = ? ORDER BY id DESC", [perfumeId]);
      return res.json({ success: true, items: rows.map(normalizeReviewRow) });
    }

    const [rows] = await db.query("SELECT * FROM reviews ORDER BY id DESC");
    return res.json({ success: true, items: rows.map(normalizeReviewRow) });
  } catch (error) {
    console.error("Reviews read error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.post("/api/reviews", requireAuth, async (req, res) => {
  try {
    const perfumeId = Number(req.body.perfumeId);
    const rating = Number(req.body.rating);
    const text = String(req.body.text || "").trim();

    if (!Number.isInteger(perfumeId) || perfumeId <= 0 || !text || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "invalid_review_payload" });
    }

    const [perfumeRows] = await db.execute("SELECT id FROM perfumes WHERE id = ? LIMIT 1", [perfumeId]);
    if (!perfumeRows.length) {
      return res.status(404).json({ success: false, message: "perfume_not_found" });
    }

    const createdAt = new Date().toISOString().slice(0, 10);
    const [result] = await db.execute(
      "INSERT INTO reviews (perfume_id, user_id, user_login, rating, text, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [perfumeId, req.session.user.id, req.session.user.login, rating, text, createdAt]
    );

    const [rows] = await db.execute("SELECT * FROM reviews WHERE id = ? LIMIT 1", [result.insertId]);
    return res.status(201).json({ success: true, item: normalizeReviewRow(rows[0]) });
  } catch (error) {
    console.error("Review create error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.get("/api/favorites", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT favorites FROM users WHERE id = ? LIMIT 1", [req.session.user.id]);
    const raw = rows[0]?.favorites;
    const parsed = Array.isArray(raw) ? raw : JSON.parse(raw || "[]");
    const favoriteIds = parsed.map(Number).filter((id) => Number.isInteger(id) && id > 0);
    return res.json({ success: true, favoriteIds });
  } catch (error) {
    console.error("Favorites read error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.post("/api/favorites/:perfumeId/toggle", requireAuth, async (req, res) => {
  try {
    const perfumeId = Number(req.params.perfumeId);
    if (!Number.isInteger(perfumeId) || perfumeId <= 0) {
      return res.status(400).json({ success: false, message: "invalid_id" });
    }

    const [perfumeRows] = await db.execute("SELECT id FROM perfumes WHERE id = ? LIMIT 1", [perfumeId]);
    if (!perfumeRows.length) {
      return res.status(404).json({ success: false, message: "perfume_not_found" });
    }

    const [rows] = await db.execute("SELECT favorites FROM users WHERE id = ? LIMIT 1", [req.session.user.id]);
    const raw = rows[0]?.favorites;
    const parsed = Array.isArray(raw) ? raw : JSON.parse(raw || "[]");
    const ids = parsed.map(Number).filter((id) => Number.isInteger(id) && id > 0);

    const has = ids.includes(perfumeId);
    const nextIds = has ? ids.filter((id) => id !== perfumeId) : [...ids, perfumeId];

    await db.execute("UPDATE users SET favorites = ? WHERE id = ?", [JSON.stringify(nextIds), req.session.user.id]);
    return res.json({ success: true, favoriteIds: nextIds });
  } catch (error) {
    console.error("Favorites toggle error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const rawEmail = String(req.body.email || req.body.login || "").trim().toLowerCase();
    const rawName = String(req.body.name || req.body.login || "").trim();
    const password = String(req.body.password || "");
    const phone = req.body.phone ? String(req.body.phone).trim() : null;
    const recoveryKeyword = String(req.body.recoveryKeyword || "").trim();

    if (!rawEmail || !rawName || !password) {
      return res.status(400).json({ success: false, message: "email_name_and_password_required" });
    }
    if (!isLikelyEmail(rawEmail)) {
      return res.status(400).json({ success: false, message: "invalid_email" });
    }
    if (!recoveryKeyword) {
      return res.status(400).json({ success: false, message: "recovery_keyword_required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "password_too_short" });
    }

    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ? OR (? IS NOT NULL AND phone = ?)",
      [rawEmail, phone || null, phone || null]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "email_or_phone_already_exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `
      INSERT INTO users (email, password_hash, name, login, password, phone, role, recovery_keyword, favorites)
      VALUES (?, ?, ?, ?, ?, ?, 'user', ?, JSON_ARRAY())
      `,
      [rawEmail, passwordHash, rawName, rawName, passwordHash, phone || null, recoveryKeyword]
    );

    req.session.user = {
      id: result.insertId,
      email: rawEmail,
      name: rawName,
      login: rawName,
      role: "user",
      phone: phone || null
    };
    return res.status(201).json({ success: true, userId: result.insertId, redirect: "/#/profile" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const identity = String(req.body.email || req.body.login || "").trim();
    const password = String(req.body.password || "");
    if (!identity || !password) {
      return res.status(400).json({ success: false, message: "login_and_password_required" });
    }

    const [rows] = await db.execute(
      `
      SELECT id, email, name, login, password_hash, password, role, phone
      FROM users
      WHERE email = ? OR login = ? OR name = ?
      LIMIT 1
      `,
      [identity.toLowerCase(), identity, identity]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "invalid_credentials" });
    }

    const user = rows[0];
    const hash = user.password_hash || user.password;
    if (!hash) {
      return res.status(401).json({ success: false, message: "invalid_credentials" });
    }
    const passwordOk = await bcrypt.compare(password, hash);

    if (!passwordOk) {
      return res.status(401).json({ success: false, message: "invalid_credentials" });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name || user.login,
      login: user.name || user.login,
      role: user.role,
      phone: user.phone
    };
    return res.json({ success: true, redirect: "/#/profile" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const identity = String(req.body.email || req.body.login || "").trim();
    const recoveryKeyword = String(req.body.recoveryKeyword || "").trim();
    const newPassword = String(req.body.newPassword || "");

    if (!identity || !recoveryKeyword || !newPassword) {
      return res.status(400).json({ success: false, message: "login_keyword_and_password_required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "password_too_short" });
    }

    const [rows] = await db.execute(
      `
      SELECT id
      FROM users
      WHERE (email = ? OR login = ? OR name = ?) AND recovery_keyword = ?
      LIMIT 1
      `,
      [identity.toLowerCase(), identity, identity, recoveryKeyword]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "invalid_recovery_data" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password_hash = ?, password = ? WHERE id = ?", [newHash, newHash, rows[0].id]);

    return res.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "logout_failed" });
    }
    return res.json({ success: true });
  });
});

app.get("/api/auth/check", (req, res) => {
  if (!req.session.user) {
    return res.json({ authenticated: false, user: null });
  }

  return res.json({
    authenticated: true,
    user: {
      id: req.session.user.id,
      email: req.session.user.email || null,
      name: req.session.user.name || req.session.user.login || null,
      login: req.session.user.name || req.session.user.login || null,
      role: req.session.user.role,
      phone: req.session.user.phone || null
    }
  });
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, email, name, login, phone, role, created_at FROM users WHERE id = ? LIMIT 1",
      [req.session.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "user_not_found" });
    }

    return res.json({
      success: true,
      user: normalizeUserRow(rows[0])
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.get("/api/auth/profile", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, email, name, login, phone, role, recovery_keyword FROM users WHERE id = ? LIMIT 1",
      [req.session.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "user_not_found" });
    }

    return res.json({
      success: true,
      user: {
        id: rows[0].id,
        email: rows[0].email || null,
        name: rows[0].name || rows[0].login || "",
        login: rows[0].name || rows[0].login || "",
        phone: rows[0].phone,
        role: rows[0].role,
        recoveryKeyword: rows[0].recovery_keyword || ""
      }
    });
  } catch (error) {
    console.error("Profile read error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.patch("/api/auth/profile", requireAuth, async (req, res) => {
  try {
    const recoveryKeyword = String(req.body.recoveryKeyword || "").trim();
    if (!recoveryKeyword) {
      return res.status(400).json({ success: false, message: "recovery_keyword_required" });
    }

    await db.execute("UPDATE users SET recovery_keyword = ? WHERE id = ?", [recoveryKeyword, req.session.user.id]);
    return res.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "internal_server_error" });
});

(async () => {
  try {
    await initDatabase();
    await ensureAdminUser();
    await seedPerfumesIfEmpty();
    await seedReviewsIfEmpty();
    await db.query("SELECT 1");

    console.log("Успешное подключение к MySQL");
    console.log(`Админ создан/обновлен: email=${ADMIN_EMAIL}, name=${ADMIN_NAME}, phone=${ADMIN_PHONE}, password=${ADMIN_PASSWORD}`);

    app.listen(port, () => {
      console.log(`Сервер запущен: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error.message);
    process.exit(1);
  }
})();
