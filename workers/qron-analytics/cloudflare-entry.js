import analyticsWorker from './worker.js';

const PREFIXES = ['/api/analytics', '/analytics'];

function rewritePath(request) {
  const url = new URL(request.url);

  for (const prefix of PREFIXES) {
    if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) {
      url.pathname = url.pathname.slice(prefix.length) || '/';
      return new Request(url.toString(), request);
    }
  }

  return request;
}

export default {
  async fetch(request, env, ctx) {
    const normalizedRequest = rewritePath(request);
    return analyticsWorker.fetch(normalizedRequest, env, ctx);
  },
};
