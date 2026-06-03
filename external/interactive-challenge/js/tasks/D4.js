class TaskD4 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🔌 모두 연결하기 (Connectivity)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 마을</button>
                    <button id="help-btn">?</button>
                    <button id="reset-lines-btn" style="background:#ff7675;color:white;border:none;border-radius:4px;width:30px;height:30px;">X</button>
                </div>
                <p>집들을 클릭하고 드래그하여 전선을 연결하세요. 모든 집이 이어져야 합니다!</p>
            </div>
            
            <canvas id="conn-canvas" width="600" height="400" style="border:1px solid #ccc; background:#2d3436; border-radius:10px; margin:0 auto; display:block; cursor:crosshair;"></canvas>
            
            <div style="text-align:center; margin-top:20px;">
                <button id="check-conn" style="padding:10px 30px; background:#00cec9; color:white; border:none; font-size:16px; border-radius:5px; cursor:pointer;">전원 켜기</button>
            </div>
        `;

        this.canvas = document.getElementById('conn-canvas');
        this.ctx = this.canvas.getContext('2d');

        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('check-conn').onclick = () => this.check();
        document.getElementById('reset-lines-btn').onclick = () => { this.edges = []; this.render(); };
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };

        // Interaction
        this.isDragging = false;
        this.dragStart = null;

        this.canvas.onmousedown = (e) => this.onDown(e);
        this.canvas.onmousemove = (e) => this.onMove(e);
        this.canvas.onmouseup = (e) => this.onUp(e);

        this.loadLevel(1);
    }

    showHelp() {
        alert("모든 집(원)이 예외 없이 연결되어야 합니다.\n최소한의 선으로 연결하면 더 좋습니다!");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = D4_LEVELS.generate(lvl);
        this.nodes = data.nodes;
        this.edges = []; // User creates edges
        this.render();
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 600, 400);

        // Edges
        ctx.strokeStyle = '#fdcb6e';
        ctx.lineWidth = 3;
        this.edges.forEach(e => {
            const n1 = this.nodes[e.from];
            const n2 = this.nodes[e.to];
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
        });

        // Drag line
        if (this.isDragging && this.dragStart !== null) {
            ctx.strokeStyle = 'rgba(253, 203, 110, 0.5)';
            ctx.beginPath();
            ctx.moveTo(this.nodes[this.dragStart].x, this.nodes[this.dragStart].y);
            ctx.lineTo(this.currX, this.currY);
            ctx.stroke();
        }

        // Nodes
        this.nodes.forEach(n => {
            ctx.fillStyle = '#0984e3';
            ctx.beginPath();
            ctx.arc(n.x, n.y, 15, 0, Math.PI * 2);
            ctx.fill();

            // House icon
            ctx.fillStyle = 'white';
            ctx.font = '16px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🏠', n.x, n.y);
        });
    }

    getPos(e) {
        const r = this.canvas.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    getNodeAt(x, y) {
        return this.nodes.findIndex(n => Math.hypot(n.x - x, n.y - y) < 20);
    }

    onDown(e) {
        const p = this.getPos(e);
        const idx = this.getNodeAt(p.x, p.y);
        if (idx !== -1) {
            this.isDragging = true;
            this.dragStart = idx;
        }
    }

    onMove(e) {
        if (this.isDragging) {
            const p = this.getPos(e);
            this.currX = p.x;
            this.currY = p.y;
            this.render();
        }
    }

    onUp(e) {
        if (this.isDragging) {
            const p = this.getPos(e);
            const idx = this.getNodeAt(p.x, p.y);
            if (idx !== -1 && idx !== this.dragStart) {
                // Add Edge
                // Avoid duplicates
                const exists = this.edges.some(e => (e.from === this.dragStart && e.to === idx) || (e.from === idx && e.to === this.dragStart));
                if (!exists) {
                    this.edges.push({ from: this.dragStart, to: idx });
                }
            }
            this.isDragging = false;
            this.dragStart = null;
            this.render();
        }
    }

    check() {
        // Connectivity Check (BFS)
        if (this.nodes.length === 0) return;
        const visited = new Set();
        const queue = [0];
        visited.add(0);

        while (queue.length > 0) {
            const curr = queue.shift();
            // Find neighbors
            this.edges.forEach(e => {
                let next = -1;
                if (e.from === curr) next = e.to;
                if (e.to === curr) next = e.from;

                if (next !== -1 && !visited.has(next)) {
                    visited.add(next);
                    queue.push(next);
                }
            });
        }

        if (visited.size === this.nodes.length) {
            alert("전원 공급 완료! 모든 마을이 연결되었습니다.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert(`아직 연결되지 않은 마을이 있습니다. (${visited.size} / ${this.nodes.length})`);
        }
    }
}
window.onload = () => new TaskD4();
