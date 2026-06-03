class TaskEngine {
    constructor(taskId, containerId) {
        this.taskId = taskId;
        this.container = document.getElementById(containerId);
        this.data = this.getTaskData(taskId);
        this.level = 1;
        this.state = {};

        // Add Feedback Container
        if (!document.querySelector('.feedback-msg')) {
            const msg = document.createElement('div');
            msg.className = 'feedback-msg';
            document.body.appendChild(msg);
        }
    }

    init() {
        if (!this.data) {
            this.container.innerHTML = "<h3>Task Data Not Found for ID: " + this.taskId + "</h3>";
            return;
        }
        this.renderUI();
    }

    showFeedback(isCorrect, msgText) {
        const msg = document.querySelector('.feedback-msg');
        msg.innerText = msgText || (isCorrect ? "정답입니다! 훌륭해요! 🎉" : "다시 생각해보세요. 🤔");
        msg.className = 'feedback-msg show ' + (isCorrect ? 'correct' : 'wrong');

        // Basic Audio Feedback (Optional)
        // const audio = new Audio(isCorrect ? 'snd/correct.mp3' : 'snd/wrong.mp3');
        // audio.play().catch(e => {});

        setTimeout(() => {
            msg.classList.remove('show');
        }, 2000);
    }

    getTaskData(id) {
        // Updated Data with Answers
        const DEFS = {
            // --- Row 1 ---
            "A1": { type: "SELECTION", mode: "multi", title: "몽타주 만들기", desc: "범인의 특징(눈이 큼, 입술이 얇음)을 모두 찾으세요.", items: ["눈이 큼", "코가 오똑함", "입술이 얇음", "눈썹이 진함"], answer: ["눈이 큼", "입술이 얇음"] },
            "B1": { type: "SORTING", title: "요리 레시피", desc: "요리 순서를 올바르게 배열하세요.", items: ["물 끓이기", "면 넣기", "스프 넣기", "계란 넣기", "먹기"], answer: ["물 끓이기", "스프 넣기", "면 넣기", "계란 넣기", "먹기"] }, // Relaxed order logic possible
            "D1": { type: "GRAPH", title: "마니또 연결", desc: "모든 친구들을 하나로 연결하세요.", nodes: ["나", "철수", "영희", "민수"], edges: [], goal: "spanning_tree" },
            "E1": { type: "SELECTION", mode: "single", title: "날씨 캐스터", desc: "회색 구름이 꼈습니다. 어떤 날씨일까요?", items: ["맑음 ☀️", "비 ☔", "눈 ❄️"], answer: ["비 ☔"] },

            // --- Row 2 ---
            "B2": { type: "SORTING", title: "등교 준비", desc: "등교 준비 순서를 맞추세요.", items: ["일어나기", "세수하기", "옷 입기", "가방 싸기", "학교 가기"], answer: ["일어나기", "세수하기", "옷 입기", "가방 싸기", "학교 가기"] },
            "D2": { type: "GRAPH_TREE", title: "가계도 그리기", desc: "할아버지 -> 아버지 -> 나 순서로 화살표를 연결하세요.", nodes: ["할아버지", "아버지", "나"], edges: [], answer: [["할아버지", "아버지"], ["아버지", "나"]] },
            "E2": { type: "ALLOCATION", title: "역할 분담", desc: "각 역할을 알맞은 사람에게 배정하세요.", slots: ["청소", "우유", "주번"], items: ["철수(힘셈)", "영희(꼼꼼)", "민수(일찍옴)"], answer: { "청소": "철수(힘셈)", "우유": "영희(꼼꼼)", "주번": "민수(일찍옴)" } },

            // --- Row 3 ---
            "A3": { type: "MAZE", title: "미로 탈출", desc: "S에서 E까지 가는 길을 클릭하여 만드세요.", size: 5, start: [0, 0], end: [4, 4] },
            "C3": { type: "TEXT_CIPHER", title: "암호 만들기", desc: "A=1, B=2, C=3 입니다. 'ABC'는?", answer: "123" },
            "D3": { type: "GRAPH_DIR", title: "먹이사슬", desc: "풀 -> 토끼 -> 늑대 순서로 연결하세요.", nodes: ["풀", "토끼", "늑대", "호랑이"], answer: [["풀", "토끼"], ["토끼", "늑대"], ["늑대", "호랑이"]] },
            "E3": { type: "ALLOCATION", title: "학급 헌법", desc: "상황에 맞는 규칙을 완성하세요.", slots: ["친구가 때리면", "숙제를 안 해오면"], items: ["선생님께 알린다", "남아서 하고 간다", "같이 때린다(X)"], answer: { "친구가 때리면": "선생님께 알린다", "숙제를 안 해오면": "남아서 하고 간다" } },

            // --- Row 4 ---
            "A4": { type: "REACTION", title: "장애물 피하기", desc: "장애물(빨강)이 나타나면 클릭해서 피하세요! (시뮬레이션)", isGame: true }, // Simple reaction mini-game
            "B4": { type: "SELECTION", mode: "single", title: "틀린 글씨 찾기", desc: "문장에서 틀린 부분을 찾아 클릭하세요.", textParts: ["아버지가", "방에", "들", "어", "가신다."], answer: ["들"] },
            "C4": { type: "SELECTION", mode: "single", title: "OX 퀴즈", desc: "펭귄은 북극에 산다?", items: ["O (그렇다)", "X (아니다)"], answer: ["X (아니다)"] },
            "D4": { type: "GRAPH_CONNECT", title: "둥글게 둥글게", desc: "모든 친구들이 원처럼 연결되게 하세요.", nodes: 5, goal: "cycle" },
            "E4": { type: "SELECTION", mode: "single", title: "만약에 극장", desc: "비가 오는데 우산이 없으면?", items: ["젖는다", "마른다", "날아간다"], answer: ["젖는다"] },

            // --- Row 5 ---
            "A5": { type: "SELECTION", mode: "single", title: "베스트 포토", desc: "전체가 가장 잘 보이는 높은 곳은?", items: ["구석진 골목", "높은 언덕", "지하실"], answer: ["높은 언덕"] },
            "B5": { type: "SORTING", title: "청소 순서", desc: "먼지는 위에서 아래로! 순서를 정하세요.", items: ["책상 닦기", "바닥 쓸기", "바닥 닦기", "창문 닦기"], answer: ["창문 닦기", "책상 닦기", "바닥 쓸기", "바닥 닦기"] },
            "C5": { type: "TEXT_SUMMARY", title: "세 줄 일기", desc: "긴 글을 읽고 핵심 단어 3개를 입력하세요.", text: "오늘 친구와 학교에서 즐겁게 축구를 했다.", keywords: ["친구", "학교", "축구"] },
            "E5": { type: "ALLOCATION", title: "이어달리기", desc: "가장 빠른 친구를 마지막(앵커)에 배치하세요.", slots: ["1번 주자", "2번 주자", "3번 주자", "4번(앵커)"], items: ["거북이", "토끼", "치타(빠름)", "강아지"], answer: { "4번(앵커)": "치타(빠름)" } }
        };

        const def = DEFS[id];
        if (def) {
            if (typeof curriculumData !== 'undefined' && curriculumData[id]) {
                const cd = curriculumData[id];
                def.title = cd.activity.title;
                def.desc = cd.activity.desc; // Keep game logic desc if specific instructions needed
                document.getElementById('task-title').innerText = cd.activity.title;
                document.getElementById('task-desc').innerHTML = cd.activity.desc;
                document.getElementById('mission-goal').innerText = cd.goal;
            }
            return def;
        }
        return null;
    }

    renderUI() {
        try {
            this.container.innerHTML = '';
            const type = this.data.type;

            switch (type) {
                case "SORTING": this.renderSorting(); break;
                case "SELECTION": this.renderSelection(); break;
                case "ALLOCATION": this.renderAllocation(); break;
                case "MAZE": this.renderMaze(); break;
                case "GRAPH":
                case "GRAPH_TREE":
                case "GRAPH_DIR":
                case "GRAPH_CONNECT":
                    this.renderGraph(); break;
                case "TEXT_CIPHER":
                case "TEXT_SUMMARY":
                    this.renderText(); break;
                case "REACTION":
                    this.renderReactionGame(); break;
                default:
                    this.container.innerHTML = "Unknown Type: " + type;
            }
        } catch (err) {
            this.logError("Render Error: " + err.message);
        }
    }

    logError(msg) {
        console.error(msg);
        let logBox = document.getElementById('debug-log');
        if (!logBox) {
            logBox = document.createElement('div');
            logBox.id = 'debug-log';
            logBox.style.cssText = 'position:fixed; top:0; left:0; background:rgba(255,0,0,0.8); color:white; padding:10px; z-index:9999; font-size:12px; pointer-events:none;';
            document.body.appendChild(logBox);
        }
        logBox.innerText += "\n" + msg;
    }

    // --- 1. SORTING ---
    renderSorting() {
        const list = document.createElement('div');
        list.className = 'sort-list interact-container';

        let items = [...this.data.items];
        // Shuffle initially
        items.sort(() => Math.random() - 0.5);
        this.state.currentOrder = items;

        items.forEach((item, idx) => {
            const el = this.createDraggable(item, 'sort');
            el.dataset.idx = idx;
            list.appendChild(el);
        });

        // Drop zone is the list itself for reordering
        list.addEventListener('dragover', e => {
            e.preventDefault();
            try {
                const afterElement = this.getDragAfterElement(list, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (!draggable) return;

                if (afterElement == null) {
                    list.appendChild(draggable);
                } else {
                    list.insertBefore(draggable, afterElement);
                }
            } catch (err) { console.error(err); }
        });

        this.container.appendChild(list);
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];
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

    createDraggable(text, type) {
        const el = document.createElement('div');
        el.className = 'draggable-item';
        el.draggable = true;
        el.innerText = text;

        el.addEventListener('dragstart', () => {
            el.classList.add('dragging');
        });
        el.addEventListener('dragend', () => {
            el.classList.remove('dragging');
            // Update state for sorting
            if (type === 'sort') {
                this.state.currentOrder = [...document.querySelectorAll('.sort-list .draggable-item')].map(e => e.innerText);
            }
        });
        return el;
    }

    // --- 2. SELECTION ---
    renderSelection() {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '10px';
        container.style.justifyContent = 'center';

        // For B4 (Text Parts)
        const sources = this.data.items || this.data.textParts;
        this.state.selected = [];

        sources.forEach(item => {
            const el = document.createElement('div');
            el.className = 'draggable-item'; // reuse style
            el.style.cursor = 'pointer';
            el.innerText = item;

            el.onclick = () => {
                if (this.data.mode === 'single') {
                    // Reset others
                    container.querySelectorAll('.selected').forEach(e => e.classList.remove('selected'));
                    this.state.selected = [item];
                    el.classList.add('selected');
                } else {
                    // Multi toggle
                    el.classList.toggle('selected');
                    if (el.classList.contains('selected')) this.state.selected.push(item);
                    else this.state.selected = this.state.selected.filter(i => i !== item);
                }
            };
            container.appendChild(el);
        });
        this.container.appendChild(container);
    }

    // --- 3. ALLOCATION ---
    renderAllocation() {
        const wrap = document.createElement('div');

        // Item Source Area
        const sourceArea = document.createElement('div');
        sourceArea.style.marginBottom = '20px';
        sourceArea.style.padding = '10px';
        sourceArea.style.border = '1px solid #eee';
        sourceArea.innerHTML = '<small>여기에 있는 항목을 아래로 드래그하세요</small><br>';

        this.data.items.forEach(item => {
            const el = this.createDraggable(item, 'alloc');
            el.id = 'item-' + item;
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', item);
            });
            sourceArea.appendChild(el);
        });
        wrap.appendChild(sourceArea);

        // Slots
        const slotContainer = document.createElement('div');
        slotContainer.className = 'slot-container';

        this.state.allocation = {};

        this.data.slots.forEach(slotKey => {
            const slot = document.createElement('div');
            slot.className = 'drop-zone';
            slot.innerHTML = `<strong>${slotKey}</strong>`;

            slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
            slot.addEventListener('dragleave', e => { slot.classList.remove('drag-over'); });
            slot.addEventListener('drop', e => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const data = e.dataTransfer.getData('text');
                // clear previous content if any (except title)
                const existing = slot.querySelector('.draggable-item');
                if (existing) existing.remove();

                // Clone visual
                const clone = document.createElement('div');
                clone.className = 'draggable-item';
                clone.innerText = data;
                slot.appendChild(clone);

                this.state.allocation[slotKey] = data;
            });
            slotContainer.appendChild(slot);
        });
        wrap.appendChild(slotContainer);
        this.container.appendChild(wrap);
    }

    // --- 4. GRAPH ---
    renderGraph() {
        const cvs = document.createElement('canvas');
        cvs.width = 600; cvs.height = 400;
        this.container.appendChild(cvs);
        const ctx = cvs.getContext('2d');

        // Check if nodes is a number (for generating generic nodes)
        let nodeData = this.data.nodes;
        if (typeof nodeData === 'number') {
            nodeData = Array.from({ length: nodeData }, (_, i) => String(i + 1));
        }

        const nodes = nodeData.map((label, i) => {
            // Circle layout
            const angle = (i / nodeData.length) * Math.PI * 2;
            return { x: 300 + Math.cos(angle) * 150, y: 200 + Math.sin(angle) * 150, label: label };
        });

        this.state.edges = [];
        let draggingNode = null;
        let diff = { x: 0, y: 0 };

        // Draw Loop
        const draw = () => {
            // Safety check if canvas is gone
            if (!this.container.contains(cvs)) return;

            ctx.clearRect(0, 0, 600, 400);

            // Edges
            ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
            this.state.edges.forEach(e => {
                ctx.beginPath();
                ctx.moveTo(e.from.x, e.from.y);
                ctx.lineTo(e.to.x, e.to.y);
                ctx.stroke();

                // Arrow?
                if (this.data.type === 'GRAPH_DIR' || this.data.type === 'GRAPH_TREE') {
                    // Draw small circle at end
                    ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(e.to.x, e.to.y, 3, 0, Math.PI * 2); ctx.fill();
                }
            });

            // Nodes
            nodes.forEach(n => {
                ctx.fillStyle = 'white'; ctx.strokeStyle = '#2c3e50';
                ctx.beginPath(); ctx.arc(n.x, n.y, 25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#333'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.font = 'bold 12px serif';
                ctx.fillText(n.label, n.x, n.y);
            });

            requestAnimationFrame(draw);
        };
        draw();

        // Interaction
        let startNode = null;

        cvs.addEventListener('mousedown', e => {
            try {
                const { x, y } = this.getPos(e, cvs);
                const clicked = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 25);

                if (clicked) {
                    startNode = clicked;
                    draggingNode = clicked;
                }
            } catch (err) { console.error(err); }
        });

        cvs.addEventListener('mousemove', e => {
            if (draggingNode) {
                const { x, y } = this.getPos(e, cvs);
                // Simple verify boundaries?
                draggingNode.x = x; draggingNode.y = y;
            }
        });

        cvs.addEventListener('mouseup', e => {
            try {
                const { x, y } = this.getPos(e, cvs);
                if (startNode) {
                    const endNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 25);
                    if (endNode && endNode !== startNode) {
                        // Create Edge
                        this.state.edges.push({ from: startNode, to: endNode });
                    }
                }
            } catch (e) { console.error(e); }
            startNode = null;
            draggingNode = null;
        });
    }

    getPos(e, cvs) {
        const r = cvs.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    // --- 5. MAZE ---
    renderMaze() {
        const grid = document.createElement('div');
        grid.className = 'maze-grid';
        grid.style.gridTemplateColumns = `repeat(5, 50px)`;

        this.state.mazePath = [];

        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.className = 'maze-cell';
            const x = i % 5; const y = Math.floor(i / 5);

            if (x === 0 && y === 0) cell.classList.add('start');
            if (x === 4 && y === 4) cell.classList.add('end');

            cell.dataset.idx = i;
            cell.onclick = () => {
                if (cell.classList.contains('path')) {
                    cell.classList.remove('path');
                    this.state.mazePath = this.state.mazePath.filter(idx => idx !== i);
                } else {
                    cell.classList.add('path');
                    this.state.mazePath.push(i);
                }
            };
            grid.appendChild(cell);
        }
        this.container.appendChild(grid);
    }

    // --- 6. TEXT ---
    renderText() {
        const txt = document.createElement('textarea');
        txt.className = 'text-input-area';
        txt.placeholder = "정답을 입력하세요...";
        this.container.appendChild(txt);
        this.state.textInput = txt;
    }

    // --- 7. REACTION GAME ---
    renderReactionGame() {
        this.container.innerHTML = `<div style="text-align:center;">
            <h3>빨간색이 나오면 클릭하세요!</h3>
            <div id="reaction-box" style="width:200px; height:200px; background:#ddd; margin:20px auto; border-radius:50%;"></div>
            <p id="time-res">준비...</p>
        </div>`;
        const box = document.getElementById('reaction-box');
        const res = document.getElementById('time-res');
        let startTime = 0;
        let waiting = true;

        setTimeout(() => {
            box.style.background = 'red';
            box.style.cursor = 'pointer';
            startTime = Date.now();
            waiting = false;
        }, 2000 + Math.random() * 2000);

        box.onclick = () => {
            if (waiting) {
                res.innerText = "너무 빨라요!";
            } else {
                const time = Date.now() - startTime;
                res.innerText = `반응 속도: ${time}ms`;
                this.state.reactionSuccess = true;
            }
        };
    }

    // --- VALIDATION ---
    checkAnswer() {
        let isCorrect = false;
        const type = this.data.type;

        try {
            if (type === 'SORTING') {
                const current = this.state.currentOrder; // Array of strings
                // Check if JSON match or loose match
                // For B5 (cleaning): partial order or exact? Let's check exact for now.
                // Using join to compare simple arrays
                isCorrect = (JSON.stringify(current) === JSON.stringify(this.data.answer));
            }
            else if (type === 'SELECTION') {
                // Compare sets
                const userSet = new Set(this.state.selected);
                const ansSet = new Set(this.data.answer);
                if (userSet.size !== ansSet.size) isCorrect = false;
                else {
                    isCorrect = true;
                    for (let a of ansSet) if (!userSet.has(a)) isCorrect = false;
                }
            }
            else if (type === 'ALLOCATION') {
                // keys match
                const userMap = this.state.allocation;
                const ansMap = this.data.answer;
                isCorrect = true;
                for (let k in ansMap) {
                    if (userMap[k] !== ansMap[k]) isCorrect = false;
                }
                if (Object.keys(userMap).length < Object.keys(ansMap).length) isCorrect = false;
            }
            else if (type.startsWith('GRAPH')) {
                // Check connectivity simply
                // e.g. D1: spanning tree. D3: specific edges.
                if (type === 'GRAPH_DIR') {
                    // Check edge existence
                    const userEdges = this.state.edges.map(e => e.from.label + "->" + e.to.label);
                    const reqEdges = this.data.answer.map(e => e[0] + "->" + e[1]);
                    // Check if all requested edges exist
                    isCorrect = reqEdges.every(r => userEdges.includes(r));
                } else if (type === 'GRAPH' && this.data.goal === 'spanning_tree') {
                    // Check if all nodes connected (one component)
                    // Simplified: check edge count >= nodes -1
                    isCorrect = (this.state.edges.length >= this.data.nodes.length - 1);
                } else if (type === 'GRAPH_CONNECT') {
                    // Cycle check... simplified
                    isCorrect = (this.state.edges.length >= this.data.nodes);
                }
            }
            else if (type === 'MAZE') {
                // BFS check if path connects start to end
                // Simply check if start(0) and end(24) are in state and connected?
                // Just checking if 0 and 24 are in path array for simple check
                const p = this.state.mazePath;
                isCorrect = (p.includes(0) && p.includes(24) && p.length >= 5);
            }
            else if (type === 'TEXT_CIPHER') {
                isCorrect = (this.state.textInput.value.trim() === this.data.answer);
            }
            else if (type === 'TEXT_SUMMARY') {
                const val = this.state.textInput.value;
                const keywords = this.data.keywords;
                isCorrect = keywords.every(k => val.includes(k));
            }
            else if (type === 'REACTION') {
                isCorrect = this.state.reactionSuccess;
            }

        } catch (e) { console.error(e); }

        this.showFeedback(isCorrect);
    }
}
