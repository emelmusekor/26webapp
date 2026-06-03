class TaskA3 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🌀 미로 탈출 시뮬레이션 (Simulation)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새로운 미로</button>
                    <button id="help-btn">?</button>
                </div>
            </div>
            
            <div style="display:flex; justify-content:center; gap:20px;">
                <canvas id="maze-canvas" width="500" height="500" style="background:#2d3436; border-radius:10px;"></canvas>
                
                <div style="width:150px; text-align:center;">
                    <h4>명령어 입력</h4>
                    <div id="cmd-list" style="height:250px; overflow-y:auto; background:#f1f2f6; border:1px solid #ccc; margin-bottom:10px;"></div>
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px;">
                        <div></div>
                        <button class="cmd-btn" data-dir="UP">⬆️</button>
                        <div></div>
                        <button class="cmd-btn" data-dir="LEFT">⬅️</button>
                        <button class="cmd-btn" data-dir="DOWN">⬇️</button>
                        <button class="cmd-btn" data-dir="RIGHT">➡️</button>
                    </div>
                    <button id="run-sim" style="width:100%; margin-top:10px; padding:10px; background:#e17055; color:white; border:none; font-weight:bold; cursor:pointer;">▶️ 실행 (Run)</button>
                    <button id="reset-sim" style="width:100%; margin-top:5px; padding:5px; background:#b2bec3;">초기화</button>
                </div>
            </div>
        `;

        this.canvas = document.getElementById('maze-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cmds = [];

        document.querySelectorAll('.cmd-btn').forEach(b => {
            b.onclick = () => this.addCmd(b.dataset.dir);
        });
        document.getElementById('run-sim').onclick = () => this.run();
        document.getElementById('reset-sim').onclick = () => { this.cmds = []; this.renderCmds(); this.player = { ...this.start }; this.render(); };

        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };
        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level);
        document.getElementById('help-btn').onclick = () => this.showHelp();

        window.game = this; // Hack for HTML onchange
        this.loadLevel(1);
    }

    showHelp() {
        alert("1. 화살표 버튼을 눌러 이동 계획을 세우세요.\n2. '실행' 버튼을 누르면 로봇이 움직입니다.\n3. 벽에 부딪히지 않고 도착지(빨강)에 가야 합니다.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = A3_LEVELS.generate(lvl);
        this.size = data.size || 15; // Default fallback
        this.grid = data.grid;
        this.start = data.start;
        this.end = data.end;
        this.fogRadius = (data.fogRadius !== undefined) ? data.fogRadius : 4;

        // Safety check for grid length
        if (!this.grid || this.grid.length !== this.size * this.size) {
            console.error("Grid size mismatch!", this.size, this.grid ? this.grid.length : "null");
            // Regenerate or fallback? Let's just create empty room
            this.grid = Array(this.size * this.size).fill(0);
        }

        this.player = { ...this.start };
        this.cmds = [];
        this.renderCmds();

        // Force clear/redraw
        if (this.ctx) {
            this.ctx.clearRect(0, 0, 500, 500);
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, 500, 500);
        }
        this.render();
    }

    addCmd(dir) {
        this.cmds.push(dir);
        this.renderCmds();
    }

    renderCmds() {
        const list = document.getElementById('cmd-list');
        const arrows = { UP: '⬆️', DOWN: '⬇️', LEFT: '⬅️', RIGHT: '➡️' };
        list.innerHTML = this.cmds.map((c, i) => `<div style="padding:2px;">${i + 1}. ${arrows[c]}</div>`).join('');
        list.scrollTop = list.scrollHeight;
    }

    render() {
        const ctx = this.ctx;
        const pad = 500 / this.size;
        ctx.clearRect(0, 0, 500, 500);

        // Fog Background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 500, 500);

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                // Fog Calculation
                const dist = Math.sqrt((r - this.player.r) ** 2 + (c - this.player.c) ** 2);

                // Show if within radius
                if (dist <= this.fogRadius || (r === this.start.r && c === this.start.c) || (r === this.end.r && c === this.end.c)) {
                    if (this.grid[r * this.size + c] === 1) {
                        ctx.fillStyle = '#636e72';
                        ctx.fillRect(c * pad, r * pad, pad, pad);
                    } else {
                        ctx.fillStyle = '#dfe6e9'; // Path
                        ctx.fillRect(c * pad, r * pad, pad, pad);
                    }

                    // Show End if visible
                    if (r === this.end.r && c === this.end.c) {
                        ctx.fillStyle = '#d63031';
                        ctx.fillRect(c * pad + 5, r * pad + 5, pad - 10, pad - 10);
                    }

                    // Show Start if visible
                    if (r === this.start.r && c === this.start.c) {
                        ctx.fillStyle = '#00b894';
                        ctx.fillRect(c * pad + 5, r * pad + 5, pad - 10, pad - 10);
                    }
                }
            }
        }

        // Player (Always visible)
        ctx.fillStyle = '#0984e3';
        ctx.beginPath();
        ctx.arc(this.player.c * pad + pad / 2, this.player.r * pad + pad / 2, pad / 3, 0, Math.PI * 2);
        ctx.fill();
    }

    async run() {
        this.player = { ...this.start };
        for (let cmd of this.cmds) {
            let nr = this.player.r, nc = this.player.c;
            if (cmd === 'UP') nr--;
            if (cmd === 'DOWN') nr++;
            if (cmd === 'LEFT') nc--;
            if (cmd === 'RIGHT') nc++;

            // Check Wall
            if (this.grid[nr * this.size + nc] === 1) {
                alert("쿵! 벽에 부딪혔습니다.");
                return;
            }

            this.player.r = nr;
            this.player.c = nc;
            this.render();
            await new Promise(r => setTimeout(r, 300));

            if (this.player.r === this.end.r && this.player.c === this.end.c) {
                alert("도착! 시뮬레이션 성공!");
                if (this.level < 50) this.loadLevel(Number(this.level) + 1);
                return;
            }
        }
        alert("도착하지 못했습니다.");
    }
}
window.onload = () => new TaskA3();
