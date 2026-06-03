class TaskC3 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🔐 암호 해독 (Symbolization)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 암호</button>
                    <button id="help-btn">?</button>
                </div>
            </div>
            
            <div style="text-align:center; padding:20px; background:#dfe6e9; border-radius:10px; margin:20px auto; max-width:500px;">
                <h4>수신된 암호</h4>
                <div id="cipher-text" style="font-size:40px; font-family:monospace; letter-spacing:10px; color:#d63031; font-weight:bold;">???</div>
                <div id="hint-text" style="color:#636e72; margin-top:10px;"></div>
            </div>
            
            <div style="text-align:center;">
                <h4>해독 결과 입력</h4>
                <input type="text" id="user-input" style="font-size:30px; padding:10px; text-align:center; text-transform:uppercase; width:200px;">
                <br>
                <button id="check-btn" style="margin-top:20px; padding:10px 30px; background:#6c5ce7; color:white; border:none; border-radius:5px; font-size:18px;">확인</button>
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
        alert("규칙을 찾아 암호를 원래 단어로 바꾸세요.\n예) A->B (1글자 뒤로 밀기)");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = C3_LEVELS.generate(lvl);
        this.answer = data.word;
        this.encoded = data.encoded;

        document.getElementById('cipher-text').innerText = this.encoded;
        document.getElementById('user-input').value = '';

        let hint = "";
        if (data.type === 'caesar') hint = `힌트: 알파벳을 ${data.shift}칸 뒤로 밀었습니다.`;
        if (data.type === 'reverse') hint = `힌트: 거꾸로 뒤집혔습니다.`;
        if (data.type === 'subst') hint = `힌트: 무작위로 다른 글자로 바뀌었습니다. (어려움)`;

        document.getElementById('hint-text').innerText = hint;
    }

    check() {
        const val = document.getElementById('user-input').value.toUpperCase().trim();
        if (val === this.answer) {
            alert("암호 해독 성공! 첩보원 자질이 있군요.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("틀렸습니다. 다시 생각해보세요.");
        }
    }
}
window.onload = () => new TaskC3();
