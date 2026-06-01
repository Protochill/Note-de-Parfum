import { el } from "../dom.js";
import { addPerfume, getState, updatePerfume, deletePerfume, refreshPerfumes } from "../state.js";

function readImageFile(input) {
  const file = input.files?.[0];
  if (!file) return Promise.resolve("");
  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("invalid_image"));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("image_read_failed"));
    reader.readAsDataURL(file);
  });
}

function createImagePicker(initialSrc = "") {
  const input = el("input", { class: "input", type: "file", accept: "image/png,image/jpeg,image/webp,image/gif" });
  const preview = el("div", { class: "image-preview" }, initialSrc
    ? el("img", { src: initialSrc, alt: "Фото товара" })
    : "Фото не выбрано");

  input.addEventListener("change", async () => {
    try {
      const dataUrl = await readImageFile(input);
      preview.replaceChildren(dataUrl
        ? el("img", { src: dataUrl, alt: "Предпросмотр фото" })
        : "Фото не выбрано");
    } catch (_error) {
      input.value = "";
      preview.replaceChildren("Выберите файл изображения.");
    }
  });

  return { input, preview };
}

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
  const imagePicker = createImagePicker();
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
      const imageDataUrl = await readImageFile(imagePicker.input);
      await addPerfume({
        name,
        brand,
        gender: genderSelect.value,
        releaseYear: yearInput.value,
        description: descriptionInput.value.trim(),
        imageDataUrl,
        volumeMl: volumeInput.value,
        priceByn: priceInput.value
      });
      status.textContent = "Товар добавлен.";
      nameInput.value = "";
      brandInput.value = "";
      yearInput.value = "";
      priceInput.value = "";
      descriptionInput.value = "";
      imagePicker.input.value = "";
      imagePicker.preview.replaceChildren("Фото не выбрано");
      window.dispatchEvent(new Event("hashchange"));
    } catch (_error) {
      status.textContent = "Не удалось создать товар. Проверьте поля и изображение.";
    }
  };

  const renderProductsTable = () => el("table", { class: "table" }, el("tbody", {}, [
    el("tr", {}, [
      el("th", {}, "ID"),
      el("th", {}, "Фото"),
      el("th", {}, "Название"),
      el("th", {}, "Бренд"),
      el("th", {}, "Год"),
      el("th", {}, "Объем / цена"),
      el("th", {}, "Действия")
    ]),
    ...perfumes.map((p) => {
      const rowStatus = el("p", { class: "muted row-status" }, "");
      const name = el("input", { class: "input", value: p.name });
      const brand = el("input", { class: "input", value: p.brand });
      const year = el("input", { class: "input", value: String(p.releaseYear) });
      const gender = el("select", { class: "select" }, [
        el("option", { value: "female", selected: p.gender === "female" ? "selected" : null }, "Женский"),
        el("option", { value: "male", selected: p.gender === "male" ? "selected" : null }, "Мужской"),
        el("option", { value: "unisex", selected: p.gender === "unisex" ? "selected" : null }, "Unisex")
      ]);
      const volume = el("input", { class: "input", value: String(p.volumeMl || 100) });
      const price = el("input", { class: "input", value: String(p.priceByn || 0) });
      const description = el("textarea", { class: "textarea table-edit-description" }, p.description || "");
      const rowImagePicker = createImagePicker(p.imageUrl || "");

      const save = async () => {
        try {
          const imageDataUrl = await readImageFile(rowImagePicker.input);
          const updated = await updatePerfume(p.id, {
            name: name.value,
            brand: brand.value,
            gender: gender.value,
            releaseYear: year.value,
            volumeMl: volume.value,
            priceByn: price.value,
            description: description.value,
            ...(imageDataUrl ? { imageDataUrl } : {})
          });
          rowStatus.textContent = updated ? "Изменения сохранены." : "Не удалось сохранить.";
          window.dispatchEvent(new Event("hashchange"));
        } catch (_error) {
          rowStatus.textContent = "Не удалось сохранить. Проверьте поля и изображение.";
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
        el("td", {}, el("div", { class: "table-edit-image" }, [rowImagePicker.preview, rowImagePicker.input])),
        el("td", {}, el("div", { class: "table-edit-name" }, [name, description, rowStatus])),
        el("td", {}, el("div", { class: "table-edit-brand" }, [brand, gender])),
        el("td", {}, el("div", { class: "table-edit-small" }, year)),
        el("td", {}, el("div", { class: "table-edit-small" }, [volume, price])),
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
          imagePicker.preview,
          imagePicker.input,
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
