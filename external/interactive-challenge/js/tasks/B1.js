class TaskB1 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }
    init() {
        this.container.innerHTML = `
            <div style="text-align:center;">
                <h2>🥘 요리 순서 기억하기 (Sequence)</h2>
                <div style="margin:10px;">
                    Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                    <button id="new-btn">🔄 새 문제</button>
                    <button id="help-btn">?</button>
                </div>
            </div>

            <!-- Animation Phase -->
            <div id="animation-stage" style="display:none; text-align:center; margin-top:30px;">
                <h3>요리 과정을 잘 기억하세요!</h3>
                <div id="anim-box" style="width:200px; height:100px; line-height:100px; background:#dfe6e9; border:2px solid #b2bec3; border-radius:10px; margin:20px auto; font-size:24px; font-weight:bold;">
                    준비...
                </div>
            </div>
            
            <!-- Interact Phase -->
            <div id="interact-stage" style="display:none;">
                <p style="text-align:center;">기억한 순서대로 나열하세요!</p>
                <div id="sort-container" style="width:300px; margin:0 auto; padding:10px; background:#f1f2f6; min-height:300px; border-radius:10px;">
                    <!-- Draggable Items -->
                </div>
                <div style="text-align:center; margin-top:20px;">
                    <button id="check-btn" style="padding:10px 30px; background:#6c5ce7; color:white; border:none; font-size:16px; border-radius:5px; cursor:pointer;">확인</button>
                </div>
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
        alert("1. 처음에 보여주는 요리 순서를 잘 기억하세요.\n2. 애니메이션이 이 끝나면 카드가 섞입니다.\n3. 올바른 순서대로 카드를 나열하세요.");
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        const data = B1_LEVELS.generate(lvl);
        this.correctOrder = data.correctOrder; // IDs in order
        this.itemsMap = {};
        data.items.forEach(i => this.itemsMap[i.id] = i.t);

        // Reset UI
        document.getElementById('animation-stage').style.display = 'block';
        document.getElementById('interact-stage').style.display = 'none';

        // Start Animation
        this.playAnimation(data.items.filter(x => this.correctOrder.includes(x.id))); // Play correct sequence meant for the recipe
        // Note: B1_LEVELS currently shuffles items. user wants to see "The Sequence", then sort "The Shuffled Items".
        // Wait, B1_LEVELS returns `items` (shuffled) and `correctOrder` (ids).
        // I should reconstruct the ordered list for animation.
    }

    async playAnimation(orderedItems) {
        // We need the items in CORRECT order.
        // `correctOrder` has IDs. `items` has full objects.
        const sequence = this.correctOrder.map(id => ({ id, t: this.itemsMap[id] }));

        const box = document.getElementById('anim-box');

        for (let i = 0; i < sequence.length; i++) {
            box.innerText = `${i + 1}. ${sequence[i].t}`;
            box.style.background = '#ffeaa7';
            box.style.transform = 'scale(1.1)';
            await new Promise(r => setTimeout(r, 1000)); // Show for 1s
            box.style.transform = 'scale(1)';
            box.style.background = '#dfe6e9';
            await new Promise(r => setTimeout(r, 300)); // Gap
        }

        box.innerText = "섞는 중...";
        await new Promise(r => setTimeout(r, 1000));

        // Switch to Interact
        document.getElementById('animation-stage').style.display = 'none';
        this.renderSortable(this.correctOrder.map(id => ({ id, t: this.itemsMap[id] })).sort(() => Math.random() - 0.5));
    }

    renderSortable(shuffled) {
        const stage = document.getElementById('interact-stage');
        stage.style.display = 'block';
        const list = document.getElementById('sort-container');
        list.innerHTML = '';

        shuffled.forEach(item => {
            const el = document.createElement('div');
            el.className = 'sort-item';
            el.draggable = true;
            el.dataset.id = item.id;
            el.innerText = item.t;
            el.style.cssText = "background:white; margin:5px 0; padding:15px; border-radius:5px; border:1px solid #ccc; cursor:grab; text-align:center; font-weight:bold;";

            el.ondragstart = (e) => { e.dataTransfer.setData('text/plain', e.target.dataset.id); e.target.classList.add('dragging'); };
            el.ondragend = (e) => { e.target.classList.remove('dragging'); };

            list.appendChild(el);
        });

        list.ondragover = (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(list, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                list.appendChild(draggable);
            } else {
                list.insertBefore(draggable, afterElement);
            }
        };
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.sort-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    check() {
        const currentOrder = [...document.querySelectorAll('.sort-item')].map(el => el.dataset.id);
        if (JSON.stringify(currentOrder) === JSON.stringify(this.correctOrder)) {
            alert("정확합니다! 완벽한 기억력!");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            if (confirm("순서가 틀렸습니다. 다시 보시겠습니까?")) {
                this.loadLevel(this.level); // Reset to new animation/shuffle
            }
        }
    }
}
window.onload = () => new TaskB1();
