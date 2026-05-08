import { el, stars } from "../dom.js";
import { getPerfumeById, listReviews, toggleFavorite, getState, addReview, refreshReviews, refreshPerfumes } from "../state.js";
import { createPerfumeMedia, createPerfumeDetailMedia } from "../ui/perfume-media.js";

function renderReviewsList(items) {
  if (!items.length) return el("p", { class: "muted" }, "Пока нет отзывов.");
  return el("div", { class: "grid" }, items.map((r) =>
    el("article", { class: "card" }, el("div", { class: "card__body" }, [
      el("div", { class: "row" }, [el("strong", {}, r.userLogin), el("span", { class: "badge" }, `${r.rating}/5`)]),
      el("p", {}, r.text),
      el("p", { class: "muted" }, r.createdAt)
    ]))
  ));
}

export function renderPerfumePage({ params, go }) {
  const section = el("section", {}, [el("div", { class: "spinner" }, "Загрузка страницы аромата...")]);
  const state = getState();

  const renderPage = async () => {
    let perfume = getPerfumeById(params.id);
    if (!perfume) {
      await refreshPerfumes({ sort: "popular" });
      perfume = getPerfumeById(params.id);
    }
    if (!perfume) {
      section.replaceChildren(
        el("section", { class: "error-page" }, [el("h1", {}, "Аромат не найден"), el("p", { class: "muted" }, "Проверьте ID аромата.")])
      );
      return;
    }

    const isGuest = !state.currentUser;
    const recommendations = state.perfumes.filter((p) => p.gender === perfume.gender && p.id !== perfume.id).slice(0, 3);
    const favorite = state.favorites.has(perfume.id);
    const notes = (title, values) => el("div", { class: "panel" }, [el("h3", {}, title), el("p", {}, (values || []).join(", "))]);

    await refreshReviews(perfume.id);
    const reviewsContainer = el("div", {}, renderReviewsList(listReviews(perfume.id)));
    const status = el("p", { class: "muted form-status-top" }, "");
    const reviewText = el("textarea", { class: "textarea", placeholder: "Ваш отзыв" });
    const reviewRating = el("select", { class: "select" }, [
      el("option", { value: "5" }, "5"),
      el("option", { value: "4" }, "4"),
      el("option", { value: "3" }, "3"),
      el("option", { value: "2" }, "2"),
      el("option", { value: "1" }, "1")
    ]);

    const submitReview = async () => {
      const text = reviewText.value.trim();
      if (!text) {
        status.textContent = "Введите текст отзыва.";
        return;
      }
      try {
        await addReview({ perfumeId: perfume.id, rating: Number(reviewRating.value), text });
        await refreshReviews(perfume.id);
        reviewText.value = "";
        status.textContent = "Отзыв добавлен.";
        reviewsContainer.replaceChildren(renderReviewsList(listReviews(perfume.id)));
      } catch (_error) {
        status.textContent = "Не удалось опубликовать отзыв.";
      }
    };

    const favButton = !isGuest
      ? el("button", {
        class: "button button--secondary",
        onclick: async () => {
          try {
            await toggleFavorite(perfume.id);
            favButton.textContent = state.favorites.has(perfume.id) ? "Убрать из избранного" : "В избранное";
            window.dispatchEvent(new Event("hashchange"));
          } catch (_error) {
            status.textContent = "Не удалось обновить избранное.";
          }
        }
      }, favorite ? "Убрать из избранного" : "В избранное")
      : null;

    section.replaceChildren(
      el("div", { class: "layout-split" }, [
        el("div", { class: "card" }, [
          createPerfumeDetailMedia(perfume),
          el("div", { class: "card__body" }, [
            el("h1", {}, perfume.name),
            el("p", { class: "muted" }, `${perfume.brand} • ${perfume.country} • ${perfume.releaseYear}`),
            el("p", { class: "muted" }, `${perfume.volumeMl || 100} мл • ${perfume.priceByn || 0} BYN`),
            el("p", {}, perfume.description),
            el("p", { class: "muted" }, `Рейтинг: ${stars(perfume.rating)}`),
            el("div", { class: "row" }, [
              favButton,
              el("button", { class: "button button--primary", onclick: () => go("/catalog") }, "К каталогу")
            ])
          ])
        ]),
        el("div", { class: "notes-grid" }, [notes("Верхние ноты", perfume.topNotes), notes("Ноты сердца", perfume.middleNotes), notes("Базовые ноты", perfume.baseNotes)])
      ]),
      el("h2", { class: "section-title" }, "Отзывы"),
      reviewsContainer,
      !isGuest
        ? el("div", { class: "panel mt-12" }, [
          el("h3", {}, "Оставить отзыв"),
          el("div", { class: "review-form-grid" }, [
            reviewRating,
            reviewText,
            el("button", { class: "button button--primary", onclick: submitReview }, "Опубликовать"),
            status
          ])
        ])
        : el("p", { class: "muted" }, "Войдите в аккаунт, чтобы оставить отзыв."),
      el("h2", { class: "section-title" }, "Рекомендации"),
      el("div", { class: "grid" }, recommendations.map((p) => el("article", { class: "card" }, [
        createPerfumeMedia(p),
        el("div", { class: "card__body" }, [
          el("strong", {}, p.name),
          el("p", { class: "muted" }, p.brand),
          el("p", { class: "muted" }, `${p.volumeMl || 100} мл • ${p.priceByn || 0} BYN`),
          el("button", { class: "button button--secondary", onclick: () => go(`/catalog/${p.id}`) }, "Открыть")
        ])
      ])))
    );
  };

  renderPage().catch(() => {
    section.replaceChildren(el("p", { class: "muted" }, "Не удалось загрузить данные страницы."));
  });
  return section;
}
