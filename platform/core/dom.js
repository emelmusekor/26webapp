export function createEl(tag, className, text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function countMatchingPrefix(value, target) {
  let count = 0;
  while (count < value.length && count < target.length && value[count] === target[count]) count += 1;
  return count;
}

export function wireDrag(container, item, drop, onComplete, onMiss) {
  let drag = null;
  let overDrop = false;

  const move = (clientX, clientY) => {
    if (!drag) return;
    const box = container.getBoundingClientRect();
    item.style.left = `${Math.max(8, Math.min(box.width - 88, clientX - box.left - drag.x))}px`;
    item.style.top = `${Math.max(8, Math.min(box.height - 88, clientY - box.top - drag.y))}px`;
    setDropHover(isInsideDrop());
  };

  const finish = () => {
    if (!drag) return;
    drag = null;
    item.classList.remove("dragging");
    if (isInsideDrop()) {
      snapIntoDrop(onComplete);
      return;
    }
    setDropHover(false);
    item.classList.add("drag-miss");
    window.setTimeout(() => item.classList.remove("drag-miss"), 260);
    onMiss?.();
  };

  const start = (clientX, clientY) => {
    const rect = item.getBoundingClientRect();
    drag = { x: clientX - rect.left, y: clientY - rect.top };
    item.classList.add("dragging");
  };

  const isInsideDrop = () => {
    const a = item.getBoundingClientRect();
    const b = drop.getBoundingClientRect();
    const center = { x: a.left + a.width / 2, y: a.top + a.height / 2 };
    return center.x >= b.left && center.x <= b.right && center.y >= b.top && center.y <= b.bottom;
  };

  const setDropHover = (value) => {
    if (overDrop === value) return;
    overDrop = value;
    drop.classList.toggle("drop-hover", value);
  };

  const snapIntoDrop = (callback) => {
    setDropHover(false);
    const box = container.getBoundingClientRect();
    const b = drop.getBoundingClientRect();
    item.classList.add("dropped");
    item.style.left = `${b.left - box.left + (b.width - item.offsetWidth) / 2}px`;
    item.style.top = `${b.top - box.top + (b.height - item.offsetHeight) / 2}px`;
    window.setTimeout(callback, 220);
  };

  item.addEventListener("pointerdown", (event) => {
    start(event.clientX, event.clientY);
    item.setPointerCapture(event.pointerId);
  });
  item.addEventListener("pointermove", (event) => move(event.clientX, event.clientY));
  item.addEventListener("pointerup", finish);
  item.addEventListener("mousedown", (event) => {
    event.preventDefault();
    start(event.clientX, event.clientY);
  });
  container.addEventListener("mousemove", (event) => move(event.clientX, event.clientY));
  container.addEventListener("mouseup", finish);
}
