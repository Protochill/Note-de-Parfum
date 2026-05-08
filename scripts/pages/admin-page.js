import { el } from "../dom.js";
import { addPerfume, getState, updatePerfume, deletePerfume, refreshPerfumes } from "../state.js";

export function renderAdminPage() {
  const { currentUser, perfumes } = getState();
  if (!currentUser) {
    window.location.replace("/auth/login");
    return el("section", { class: "panel" }, [el("p", { class: "muted" }, "Перенаправление на страницу входа...")]);
  }
  if (currentUser.role !== "admin") {
    return el("section", { class: "error-page" }, [
      el("h1", {}, "Доступ запрещен"),
      el("p", { class: "muted" }, "Эта страница доступна только администраторам.")
    ]);
  }

  const nameInput = el("input", { class: "input", placeholder: "Название аромата" });
  const brandInput = el("input", { class: "input", placeholder: "Парфюмерный дом" });
  const yearInput = el("input", { class: "input", placeholder: "Год выпуска" });
  const genderSelect = el("select", { class: "select" }, [
    el("option", { value: "female" }, "Женский"),
    el("option", { value: "male" }, "Мужской"),
    el("option", { value: "unisex", selected: "selected" }, "Unisex")
  ]);
  const volumeInput = el("input", { class: "input", placeholder: "Объем, мл", value: "100" });
  const priceInput = el("input", { class: "input", placeholder: "Цена, BYN" });
  const imageUrlInput = el("input", { class: "input", placeholder: "URL фото" });
  const descriptionInput = el("textarea", { class: "textarea", placeholder: "Краткое описание" });
  const status = el("p", { class: "muted form-status" }, "");

  const createPerfume = async () => {
    const name = nameInput.value.trim();
    const brand = brandInput.value.trim();
    if (!name || !brand) {
      status.textContent = "Заполните минимум: название и бренд.";
      return;
    }
    try {
      await addPerfume({
        name,
        brand,
        gender: genderSelect.value,
        releaseYear: yearInput.value,
        description: descriptionInput.value.trim(),
        imageUrl: imageUrlInput.value.trim(),
        volumeMl: volumeInput.value,
        priceByn: priceInput.value
      });
      status.textContent = "Товар добавлен.";
      window.dispatchEvent(new Event("hashchange"));
    } catch (_error) {
      status.textContent = "Не удалось создать товар.";
    }
  };

  const renderProductsTable = () => el("table", { class: "table" }, el("tbody", {}, [
    el("tr", {}, [
      el("th", {}, "ID"),
      el("th", {}, "Название"),
      el("th", {}, "Бренд"),
      el("th", {}, "Год"),
      el("th", {}, "100 мл, BYN"),
      el("th", {}, "Действия")
    ]),
    ...perfumes.map((p) => {
      const rowStatus = el("p", { class: "muted row-status" }, "");
      const name = el("input", { class: "input", value: p.name });
      const brand = el("input", { class: "input", value: p.brand });
      const year = el("input", { class: "input", value: String(p.releaseYear) });
      const price = el("input", { class: "input", value: String(p.priceByn || 0) });

      const save = async () => {
        try {
          const updated = await updatePerfume(p.id, {
            name: name.value,
            brand: brand.value,
            releaseYear: year.value,
            priceByn: price.value
          });
          rowStatus.textContent = updated ? "Изменения сохранены." : "Не удалось сохранить.";
          window.dispatchEvent(new Event("hashchange"));
        } catch (_error) {
          rowStatus.textContent = "Не удалось сохранить.";
        }
      };

      const remove = async () => {
        const ok = confirm(`Удалить товар «${p.name}»?`);
        if (!ok) return;
        try {
          await deletePerfume(p.id);
          await refreshPerfumes({ sort: "popular" });
          window.dispatchEvent(new Event("hashchange"));
        } catch (_error) {
          rowStatus.textContent = "Не удалось удалить.";
        }
      };

      return el("tr", {}, [
        el("td", {}, p.id),
        el("td", {}, el("div", { class: "table-edit-name" }, [name, rowStatus])),
        el("td", {}, el("div", { class: "table-edit-brand" }, brand)),
        el("td", {}, el("div", { class: "table-edit-small" }, year)),
        el("td", {}, el("div", { class: "table-edit-small" }, price)),
        el("td", {}, el("div", { class: "table-actions" }, [
          el("button", { class: "button button--secondary", onclick: save }, "Сохранить"),
          el("button", { class: "button button--primary", onclick: remove }, "Удалить")
        ]))
      ]);
    })
  ]));

  return el("section", {}, [
    el("h1", {}, "Админ-панель"),
    el("div", { class: "layout-split" }, [
      el("aside", { class: "panel" }, [
        el("h3", {}, "Добавить аромат"),
        el("div", { class: "admin-form-grid" }, [
          nameInput,
          brandInput,
          yearInput,
          genderSelect,
          volumeInput,
          priceInput,
          imageUrlInput,
          descriptionInput,
          el("button", { class: "button button--primary", onclick: createPerfume }, "Создать товар"),
          status
        ])
      ]),
      el("div", { class: "panel" }, [
        el("h3", {}, `Ароматы (${perfumes.length})`),
        renderProductsTable()
      ])
    ])
  ]);
}
