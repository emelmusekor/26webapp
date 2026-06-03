// A2 - Galaxy Zoo - Refactor
class TaskA2 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div style="text-align:center; padding:10px;">
                <h2 style="font-family:'Jua'; color:#2d3436;">👽 외계인 분류 (Galaxy Zoo)</h2>
                <div style="margin-bottom:15px;">
                     Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                     <button id="new-btn" style="margin-left:10px;">🔄 새로운 문제</button>
                     <button id="help-btn" style="margin-left:5px;">?</button>
                </div>
                <div id="game-board"></div>
            </div>
        `;

        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };
        document.getElementById('new-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('help-btn').onclick = () => this.showHelp();

        this.loadLevel(1);
    }

    showHelp() {
        const modal = document.createElement('div');
        modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:1000;";
        modal.innerHTML = `
            <div style="background:white; padding:30px; border-radius:15px; max-width:400px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.2); font-family:'Jua', sans-serif;">
                <h3 style="margin-top:0;">📖 게임 방법</h3>
                <p style="font-size:16px; line-height:1.6; color:#555;">
                    1. <b>Group A</b>와 <b>Group B</b>를 관찰하세요.<br>
                    2. 두 그룹을 구분하는 <b>공통된 규칙</b>(예: 눈 개수, 뿔 유무)을 찾으세요.<br>
                    3. 아래 버튼 중 정답이라고 생각되는 규칙을 누르세요.<br>
                </p>
                <button id="close-help" style="margin-top:20px; padding:10px 25px; background:#0984e3; color:white; border:none; border-radius:20px; cursor:pointer; font-weight:bold;">알겠어요!</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('close-help').onclick = () => modal.remove();
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;

        // Use standard level generation
        const data = A2_LEVELS.generate(lvl);
        this.rule = data.rule.key;
        this.ruleData = data.rule; // Store full rule object
        this.alienCount = data.alienCount || 3;
        this.featureDetails = data.featureDetails;

        this.renderGame();
    }

    renderGame() {
        const board = document.getElementById('game-board');
        board.innerHTML = '';

        // Determine Rule Values
        // E.g. Rule = Eyes. Group A = 1 Eye. Group B = 2 Eyes.
        // Need to ensure distinct values.

        const config = this.genConfig(this.rule);

        const flex = document.createElement('div');
        flex.style.display = 'flex';
        flex.style.justifyContent = 'space-around';
        flex.style.marginBottom = '20px';

        ['A', 'B'].forEach(grp => {
            const box = document.createElement('div');
            box.style.border = `4px solid ${grp === 'A' ? '#e17055' : '#0984e3'}`;
            box.style.borderRadius = '15px';
            box.style.padding = '15px';
            box.style.background = 'white';
            box.style.minWidth = '150px';

            box.innerHTML = `<h3 style="margin:0 0 10px 0;">Group ${grp}</h3>`;

            // Aliens
            const aliensDiv = document.createElement('div');
            aliensDiv.style.display = 'flex';
            aliensDiv.style.flexWrap = 'wrap';
            aliensDiv.style.gap = '10px';
            aliensDiv.style.justifyContent = 'center';

            for (let i = 0; i < this.alienCount; i++) {
                const alien = this.createAlien(this.rule, config[grp]);
                aliensDiv.appendChild(alien);
            }
            box.appendChild(aliensDiv);
            flex.appendChild(box);
        });

        board.appendChild(flex);

        // Options
        const opts = document.createElement('div');
        opts.innerHTML = '<h3>Q. 분류 기준은?</h3>';

        const labels = { 'eyes': '눈의 개수', 'horns': '뿔의 개수', 'color': '몸 색깔', 'shape': '얼굴 모양' };

        Object.keys(labels).forEach(k => {
            const btn = document.createElement('button');
            btn.innerText = labels[k];
            btn.style.margin = '5px';
            btn.style.padding = '10px 20px';
            btn.style.fontSize = '16px';
            btn.style.cursor = 'pointer';
            btn.onclick = () => {
                if (k === this.rule) {
                    alert("정답입니다! 👏");
                    if (this.level < 50) this.loadLevel(this.level + 1);
                } else {
                    alert("틀렸습니다. 다시 살펴보세요.");
                }
            };
            opts.appendChild(btn);
        });
        board.appendChild(opts);
    }

    genConfig(ruleKey) {
        // ruleKey is just the primary key name (e.g. 'eyes'), but we need the full rule object
        // this.ruleData = { type, key, val, k1, v1, val: ..., desc ... }

        const details = this.featureDetails;
        const r = this.ruleData;

        // Group A = Positive, Group B = Negative

        if (r.type === 'simple') {
            const targetVal = r.val;
            // B gets random OTHER
            const options = details[r.key];
            const others = options.filter(v => v !== targetVal);
            const valB = others[Math.floor(Math.random() * others.length)];

            // Return simple object (createAlien handles basic key override)
            // But createAlien expects {A: val, B: val} for 'this.rule'.
            // If we are compliant with simple rule, this works.
            return { A: targetVal, B: valB };
        }

        if (r.type === 'not') {
            const avoidVal = r.val;
            // A gets ANYTHING except avoidVal
            const options = details[r.key];
            const valid = options.filter(v => v !== avoidVal);
            const valA = valid[Math.floor(Math.random() * valid.length)];

            // B gets avoidVal (Violation)
            return { A: valA, B: avoidVal };
        }

        if (r.type === 'and') {
            // A matches k1=v1 AND k2=v2
            // B matches k1!=v1 OR k2!=v2

            // We need to return an object that creates specific alien properties.
            // Current createAlien(rule, val) only overrides 'rule' property with 'val'.
            // It doesn't support multiple properties.

            // We will return a SPECIAL object that createAlien will detect.
            // B: Randomize which condition fails (1, 2, or both)
            const failMode = Math.random();
            let bObj = {};
            if (failMode < 0.33) { // Fail K1
                const opts1 = details[r.k1].filter(x => x !== r.v1);
                bObj[r.k1] = opts1[Math.floor(Math.random() * opts1.length)];
                bObj[r.k2] = r.v2;
            } else if (failMode < 0.66) { // Fail K2
                bObj[r.k1] = r.v1;
                const opts2 = details[r.k2].filter(x => x !== r.v2);
                bObj[r.k2] = opts2[Math.floor(Math.random() * opts2.length)];
            } else { // Fail Both
                const opts1 = details[r.k1].filter(x => x !== r.v1);
                const opts2 = details[r.k2].filter(x => x !== r.v2);
                bObj[r.k1] = opts1[Math.floor(Math.random() * opts1.length)];
                bObj[r.k2] = opts2[Math.floor(Math.random() * opts2.length)];
            }

            return {
                A: { [r.k1]: r.v1, [r.k2]: r.v2, _multi: true },
                B: { ...bObj, _multi: true }
            };
        }

        return { A: r.val, B: r.val }; // Fallback
    }

    createAlien(ruleKey, val) {
        const el = document.createElement('div');
        el.style.width = '60px';
        el.style.height = '60px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.border = '2px solid #333';
        el.style.fontSize = '24px';

        // Defaults
        let eyes = 1; // 1, 2, 3
        let horns = 0; // 0, 1, 2
        let mouth = 'flat'; // smile, flat, sad
        let color = '#a29bfe';
        let radius = '50%'; // Circle

        // Override if multi or simple
        if (val && val._multi) {
            // Apply multiple props
            if (val.eyes) eyes = val.eyes;
            if (val.horns) horns = val.horns;
            if (val.color) color = val.color;
            if (val.shape) radius = val.shape;
        } else {
            // Fallback single rule
            if (ruleKey === 'eyes' || ruleKey === 'featureDetails') eyes = val; // Check logic? ruleKey is primary rule name.
            // Actually, createAlien logic was simplistic: if(rule === 'eyes') eyes = val;
            // We need to keep randomizing NON-rule features.
            // But if val has spec, use it.

            if (ruleKey === 'eyes') eyes = val;
            if (ruleKey === 'horns') horns = val;
            if (ruleKey === 'color') color = val;
            if (ruleKey === 'shape') radius = val;
        }

        // Randomize others if NOT set above (defaults are simplistic)
        // We need a way to know if it was set?
        // Let's re-randomize everything first, then apply overrides.

        if (!val || !val.eyes) if (ruleKey !== 'eyes') eyes = 1 + Math.floor(Math.random() * 3);
        if (!val || !val.horns) if (ruleKey !== 'horns') horns = Math.floor(Math.random() * 3);
        if (!val || !val.color) if (ruleKey !== 'color') {
            const colors = ['#a29bfe', '#55efc4', '#ffeaa7'];
            color = colors[Math.floor(Math.random() * colors.length)];
        }
        if (!val || !val.shape) if (ruleKey !== 'shape') radius = (Math.random() > 0.5) ? '50%' : '10px';

        // RE-Apply overrides to be safe (if randomized above overwrote, though logic prevents it)
        if (ruleKey === 'eyes' && !val._multi) eyes = val;
        // ... this logic is getting messy. Simplification:

        // 1. Random Base
        let finalEyes = 1 + Math.floor(Math.random() * 3);
        let finalHorns = Math.floor(Math.random() * 3);
        const mouths = ['smile', 'flat', 'sad'];
        let finalMouth = mouths[Math.floor(Math.random() * mouths.length)];
        const colors = ['#a29bfe', '#55efc4', '#ffeaa7'];
        let finalColor = colors[Math.floor(Math.random() * colors.length)];
        let finalRadius = (Math.random() > 0.5) ? '50%' : '10px';

        // 2. Apply Overrides
        if (val && val._multi) {
            if (val.eyes) finalEyes = val.eyes;
            if (val.horns) finalHorns = val.horns;
            if (val.mouth) finalMouth = val.mouth;
            if (val.color) finalColor = val.color;
            if (val.shape) finalRadius = val.shape;
        } else {
            if (ruleKey === 'eye') finalEyes = val; // Assuming ruleKey matches 'eye'
            if (ruleKey === 'eyes') finalEyes = val;
            if (ruleKey === 'horn') finalHorns = val;
            if (ruleKey === 'horns') finalHorns = val;
            if (ruleKey === 'mouth') finalMouth = val;
            if (ruleKey === 'color') finalColor = val;
            if (ruleKey === 'shape') finalRadius = val;
        }

        // Apply
        eyes = finalEyes; horns = finalHorns; mouth = finalMouth; color = finalColor; radius = finalRadius;

        // Apply Styles
        el.style.background = color;
        el.style.borderRadius = radius;

        // Content
        let content = '';
        for (let k = 0; k < eyes; k++) content += '👁️';

        // Mouth Map
        const mouthMap = { 'smile': '😊', 'flat': '😐', 'sad': '☹️' };
        let mouthChar = mouthMap[mouth] || '😐'; // Default

        // Horns visual (simplified as prepend)
        let hornStr = '';
        for (let h = 0; h < horns; h++) hornStr += '▲';

        el.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; line-height:1;">
                <span style="font-size:12px; color:#555;">${hornStr}</span>
                <span>${content}</span>
                <span style="font-size:14px; margin-top:-5px;">${mouthChar}</span>
            </div>
        `;

        return el;
    }
}
window.onload = () => new TaskA2();
