import { el, stars } from "../dom.js";
import { listFavoritePerfumes, toggleFavorite, getState } from "../state.js";
import { createPerfumeMedia } from "../ui/perfume-media.js";

export function renderFavoritesPage({ go }) {
  const { currentUser } = getState();
  if (!currentUser) {
    window.location.replace("/auth/login");
    return el("section", { class: "panel" }, [el("p", { class: "muted" }, "Перенаправление на страницу входа...")]);
  }

  const items = listFavoritePerfumes();
  if (!items.length) {
    return el("section", { class: "error-page" }, [
      el("h1", {}, "Избранное пока пусто"),
      el("p", { class: "muted" }, "Добавьте ароматы из каталога, чтобы собрать личную коллекцию."),
      el("button", { class: "button button--primary", onclick: () => go("/catalog") }, "Перейти в каталог")
    ]);
  }

  return el("section", {}, [
    el("h1", {}, "Мои избранные ароматы"),
    el("div", { class: "grid" }, items.map((p) =>
      el("article", { class: "card" }, [
        createPerfumeMedia(p),
        el("div", { class: "card__body" }, [
          el("div", { class: "row" }, [el("strong", {}, p.name), el("span", { class: "badge" }, p.brand)]),
          el("p", { class: "muted" }, `${stars(p.rating)} • ${p.releaseYear} • ${p.volumeMl || 100} мл • ${p.priceByn || 0} BYN`),
          el("div", { class: "row" }, [
            el("button", { class: "button button--primary", onclick: () => go(`/catalog/${p.id}`) }, "Открыть"),
            el("button", {
              class: "button button--secondary",
              onclick: async () => {
                try {
                  await toggleFavorite(p.id);
                  window.dispatchEvent(new Event("hashchange"));
                } catch (_error) {
                  // no-op
                }
              }
            }, "Удалить")
          ])
        ])
      ])
    ))
  ]);
}
