class TaskD1 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🎁 마니또 찾기 (Link Discovery)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 관계</button>
                    <button id="help-btn">?</button>
                </div>
            </div>
            
            <canvas id="graph-canvas" width="600" height="400" style="border:1px solid #ccc; background:white; border-radius:10px; margin:0 auto; display:block;"></canvas>
            
            <div style="text-align:center; margin-top:10px;">
                <h3 id="question-text"></h3>
                <div id="options-container"></div>
            </div>
        `;

        this.canvas = document.getElementById('graph-canvas');
        this.ctx = this.canvas.getContext('2d');

        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };

        this.loadLevel(1);
    }

    showHelp() {
        alert("화살표를 보고 누가 누구에게 선물을 주는지 확인하세요.\n질문에 맞는 친구를 고르세요!");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = D1_LEVELS.generate(lvl);
        this.people = data.people;
        this.edges = data.edges;

        this.question = data.question;

        document.getElementById('question-text').innerText = this.question.q;

        // Render Graph
        this.renderGraph();

        this.selected = new Set();

        // Render Options
        const opts = document.getElementById('options-container');
        opts.innerHTML = '';
        this.people.forEach(p => {
            const btn = document.createElement('button');
            btn.innerText = p;
            btn.style.cssText = "margin:5px; padding:10px 20px; font-size:16px; cursor:pointer; background:#eee; border:none; border-radius:5px;";
            btn.onclick = () => {
                if (this.selected.has(p)) {
                    this.selected.delete(p);
                    btn.style.background = '#eee';
                    btn.style.color = 'black';
                } else {
                    this.selected.add(p);
                    btn.style.background = '#0984e3';
                    btn.style.color = 'white';
                }
            };
            opts.appendChild(btn);
        });

        // Add Submit Button
        const subBtn = document.createElement('button');
        subBtn.innerText = "✅ 결정";
        subBtn.style.cssText = "display:block; margin:20px auto; padding:10px 40px; background:#00cec9; color:white; border:none; border-radius:5px; font-size:18px; cursor:pointer;";
        subBtn.onclick = () => this.check();
        opts.appendChild(subBtn);
    }

    renderGraph() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 600, 400);

        const cx = 300, cy = 200, r = 150;
        const count = this.people.length;
        const positions = {};

        // Draw Nodes
        this.people.forEach((p, i) => {
            const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            positions[p] = { x, y };

            ctx.fillStyle = '#fab1a0';
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#2d3436';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(p, x, y);
        });

        // Draw Edges
        ctx.strokeStyle = '#0984e3';
        ctx.lineWidth = 2;
        this.edges.forEach(e => {
            const p1 = positions[e.from];
            const p2 = positions[e.to];

            // Draw Line
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Arrowhead (Simple dot at end for now, or true arrow)
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2; // Midpoint slightly closer to target?

            // Arrow
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const headlen = 10;
            const tx = p2.x - 30 * Math.cos(angle); // Adjust for radius
            const ty = p2.y - 30 * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx - headlen * Math.cos(angle - Math.PI / 6), ty - headlen * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(tx - headlen * Math.cos(angle + Math.PI / 6), ty - headlen * Math.sin(angle + Math.PI / 6));
            ctx.fill();
        });
    }

    check() {
        const correctList = this.question.a; // Array
        const userList = Array.from(this.selected);

        // Check exact match
        let isCorrect = true;
        if (userList.length !== correctList.length) isCorrect = false;
        else {
            userList.forEach(u => {
                if (!correctList.includes(u)) isCorrect = false;
            });
        }

        if (isCorrect) {
            alert("정답! 관계를 잘 파악했습니다.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert(`틀렸습니다.\n정답은: ${correctList.join(', ')}`);
        }
    }
}
window.onload = () => new TaskD1();
