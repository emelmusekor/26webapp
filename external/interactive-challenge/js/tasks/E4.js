class TaskE4 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🗒️ 데이터 탐험가 (Database)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 데이터</button>
                    <button id="help-btn">?</button>
                </div>
                <h3 id="query-text" style="color:#6c5ce7;"></h3>
            </div>
            
            <div style="max-width:600px; margin:0 auto; max-height:400px; overflow-y:auto; border:1px solid #ccc; border-radius:5px;">
                <table style="width:100%; border-collapse:collapse;">
                    <thead>
                        <tr style="background:#dfe6e9;">
                            <th style="padding:10px;">종류</th>
                            <th>색깔</th>
                            <th>가격</th>
                            <th>선택</th>
                        </tr>
                    </thead>
                    <tbody id="data-table">
                        <!-- Rows -->
                    </tbody>
                </table>
            </div>
            
            <div style="text-align:center; margin-top:20px;">
                <button id="check-btn" style="padding:10px 30px; background:#00b894; color:white; border:none; border-radius:5px; font-size:18px; cursor:pointer;">검색 완료</button>
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
        alert("데이터베이스에서 조건에 맞는 항목을 찾아 체크하세요.\n'검색' 버튼을 누르면 정답을 확인합니다.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = E4_LEVELS.generate(lvl);
        this.items = data.items;
        this.queryText = data.queryText;
        // Eval filter func from string (Security warning in real app, ok here for demo)
        // Or actually, passing function directly via window object if possible?
        // JSON serialization loses functions. So re-implement logic or passing simple criteria object is better.
        // For now, let's parse criteria from queryText simple heuristic or handle in generator better.

        // Fix: Use the filter logic provided by the level generator directly
        // The generator provides a stringified function. We hydrate it.
        // Use structured criteria
        this.criteria = data.criteria;

        // Define filter function based on criteria
        this.filterFunc = (item) => {
            const c = this.criteria;
            if (c.mode === 1) return item.type === c.targetType;
            if (c.mode === 2) return item.type === c.targetType && item.color === c.targetColor;
            if (c.mode === 3) return item.price <= c.targetPrice;
            if (c.mode === 4) return item.color === c.targetColor && item.price <= c.targetPrice;
            return false;
        };

        document.getElementById('query-text').innerText = this.queryText;

        const tbody = document.getElementById('data-table');
        tbody.innerHTML = '';
        this.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding:10px; border-bottom:1px solid #eee; text-align:center;">${item.type}</td>
                <td style="border-bottom:1px solid #eee; text-align:center;">${item.color}</td>
                <td style="border-bottom:1px solid #eee; text-align:center;">${item.price}원</td>
                <td style="border-bottom:1px solid #eee; text-align:center;"><input type="checkbox" class="row-check" data-id="${item.id}"></td>
            `;
            // Click row to toggle check
            tr.onclick = (e) => {
                if (e.target.type !== 'checkbox') {
                    const chk = tr.querySelector('input');
                    chk.checked = !chk.checked;
                }
            };
            tbody.appendChild(tr);
        });
    }

    check() {
        const checks = document.querySelectorAll('.row-check');
        let correct = true;
        let missed = false;

        checks.forEach(chk => {
            const id = parseInt(chk.dataset.id);
            const item = this.items.find(i => i.id === id);
            const shouldBeChecked = this.filterFunc(item);

            if (chk.checked && !shouldBeChecked) correct = false;
            if (!chk.checked && shouldBeChecked) correct = false;
        });

        if (correct) {
            alert("정확하게 데이터를 추출했습니다!");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("조건에 맞지 않는 항목이 있거나, 빠진 항목이 있습니다.");
        }
    }
}
window.onload = () => new TaskE4();
