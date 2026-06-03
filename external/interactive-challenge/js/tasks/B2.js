class TaskB2 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>📦 문제 쪼개기 (Decomposition)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 문제</button>
                    <button id="help-btn">?</button>
                </div>
                <p>아이템을 올바른 상자에 분류하세요!</p>
            </div>
            
            <div style="display:flex; justify-content:space-around; margin-top:20px; gap:20px;">
                <!-- Buckets -->
                <div id="buckets-container" style="display:flex; gap:20px;"></div>
            </div>
            
            <div style="margin-top:30px; padding:20px; background:#f1f2f6; border-radius:10px; min-height:100px;">
                <div id="items-pool" style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;">
                    <!-- Draggable Items -->
                </div>
            </div>
            
            <div style="text-align:center; margin-top:20px;">
                <button id="check-btn" style="padding:10px 30px; background:#00b894; color:white; border:none; font-size:16px; border-radius:5px; cursor:pointer;">확인</button>
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
        alert("아래에 있는 아이템을 드래그하여, 알맞은 카테고리 상자에 넣으세요.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;

        const data = B2_LEVELS.generate(lvl);
        this.buckets = data.buckets;
        this.items = data.items;

        this.render();
    }

    render() {
        const bucketsContainer = document.getElementById('buckets-container');
        bucketsContainer.innerHTML = '';

        this.buckets.forEach(b => {
            const div = document.createElement('div');
            div.className = 'bucket';
            div.dataset.cat = b.id;
            div.innerHTML = `<h3>${b.label}</h3><div class="bucket-content" style="min-height:100px;"></div>`;
            div.style.cssText = "width:150px; min-height:200px; border:3px dashed #b2bec3; border-radius:10px; background:white; padding:10px; display:flex; flex-direction:column; align-items:center;";

            // Drop logic
            div.ondragover = (e) => e.preventDefault();
            div.ondrop = (e) => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('text');
                const itemEl = document.getElementById(itemId);
                if (itemEl) {
                    div.querySelector('.bucket-content').appendChild(itemEl);
                }
            };

            bucketsContainer.appendChild(div);
        });

        const pool = document.getElementById('items-pool');
        pool.innerHTML = '';
        this.items.forEach(item => {
            const el = document.createElement('div');
            el.id = 'item-' + item.id;
            el.dataset.target = item.category;
            el.className = 'item';
            el.draggable = true;
            el.innerText = item.text;
            el.style.cssText = "padding:10px 15px; background:#74b9ff; color:white; border-radius:20px; cursor:grab; font-weight:bold;";

            el.ondragstart = (e) => {
                e.dataTransfer.setData('text', el.id);
            };

            pool.appendChild(el);
        });

        // Allow dropping back to pool
        pool.ondragover = (e) => e.preventDefault();
        pool.ondrop = (e) => {
            e.preventDefault();
            const itemId = e.dataTransfer.getData('text');
            const itemEl = document.getElementById(itemId);
            if (itemEl) pool.appendChild(itemEl);
        };
    }

    check() {
        const buckets = document.querySelectorAll('.bucket');
        let correct = 0;
        let total = this.items.length;
        let wrong = 0;

        buckets.forEach(b => {
            const targetCat = b.dataset.cat;
            const children = b.querySelector('.bucket-content').children;
            for (let c of children) {
                if (c.dataset.target === targetCat) correct++;
                else wrong++;
            }
        });

        // All items must be placed?
        const poolCount = document.getElementById('items-pool').children.length;

        if (correct === total && wrong === 0 && poolCount === 0) {
            alert("완벽합니다! 모든 물건을 올르게 분류했습니다.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert(`아직 정리가 덜 되었거나 틀린게 있습니다.\n맞은 개수: ${correct}/${total}`);
        }
    }
}
window.onload = () => new TaskB2();
