import { el } from "../dom.js";

export function renderNotFoundPage({ path, go }) {
  return el("section", { class: "error-page" }, [
    el("h1", {}, "404: страница не найдена"),
    el("p", { class: "muted" }, `Маршрут ${path} отсутствует в приложении.`),
    el("div", { class: "mt-12" }, el("button", { class: "button button--primary", onclick: () => go("/") }, "Вернуться на главную"))
  ]);
}
