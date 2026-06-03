class TaskB5 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🧹 청소의 달인 (Efficiency)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 재시작</button>
                    <button id="help-btn">?</button>
                </div>
                <p>상자를 클릭하여 로봇에게 나누어 주세요.<br>클릭할 때마다 다음 로봇으로 옮겨집니다. (Pool -> R1 -> R2 -> ... -> Pool)<br><b>모든 로봇이 동시에 일합니다.</b></p>
            </div>
            
            <div id="tasks-pool" style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; padding:20px; min-height:100px; background:#dfe6e9; border-radius:10px; margin-bottom:20px;">
                <!-- Tasks go here -->
            </div>
            
            <div id="workers-container" style="display:flex; justify-content:space-around; gap:20px;">
                <!-- Workers go here -->
            </div>
            
            <div style="text-align:center; margin-top:20px;">
                <h3>전체 소요 시간: <span id="max-time" style="color:#d63031;">0</span>시간</h3>
                <button id="check-btn" style="padding:10px 30px; background:#0984e3; color:white; border:none; border-radius:5px; cursor:pointer;">작업 시작!</button>
            </div>
        `;

        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('check-btn').onclick = () => this.check();
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };

        this.loadLevel(1);
    }

    showHelp() {
        alert("숫자가 적힌 상자를 클릭하면 로봇에게 순서대로 배정됩니다.\n가장 오래 걸리는 로봇의 시간이 전체 소요 시간입니다.\n시간을 최소한으로 줄이세요!");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = B5_LEVELS.generate(lvl);
        this.tasks = data.tasks; // Array of {cost: N}
        // Reset assignments
        this.tasks.forEach(t => t.worker = undefined);

        this.workerCount = data.workers;
        this.workers = Array(this.workerCount).fill(0).map((_, i) => ({ id: i, load: 0, items: [] }));

        this.updateState(); // Render all
    }

    updateState() {
        // Reset worker loads
        this.workers.forEach(w => { w.load = 0; w.items = []; });

        // Calculate loads
        this.tasks.forEach(t => {
            if (t.worker !== undefined) {
                this.workers[t.worker].load += t.cost;
                this.workers[t.worker].items.push(t);
            }
        });

        // Update Max Time
        const loads = this.workers.map(w => w.load);
        const max = Math.max(...loads, 0); // Ensure at least 0
        document.getElementById('max-time').innerText = max;

        this.renderPool();
        this.renderWorkers();
    }

    renderPool() {
        const pool = document.getElementById('tasks-pool');
        pool.innerHTML = '';
        this.tasks.forEach((t, i) => {
            if (t.worker === undefined) {
                const el = document.createElement('div');
                el.innerText = t.cost + "h";
                el.style.cssText = "width:50px; height:50px; background:#fdcb6e; display:flex; justify-content:center; align-items:center; font-weight:bold; cursor:pointer; border-radius:5px; box-shadow:0 2px 5px rgba(0,0,0,0.2);";

                el.onclick = () => {
                    // Click in pool -> Assign to Robot 0
                    t.worker = 0;
                    this.updateState();
                };
                pool.appendChild(el);
            }
        });
    }

    renderWorkers() {
        const wc = document.getElementById('workers-container');
        wc.innerHTML = '';
        this.workers.forEach(w => {
            const dim = document.createElement('div');
            dim.style.cssText = "flex:1; min-height:200px; background:#b2bec3; border-radius:10px; padding:10px; text-align:center; transition: background 0.3s;";

            // Highlight if max load
            const maxLoad = Math.max(...this.workers.map(x => x.load), 0);
            if (w.load === maxLoad && maxLoad > 0) {
                dim.style.border = "3px solid #d63031";
            }

            dim.innerHTML = `
                <h4>🤖 로봇 ${w.id + 1}</h4>
                <div style="font-size:1.2rem; font-weight:bold; color:white; margin-bottom:5px;">${w.load}h</div>
                <div style="background:white; border-radius:5px; height:10px; width:100%; overflow:hidden; margin-bottom:10px;">
                    <div style="background:#00b894; height:100%; width:${Math.min(100, w.load * 10)}%;"></div>
                </div>
                <div class="items-container" style="display:flex; flex-wrap:wrap; gap:5px; justify-content:center;"></div>
            `;

            const itemContainer = dim.querySelector('.items-container');
            w.items.forEach(t => {
                const item = document.createElement('div');
                item.innerText = t.cost;
                item.style.cssText = "width:30px; height:30px; background:#ffeaa7; display:flex; justify-content:center; align-items:center; font-weight:bold; border-radius:3px; cursor:pointer; border:2px solid #fdcb6e;";
                item.onclick = (e) => {
                    e.stopPropagation();
                    // Cycle to next worker
                    let next = w.id + 1;
                    if (next >= this.workerCount) t.worker = undefined; // Return to pool
                    else t.worker = next;

                    this.updateState();
                };
                itemContainer.appendChild(item);
            });

            wc.appendChild(dim);
        });
    }

    check() {
        const loads = this.workers.map(w => w.load);
        const max = Math.max(...loads);
        const min = Math.min(...loads);

        if (this.tasks.some(t => t.worker === undefined)) {
            alert("아직 비어있는 상자가 있습니다. 모두 배분해주세요!");
            return;
        }

        if (max - min <= 2) {
            alert("훌륭합니다! 효율적인 작업 분배입니다. 완료!");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert(`작업 시간이 불균형합니다. (최대: ${max}h, 최소: ${min}h)\n차이를 줄여보세요!`);
        }
    }
}
window.onload = () => new TaskB5();
