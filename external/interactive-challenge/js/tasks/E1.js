class TaskE1 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🌦️ 오늘의 날씨 캐스터 (Environment Variable)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새로운 날씨</button>
                    <button id="help-btn">?</button>
                </div>
            </div>
            
            <div style="display:flex; justify-content:center; gap:30px; margin-top:30px; align-items:center;">
                <div style="text-align:center; padding:20px; border:2px solid #74b9ff; border-radius:15px; background:#f0f8ff;">
                    <h3>현재 환경 (Environment)</h3>
                    <div id="env-display" style="font-size:18px; line-height:2;">
                        <!-- Env vars go here -->
                    </div>
                </div>
                
                <div style="font-size:30px;">➡️</div>
                
                <div style="text-align:center; padding:20px; border:2px dashed #0984e3; border-radius:15px;">
                    <h3>준비물 챙기기</h3>
                    <div id="items-container" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; max-width:300px;">
                        <!-- Items -->
                    </div>
                </div>
            </div>

            <div style="text-align:center; margin-top:30px;">
                <button id="check-btn" style="padding:10px 40px; background:#00cec9; color:white; border:none; border-radius:5px; font-size:18px; cursor:pointer;">방송 하기</button>
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
        alert("오늘의 날씨(환경 변수)를 보고 적절한 준비물을 선택하세요!\n비가 오면 우산, 추우면 패딩이 필요합니다.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;

        const data = E1_LEVELS.generate(lvl);
        this.env = data.env;
        this.correctItems = data.correctItems;
        this.options = data.options;
        this.selected = new Set();

        // Render Env
        const envDiv = document.getElementById('env-display');
        envDiv.innerHTML = `
            <div>하늘: <b>${this.env.sky}</b></div>
            <div>기온: <b>${this.env.temp}</b></div>
            <div>바람: <b>${this.env.wind}</b></div>
        `;

        // Render Options
        const itemDiv = document.getElementById('items-container');
        itemDiv.innerHTML = '';
        this.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerText = opt;
            btn.style.cssText = "padding:10px; border:1px solid #ccc; background:white; cursor:pointer; border-radius:5px;";
            btn.onclick = () => {
                if (this.selected.has(opt)) {
                    this.selected.delete(opt);
                    btn.style.background = 'white';
                    btn.style.color = 'black';
                } else {
                    this.selected.add(opt);
                    btn.style.background = '#0984e3';
                    btn.style.color = 'white';
                }
            };
            itemDiv.appendChild(btn);
        });
    }

    check() {
        // Logic: Should select ALL strictly required items?
        // Or AT LEAST one suitable item?
        // Let's go with: "You must choose at least one valid item, and NO invalid items."
        // Or "Match the recommended list exactly?" - That's hard to guess.
        // Let's be lenient: Input Valid if User selection is a SUBSET of Correct Items AND size > 0.
        // Or simpler: Correct Items list from generator contains ALL acceptable items. User must pick at least one, and not pick any 'bad' items.
        // Bad items logic needed?
        // Let's assume generator returns "Necessary" items.
        // Wait, generator logic: `if (sky==='비') correctItems.push('우산', '레인부츠');`.
        // If it rains, Umbrella OR Rainboots is ok? Or Both?
        // Let's require ONE of the correct items to be present, and NO items that are clearly wrong? 
        // Simplest: Check if the user selected item is in the correctItems list.

        if (this.selected.size === 0) {
            alert("준비물을 하나 이상 선택하세요.");
            return;
        }

        let allCorrect = true;
        let atLeastOne = false;

        // Check if selected items are valid
        for (let item of this.selected) {
            if (this.correctItems.includes(item)) {
                atLeastOne = true;
            } else {
                // If user picked 'Swimsuit' on a rainy day?
                // Generator doesn't explicity list 'forbidden'.
                // Assuming correctItems contains EVERYTHING suitable.
                // So if not in correctItems, it's wrong.
                allCorrect = false;
            }
        }

        if (allCorrect && atLeastOne) {
            alert(`성공! ${this.env.sky} 날씨에 딱 맞는 준비물입니다.`);
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("음... 날씨에 맞지 않는 물건이 있거나, 필요한게 빠졌나요?");
        }
    }
}
window.onload = () => new TaskE1();
