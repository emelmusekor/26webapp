// C2 - Smart Sorter - Refactor
class TaskC2 {
    constructor() {
        this.container = document.getElementById('task-stage');
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div style="text-align:center; padding:10px;">
                <h2>🔄 스마트 분류기 (Smart Sorter)</h2>
                Level: <input type="number" id="lvl-input" min="1" max="50" value="1" style="width:50px; text-align:center;">
                <button id="regen-btn" style="margin-left:10px;">🔄 초기화</button>
            </div>
            <div id="game-stage" style="position:relative; width:600px; height:400px; background:#222; margin:0 auto; border-radius:10px; overflow:hidden;">
                <!-- Canvas Overlay -->
                <canvas id="sim-canvas" width="600" height="400"></canvas>
            </div>
            <div style="text-align:center; margin-top:10px;">
                <button id="start-btn" style="padding:10px 40px; font-size:18px; font-weight:bold; background:#e17055; color:white; border:none; cursor:pointer;">START</button>
                <p style="color:#666;">게이트를 클릭하여 경로를 바꾸세요!</p>
            </div>
        `;

        this.canvas = document.getElementById('sim-canvas');
        this.ctx = this.canvas.getContext('2d');

        document.getElementById('lvl-input').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= 50) this.loadLevel(val);
        };
        document.getElementById('regen-btn').onclick = () => this.loadLevel(this.level || 1);
        document.getElementById('start-btn').onclick = () => this.toggle();
        this.canvas.onclick = (e) => this.onClick(e);

        this.loadLevel(1);
    }

    loadLevel(lvl) {
        this.level = lvl;
        const inp = document.getElementById('lvl-input');
        if (inp) inp.value = lvl;
        this.playing = false;
        document.getElementById('start-btn').innerText = "START";

        this.score = 0;
        const data = C2_LEVELS.generate(lvl);
        this.goal = data.goal;
        this.ruleType = data.ruleType;

        // Entites
        this.packets = [];
        this.gates = [
            { x: 300, y: 120, dir: -1 }, // Root
            { x: 150, y: 250, dir: 1 },
            { x: 450, y: 250, dir: -1 }
        ];

        // Map data.bins to physical locations
        // Physical spots: x=75, 225, 375, 525
        const locs = [75, 225, 375, 525];
        this.bins = [];

        // If we have fewer logic bins than phys slots, repeat them?
        // E.g. 2 bins -> [Bin0, Bin0, Bin1, Bin1] logic to keep layout full
        for (let i = 0; i < 4; i++) {
            let logicBin = data.bins[i % data.bins.length];
            this.bins.push({
                x: locs[i],
                y: 360,
                color: logicBin.color,
                shape: logicBin.shape,
                id: logicBin.id // The logic ID (0..3 or 0..1)
            });
        }

        this.draw();
    }

    toggle() {
        this.playing = !this.playing;
        document.getElementById('start-btn').innerText = this.playing ? "PAUSE" : "RESUME";
        if (this.playing) this.loop();
    }

    loop() {
        if (!this.playing) return;

        // Spawn
        if (Math.random() < 0.02 + (this.level * 0.001)) {
            // Pick a random target bin
            const targetBin = this.bins[Math.floor(Math.random() * this.bins.length)];

            this.packets.push({
                x: 300, y: 0,
                vx: 0,
                vy: 2 + (this.level * 0.1),
                targetId: targetBin.id, // The logic type we want
                color: targetBin.color,
                shape: targetBin.shape,
                active: true
            });
        }

        // Update
        this.packets.forEach(p => {
            if (!p.active) return;
            p.y += p.vy;
            p.x += p.vx;

            // Gate Logic
            this.gates.forEach(g => {
                // Determine if close enough to hit
                // Y=120 (Top), Y=250 (Mid)
                if (Math.abs(p.y - g.y) < 5 && Math.abs(p.x - g.x) < 10) {
                    // PHYSICS FIX:
                    // Dy = 130 (120->250) or 110 (250->360)
                    // Dx = 150 (300->150/450) or 75 (150->75/225)

                    // We need to calculate ratio. 
                    // Top gate: Dy=130, Dx=150. Ratio = 1.1538
                    // Bottom gate: Dy=110, Dx=75. Ratio = 0.6818

                    let ratio = 0;
                    if (g.y < 200) ratio = 150 / 130;
                    else ratio = 75 / 110;

                    p.vx = g.dir * p.vy * ratio;
                }
            });

            // Bin Logic
            if (p.y > 350) {
                // Check bin proximity
                let caught = false;
                this.bins.forEach(b => {
                    if (Math.abs(p.x - b.x) < 30) {
                        // Check match: p.targetId === b.id
                        // Wait, p was spawned with properties matching a targetBin.
                        // But does it match THIS bin? 
                        // Logic: Does this bin match p's properties according to Rule?
                        // BUT Level gen simplified it: p matches targetBin.id.
                        // If b.id matches p.targetId, we are good.

                        if (b.id === p.targetId) this.score++;
                        else this.score--; // Penalty
                        caught = true;
                    }
                });
                p.active = false;
            }
        });

        this.draw();

        requestAnimationFrame(() => this.loop());
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 600, 400); // Clear

        // Gates
        this.gates.forEach(g => {
            // Draw Pivot
            ctx.fillStyle = '#b2bec3';
            ctx.beginPath(); ctx.arc(g.x, g.y, 15, 0, Math.PI * 2); ctx.fill();

            // Draw Lever
            ctx.beginPath();
            ctx.moveTo(g.x, g.y);
            ctx.lineTo(g.x + (g.dir * 40), g.y + 40);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 6;
            ctx.stroke();

            // Draw Arrow hint
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '12px Arial';
            ctx.fillText(g.dir > 0 ? "R" : "L", g.x - 5, g.y - 20);
        });

        // Bins
        this.bins.forEach(b => {
            // Check Rule type to decide what to show?
            // Always show Color and Shape hint
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x - 30, b.y, 60, 40);

            // Draw Shape Icon on Bin
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            const cx = b.x, cy = b.y + 20;
            if (b.shape === 0) ctx.arc(cx, cy, 10, 0, Math.PI * 2); // Circle
            else if (b.shape === 1) ctx.rect(cx - 10, cy - 10, 20, 20); // Square
            else if (b.shape === 2) { // Triangle
                ctx.moveTo(cx, cy - 10); ctx.lineTo(cx + 10, cy + 10); ctx.lineTo(cx - 10, cy + 10);
            }
            else if (b.shape === 3) { // Star (Diamond actually)
                ctx.moveTo(cx, cy - 12); ctx.lineTo(cx + 12, cy); ctx.lineTo(cx, cy + 12); ctx.lineTo(cx - 12, cy);
            }
            ctx.fill();
        });

        // Packets
        this.packets.forEach(p => {
            if (!p.active) return;
            ctx.fillStyle = p.color;
            ctx.beginPath();

            if (p.shape === 0) ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
            else if (p.shape === 1) ctx.rect(p.x - 8, p.y - 8, 16, 16);
            else if (p.shape === 2) {
                ctx.moveTo(p.x, p.y - 8); ctx.lineTo(p.x + 8, p.y + 8); ctx.lineTo(p.x - 8, p.y + 8);
            }
            else if (p.shape === 3) {
                ctx.moveTo(p.x, p.y - 10); ctx.lineTo(p.x + 10, p.y); ctx.lineTo(p.x, p.y + 10); ctx.lineTo(p.x - 10, p.y);
            }
            ctx.fill();
        });

        // Score
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${this.score} / ${this.goal}`, 10, 30);
    }

    onClick(e) {
        const r = this.canvas.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;

        this.gates.forEach(g => {
            // Increased Hit Radius
            if (Math.hypot(g.x - x, g.y - y) < 50) {
                g.dir *= -1;
                this.draw();
            }
        });
    }
}
window.onload = () => new TaskC2();
