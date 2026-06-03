class TaskRolePlay {
    constructor() {
        this.container = document.getElementById('task-stage');
        // Logic to update the Hero Title in task_role_play.html
        this.titleEl = document.getElementById('task-title');
        this.descEl = document.getElementById('task-desc');
        this.goalEl = document.getElementById('mission-goal');

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div id="game-area" style="text-align:center; padding:20px;">
                <div id="slots-area" style="display:flex; justify-content:center; gap:20px; margin-bottom:40px; min-height:80px;">
                    <!-- Slots -->
                </div>
                
                <div id="options-area" style="display:flex; justify-content:center; gap:15px; flex-wrap:wrap;">
                    <!-- Options -->
                </div>
            </div>
            
            <div style="text-align:center; margin-top:30px;">
                Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                <button id="check-btn" style="padding:10px 30px; background:#0984e3; color:white; border:none; border-radius:5px; font-size:18px; cursor:pointer;">역할 확정</button>
            </div>
        `;

        document.getElementById('check-btn').onclick = () => this.check();
        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };

        this.level = 1;
        this.loadLevel(1);
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;

        const data = ROLEPLAY_LEVELS.generate(lvl);
        this.correctRoles = data.correct;
        this.currentSlots = Array(data.slots).fill(null);

        // Update Metadata
        if (this.titleEl) this.titleEl.innerText = "🎭 역할 정의 (Role Definition)";
        if (this.descEl) this.descEl.innerText = data.title;
        if (this.goalEl) this.goalEl.innerText = data.desc;

        this.renderSlots(data.slots);
        this.renderOptions(data.options);
    }

    renderSlots(count) {
        const area = document.getElementById('slots-area');
        area.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const slot = document.createElement('div');
            slot.className = 'role-slot';
            slot.style.cssText = "width:100px; height:100px; border:2px dashed #b2bec3; border-radius:10px; display:flex; justify-content:center; align-items:center; background:rgba(255,255,255,0.1); color:white;";

            if (this.currentSlots[i]) {
                slot.innerText = this.currentSlots[i];
                slot.style.background = "#00b894";
                slot.style.border = "2px solid white";
                slot.onclick = () => {
                    this.currentSlots[i] = null;
                    this.renderSlots(count);
                    this.renderOptions(this.lastOptions); // Refresh options visibility
                };
            } else {
                slot.innerText = `역할 ${i + 1}`;
            }

            // Drop support
            slot.ondragover = e => e.preventDefault();
            slot.ondrop = e => {
                const val = e.dataTransfer.getData('role');
                if (val) {
                    this.currentSlots[i] = val;
                    this.renderSlots(count);
                    this.renderOptions(this.lastOptions);
                }
            };

            area.appendChild(slot);
        }
    }

    renderOptions(options) {
        this.lastOptions = options;
        const area = document.getElementById('options-area');
        area.innerHTML = '';

        options.forEach(opt => {
            // Check if already used
            if (this.currentSlots.includes(opt)) return;

            const el = document.createElement('div');
            el.innerText = opt;
            el.draggable = true;
            el.style.cssText = "padding:10px 20px; background:#e17055; color:white; border-radius:20px; cursor:grab; font-weight:bold;";

            el.ondragstart = e => {
                e.dataTransfer.setData('role', opt);
            };

            // Click support as well
            el.onclick = () => {
                const emptyIdx = this.currentSlots.findIndex(x => x === null);
                if (emptyIdx !== -1) {
                    this.currentSlots[emptyIdx] = opt;
                    this.renderSlots(this.currentSlots.length);
                    this.renderOptions(options);
                }
            };

            area.appendChild(el);
        });
    }

    check() {
        // Check if all slots filled
        if (this.currentSlots.includes(null)) {
            alert("모든 역할의 주인공을 정해주세요!");
            return;
        }

        // Check correctness
        // Order shouldn't matter? Or strictly match?
        // Usually roles are set disjoint.
        // Check if every slot is in correctRoles.
        // And if all correctRoles are present (if slots == correctRoles.length).

        const filled = this.currentSlots;
        let correct = true;

        filled.forEach(f => {
            if (!this.correctRoles.includes(f)) correct = false;
        });

        if (correct) {
            alert("정확합니다! 시스템을 위한 완벽한 역할 분담입니다.");
            if (this.level < 50) this.loadLevel(this.level + 1);
        } else {
            alert("시스템에 맞지 않는 역할이 포함되어 있습니다. 다시 생각해보세요.");
        }
    }
}
window.onload = () => new TaskRolePlay();
