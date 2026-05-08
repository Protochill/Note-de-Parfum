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
  { path: "/admin", page: renderAdminPage },
  { path: "*", page: renderNotFoundPage }
];

(async () => {
  await refreshAuthState();
  try {
    await bootstrapAppData();
  } catch (_error) {
    // catalog page will show fetch error state
  }

  createRouter(routes, ({ page, params, query, path, go }) => {
    const content = page?.({ params, query, go, path }) || renderNotFoundPage({ path, go });
    renderLayout({ path, content });
  });
})();
