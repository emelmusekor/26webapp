function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function renderPage() {
    const id = getQueryParam('id');
    const data = curriculumData[id];
    const app = document.getElementById('app');

    if (!data) {
        app.innerHTML = '<div style="text-align:center; padding:50px;"><h2>데이터를 찾을 수 없습니다. (ID Error)</h2><a href="index.html" class="back-btn">돌아가기</a></div>';
        return;
    }

    // Color theme based on domain (Optional simple logic)
    let themeColor = '#6c5ce7';
    if (id.startsWith('A')) themeColor = '#3498db'; // Vision
    if (id.startsWith('B')) themeColor = '#9b59b6'; // Logic
    if (id.startsWith('C')) themeColor = '#2ecc71'; // Data
    if (id.startsWith('D')) themeColor = '#e67e22'; // Network
    if (id.startsWith('E')) themeColor = '#e74c3c'; // System

    const gameButton = data.gameLink
        ? `<a href="${data.gameLink}" class="game-btn">🧩 문제 풀러 가기!</a>`
        : `<div class="game-btn disabled">🚧 문제 준비 중이에요</div>`;

    app.innerHTML = `
    <div class="nav-bar">
        <button class="back-btn" onclick="location.href='index.html'">⬅️ 매트릭스로 돌아가기</button>
        <div style="font-weight:bold; color:#ccc;">ID: ${data.id}</div>
    </div>

    <div class="hero" style="background: linear-gradient(135deg, ${themeColor}, #555);">
        <div class="tags">
            <span class="tag">${data.domain}</span>
            <span class="tag">${data.process}</span>
        </div>
        <div class="hero-icon">
            <svg viewBox="0 0 24 24"><path d="${data.iconPath}"/></svg>
        </div>
        <h1>${data.childTerm}</h1>
        <div class="sub-title">${data.term}</div>
        <p style="margin-top:20px; font-size:1.1rem; opacity:0.9;">"${data.summary}"</p>
    </div>

    <div class="section">
        <div class="section-title">🧐 무엇을 배우나요?</div>
        <div class="content-text">
            ${data.goal}
        </div>
    </div>

    <!-- Added Concept Section -->
    <div class="section concept-box">
        <div class="section-title" style="color:#2980b9;">💻 정보과학 개념 (Informatics Concept)</div>
        <div class="content-text">
            <strong>${data.concept.split(':')[0]}</strong><br>
            ${data.concept.split(':')[1] || ''}
        </div>
    </div>

    <!-- Difficulty Section Removed as per request -->

    <div class="section activity-box">
        <div class="section-title activity-header">🎈 함께 해봐요!</div>
        <div class="content-text">
            <strong>[${data.activity.title}]</strong><br><br>
            ${data.activity.desc}
        </div>
        <div style="text-align: center;">
            ${gameButton}
        </div>
    </div>
`;
}

// Wait for data script to load if mostly synchronous usually fine, but ensure safety
window.onload = renderPage;
