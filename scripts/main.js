import { createRouter } from "./router.js";
import { renderLayout } from "./layout.js";
import { refreshAuthState, bootstrapAppData } from "./state.js";

import { renderHomePage } from "./pages/home-page.js";
import { renderAuthPage } from "./pages/auth-page.js";
import { renderCatalogPage } from "./pages/catalog-page.js";
import { renderPerfumePage } from "./pages/perfume-page.js";
import { renderBrandsPage } from "./pages/brands-page.js";
import { renderProfilePage } from "./pages/profile-page.js";
import { renderFavoritesPage } from "./pages/favorites-page.js";
import { renderCartPage } from "./pages/cart-page.js";
import { renderAdminPage } from "./pages/admin-page.js";
import { renderNotFoundPage } from "./pages/not-found-page.js";

const routes = [
  { path: "/", page: renderHomePage },
  { path: "/auth/login", page: renderAuthPage },
  { path: "/auth/register", page: renderAuthPage },
  { path: "/auth/forgot-password", page: renderAuthPage },
  { path: "/catalog", page: renderCatalogPage },
  { path: "/catalog/:id", page: renderPerfumePage },
  { path: "/brands", page: renderBrandsPage },
  { path: "/profile", page: renderProfilePage },
  { path: "/favorites", page: renderFavoritesPage },
  { path: "/cart", page: renderCartPage },
  { path: "/admin", page: renderAdminPage },
  { path: "*", page: renderNotFoundPage }
];

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function createTransitionScreen() {
  const loader = document.createElement("div");
  loader.className = "route-loader";
  loader.innerHTML = `
    <div class="route-loader__panel">
      <div class="route-loader__spinner" aria-hidden="true"></div>
      <div class="route-loader__text">Загружаем страницу...</div>
    </div>
  `;
  return loader;
}

(async () => {
  await refreshAuthState();
  try {
    await bootstrapAppData();
  } catch (_error) {
    // catalog page will show fetch error state
  }

  let navigationToken = 0;

  createRouter(routes, async ({ page, params, query, path, go }) => {
    const currentToken = ++navigationToken;
    const root = document.getElementById("app");
    const loader = createTransitionScreen();
    root.replaceChildren(loader);

    const delay = Math.floor(Math.random() * 751);
    await wait(delay);
    if (currentToken !== navigationToken) return;

    const content = page?.({ params, query, go, path }) || renderNotFoundPage({ path, go });
    if (currentToken !== navigationToken) return;
    renderLayout({ path, content });
  });
})();
