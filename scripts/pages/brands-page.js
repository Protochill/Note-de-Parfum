import { el } from "../dom.js";
import { listBrands } from "../state.js";

export function renderBrandsPage({ query }) {
  const countryFilter = query.country || "";
  const brands = listBrands().filter((b) => !countryFilter || b.country === countryFilter);
  const countries = [...new Set(listBrands().map((b) => b.country))];

  return el("section", {}, [
    el("h1", {}, "Бренды"),
    el("div", { class: "toolbar" }, [
      el("div", { class: "muted" }, `Найдено брендов: ${brands.length}`),
      el(
        "select",
        {
          class: "select",
          onchange: (e) => {
            const value = e.target.value;
            window.location.hash = value ? `#/brands?country=${encodeURIComponent(value)}` : "#/brands";
          }
        },
        [el("option", { value: "" }, "Все страны"), ...countries.map((c) => el("option", { value: c, selected: c === countryFilter ? "selected" : null }, c))]
      )
    ]),
    el(
      "div",
      { class: "grid" },
      brands.map((brand) =>
        el("article", { class: "card" }, [
          el("div", { class: "card__body" }, [
            el("div", { class: "row" }, [el("strong", {}, brand.name), el("span", { class: "badge" }, brand.country)]),
            el("p", { class: "muted" }, `Основан: ${brand.foundedYear || "—"}`),
            el("p", {}, brand.description),
            el("a", { href: `#/catalog?q=${encodeURIComponent(brand.name)}`, class: "button button--secondary" }, "Смотреть ароматы")
          ])
        ])
      )
    )
  ]);
}

