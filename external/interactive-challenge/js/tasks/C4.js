class TaskC4 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>✅ OX 퀴즈 탐정 (Verification)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 문제</button>
                    <button id="help-btn">?</button>
                </div>
            </div>
            
            <div style="text-align:center; padding:50px; background:#fab1a0; border-radius:20px; font-size:30px; font-weight:bold; color:white; margin:20px auto; max-width:600px;">
                <span id="quiz-text">Loading...</span>
            </div>
            
            <div style="display:flex; justify-content:center; gap:20px; margin-top:30px;">
                <button id="btn-o" style="width:100px; height:100px; border-radius:50%; font-size:50px; border:none; background:#0984e3; color:white; cursor:pointer;">O</button>
                <button id="btn-x" style="width:100px; height:100px; border-radius:50%; font-size:50px; border:none; background:#d63031; color:white; cursor:pointer;">X</button>
            </div>
        `;

        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('btn-o').onclick = () => this.check(true);
        document.getElementById('btn-x').onclick = () => this.check(false);
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };

        this.loadLevel(1);
    }

    showHelp() {
        alert("명제가 참(True)이면 O, 거짓(False)이면 X를 누르세요.\n컴퓨터 논리(AND, OR, NOT)를 검증합니다.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = C4_LEVELS.generate(lvl);
        this.answer = data.a;
        document.getElementById('quiz-text').innerText = data.q;
    }

    check(choice) {
        if (choice === this.answer) {
            alert("정답입니다! 논리적입니다.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("오답입니다. 다시 검증하세요.");
        }
    }
}
window.onload = () => new TaskC4();
