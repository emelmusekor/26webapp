class TaskA1 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🕵️ 탐정 놀이: 몽타주 만들기 (Data Scanning)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새로운 용의자</button>
                    <button id="help-btn">?</button>
                </div>
            </div>
            <div style="display:flex; justify-content:center; gap:20px;">
                <div style="border:2px solid #555; padding:10px; border-radius:10px;">
                    <h4>목격 진술 (Target)</h4>
                    <div id="target-desc" style="font-size:14px; width:200px; text-align:left;"></div>
                    <div id="target-face" style="width:150px; height:150px; background:#eee; margin:10px auto; border:1px solid #999;"></div> 
                </div>
                
                <div style="border:2px dashed #00cec9; padding:10px; border-radius:10px; min-width:300px;">
                    <h4>몽타주 작성</h4>
                    <div id="canvas-face" style="width:150px; height:150px; background:#fff; margin:0 auto; border:1px solid #333; position:relative;">
                        <!-- Parts rendered here -->
                        <div id="p-face" style="position:absolute; width:100%; height:100%; top:0; left:0;"></div>
                        <div id="p-eye" style="position:absolute; width:100%; top:40px; text-align:center;"></div>
                        <div id="p-nose" style="position:absolute; width:100%; top:80px; text-align:center;"></div>
                        <div id="p-mouth" style="position:absolute; width:100%; top:110px; text-align:center;"></div>
                    </div>
                    
                    <div id="controls" style="margin-top:10px; display:grid; grid-template-columns:1fr 1fr; gap:5px;">
                        <!-- Selectors -->
                    </div>
                    <button id="submit-btn" style="width:100%; margin-top:10px; padding:10px; background:#00cec9; color:white; border:none; font-weight:bold; cursor:pointer;">제출하기</button>
                </div>
            </div>
        `;

        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();
        document.getElementById('submit-btn').onclick = () => this.check();
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };

        this.loadLevel(1);
    }

    showHelp() {
        const m = document.createElement('div');
        m.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:999;display:flex;justify-content:center;align-items:center;";
        m.innerHTML = `<div style="background:white;padding:30px;border-radius:15px;max-width:400px;text-align:center;">
            <h3>게임 방법</h3>
            <p>1. <b>목격 진술</b>을 잘 읽거나 타겟 얼굴을 기억하세요.<br>2. 아래 버튼을 눌러 <b>얼굴, 눈, 코, 입</b>을 맞추세요.<br>3. 레벨이 오르면 타겟 얼굴이 사라지거나 흐릿해집니다! (기억력/관찰력)</p>
            <button onclick="this.parentNode.parentNode.remove()" style="padding:10px 20px;background:#00cec9;color:white;border:none;border-radius:5px;">닫기</button></div>`;
        document.body.appendChild(m);
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        if (!window.A1_LEVELS) {
            console.error("A1_LEVELS not found");
            return;
        }
        const data = A1_LEVELS.generate(lvl);
        if (!data || !data.options) {
            console.error("Invalid level data for A1");
            return;
        }
        this.target = data.target;
        this.options = data.options;

        // Initial Selection
        this.selection = { face: this.options.faces[0], eye: this.options.eyes[0], mouth: this.options.mouths[0], nose: this.options.noses[0] };

        // Render Controls
        const c = document.getElementById('controls');
        c.innerHTML = '';
        ['face', 'eye', 'nose', 'mouth'].forEach(part => {
            const div = document.createElement('div');
            div.innerHTML = `<label style="display:block;font-size:12px;">${part.toUpperCase()}</label>`;
            const sel = document.createElement('select');
            sel.style.width = "100%";
            this.options[part + 's'].forEach(opt => {
                const o = document.createElement('option');
                o.value = opt;
                o.innerText = opt;
                sel.appendChild(o);
            });
            sel.onchange = (e) => {
                this.selection[part] = e.target.value;
                this.renderMontage();
            };
            sel.value = this.selection[part]; // Reset to first
            div.appendChild(sel);
            c.appendChild(div);
        });

        // Target Visuals & Constraints
        const tDesc = document.getElementById('target-desc');
        const tVis = document.getElementById('target-face');

        tVis.style.display = 'block';
        tVis.style.filter = `blur(${data.constraints.noiseLevel}px)`;
        tDesc.innerHTML = '관찰하세요!';

        // Setup Visual Face for Target
        tVis.innerHTML = '';
        const map = {
            'round': 'border-radius:50%;', 'square': 'border-radius:0%;', 'oval': 'border-radius:40%; height:140px; top:5px;', 'triangle': 'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);', 'heart': 'clip-path: polygon(50% 0%, 100% 35%, 82% 100%, 50% 100%, 18% 100%, 0% 35%);', 'star': 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);', 'diamond': 'clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);',
            'normal': '👀', 'wink': '😉', 'glasses': '👓', 'angry': '😠', 'surprised': '😲', 'closed': '😆', 'teary': '😢',
            'small': '👃', 'long': '🤥', 'round': '🐽', 'pointed': '🐁', 'flat': '👃', 'pig': '🐷', 'button': '🔘',
            'smile': '👄', 'flat': '😐', 'open': '😮', 'frown': '☹️', 'tongue': '😛', 'zipper': '🤐', 'mask': '😷'
        };

        tVis.innerHTML = `
            <div style="position:absolute; width:100%; height:100%; top:0; left:0; background:#ffeaa7; border:2px solid #000; ${map[this.target.face]}"></div>
            <div style="position:absolute; width:100%; top:40px; text-align:center;">${map[this.target.eye]}</div>
            <div style="position:absolute; width:100%; top:80px; text-align:center;">${map[this.target.nose]}</div>
            <div style="position:absolute; width:100%; top:110px; text-align:center;">${map[this.target.mouth]}</div>
        `;

        // Handle Memory Constraint
        if (data.constraints.memoryTimeout > 0) {
            setTimeout(() => {
                tVis.style.display = 'none';
                tDesc.innerHTML = '<b>기억에 의존하여 몽타주를 완성하세요!</b><br>(Working Memory Test)';
            }, data.constraints.memoryTimeout);
        }

        this.renderMontage();
    }

    renderMontage() {
        const map = {
            'round': 'border-radius:50%;', 'square': 'border-radius:0%;', 'oval': 'border-radius:40%; height:140px; top:5px;', 'triangle': 'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);', 'heart': 'clip-path: polygon(50% 0%, 100% 35%, 82% 100%, 50% 100%, 18% 100%, 0% 35%);', 'star': 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);', 'diamond': 'clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);',
            'normal': '👀', 'wink': '😉', 'glasses': '👓', 'angry': '😠', 'surprised': '😲', 'closed': '😆', 'teary': '😢',
            'small': '👃', 'long': '🤥', 'round': '🐽', 'pointed': '🐁', 'flat': '👃', 'pig': '🐷', 'button': '🔘',
            'smile': '👄', 'flat': '😐', 'open': '😮', 'frown': '☹️', 'tongue': '😛', 'zipper': '🤐', 'mask': '😷'
        };

        document.getElementById('p-face').style.cssText = `position:absolute; width:100%; height:100%; top:0; left:0; border:2px solid #000; background:#ffeaa7; ${map[this.selection.face]}`;
        document.getElementById('p-eye').innerText = map[this.selection.eye];
        document.getElementById('p-nose').innerText = map[this.selection.nose];
        document.getElementById('p-mouth').innerText = map[this.selection.mouth];
    }

    check() {
        let correct = true;
        for (let k in this.target) {
            if (this.target[k] !== this.selection[k]) correct = false;
        }

        if (correct) {
            alert("범인을 잡았습니다! 완벽한 몽타주입니다.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("몽타주가 일치하지 않습니다. 다시 확인하세요.");
        }
    }
}
window.onload = () => new TaskA1();
