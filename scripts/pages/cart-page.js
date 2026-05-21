import { el } from "../dom.js";
import { getState, listCartItems, getCartTotal, updateCartItem, removeFromCart, clearCart } from "../state.js";
import { refreshHeaderCounters } from "../layout.js";

export function renderCartPage({ go }) {
  const { currentUser } = getState();
  if (!currentUser) {
    window.location.hash = "#/auth/login";
    return el("section", { class: "panel" }, [el("p", { class: "muted" }, "Корзина доступна только авторизованным пользователям.")]);
  }

  const section = el("section", {}, [el("h1", {}, "Корзина")]);
  const status = el("p", { class: "muted" }, "");
  const content = el("div", {});

  const render = () => {
    const items = listCartItems();
    refreshHeaderCounters();

    if (!items.length) {
      content.replaceChildren(
        el("section", { class: "error-page" }, [
          el("h2", {}, "Корзина пока пуста"),
          el("p", { class: "muted" }, "Добавьте товары из каталога, чтобы оформить заказ."),
          el("button", { class: "button button--primary", onclick: () => go("/catalog") }, "Перейти в каталог")
        ])
      );
      status.textContent = "";
      return;
    }

    const rows = items.map((item) =>
      el("article", { class: "card mt-12" }, [
        el("div", { class: "card__body" }, [
          el("div", { class: "row" }, [
            el("strong", {}, item.perfume.name),
            el("span", { class: "badge" }, `${item.perfume.priceByn || 0} BYN`)
          ]),
          el("p", { class: "muted" }, `${item.perfume.brand} • ${item.perfume.volumeMl || 100} мл`),
          el("div", { class: "actions-row" }, [
            el("input", {
              class: "input",
              type: "number",
              min: "1",
              value: String(item.quantity),
              onchange: (e) => {
                updateCartItem(item.perfume.id, Number(e.target.value));
                render();
              }
            }),
            el("button", {
              class: "button button--secondary",
              onclick: () => {
                removeFromCart(item.perfume.id);
                render();
              }
            }, "Удалить"),
            el("button", { class: "button button--primary", onclick: () => go(`/catalog/${item.perfume.id}`) }, "Открыть")
          ]),
          el("p", { class: "muted" }, `Сумма по позиции: ${item.subtotal} BYN`)
        ])
      ])
    );

    content.replaceChildren(
      el("h2", { class: "section-title" }, `Итого: ${getCartTotal()} BYN`),
      el("div", { class: "actions-row" }, [
        el("button", {
          class: "button button--secondary",
          onclick: () => {
            clearCart();
            status.textContent = "Корзина очищена.";
            render();
          }
        }, "Очистить корзину"),
        el("button", {
          class: "button button--primary",
          onclick: () => {
            clearCart();
            status.textContent = "Заказ оформлен. Спасибо за покупку.";
            render();
          }
        }, "Оформить заказ")
      ]),
      ...rows
    );
  };

  render();
  section.append(status, content);
  return section;
}
