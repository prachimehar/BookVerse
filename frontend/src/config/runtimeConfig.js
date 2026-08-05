export function getRuntimeConfigValue(key, fallback = "") {
  const runtimeConfig = window.__BOOKVERSE_CONFIG__ || {};
  return runtimeConfig[key] || import.meta.env[key] || fallback;
}
