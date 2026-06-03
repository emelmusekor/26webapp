// C1 - Ocean Sonar - Refactored
class TaskC1 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }

    init() {
        this.container.innerHTML = '';

        // Header & Controls
        const head = document.createElement('div');
        head.style.textAlign = 'center';
        head.innerHTML = `
            <h2>📡 심해 음파 탐지 (Ocean Sonar)</h2>
            <div style="margin: 15px 0; display:flex; justify-content:center; gap:10px;">
                <label>Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center; padding:5px; font-size:16px;"></label>
                <button id="regen-btn" style="padding:5px 15px; background:#00cec9; border:none; border-radius:4px; color:white; cursor:pointer;">New Map</button>
                <button id="help-btn" style="padding:5px 15px; background:#fab1a0; border:none; border-radius:4px; color:white; font-weight:bold; cursor:pointer;">?</button>
            </div>
            <div style="display:flex; justify-content:center; gap:20px; font-size:1.2em; margin-bottom:10px;">
                <span>목표물: <b id="target-ui" style="color:#fdcb6e;">0</b></span>
                <span>클릭 수: <b id="click-ui">0</b></span>
            </div>
        `;
        this.container.appendChild(head);

        // Grid container
        const gridBox = document.createElement('div');
        gridBox.id = 'sonar-grid';
        gridBox.style.display = 'grid';
        gridBox.style.gap = '2px';
        gridBox.style.margin = '0 auto';
        gridBox.style.padding = '10px';
        gridBox.style.background = '#2d3436';
        gridBox.style.borderRadius = '5px';
        gridBox.style.width = 'fit-content';
        this.container.appendChild(gridBox);

        // Events
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };
        document.getElementById('regen-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();

        this.loadLevel(1);
    }

    showHelp() {
        const modal = document.createElement('div');
        modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:1000;";
        modal.innerHTML = `
            <div style="background:white; padding:30px; border-radius:15px; max-width:400px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
                <h3 style="margin-top:0;">📖 게임 방법</h3>
                <p style="font-size:16px; line-height:1.6; color:#555;">
                    1. 파란색 격자를 <b>클릭</b>하여 탐사합니다.<br>
                    2. 숨겨진 <b>보물(💎)</b>을 모두 찾으면 성공!<br>
                    3. <b>장애물(🪨)</b>은 아무것도 없습니다.<br>
                    4. <b>클릭 횟수</b>를 최소화하여 도전해보세요!
                </p>
                <button id="close-help" style="margin-top:20px; padding:10px 25px; background:#00cec9; color:white; border:none; border-radius:20px; cursor:pointer; font-weight:bold;">알겠어요!</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('close-help').onclick = () => modal.remove();
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;

        // Data Generation
        const size = lvl < 5 ? 5 : (lvl < 10 ? 7 : (lvl < 20 ? 10 : (lvl < 40 ? 12 : 15)));
        const targetCount = 1 + Math.floor(lvl / 5);
        const obsCount = Math.floor(size * size * 0.1) + lvl;

        this.gridSize = size;
        this.targets = [];
        this.obstacles = [];
        this.clicks = 0;
        this.found = 0;
        this.totalTargets = targetCount;

        // Populate
        const all = [];
        for (let i = 0; i < size * size; i++) all.push(i);
        // Shuffle
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }

        this.targets = new Set(all.slice(0, targetCount));
        this.obstacles = new Set(all.slice(targetCount, targetCount + obsCount));

        this.render();
        this.updateUI();
    }

    render() {
        const grid = document.getElementById('sonar-grid');
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${this.gridSize}, 40px)`;

        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const cell = document.createElement('div');
            cell.style.width = '40px';
            cell.style.height = '40px';
            cell.style.background = '#0984e3';
            cell.style.cursor = 'pointer';
            cell.style.display = 'flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            cell.style.fontSize = '20px';
            cell.dataset.idx = i;

            cell.onclick = () => this.scan(i, cell);
            grid.appendChild(cell);
        }
    }

    scan(i, cell) {
        if (cell.classList.contains('scanned')) return;
        cell.classList.add('scanned');
        this.clicks++;

        if (this.targets.has(i)) {
            cell.style.background = '#ffeaa7';
            cell.innerText = '💎';
            this.found++;
            if (this.found >= this.totalTargets) {
                alert(`성공! ${this.clicks}번 만에 모든 보물을 찾았습니다!`);
                // Auto next?
                if (this.level < 50) this.loadLevel(this.level + 1);
            }
        } else if (this.obstacles.has(i)) {
            cell.style.background = '#636e72';
            cell.innerText = '🪨';
        } else {
            cell.style.background = '#00cec9'; // Water

            // Calculate distance to nearest target
            let minDist = Infinity;
            const r = Math.floor(i / this.gridSize);
            const c = i % this.gridSize;

            this.targets.forEach(tIdx => {
                const tr = Math.floor(tIdx / this.gridSize);
                const tc = tIdx % this.gridSize;
                const dist = Math.abs(r - tr) + Math.abs(c - tc); // Manhattan Distance (easier for kids?)
                // Or Euclidean: Math.ceil(Math.hypot(r-tr, c-tc))
                if (dist < minDist) minDist = dist;
            });

            cell.innerText = minDist;
            cell.style.color = '#fff';
            cell.style.fontWeight = 'bold';
        }
        this.updateUI();
    }

    updateUI() {
        document.getElementById('target-ui').innerText = this.totalTargets - this.found;
        document.getElementById('click-ui').innerText = this.clicks;
    }
}

window.onload = () => new TaskC1();
