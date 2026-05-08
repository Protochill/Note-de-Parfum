function normalizeHash() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function matchPath(pattern, path) {
  const pParts = pattern.split("/").filter(Boolean);
  const aParts = path.split("/").filter(Boolean);
  if (pParts.length !== aParts.length) return null;

  const params = {};
  for (let i = 0; i < pParts.length; i += 1) {
    const p = pParts[i];
    const a = aParts[i];
    if (p.startsWith(":")) params[p.slice(1)] = decodeURIComponent(a);
    else if (p !== a) return null;
  }
  return params;
}

export function createRouter(routes, render) {
  const go = (path) => {
    window.location.hash = `#${path}`;
  };

  const resolve = () => {
    const full = normalizeHash();
    const [pathname, queryString = ""] = full.split("?");
    const query = Object.fromEntries(new URLSearchParams(queryString));

    for (const route of routes) {
      const params = matchPath(route.path, pathname);
      if (!params) continue;
      render({ page: route.page, params, query, path: pathname, go });
      return;
    }

    const notFound = routes.find((r) => r.path === "*");
    render({ page: notFound?.page, params: {}, query, path: pathname, go });
  };

  window.addEventListener("hashchange", resolve);
  resolve();

  return { go };
}
