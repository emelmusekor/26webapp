class TaskD2 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🌳 가계도 꾸미기 (Simplification)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 가계도</button>
                    <button id="help-btn">?</button>
                </div>
                <h3 id="question-text"></h3>
            </div>
            
            <div id="tree-container" style="display:flex; justify-content:center; padding:20px;">
                <!-- Tree -->
            </div>
        `;

        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };

        this.loadLevel(1);
    }

    showHelp() {
        alert("가문의 계보를 보고 질문에 맞는 사람을 클릭하세요.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = D2_LEVELS.generate(lvl);
        this.root = data.root;
        this.targetName = data.targetName;
        this.question = data.question;
        this.startId = data.startId;

        document.getElementById('question-text').innerHTML = this.question; // Use innerHTML for bold tags

        const container = document.getElementById('tree-container');
        container.innerHTML = '';
        container.appendChild(this.renderNode(this.root));
    }

    renderNode(node) {
        const div = document.createElement('div');
        div.style.cssText = "display:flex; flex-direction:column; align-items:center; margin:10px;";

        const box = document.createElement('div');
        box.innerText = node.name;

        let bg = '#fab1a0';
        if (node.id === this.startId) bg = '#ffeaa7'; // Highlight Start

        box.style.cssText = `padding:10px 20px; background:${bg}; border-radius:10px; font-weight:bold; cursor:pointer; border:2px solid #e17055;`;
        if (node.id === this.startId) box.style.border = "4px solid #fdcb6e";

        box.onclick = () => this.check(node.name);

        div.appendChild(box);

        if (node.items && node.items.length > 0) {
            const childrenDiv = document.createElement('div');
            childrenDiv.style.cssText = "display:flex; margin-top:20px; border-top:2px solid #ccc; padding-top:10px;";
            node.items.forEach(c => childrenDiv.appendChild(this.renderNode(c)));
            div.appendChild(childrenDiv);
        }

        return div;
    }

    check(name) {
        const isCorrect = Array.isArray(this.targetName) ? this.targetName.includes(name) : this.targetName === name;

        if (isCorrect) {
            alert("정답입니다!");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("틀렸습니다. 다시 생각해보세요.");
        }
    }
}
window.onload = () => new TaskD2();
