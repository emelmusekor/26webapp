export function openView(viewName) {
  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${viewName}View`);
  });
  document.querySelectorAll(".dock-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
}
