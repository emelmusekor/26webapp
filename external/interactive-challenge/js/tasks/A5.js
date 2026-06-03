class TaskA5 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>📷 베스트 포토그래퍼 (Optimization)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="snap-btn" style="background:#e84393; color:white; border:none; padding:5px 15px; border-radius:5px;">📸 찰칵!</button>
                    <button id="new-btn">🔄 새 장소</button>
                    <button id="help-btn">?</button>
                </div>
                <div>보이는 별: <span id="score-display">0</span> / <span id="total-display">0</span></div>
            </div>
            <div style="position:relative; width:400px; height:400px; background:#f1f2f6; margin:0 auto; border:2px solid #ccc; cursor:crosshair;" id="scene">
                <canvas id="cam-canvas" width="400" height="400"></canvas>
            </div>
        `;

        this.canvas = document.getElementById('cam-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.camPos = { x: 200, y: 350 };

        this.canvas.onmousemove = (e) => {
            if (this.isLocked) return;
            const rect = this.canvas.getBoundingClientRect();
            this.camPos.x = e.clientX - rect.left;
            this.camPos.y = e.clientY - rect.top;
            this.render();
        };

        this.canvas.onclick = (e) => {
            this.isLocked = !this.isLocked;
            if (this.isLocked) {
                // visual feedback
                this.render();
            }
        };

        document.getElementById('snap-btn').onclick = () => this.check();
        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };

        this.loadLevel(1);
    }

    showHelp() {
        alert("마우스를 움직여 카메라 위치를 잡으세요.\n회색 벽에 가려지지 않고 별이 가장 많이 보이는 곳을 찾으세요!\n준비되면 '찰칵' 버튼을 누르세요.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = A5_LEVELS.generate(lvl);
        this.stars = data.stars;
        this.walls = data.walls;
        this.threshold = data.threshold;
        document.getElementById('total-display').innerText = this.stars.length;
        this.render();
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 400, 400);

        // Walls
        ctx.fillStyle = '#636e72';
        this.walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));

        // Stars and Visibility Raycast
        let visibleCount = 0;
        this.stars.forEach(s => {
            if (this.checkVisible(this.camPos, s, this.walls)) {
                ctx.fillStyle = '#f1c40f'; // Visible Gold
                visibleCount++;
            } else {
                ctx.fillStyle = '#b2bec3'; // Blocked Grey
            }

            // Draw Star shape
            ctx.beginPath();
            ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Camera
        ctx.fillStyle = '#e84393';
        ctx.beginPath();
        ctx.arc(this.camPos.x, this.camPos.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // POV Lines (Visual Aid)
        ctx.strokeStyle = 'rgba(232, 67, 147, 0.1)';
        this.stars.forEach(s => {
            ctx.beginPath();
            ctx.moveTo(this.camPos.x, this.camPos.y);
            ctx.lineTo(s.x, s.y);
            ctx.stroke();
        });

        document.getElementById('score-display').innerText = visibleCount;
        this.currentScore = visibleCount;
    }

    checkVisible(p1, p2, walls) {
        // Line Segment Intersection
        // Ray from p1 to p2
        // Check against all walls (4 lines each)
        for (let w of walls) {
            // Simplified: Check intersection with Rect
            if (this.lineRectIntersect(p1.x, p1.y, p2.x, p2.y, w.x, w.y, w.w, w.h)) return false;
        }
        return true;
    }

    lineRectIntersect(x1, y1, x2, y2, rx, ry, rw, rh) {
        // Check if line (x1,y1)-(x2,y2) intersects rect (rx,ry,rw,rh)
        // Liang-Barsky or just check 4 sides
        const left = this.lineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
        const right = this.lineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
        const top = this.lineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
        const bottom = this.lineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

        // Also check if point is inside? No need if walls are blockers and stars outside
        return left || right || top || bottom;
    }

    lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
    }

    check() {
        const goal = Math.ceil(this.stars.length * this.threshold);
        if (this.currentScore >= goal) {
            alert(`찰칵! ${this.currentScore}개의 별을 담았습니다. 성공!`);
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert(`아쉽습니다. ${goal}개 이상의 별이 보여야 합니다. 위치를 옮겨보세요!`);
        }
    }
}
window.onload = () => new TaskA5();
