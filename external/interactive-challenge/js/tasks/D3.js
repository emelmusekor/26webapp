class TaskD3 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🕸️ 먹이사슬 (Network)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 생태계</button>
                    <button id="help-btn">?</button>
                </div>
                <h3 id="question-text"></h3>
            </div>
            
            <canvas id="net-canvas" width="600" height="400" style="border:1px solid #ccc; background:#f9f9f9; border-radius:10px; margin:0 auto; display:block; cursor:pointer;"></canvas>
        `;

        this.canvas = document.getElementById('net-canvas');
        this.ctx = this.canvas.getContext('2d');

        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };
        this.canvas.onclick = (e) => this.onClick(e);

        this.loadLevel(1);
    }

    showHelp() {
        alert("화살표는 에너지의 흐름(먹힘 -> 먹음)을 나타냅니다.\n질문에 맞는 동물을 클릭하세요.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = D3_LEVELS.generate(lvl);
        this.nodes = data.nodes;
        this.edges = data.edges;
        this.question = data.question;

        document.getElementById('question-text').innerText = this.question.q;

        // Layout
        const tiers = {};
        this.nodes.forEach(n => {
            if (!tiers[n.layer]) tiers[n.layer] = [];
            tiers[n.layer].push(n);
        });

        const layerCount = Object.keys(tiers).length;
        const hStep = 600 / (layerCount + 1); // Horizontal layers? Or Vertical?
        // Food chain usually vertical: Bottom producers up to Apex
        const vStep = 350 / (layerCount);

        for (let l in tiers) {
            const list = tiers[l];
            const wStep = 600 / (list.length + 1);
            list.forEach((n, i) => {
                n.x = wStep * (i + 1);
                n.y = 350 - (n.layer * vStep) - 50; // Bottom up
                n.w = 80;
                n.h = 40;
            });
        }

        this.render();
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 600, 400);

        // Edges
        ctx.strokeStyle = '#636e72'; // Darker for visibility
        ctx.lineWidth = 3; // Thicker
        this.edges.forEach(e => {
            const n1 = this.nodes.find(n => n.id === e.from);
            const n2 = this.nodes.find(n => n.id === e.to);

            // Arrow
            const angle = Math.atan2(n2.y - n1.y, n2.x - n1.x);
            // Line
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x - 40 * Math.cos(angle), n2.y - 20 * Math.sin(angle)); // Stop at box edge roughly
            ctx.stroke();

            // Head (Triangle)
            const tx = n2.x - 45 * Math.cos(angle);
            const ty = n2.y - 25 * Math.sin(angle);

            ctx.fillStyle = '#636e72';
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx - 10 * Math.cos(angle - Math.PI / 6), ty - 10 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(tx - 10 * Math.cos(angle + Math.PI / 6), ty - 10 * Math.sin(angle + Math.PI / 6));
            ctx.fill();
        });

        // Nodes
        this.nodes.forEach(n => {
            ctx.fillStyle = n.layer === 0 ? '#55efc4' : (n.layer === 1 ? '#ffeaa7' : '#ff7675');
            ctx.fillRect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h);
            ctx.strokeRect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h);

            ctx.fillStyle = '#2d3436';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '14px sans-serif';
            ctx.fillText(n.label, n.x, n.y);
        });
    }

    onClick(e) {
        if (this.isProcessing) return;
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        for (let n of this.nodes) {
            if (mx >= n.x - n.w / 2 && mx <= n.x + n.w / 2 &&
                my >= n.y - n.h / 2 && my <= n.y + n.h / 2) {
                this.check(n.id);
                return;
            }
        }
    }

    check(id) {
        // Support array of valid answers
        const valid = Array.isArray(this.question.a) ? this.question.a.includes(id) : this.question.a === id;

        if (valid) {
            alert("정답! 생태계의 흐름을 이해하셨군요.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("틀렸습니다. 화살표 방향을 다시 확인하세요.");
        }
    }
}
window.onload = () => new TaskD3();
