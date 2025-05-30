export default function parseRoute(hashRoute) {
    if (hashRoute.startsWith('#')) {
      hashRoute = hashRoute.slice(1);
    }
    const [rawPath, queryString] = hashRoute.split('?');
    const [path, id] = rawPath.split('/');
    const params = new URLSearchParams(queryString);
    if (id) {
      params.set('id', id);
    }
    return { path, params };
  }
  