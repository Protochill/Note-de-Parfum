import { el } from "./dom.js";
import { getState, logoutUser, getCartCount } from "./state.js";

export function refreshHeaderCounters() {
  const state = getState();
  const favoritesLink = document.getElementById("nav-favorites");
  if (favoritesLink) favoritesLink.textContent = `Избранное (${state.favorites.size})`;
  const cartCount = document.getElementById("nav-cart-count");
  if (cartCount) cartCount.textContent = String(getCartCount());
  const cartLink = document.getElementById("nav-cart");
  if (cartLink) cartLink.setAttribute("aria-label", `Корзина: ${getCartCount()}`);
}

export function renderLayout({ path, content }) {
  const root = document.getElementById("app");
  const state = getState();
  const isAdmin = state.currentUser?.role === "admin";
  const isGuest = !state.currentUser;

  const navItems = [
    ["/", "Главная"],
    ["/catalog", "Каталог"],
    ["/brands", "Бренды"],
    ["/profile", "Профиль"]
  ];
  if (!isGuest) navItems.push(["/cart", "cart"]);
  if (!isGuest) navItems.push(["/favorites", `Избранное (${state.favorites.size})`]);
  if (isAdmin) navItems.push(["/admin", "Админ"]);

  const header = el("header", { class: "header" }, [
    el("div", { class: "header__inner" }, [
      el("a", { class: "logo", href: "#/" }, "Note de Parfum"),
      el("nav", { class: "nav" }, navItems.map(([href, label]) =>
        href === "/cart"
          ? el("a", {
            class: `nav__link nav__link--cart ${path === href ? "active" : ""}`.trim(),
            href: `#${href}`,
            id: "nav-cart",
            "aria-label": `Корзина: ${getCartCount()}`
          }, [
            el("span", { class: "nav__icon", "aria-hidden": "true" }, "🛒"),
            el("span", { class: "nav__count", id: "nav-cart-count" }, String(getCartCount()))
          ])
          : el("a", {
            class: `nav__link ${path === href ? "active" : ""}`.trim(),
            href: `#${href}`,
            id: href === "/favorites" ? "nav-favorites" : null
          }, label)
      )),
      el("div", { class: "header__actions" }, [
        el("span", { class: "header__status" }, state.currentUser ? `Вход: ${state.currentUser.login}` : "Гость"),
        state.currentUser
          ? el("button", {
            class: "button button--secondary",
            onclick: async () => {
              await logoutUser();
              window.location.hash = "#/auth/login";
            }
          }, "Выйти")
          : el("a", { class: "button button--secondary", href: "#/auth/login" }, "Войти")
      ])
    ])
  ]);

  const pageContent = el("div", { class: "page-content page-content--enter" }, content);
  const main = el("main", { class: "main" }, el("div", { class: "container" }, pageContent));
  const footer = el("footer", { class: "footer" }, [
    el("div", { class: "container" }, [
      el("strong", {}, "Note de Parfum"),
      el("p", { class: "muted footer__contacts" }, "г. Брест, ул. Парфюмерная, д. 1 • +375 (29) 111-11-11 • support@noteparfum.by")
    ])
  ]);

  root.replaceChildren(header, main, footer);

  const animatedCards = root.querySelectorAll(".grid > .card");
  animatedCards.forEach((card, index) => {
    card.style.setProperty("--card-index", String(index));
    card.classList.add("card--reveal");
  });
}
