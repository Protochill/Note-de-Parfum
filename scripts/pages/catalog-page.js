import { el, stars } from "../dom.js";
import { getState, listPerfumes, refreshPerfumes, toggleFavorite } from "../state.js";
import { createPerfumeMedia } from "../ui/perfume-media.js";

export function renderCatalogPage({ query, go }) {
  const filters = {
    q: query.q || "",
    brand: query.brand || "",
    gender: query.gender || "",
    year: query.year || "",
    sort: query.sort || "popular"
  };

  const state = getState();
  const section = el("section", {}, [el("h1", {}, "Каталог ароматов")]);
  const status = el("p", { class: "muted" }, "");
  const grid = el("div", { class: "grid" }, []);

  const apply = (next) => {
    const params = new URLSearchParams(Object.entries({ ...filters, ...next }).filter(([, v]) => v));
    window.location.hash = `#/catalog${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const renderItems = () => {
    const perfumes = listPerfumes(filters);
    const isGuest = !state.currentUser;
    const brands = [...new Set(state.perfumes.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "ru"));
    const years = [...new Set(state.perfumes.map((p) => p.releaseYear))].sort((a, b) => b - a);

    const toolbar = el("div", { class: "toolbar" }, [
      el("input", {
        class: "input",
        placeholder: "Поиск по аромату или бренду",
        value: filters.q,
        oninput: (e) => apply({ q: e.target.value })
      }),
      el("select", { class: "select", onchange: (e) => apply({ brand: e.target.value }) }, [
        el("option", { value: "" }, "Все бренды"),
        ...brands.map((b) => el("option", { value: b, selected: b === filters.brand ? "selected" : null }, b))
      ]),
      el("select", { class: "select", onchange: (e) => apply({ gender: e.target.value }) }, [
        el("option", { value: "" }, "Любой пол"),
        el("option", { value: "female", selected: filters.gender === "female" ? "selected" : null }, "Женский"),
        el("option", { value: "male", selected: filters.gender === "male" ? "selected" : null }, "Мужской"),
        el("option", { value: "unisex", selected: filters.gender === "unisex" ? "selected" : null }, "Unisex")
      ]),
      el("select", { class: "select", onchange: (e) => apply({ year: e.target.value }) }, [
        el("option", { value: "" }, "Все годы"),
        ...years.map((y) => el("option", { value: y, selected: String(y) === String(filters.year) ? "selected" : null }, String(y)))
      ])
    ]);

    const sortRow = el("div", { class: "actions-row actions-row--top10" }, [
      el("button", { class: "button button--secondary", onclick: () => apply({ sort: "popular" }) }, "По рейтингу"),
      el("button", { class: "button button--secondary", onclick: () => apply({ sort: "new" }) }, "Сначала новые"),
      el("button", { class: "button button--secondary", onclick: () => apply({ sort: "name" }) }, "По названию")
    ]);

    status.textContent = `Найдено: ${perfumes.length}`;
    grid.replaceChildren(...perfumes.map((p) => {
      const isFavorite = state.favorites.has(p.id);
      const favButton = !isGuest
        ? el("button", {
          class: "button button--secondary",
          onclick: async () => {
            try {
              await toggleFavorite(p.id);
              favButton.textContent = state.favorites.has(p.id) ? "Убрать из избранного" : "В избранное";
              window.dispatchEvent(new Event("hashchange"));
            } catch (_error) {
              status.textContent = "Не удалось обновить избранное.";
            }
          }
        }, isFavorite ? "Убрать из избранного" : "В избранное")
        : null;

      return el("article", { class: "card" }, [
        createPerfumeMedia(p),
        el("div", { class: "card__body" }, [
          el("div", { class: "row" }, [el("strong", {}, p.name), el("span", { class: "badge" }, p.brand)]),
          el("p", { class: "muted" }, `${stars(p.rating)} • ${p.releaseYear}`),
          el("p", { class: "muted" }, `${p.volumeMl || 100} мл • ${p.priceByn || 0} BYN`),
          el("p", {}, p.description),
          el("div", { class: "row" }, [
            el("button", { class: "button button--primary", onclick: () => go(`/catalog/${p.id}`) }, "Подробнее"),
            favButton
          ])
        ])
      ]);
    }));

    section.replaceChildren(el("h1", {}, "Каталог ароматов"), toolbar, sortRow, status, grid);
  };

  section.append(el("div", { class: "spinner" }, "Загрузка каталога..."));
  refreshPerfumes(filters)
    .then(renderItems)
    .catch(() => {
      section.replaceChildren(
        el("h1", {}, "Каталог ароматов"),
        el("p", { class: "muted" }, "Не удалось загрузить каталог с сервера.")
      );
    });

  return section;
}
