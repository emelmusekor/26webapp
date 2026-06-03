import { createEl } from "./dom.js";

export function playRoundEffect(canvas, label) {
  if (!canvas) return;
  const toast = createEl("div", "round-toast", label);
  canvas.append(toast);
  for (let index = 0; index < 12; index += 1) {
    const piece = createEl("i", "burst-piece");
    piece.style.setProperty("--x", `${Math.cos(index * 0.54) * (80 + (index % 4) * 18)}px`);
    piece.style.setProperty("--y", `${Math.sin(index * 0.54) * (58 + (index % 3) * 16)}px`);
    piece.style.setProperty("--delay", `${index * 18}ms`);
    canvas.append(piece);
    window.setTimeout(() => piece.remove(), 950);
  }
  window.setTimeout(() => toast.remove(), 900);
}

export function playClearEffect(canvas) {
  if (!canvas) return;
  const clear = createEl("div", "clear-effect");
  clear.innerHTML = "<span>클리어!</span>";
  canvas.append(clear);
  for (let index = 0; index < 28; index += 1) {
    const confetti = createEl("i", "confetti-piece");
    confetti.style.left = `${8 + ((index * 13) % 84)}%`;
    confetti.style.setProperty("--fall", `${180 + (index % 5) * 46}px`);
    confetti.style.setProperty("--spin", `${160 + index * 19}deg`);
    confetti.style.setProperty("--delay", `${index * 28}ms`);
    confetti.style.background = ["#2b6eea", "#0f9f9a", "#f5bd2f", "#e45b55", "#7657d6"][index % 5];
    canvas.append(confetti);
    window.setTimeout(() => confetti.remove(), 1900);
  }
  window.setTimeout(() => clear.remove(), 1500);
}
