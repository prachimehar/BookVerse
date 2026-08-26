export function getRuntimeConfigValue(key, fallback = "") {
  const runtimeConfig = window.__BOOKVERSE_CONFIG__ || {};
  const runtimeValue = runtimeConfig[key];

  if (runtimeValue !== undefined && runtimeValue !== null && runtimeValue !== "") {
    return runtimeValue;
  }

  return import.meta.env[key] || fallback;
}
