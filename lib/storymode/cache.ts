const cache = new Map();

export function getCachedStory(key: string) {
  return cache.get(key) || null;
}

export function setCachedStory(key: string, value: any) {
  cache.set(key, value);
}
