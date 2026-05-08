import { el } from "../dom.js";
import { getState, logoutUser, apiRequest } from "../state.js";

export function renderProfilePage() {
  const { currentUser } = getState();

  if (!currentUser) {
    window.location.replace("/auth/login");
    return el("section", { class: "panel" }, [
      el("h1", {}, "Личный кабинет"),
      el("p", { class: "muted" }, "Перенаправление на страницу входа...")
    ]);
  }

  const nameInput = el("input", { class: "input", value: currentUser.name || currentUser.login || "", readonly: "readonly" });
  const emailInput = el("input", { class: "input", value: currentUser.email || "", readonly: "readonly" });
  const phoneInput = el("input", { class: "input", value: currentUser.phone || "", readonly: "readonly" });
  const keywordInput = el("input", { class: "input", placeholder: "Ключевое слово для восстановления" });
  const status = el("p", { class: "muted form-status-top" }, "");

  const loadProfile = async () => {
    try {
      const data = await apiRequest("/api/auth/profile");
      keywordInput.value = data.user.recoveryKeyword || "";
    } catch (_error) {
      status.textContent = "Не удалось загрузить ключевое слово.";
    }
  };

  const saveKeyword = async () => {
    const recoveryKeyword = keywordInput.value.trim();
    if (!recoveryKeyword) {
      status.textContent = "Введите ключевое слово.";
      return;
    }

    try {
      await apiRequest("/api/auth/profile", {
        method: "PATCH",
        body: { recoveryKeyword }
      });
      status.textContent = "Ключевое слово обновлено.";
    } catch (error) {
      status.textContent = error.message === "recovery_keyword_required"
        ? "Ключевое слово обязательно."
        : "Не удалось обновить ключевое слово.";
    }
  };

  loadProfile();

  return el("section", { class: "panel" }, [
    el("h1", {}, "Личный кабинет"),
    el("p", { class: "muted" }, "Профиль активной сессии."),
    el("div", { class: "profile-grid" }, [
      el("label", {}, "Имя"),
      nameInput,
      el("label", {}, "Email"),
      emailInput,
      el("label", {}, "Телефон"),
      phoneInput,
      el("label", {}, "Ключевое слово"),
      keywordInput,
      el("button", { class: "button button--primary", onclick: saveKeyword }, "Обновить ключевое слово"),
      el("button", {
        class: "button button--secondary",
        onclick: async () => {
          await logoutUser();
          window.location.hash = "#/auth/login";
        }
      }, "Выйти"),
      status
    ]),
    el("p", { class: "muted mt-10" }, `Роль: ${currentUser.role}`)
  ]);
}
