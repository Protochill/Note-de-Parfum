import { el } from "../dom.js";
import { apiRequest, refreshAuthState } from "../state.js";

export function renderAuthPage({ path, go }) {
  const mode = path.split("/").pop();

  if (mode === "forgot-password") {
    const loginInput = el("input", { class: "input", placeholder: "Email или имя" });
    const keywordInput = el("input", { class: "input", placeholder: "Ключевое слово" });
    const newPasswordInput = el("input", { class: "input", type: "password", placeholder: "Новый пароль" });
    const status = el("p", { class: "muted form-status-top" }, "");

    const resetPassword = async () => {
      try {
        status.textContent = "Выполняем восстановление...";
        await apiRequest("/api/auth/reset-password", {
          method: "POST",
          body: {
            login: loginInput.value.trim(),
            recoveryKeyword: keywordInput.value.trim(),
            newPassword: newPasswordInput.value
          }
        });
        status.textContent = "Пароль обновлен. Можно войти.";
      } catch (error) {
        const map = {
          login_keyword_and_password_required: "Заполните логин, ключевое слово и новый пароль.",
          password_too_short: "Минимальная длина нового пароля: 6 символов.",
          invalid_recovery_data: "Неверный логин или ключевое слово."
        };
        status.textContent = map[error.message] || "Не удалось восстановить пароль.";
      }
    };

    return el("section", { class: "panel" }, [
      el("h2", {}, "Восстановление пароля"),
      el("p", { class: "muted" }, "Введите email (или имя), ключевое слово и новый пароль."),
      el("div", { class: "form-grid" }, [loginInput, keywordInput, newPasswordInput]),
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
  const keywordInput = isRegister ? el("input", { class: "input", placeholder: "Ключевое слово для восстановления" }) : null;
  const passwordInput = el("input", { class: "input", type: "password", placeholder: "Пароль" });
  const confirmInput = isRegister ? el("input", { class: "input", type: "password", placeholder: "Подтвердите пароль" }) : null;
  const status = el("p", { class: "muted form-status" }, "");

  const submit = async () => {
    try {
      const login = loginInput.value.trim();
      const email = emailInput ? emailInput.value.trim() : login;
      const password = passwordInput.value;
      const phone = phoneInput ? phoneInput.value.trim() : null;
      const recoveryKeyword = keywordInput ? keywordInput.value.trim() : null;

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
      if (password.length < 6) {
        status.textContent = "Минимальная длина пароля: 6 символов.";
        return;
      }
      if (isRegister && !recoveryKeyword) {
        status.textContent = "Добавьте ключевое слово для восстановления.";
        return;
      }

      status.textContent = "Выполняем запрос...";

      if (isRegister) {
        await apiRequest("/api/auth/register", {
          method: "POST",
          body: { name: login, email, password, phone, recoveryKeyword, login }
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
        password_too_short: "Минимальная длина пароля: 6 символов.",
        login_or_phone_already_exists: "Такой логин или телефон уже заняты.",
        email_or_phone_already_exists: "Такой email или телефон уже заняты.",
        recovery_keyword_required: "Ключевое слово обязательно для регистрации.",
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
      keywordInput,
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
