class TaskE5 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🤖 인공지능 트레이닝 (AI)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 데이터</button>
                    <button id="help-btn">?</button>
                </div>
            </div>
            
            <div style="display:flex; justify-content:center; gap:20px; margin-top:20px;">
                <div style="background:#dfe6e9; padding:20px; border-radius:10px;">
                    <h3>학습 데이터 (Training Data)</h3>
                    <div id="training-set" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;"></div>
                </div>
            </div>
            
            <div style="text-align:center; margin-top:30px;">
                <h3>이것은 어느 그룹일까요? (Test)</h3>
                <div id="test-item" style="width:100px; height:100px; margin:10px auto; background:#fff; border:2px solid #333; display:flex; justify-content:center; align-items:center;"></div>
                <div style="margin-top:10px; display:flex; justify-content:center; gap:20px;">
                    <button id="btn-a" style="padding:15px 40px; font-size:20px; background:#0984e3; color:white; border:none; border-radius:10px; cursor:pointer;">A 그룹</button>
                    <button id="btn-b" style="padding:15px 40px; font-size:20px; background:#e84393; color:white; border:none; border-radius:10px; cursor:pointer;">B 그룹</button>
                </div>
            </div>
        `;

        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('btn-a').onclick = () => this.check('A');
        document.getElementById('btn-b').onclick = () => this.check('B');
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };

        this.loadLevel(1);
    }

    showHelp() {
        alert("학습 데이터를 보고 규칙을 찾으세요.\n(예: 빨간색은 A, 파란색은 B)\n규칙에 따라 테스트 데이터의 그룹을 맞추세요.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;

        try {
            if (typeof E5_LEVELS === 'undefined') {
                throw new Error("Level generator not found");
            }

            const data = E5_LEVELS.generate(lvl);
            if (!data || !data.training) {
                throw new Error("No training data generated");
            }

            this.training = data.training;
            this.test = data.test;
            this.answer = data.answer;

            this.renderTraining();
            this.renderTest();
        } catch (e) {
            console.error(e);
            alert("레벨 데이터 생성 오류: " + e.message);
        }
    }

    createItemEl(item, showLabel = false) {
        const el = document.createElement('div');
        el.style.cssText = "width:60px; height:60px; background:#fff; border:1px solid #ccc; display:flex; flex-direction:column; justify-content:center; align-items:center;";

        const shape = document.createElement('div');
        shape.style.width = '40px';
        shape.style.height = '40px';
        shape.style.backgroundColor = item.color === 'red' ? '#ff7675' : '#0984e3';
        shape.style.borderRadius = item.shape === 'circle' ? '50%' : '0%';

        el.appendChild(shape);

        if (showLabel) {
            const lbl = document.createElement('div');
            lbl.innerText = item.group;
            lbl.style.fontWeight = 'bold';
            lbl.style.color = item.group === 'A' ? '#0984e3' : '#e84393';
            el.appendChild(lbl);
        }
        return el;
    }

    renderTraining() {
        const c = document.getElementById('training-set');
        c.innerHTML = '';
        this.training.forEach(t => {
            c.appendChild(this.createItemEl(t, true));
        });
    }

    renderTest() {
        const c = document.getElementById('test-item');
        c.innerHTML = '';
        const item = this.createItemEl(this.test, false);
        item.style.border = 'none';
        item.style.width = '100px';
        item.style.height = '100px';
        item.firstChild.style.width = '80px';
        item.firstChild.style.height = '80px';
        c.appendChild(item);
    }

    check(choice) {
        if (choice === this.answer) {
            alert("정답! 인공지능 모델이 학습되었습니다.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("틀렸습니다. 학습 데이터를 다시 살펴보세요.");
        }
    }
}
window.onload = () => new TaskE5();
