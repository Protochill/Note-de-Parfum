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
  const questionInput = el("input", { class: "input", placeholder: "Вопрос для восстановления пароля" });
  const answerInput = el("input", { class: "input", placeholder: "Новый ответ на вопрос" });
  const status = el("p", { class: "muted form-status-top" }, "");

  const loadProfile = async () => {
    try {
      const data = await apiRequest("/api/auth/profile");
      questionInput.value = data.user.recoveryQuestion || "";
    } catch (_error) {
      status.textContent = "Не удалось загрузить вопрос восстановления.";
    }
  };

  const saveRecovery = async () => {
    const recoveryQuestion = questionInput.value.trim();
    const recoveryAnswer = answerInput.value.trim();
    if (!recoveryQuestion) {
      status.textContent = "Введите вопрос восстановления.";
      return;
    }

    try {
      await apiRequest("/api/auth/profile", {
        method: "PATCH",
        body: { recoveryQuestion, recoveryAnswer }
      });
      answerInput.value = "";
      status.textContent = recoveryAnswer
        ? "Вопрос и ответ восстановления обновлены."
        : "Вопрос восстановления обновлен.";
    } catch (error) {
      status.textContent = error.message === "recovery_question_required"
        ? "Вопрос восстановления обязателен."
        : "Не удалось обновить данные восстановления.";
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
      el("label", {}, "Вопрос восстановления"),
      questionInput,
      el("label", {}, "Ответ восстановления"),
      answerInput,
      el("button", { class: "button button--primary", onclick: saveRecovery }, "Обновить восстановление"),
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
