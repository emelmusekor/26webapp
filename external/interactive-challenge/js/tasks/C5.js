class TaskC5 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>📏 데이터 꽉꽉 (Compression)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 데이터</button>
                    <button id="help-btn">?</button>
                </div>
            </div>
            
             <div style="text-align:center; padding:20px; background:#81ecec; border-radius:10px; margin:20px auto; max-width:500px;">
                <h4>원본 데이터</h4>
                <div id="raw-text" style="font-size:30px; font-family:monospace; color:#2d3436; font-weight:bold; word-break:break-all;"></div>
            </div>
            
            <div style="text-align:center;">
                <h4>압축된 데이터 입력 (예: 5A3B)</h4>
                <input type="text" id="user-input" style="font-size:30px; padding:10px; text-align:center; text-transform:uppercase; width:200px;">
                <br>
                <button id="check-btn" style="margin-top:20px; padding:10px 30px; background:#00b894; color:white; border:none; border-radius:5px; font-size:18px;">압축하기</button>
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
        alert("반복되는 문자를 '숫자+문자' 형태로 줄여보세요.\n예) AAAAA -> 5A\n이것을 '런-렝스 인코딩(RLE)'이라고 합니다.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = C5_LEVELS.generate(lvl);
        this.raw = data.raw;
        this.answer = data.answer;

        document.getElementById('raw-text').innerText = this.raw;
        document.getElementById('user-input').value = '';
    }

    check() {
        const val = document.getElementById('user-input').value.toUpperCase().trim();
        if (val === this.answer) {
            alert(`압축 성공! ${this.raw.length}글자를 ${this.answer.length}글자로 줄였습니다.`);
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("압축 결과가 다릅니다. 다시 확인하세요.");
        }
    }
}
window.onload = () => new TaskC5();
