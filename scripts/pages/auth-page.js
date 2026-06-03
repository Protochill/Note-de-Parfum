import { el } from "../dom.js";
import { apiRequest, refreshAuthState } from "../state.js";

function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function renderAuthPage({ path, go }) {
  const mode = path.split("/").pop();

  if (mode === "forgot-password") {
    const loginInput = el("input", { class: "input", placeholder: "Email или имя" });
    const questionText = el("p", { class: "muted form-status-top" }, "Введите email или имя, чтобы увидеть ваш вопрос восстановления.");
    const answerInput = el("input", { class: "input", placeholder: "Ответ на вопрос восстановления" });
    const newPasswordInput = el("input", { class: "input", type: "password", placeholder: "Новый пароль" });
    const status = el("p", { class: "muted form-status-top" }, "");

    const loadQuestion = async () => {
      const identity = loginInput.value.trim();
      if (!identity) {
        status.textContent = "Введите email или имя.";
        return;
      }
      try {
        status.textContent = "Ищем вопрос...";
        const data = await apiRequest(`/api/auth/recovery-question?identity=${encodeURIComponent(identity)}`);
        questionText.textContent = data.question || "Введите ответ на вопрос восстановления.";
        status.textContent = "";
      } catch (error) {
        const map = {
          identity_required: "Введите email или имя.",
          user_not_found: "Пользователь не найден."
        };
        status.textContent = map[error.message] || "Не удалось загрузить вопрос.";
      }
    };

    const resetPassword = async () => {
      try {
        status.textContent = "Выполняем восстановление...";
        await apiRequest("/api/auth/reset-password", {
          method: "POST",
          body: {
            login: loginInput.value.trim(),
            recoveryAnswer: answerInput.value.trim(),
            newPassword: newPasswordInput.value
          }
        });
        status.textContent = "Пароль обновлен. Можно войти.";
      } catch (error) {
        const map = {
          login_answer_and_password_required: "Заполните логин, ответ и новый пароль.",
          password_too_weak: "Пароль должен быть минимум 8 символов, содержать одну заглавную, одну строчную букву и один спецсимвол.",
          invalid_recovery_data: "Неверный логин или ответ."
        };
        status.textContent = map[error.message] || "Не удалось восстановить пароль.";
      }
    };

    return el("section", { class: "panel" }, [
      el("h2", {}, "Восстановление пароля"),
      el("p", { class: "muted" }, "Введите email или имя, получите персональный вопрос и укажите ответ."),
      el("div", { class: "form-grid" }, [
        loginInput,
        el("button", { class: "button button--secondary", onclick: loadQuestion }, "Показать вопрос"),
        questionText,
        answerInput,
        newPasswordInput
      ]),
      el("div", { class: "actions-row actions-row--top10" }, [
        el("button", { class: "button button--primary", onclick: resetPassword }, "Сбросить пароль"),
        el("a", { href: "#/auth/login", class: "button button--secondary" }, "К входу"),
        el("a", { href: "#/auth/register", class: "button button--secondary" }, "К регистрации")
      ]),
      status
    ]);
  }

  const isRegister = mode === "register";
  const loginInput = el("input", { class: "input", placeholder: isRegister ? "Имя" : "Email или имя" });
  const emailInput = isRegister ? el("input", { class: "input", placeholder: "Email" }) : null;
  const phoneInput = isRegister ? el("input", { class: "input", placeholder: "Телефон" }) : null;
  const questionInput = isRegister ? el("input", { class: "input", placeholder: "Вопрос для восстановления пароля" }) : null;
  const answerInput = isRegister ? el("input", { class: "input", placeholder: "Ответ на вопрос восстановления" }) : null;
  const passwordInput = el("input", { class: "input", type: "password", placeholder: "Пароль" });
  const confirmInput = isRegister ? el("input", { class: "input", type: "password", placeholder: "Подтвердите пароль" }) : null;
  const status = el("p", { class: "muted form-status" }, "");

  const submit = async () => {
    try {
      const login = loginInput.value.trim();
      const email = emailInput ? emailInput.value.trim() : login;
      const password = passwordInput.value;
      const phone = phoneInput ? phoneInput.value.trim() : null;
      const recoveryQuestion = questionInput ? questionInput.value.trim() : null;
      const recoveryAnswer = answerInput ? answerInput.value.trim() : null;

      if (!login || !password || (isRegister && !email)) {
        status.textContent = isRegister ? "Заполните имя, email и пароль." : "Заполните email (или имя) и пароль.";
        return;
      }
      if (isRegister && password !== confirmInput.value) {
        status.textContent = "Пароли не совпадают.";
        return;
      }
      if (isRegister && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = "Введите корректный email.";
        return;
      }
      if (!isStrongPassword(password)) {
        status.textContent = "Пароль должен быть минимум 8 символов, содержать одну заглавную, одну строчную букву и один спецсимвол.";
        return;
      }
      if (isRegister && (!recoveryQuestion || !recoveryAnswer)) {
        status.textContent = "Добавьте вопрос и ответ для восстановления.";
        return;
      }

      status.textContent = "Выполняем запрос...";

      if (isRegister) {
        await apiRequest("/api/auth/register", {
          method: "POST",
          body: { name: login, email, password, phone, recoveryQuestion, recoveryAnswer, login }
        });
      } else {
        await apiRequest("/api/auth/login", {
          method: "POST",
          body: { email: login, password, login }
        });
      }

      await refreshAuthState();
      status.textContent = "Успешно!";
      go("/profile");
    } catch (error) {
      const map = {
        login_and_password_required: "Логин и пароль обязательны.",
        email_name_and_password_required: "Имя, email и пароль обязательны.",
        invalid_email: "Введите корректный email.",
        password_too_weak: "Пароль должен быть минимум 8 символов, содержать одну заглавную, одну строчную букву и один спецсимвол.",
        login_or_phone_already_exists: "Такой логин или телефон уже заняты.",
        email_or_phone_already_exists: "Такой email или телефон уже заняты.",
        recovery_question_and_answer_required: "Вопрос и ответ обязательны для регистрации.",
        invalid_credentials: "Неверный логин или пароль."
      };
      status.textContent = map[error.message] || "Ошибка сервера. Проверь подключение к API.";
    }
  };

  return el("section", { class: "panel" }, [
    el("h2", {}, isRegister ? "Регистрация" : "Вход"),
    el("div", { class: "form-grid" }, [
      loginInput,
      emailInput,
      phoneInput,
      questionInput,
      answerInput,
      passwordInput,
      confirmInput,
      el("button", { class: "button button--primary", onclick: submit }, isRegister ? "Создать аккаунт" : "Войти")
    ]),
    status,
    el("div", { class: "actions-row actions-row--top12" }, [
      el("a", { href: "#/auth/login", class: "badge" }, "Вход"),
      el("a", { href: "#/auth/register", class: "badge" }, "Регистрация"),
      el("a", { href: "#/auth/forgot-password", class: "badge" }, "Забыли пароль")
    ]),
    el("div", { class: "mt-12" }, el("button", { class: "button button--secondary", onclick: () => go("/") }, "На главную"))
  ]);
}
