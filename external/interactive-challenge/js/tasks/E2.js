class TaskE2 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🎨 픽셀 아트 (Representation)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 그림</button>
                    <button id="help-btn">?</button>
                </div>
            </div>
            
             <div style="display:flex; justify-content:center; gap:40px; margin-top:20px;">
                <div style="text-align:center;">
                    <h4>목표 그림</h4>
                     <canvas id="target-canvas" width="200" height="200" style="border:1px solid #ccc;"></canvas>
                </div>
                
                <div style="text-align:center;">
                    <h4>나의 그림 (클릭해서 그리기)</h4>
                     <canvas id="my-canvas" width="200" height="200" style="border:1px solid #ccc; cursor:pointer;"></canvas>
                </div>
            </div>
            
            <div style="text-align:center; margin-top:20px;">
                <button id="check-btn" style="padding:10px 30px; background:#e84393; color:white; border:none; border-radius:5px; font-size:18px; cursor:pointer;">제출하기</button>
            </div>
        `;

        this.tCanvas = document.getElementById('target-canvas');
        this.mCanvas = document.getElementById('my-canvas');
        this.tCtx = this.tCanvas.getContext('2d');
        this.mCtx = this.mCanvas.getContext('2d');

        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('check-btn').onclick = () => this.check();
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };
        this.mCanvas.onclick = (e) => this.onClick(e);

        this.loadLevel(1);
    }

    showHelp() {
        alert("왼쪽의 목표 그림과 똑같이 만드세요.\n칸을 클릭하면 검은색/흰색이 바뀝니다.\n컴퓨터 화면이 0과 1로 그림을 그리는 원리입니다.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = E2_LEVELS.generate(lvl);
        this.size = data.size;
        this.targetGrid = data.grid;
        this.myGrid = Array(this.size * this.size).fill(0);

        this.render(this.tCtx, this.targetGrid);
        this.render(this.mCtx, this.myGrid);
    }

    render(ctx, grid) {
        const cellSize = 200 / this.size;
        ctx.clearRect(0, 0, 200, 200);

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const idx = r * this.size + c;
                ctx.fillStyle = grid[idx] ? '#2d3436' : '#fff';
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
    }

    onClick(e) {
        const rect = this.mCanvas.getBoundingClientRect();
        const cellSize = 200 / this.size;
        const c = Math.floor((e.clientX - rect.left) / cellSize);
        const r = Math.floor((e.clientY - rect.top) / cellSize);

        const idx = r * this.size + c;
        if (idx >= 0 && idx < this.myGrid.length) {
            this.myGrid[idx] = 1 - this.myGrid[idx];
            this.render(this.mCtx, this.myGrid);
        }
    }

    check() {
        let correct = true;
        for (let i = 0; i < this.targetGrid.length; i++) {
            if (this.targetGrid[i] !== this.myGrid[i]) correct = false;
        }

        if (correct) {
            alert("완벽합니다! 픽셀 아티스트시군요.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("그림이 다릅니다. 다시 확인하세요.");
        }
    }
}
window.onload = () => new TaskE2();
