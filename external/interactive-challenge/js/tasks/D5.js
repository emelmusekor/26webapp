class TaskD5 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🧸 장난감 교환 (Shortest Path)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 거래</button>
                    <button id="help-btn">?</button>
                </div>
                <p>출발지(Start)에서 도착지(End)까지 <b>비용 합이 가장 작은</b> 길을 찾으세요.</p>
            </div>
            
            <canvas id="graph-canvas" width="600" height="400" style="background:#f1f2f6; border-radius:10px; margin:0 auto; display:block; cursor:pointer; border:1px solid #ccc;"></canvas>
            
            <div style="text-align:center; margin-top:20px;">
                <h3>현재 비용: <span id="current-cost" style="color:#e84393;">0</span></h3>
                <button id="check-btn" style="padding:10px 30px; background:#6c5ce7; color:white; border:none; border-radius:5px; font-size:18px; cursor:pointer;">교환 확정</button>
                <button id="reset-path" style="padding:10px; background:#b2bec3; border:none; boreder-radius:5px; margin-left:10px;">초기화</button>
            </div>
        `;

        this.canvas = document.getElementById('graph-canvas');
        this.ctx = this.canvas.getContext('2d');

        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('check-btn').onclick = () => this.check();
        document.getElementById('reset-path').onclick = () => this.resetPath();
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };

        // Mouse Events for Drag & Drop
        this.canvas.onmousedown = (e) => this.onMouseDown(e);
        this.canvas.onmousemove = (e) => this.onMouseMove(e);
        this.canvas.onmouseup = (e) => this.onMouseUp(e);

        this.loadLevel(1);
    }

    showHelp() {
        alert("원(노드)을 드래그하여 정리할 수 있습니다.\n클릭하여 경로를 만드세요.\n선에 적힌 숫자가 비용입니다.\n합계가 최소가 되어야 합니다!");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = D5_LEVELS.generate(lvl);
        this.nodes = data.nodes;
        this.edges = data.edges;
        this.startNode = data.start;
        this.endNode = data.end;

        this.path = [this.startNode];
        this.resetPath();

        // Find Optimal Cost (Dijkstra) for validation
        this.optimalCost = this.solveDijkstra(this.nodes.length, this.startNode, this.endNode, this.edges);
    }

    resetPath() {
        this.path = [this.startNode];
        this.updateCost();
        this.render();
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 600, 400);

        // Edges
        this.edges.forEach(e => {
            const n1 = this.nodes[e.from];
            const n2 = this.nodes[e.to];

            // Check if active
            const isPath = this.isEdgeInPath(e);

            ctx.strokeStyle = isPath ? '#e84393' : '#b2bec3';
            ctx.lineWidth = isPath ? 4 : 2;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            // Weight Label
            const mx = (n1.x + n2.x) / 2;
            const my = (n1.y + n2.y) / 2;
            ctx.fillStyle = 'white';
            ctx.fillRect(mx - 10, my - 10, 20, 20);
            ctx.fillStyle = isPath ? '#e84393' : '#636e72';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(e.weight, mx, my);
        });

        // Nodes
        this.nodes.forEach(n => {
            const isStart = n.id === this.startNode;
            const isEnd = n.id === this.endNode;
            const inPath = this.path.includes(n.id);

            ctx.fillStyle = isStart ? '#00b894' : (isEnd ? '#d63031' : (inPath ? '#e84393' : '#0984e3'));
            ctx.beginPath();
            ctx.arc(n.x, n.y, 15, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(n.label, n.x, n.y);
        });
    }

    isEdgeInPath(e) {
        for (let i = 0; i < this.path.length - 1; i++) {
            const u = this.path[i];
            const v = this.path[i + 1];
            if ((e.from === u && e.to === v) || (e.from === v && e.to === u)) return true;
        }
        return false;
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    onMouseDown(e) {
        const pos = this.getMousePos(e);
        const clicked = this.nodes.find(n => Math.hypot(n.x - pos.x, n.y - pos.y) < 20);
        if (clicked) {
            this.dragNode = clicked;
            this.isDragging = false;
        }
    }

    onMouseMove(e) {
        if (this.dragNode) {
            const pos = this.getMousePos(e);
            this.dragNode.x = pos.x;
            this.dragNode.y = pos.y;
            this.isDragging = true;
            this.render();
        }
    }

    onMouseUp(e) {
        if (!this.isDragging && this.dragNode) {
            // It was a click
            this.handleNodeClick(this.dragNode);
        }
        this.dragNode = null;
        this.isDragging = false;
    }

    handleNodeClick(clicked) {
        const last = this.path[this.path.length - 1];
        // Check if connected
        const edge = this.edges.find(ed => (ed.from === last && ed.to === clicked.id) || (ed.from === clicked.id && ed.to === last));

        if (edge) {
            this.path.push(clicked.id);
            this.updateCost();
            this.render();
        } else if (clicked.id === last && this.path.length > 1) {
            this.path.pop();
            this.updateCost();
            this.render();
        }
    }

    updateCost() {
        let cost = 0;
        for (let i = 0; i < this.path.length - 1; i++) {
            const u = this.path[i];
            const v = this.path[i + 1];
            const edge = this.edges.find(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));
            if (edge) cost += edge.weight;
        }
        this.currentCost = cost;
        document.getElementById('current-cost').innerText = cost;
    }

    solveDijkstra(N, start, end, edges) {
        const dist = Array(N).fill(Infinity);
        dist[start] = 0;
        const q = Array.from({ length: N }, (_, i) => i);

        while (q.length > 0) {
            // Min dist
            let u = null;
            let minD = Infinity;
            q.forEach(node => {
                if (dist[node] < minD) { minD = dist[node]; u = node; }
            });

            if (u === null) break;
            q.splice(q.indexOf(u), 1);

            if (u === end) return dist[end];

            // Neighbors
            const neighbors = edges.filter(e => e.from === u || e.to === u);
            neighbors.forEach(e => {
                const v = e.from === u ? e.to : e.from;
                if (q.includes(v)) {
                    const alt = dist[u] + e.weight;
                    if (alt < dist[v]) dist[v] = alt;
                }
            });
        }
        return dist[end];
    }

    check() {
        const last = this.path[this.path.length - 1];
        if (last !== this.endNode) {
            alert("도착지에 도달하지 못했습니다.");
            return;
        }

        if (this.currentCost <= this.optimalCost) {
            alert("최고의 거래입니다! (최소 비용)");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert(`비용이 ${this.currentCost}입니다. 더 저렴한 방법(${this.optimalCost})이 있습니다!`);
        }
    }
}
window.onload = () => new TaskD5();
