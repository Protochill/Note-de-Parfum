import { el, stars } from "../dom.js";
import { listPerfumes } from "../state.js";
import { createPerfumeMedia } from "../ui/perfume-media.js";

export function renderHomePage({ go }) {
  const popular = listPerfumes({ sort: "popular" }).slice(0, 4);
  const fresh = listPerfumes({ sort: "new" }).slice(0, 4);

  const makeGrid = (items) =>
    el(
      "div",
      { class: "grid" },
      items.map((p) =>
        el("article", { class: "card" }, [
          createPerfumeMedia(p),
          el("div", { class: "card__body" }, [
            el("div", { class: "row" }, [el("strong", {}, p.name), el("span", { class: "badge" }, p.brand)]),
            el("p", { class: "muted" }, `${stars(p.rating)} • ${p.releaseYear}`),
            el("p", { class: "muted" }, `${p.volumeMl || 100} мл • ${p.priceByn || 0} BYN`),
            el("button", { class: "button button--secondary", onclick: () => go(`/catalog/${p.id}`) }, "Открыть")
          ])
        ])
      )
    );

  return el("section", {}, [
    el("div", { class: "hero" }, [
      el("h1", {}, "Каталог ароматов Note de Parfum"),
      el("p", {}, "Изучайте пирамиду нот, добавляйте любимые ароматы в избранное и ведите свой цифровой парфюмерный дневник."),
      el("button", { class: "button button--primary", onclick: () => go("/catalog") }, "Перейти в каталог")
    ]),
    el("h2", { class: "section-title" }, "Популярные ароматы"),
    makeGrid(popular),
    el("h2", { class: "section-title" }, "Новинки"),
    makeGrid(fresh)
  ]);
}
