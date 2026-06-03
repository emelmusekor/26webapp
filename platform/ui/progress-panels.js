import { AREAS, getAllModules } from "../data/catalog.js";

export function renderBadges(badgeBoard, progress) {
  const completed = Object.entries(progress).filter(([, value]) => value.complete);
  if (!completed.length) {
    badgeBoard.innerHTML = `
      <div class="badge-card">
        <div class="badge-medal">0</div>
        <h3>아직 비어 있어요</h3>
        <p class="guide-text">체험 모듈을 완료하면 배지가 생깁니다.</p>
      </div>
    `;
    return;
  }

  badgeBoard.innerHTML = completed
    .map(([, value], index) => `
      <article class="badge-card">
        <div class="badge-medal">${index + 1}</div>
        <h3>${value.title}</h3>
        <p class="guide-text">${value.area} 영역 완료</p>
      </article>
    `)
    .join("");
}

export function renderTeacherBoard(teacherBoard, progress) {
  const modules = getAllModules();
  const done = modules.filter((module) => progress[module.id]?.complete).length;
  const percent = Math.round((done / modules.length) * 100);
  const areaRows = AREAS.map((area) => {
    const areaDone = area.modules.filter((module) => progress[module.id]?.complete).length;
    return `
      <article class="teacher-card compact">
        <h3>${area.name}</h3>
        <p class="guide-text">${areaDone} / ${area.modules.length}개 모듈</p>
        <div class="teacher-meter"><span style="width:${Math.round((areaDone / area.modules.length) * 100)}%"></span></div>
      </article>
    `;
  }).join("");

  teacherBoard.innerHTML = `
    <article class="teacher-card">
      <h3>전체 진행률</h3>
      <p class="guide-text">${done} / ${modules.length}개 모듈</p>
      <div class="teacher-meter"><span style="width:${percent}%"></span></div>
    </article>
    ${areaRows}
  `;
}

export function updateStatus(badgeCountLabel, progress) {
  const completed = Object.values(progress).filter((value) => value.complete).length;
  badgeCountLabel.textContent = `${completed}개`;
}
