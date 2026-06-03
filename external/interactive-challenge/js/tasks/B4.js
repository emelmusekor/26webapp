class TaskB4 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🐛 디버깅 탐정 (Debugging & Sequencing)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 문제</button>
                    <button id="help-btn">?</button>
                </div>
                <p>뒤죽박죽 섞인 순서를 올바르게 맞춰주세요.<br>블록을 드래그해서 순서를 바꿀 수 있습니다.</p>
            </div>
            
            <div id="sort-area" style="width:300px; margin:20px auto; min-height:300px; background:#dfe6e9; padding:20px; border-radius:10px; display:flex; flex-direction:column; gap:10px;">
                <!-- Draggable Items -->
            </div>
            
            <div style="text-align:center;">
                <button id="check-btn" style="padding:10px 30px; background:#00b894; color:white; border:none; border-radius:5px; font-size:18px; cursor:pointer;">버그 수정 완료!</button>
                <div id="hint-msg" style="margin-top:10px; color:#e17055; display:none;"></div>
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
        alert("순서가 잘못된 블록들을 드래그해서 올바른 순서로 정렬하세요.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = B4_LEVELS.generate(lvl);
        this.correctOrder = data.correct;
        this.currentItems = data.shuffled;

        this.renderBlocks();
        document.getElementById('hint-msg').style.display = 'none';
        document.getElementById('hint-msg').innerText = "힌트: " + data.hint;
    }

    renderBlocks() {
        const area = document.getElementById('sort-area');
        area.innerHTML = '';

        this.currentItems.forEach((text, i) => {
            const el = document.createElement('div');
            el.className = 'draggable-item';
            el.innerText = text;
            el.style.cssText = "padding:15px; background:white; border-left:5px solid #0984e3; border-radius:5px; cursor:grab; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.1);";
            el.draggable = true;
            el.dataset.index = i;

            // Drag Events
            el.ondragstart = e => {
                e.dataTransfer.setData('srcIdx', i);
                el.style.opacity = '0.5';
            };

            el.ondragend = e => {
                el.style.opacity = '1.0';
                this.renderBlocks(); // Re-render to clean up styles if needed
            };

            // Drop Target Events (Allow reordering)
            el.ondragover = e => {
                e.preventDefault();
                el.style.background = '#81ecec'; // Highlight drop target
            };

            el.ondragleave = e => {
                el.style.background = 'white';
            };

            el.ondrop = e => {
                e.preventDefault();
                const srcIdx = parseInt(e.dataTransfer.getData('srcIdx'));
                const targetIdx = i;

                // Swap in array? Or Move?
                // Let's Move: Remove from src, insert at target.
                const item = this.currentItems.splice(srcIdx, 1)[0];
                this.currentItems.splice(targetIdx, 0, item);

                this.renderBlocks();
            };

            area.appendChild(el);
        });
    }

    check() {
        // Compare currentItems with correctOrder
        let correct = true;
        for (let i = 0; i < this.correctOrder.length; i++) {
            if (this.currentItems[i] !== this.correctOrder[i]) correct = false;
        }

        if (correct) {
            alert("완벽합니다! 버그가 수정되었습니다.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            document.getElementById('hint-msg').style.display = 'block';
            alert("순서가 맞지 않습니다. 힌트를 참고하세요!");
        }
    }
}
window.onload = () => new TaskB4();
