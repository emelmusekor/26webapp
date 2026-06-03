const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let level = 1;
let path = [];
let nodes = [];
let edges = [];
let startNode = 0;
let endNode = 0;
let optimalCost = 0;
let maxLevels = 50;

function resizeCanvas() {
    const container = document.getElementById('main-view');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    requestAnimationFrame(draw);
}
window.addEventListener('resize', resizeCanvas);

function setLevel(lvl) {
    if (!LEVELS[lvl]) return;
    level = lvl;

    // Update Buttons UI - Re-generate pills for 10 levels
    // Update Buttons UI - Re-generate pills for 10 levels
    const select = document.getElementById('level-select');
    if (select.options.length === 0) {
        for (let i = 1; i <= maxLevels; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.innerText = i;
            select.appendChild(opt);
        }
    }
    select.value = level;

    // Load Level Data
    const data = LEVELS[lvl];
    nodes = JSON.parse(JSON.stringify(data.nodes));
    edges = JSON.parse(JSON.stringify(data.edges));
    startNode = data.start;
    endNode = data.end;
    optimalCost = data.optimal;

    resetGame();
}

function resetGame() {
    path = [startNode];
    updateStatus("친구 집에 선물을 전해줘! <br> 사탕을 가장 적게 쓰는 길은?");
    document.getElementById('char-face').style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23ff9f43'/%3E%3Ccircle cx='35' cy='40' r='5' fill='%23333'/%3E%3Ccircle cx='65' cy='40' r='5' fill='%23333'/%3E%3Cpath d='M30 65 Q50 80 70 65' stroke='%23333' stroke-width='3' fill='none'/%3E%3C/svg%3E\")";

    // Remove existing next buttons if any
    const existingNext = document.querySelector('.next-btn');
    if (existingNext) existingNext.remove();
    document.querySelector('.check-btn').style.display = 'inline-block';

    draw();
}

function getCost() {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i + 1];
        const edge = edges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
        if (edge) total += edge.cost;
    }
    return total;
}

function updateStatus(msg, isSuccess) {
    const bubble = document.getElementById('msg-bubble');
    bubble.innerHTML = msg;
    document.getElementById('cost-val').innerText = getCost();

    const face = document.getElementById('char-face');

    if (isSuccess === true) {
        bubble.style.borderColor = "#1dd1a1";
        bubble.style.backgroundColor = "#e0fff4";
        face.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%231dd1a1'/%3E%3Ccircle cx='35' cy='40' r='5' fill='%23fff'/%3E%3Ccircle cx='65' cy='40' r='5' fill='%23fff'/%3E%3Cpath d='M30 65 Q50 85 70 65' stroke='%23fff' stroke-width='3' fill='none'/%3E%3C/svg%3E\")";

        // Show Next Level Button if available
        if (level < maxLevels) {
            const actionArea = document.querySelector('.action-area');
            if (!document.querySelector('.next-btn')) {
                const nextBtn = document.createElement('button');
                nextBtn.className = 'big-btn next-btn';
                nextBtn.innerText = '다음 단계 ➡️';
                nextBtn.onclick = () => setLevel(level + 1);

                document.querySelector('.check-btn').style.display = 'none'; // Hide check
                actionArea.appendChild(nextBtn);
            }
        }

    } else if (isSuccess === false) {
        bubble.style.borderColor = "#ff6b6b";
        bubble.style.backgroundColor = "#fff0f0";
        face.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23ff6b6b'/%3E%3Ccircle cx='35' cy='40' r='5' fill='%23fff'/%3E%3Ccircle cx='65' cy='40' r='5' fill='%23fff'/%3E%3Cpath d='M35 75 Q50 60 65 75' stroke='%23fff' stroke-width='3' fill='none'/%3E%3C/svg%3E\")";
    } else {
        bubble.style.borderColor = "#48dbfb";
        bubble.style.backgroundColor = "#fff";
    }
}

function checkWin() {
    const currentCost = getCost();
    const lastNode = path[path.length - 1];

    if (lastNode !== endNode) {
        updateStatus("아직 친구 집에 도착하지 못했어! 🏠", false);
        return;
    }

    if (currentCost <= optimalCost) {
        updateStatus(`정답이야! 짝짝짝! 👏<br>사탕 ${currentCost}개로 도착했어!`, true);
    } else {
        updateStatus(`도착은 했지만... 🤔<br>사탕을 더 아낄 수 있는 길이 있어!`, false);
    }
}

// Interaction & Drag-n-Drop
let draggedNode = null;
let isDragging = false;

canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check node click
    const clickedNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 40);

    if (clickedNode) {
        draggedNode = clickedNode;
        isDragging = false; // Start assumption
    }
});

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Change cursor
    const hovering = nodes.some(n => Math.hypot(n.x - x, n.y - y) < 40);
    canvas.style.cursor = hovering ? 'grab' : 'default';

    if (draggedNode) {
        isDragging = true;
        draggedNode.x = x;
        draggedNode.y = y;
        canvas.style.cursor = 'grabbing';
        requestAnimationFrame(draw);
    }
});

canvas.addEventListener('mouseup', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // If it was a click (not a drag), process game logic
    if (draggedNode && !isDragging) {
        // Game Logic (Click to Select)
        const clickedNode = draggedNode;
        const last = path[path.length - 1];

        // Backtrack
        if (path.length > 1 && clickedNode.id === path[path.length - 2]) {
            path.pop();
            updateStatus("친구 집에 선물을 전해줘! <br> 사탕을 가장 적게 쓰는 길은?");
        }
        // Check connection
        else {
            const connected = edges.find(e => (e.u === last && e.v === clickedNode.id) || (e.u === clickedNode.id && e.v === last));
            if (connected && !path.includes(clickedNode.id)) {
                path.push(clickedNode.id);
            }
        }
        document.getElementById('cost-val').innerText = getCost();
    }

    draggedNode = null;
    isDragging = false;
    draw();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Edges
    edges.forEach(e => {
        const u = nodes.find(n => n.id === e.u);
        const v = nodes.find(n => n.id === e.v);

        const isPath = checkIsPath(e);

        ctx.beginPath();
        ctx.moveTo(u.x, u.y);
        ctx.lineTo(v.x, v.y);

        if (isPath) {
            ctx.strokeStyle = '#ff9f43';
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
        } else {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 15; // Thicker for better visibility
            ctx.lineCap = 'round';
            ctx.stroke(); // Stroke white background first

            ctx.strokeStyle = '#fff'; // Redundant but safe
            ctx.lineWidth = 8;
        }
        ctx.stroke();

        // Candy Icon on path
        const midX = (u.x + v.x) / 2;
        const midY = (u.y + v.y) / 2;

        // Draw candy bubble
        ctx.beginPath();
        ctx.arc(midX, midY, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '20px Arial';
        ctx.fillStyle = '#ff6b6b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.cost, midX, midY + 1);

        // Small candy
        ctx.font = '12px Arial';
        ctx.fillText('🍬', midX, midY - 15);
    });

    // Draw Nodes
    nodes.forEach(n => {
        // Shadow
        ctx.beginPath();
        ctx.arc(n.x, n.y + 5, 40, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fill();

        // Circle bg
        ctx.beginPath();
        ctx.arc(n.x, n.y, 40, 0, Math.PI * 2);
        ctx.fillStyle = (path.includes(n.id)) ? '#ffeaa7' : '#fff';

        if (n.id === startNode) ctx.fillStyle = '#74b9ff';
        if (n.id === endNode) ctx.fillStyle = '#ff7675';

        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // Label
        ctx.font = 'bold 16px Jua';
        ctx.fillStyle = (n.id === startNode || n.id === endNode) ? '#fff' : '#555';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + 5);

        // Icon (Home/Star)
        if (n.id === startNode) ctx.fillText('🏠', n.x, n.y - 15);
        else if (n.id === endNode) ctx.fillText('🎁', n.x, n.y - 15);
    });
}

function checkIsPath(edge) {
    for (let i = 0; i < path.length - 1; i++) {
        if ((path[i] === edge.u && path[i + 1] === edge.v) ||
            (path[i] === edge.v && path[i + 1] === edge.u)) {
            return true;
        }
    }
    return false;
}

// Init
resizeCanvas();
setLevel(1);
