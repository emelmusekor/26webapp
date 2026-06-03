class TaskA4 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🧩 패턴 찾기 (Pattern Matching)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 게임</button>
                    <button id="help-btn">?</button>
                </div>
                <p>같은 모양의 카드를 찾아 **드래그하여 겹치세요**!</p>
            </div>
            
            <div id="game-area" style="position:relative; width:600px; min-height:400px; height:auto; background:#dfe6e9; margin:20px auto; border-radius:10px; border:2px solid #b2bec3; padding-bottom: 20px;">
                <!-- Cards will be placed here -->
            </div>
            
            <div style="text-align:center;">
                <h3 id="status-msg" style="color:#6c5ce7;"></h3>
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
        alert("같은 모양의 카드를 찾아 드래그해서 겹쳐보세요.\n모든 짝을 맞추면 성공입니다!");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = A4_LEVELS.generate(lvl);
        this.items = data.items;
        this.matchesLeft = this.items.length / 2;

        document.getElementById('status-msg').innerText = `남은 쌍: ${this.matchesLeft}`;
        this.renderCards();
    }

    renderCards() {
        const area = document.getElementById('game-area');
        area.innerHTML = '';

        this.items.forEach((item, i) => {
            if (item.matched) return; // Skip matched

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = item.pattern;
            // Random positions if not set? Or grid?
            // Let's use slight random scatter on grid for "Scanning" feel.
            const total = this.items.length;
            // Config grid based on count
            let cols = 4;
            if (total > 16) cols = 6;
            if (total > 24) cols = 8;

            const cardW = (total > 24) ? 60 : 80;
            const cardH = (total > 24) ? 80 : 100;
            const gapX = (total > 24) ? 70 : 120;
            const gapY = (total > 24) ? 90 : 110;
            const fontSize = (total > 24) ? '30px' : '40px';

            const row = Math.floor(i / cols);
            const col = i % cols;

            // Layout centering
            // Layout centering
            const top = row * gapY + 20 + (Math.random() * 10 - 5);
            const left = col * gapX + 20 + (Math.random() * 10 - 5);

            // Expand Area if needed
            if (top + cardH > area.clientHeight) {
                area.style.height = (top + cardH + 50) + 'px';
            }

            card.style.cssText = `
                position:absolute; 
                top:${top}px; left:${left}px; 
                width:${cardW}px; height:${cardH}px; 
                background:white; 
                display:flex; justify-content:center; align-items:center; 
                font-size:${fontSize}; 
                border-radius:10px; 
                box-shadow:2px 2px 5px rgba(0,0,0,0.1); 
                cursor:grab; 
                user-select:none;
                border: 2px solid #0984e3;
            `;

            // Drag logic
            card.draggable = true;
            card.ondragstart = (e) => {
                e.dataTransfer.setData('idx', i);
                e.dataTransfer.effectAllowed = 'move';
                card.style.opacity = '0.5';
            };

            card.ondragend = (e) => {
                card.style.opacity = '1.0';
            };

            // Drop Logic (Target)
            card.ondragover = (e) => {
                e.preventDefault(); // Allow drop
                e.dataTransfer.dropEffect = 'move';
            };

            card.ondrop = (e) => {
                e.preventDefault();
                const srcIdx = parseInt(e.dataTransfer.getData('idx'));
                if (srcIdx === i) return; // Self drop

                this.checkMatch(srcIdx, i);
            };

            area.appendChild(card);
        });
    }

    checkMatch(id1, id2) {
        const item1 = this.items[id1];
        const item2 = this.items[id2];

        if (item1.pattern === item2.pattern) {
            // Match!
            item1.matched = true;
            item2.matched = true;
            this.matchesLeft--;
            document.getElementById('status-msg').innerText = `남은 쌍: ${this.matchesLeft}`;

            // Animation or refresh
            this.renderCards();

            if (this.matchesLeft === 0) {
                alert("훌륭합니다! 패턴 인식 성공!");
                if (this.level < 50) this.loadLevel(this.level + 1);
            }
        } else {
            // No match visual feedback?
            alert("모양이 다릅니다.");
        }
    }
}
window.onload = () => new TaskA4();
