import { el } from "../dom.js";

export function createPerfumeMedia(perfume) {
  if (perfume.imageUrl) {
    const img = el("img", { src: perfume.imageUrl, alt: perfume.name, class: "card__image" });
    img.onerror = () => {
      img.replaceWith(el("div", { class: "card__media" }, "Фото не найдено"));
    };
    return el("div", { class: "card__media" }, img);
  }

  return el("div", { class: "card__media" }, perfume.name[0]);
}

export function createPerfumeDetailMedia(perfume) {
  if (perfume.imageUrl) {
    const img = el("img", { src: perfume.imageUrl, alt: perfume.name, class: "card__image card__image--large" });
    img.onerror = () => {
      img.replaceWith(el("div", { class: "card__media card__media--detail-missing" }, "Фото не найдено"));
    };
    return el("div", { class: "card__media card__media--detail" }, img);
  }

  return el("div", { class: "card__media card__media--detail-initial" }, perfume.name[0]);
}
