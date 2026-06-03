const STORAGE_KEY = "digiteracy-module-progress";

export function resetProgressFromQuery() {
  if (!new URLSearchParams(window.location.search).has("reset")) return;
  localStorage.removeItem(STORAGE_KEY);
  window.history.replaceState(null, "", window.location.pathname);
}

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
