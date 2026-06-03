import os
import json

TASKS = {
    "A1": { "type": "SELECTION", "mode": "multi", "title": "몽타주 만들기", "desc": "범인의 특징(눈이 큼, 입술이 얇음)을 모두 찾으세요.", "items": ["눈이 큼", "코가 오똑함", "입술이 얇음", "눈썹이 진함"], "answer": ["눈이 큼", "입술이 얇음"] },
    "B1": { "type": "SORTING", "title": "요리 레시피", "desc": "요리 순서를 올바르게 배열하세요.", "items": ["물 끓이기", "면 넣기", "스프 넣기", "계란 넣기", "먹기"], "answer": ["물 끓이기", "스프 넣기", "면 넣기", "계란 넣기", "먹기"] },
    "D1": { "type": "GRAPH", "title": "마니또 연결", "desc": "모든 친구들을 하나로 연결하세요.", "nodes": ["나", "철수", "영희", "민수"], "edges": [], "goal": "spanning_tree" },
    "E1": { "type": "SELECTION", "mode": "single", "title": "날씨 캐스터", "desc": "회색 구름이 꼈습니다. 어떤 날씨일까요?", "items": ["맑음 ☀️", "비 ☔", "눈 ❄️"], "answer": ["비 ☔"] },

    "B2": { "type": "SORTING", "title": "등교 준비", "desc": "등교 준비 순서를 맞추세요.", "items": ["일어나기", "세수하기", "옷 입기", "가방 싸기", "학교 가기"], "answer": ["일어나기", "세수하기", "옷 입기", "가방 싸기", "학교 가기"] },
    "D2": { "type": "GRAPH_TREE", "title": "가계도 그리기", "desc": "할아버지 -> 아버지 -> 나 순서로 화살표를 연결하세요.", "nodes": ["할아버지", "아버지", "나"], "edges": [], "answer": [["할아버지", "아버지"], ["아버지", "나"]] },
    "E2": { "type": "ALLOCATION", "title": "역할 분담", "desc": "각 역할을 알맞은 사람에게 배정하세요.", "slots": ["청소", "우유", "주번"], "items": ["철수(힘셈)", "영희(꼼꼼)", "민수(일찍옴)"], "answer": { "청소": "철수(힘셈)", "우유": "영희(꼼꼼)", "주번": "민수(일찍옴)" } },
    
    "A3": { "type": "MAZE", "title": "미로 탈출", "desc": "S에서 E까지 가는 길을 클릭하여 만드세요.", "size": 5, "start": [0, 0], "end": [4, 4] },
    "C3": { "type": "TEXT_CIPHER", "title": "암호 만들기", "desc": "A=1, B=2, C=3 입니다. 'ABC'는?", "answer": "123" },
    "D3": { "type": "GRAPH_DIR", "title": "먹이사슬", "desc": "풀 -> 토끼 -> 늑대 순서로 연결하세요.", "nodes": ["풀", "토끼", "늑대", "호랑이"], "answer": [["풀", "토끼"], ["토끼", "늑대"], ["늑대", "호랑이"]] },
    "E3": { "type": "ALLOCATION", "title": "학급 헌법", "desc": "상황에 맞는 규칙을 완성하세요.", "slots": ["친구가 때리면", "숙제를 안 해오면"], "items": ["선생님께 알린다", "남아서 하고 간다", "같이 때린다(X)"], "answer": { "친구가 때리면": "선생님께 알린다", "숙제를 안 해오면": "남아서 하고 간다" } },

    "A4": { "type": "REACTION", "title": "장애물 피하기", "desc": "장애물(빨강)이 나타나면 클릭해서 피하세요! (시뮬레이션)", "isGame": True },
    "B4": { "type": "SELECTION", "mode": "single", "title": "틀린 글씨 찾기", "desc": "문장에서 틀린 부분을 찾아 클릭하세요.", "textParts": ["아버지가", "방에", "들", "어", "가신다."], "answer": ["들"] },
    "C4": { "type": "SELECTION", "mode": "single", "title": "OX 퀴즈", "desc": "펭귄은 북극에 산다?", "items": ["O (그렇다)", "X (아니다)"], "answer": ["X (아니다)"] },
    "D4": { "type": "GRAPH_CONNECT", "title": "둥글게 둥글게", "desc": "모든 친구들이 원처럼 연결되게 하세요.", "nodes": 5, "goal": "cycle" },
    "E4": { "type": "SELECTION", "mode": "single", "title": "만약에 극장", "desc": "비가 오는데 우산이 없으면?", "items": ["젖는다", "마른다", "날아간다"], "answer": ["젖는다"] },

    "A5": { "type": "SELECTION", "mode": "single", "title": "베스트 포토", "desc": "전체가 가장 잘 보이는 높은 곳은?", "items": ["구석진 골목", "높은 언덕", "지하실"], "answer": ["높은 언덕"] },
    "B5": { "type": "SORTING", "title": "청소 순서", "desc": "먼지는 위에서 아래로! 순서를 정하세요.", "items": ["책상 닦기", "바닥 쓸기", "바닥 닦기", "창문 닦기"], "answer": ["창문 닦기", "책상 닦기", "바닥 쓸기", "바닥 닦기"] },
    "C5": { "type": "TEXT_SUMMARY", "title": "세 줄 일기", "desc": "긴 글을 읽고 핵심 단어 3개를 입력하세요.", "text": "오늘 친구와 학교에서 즐겁게 축구를 했다.", "keywords": ["친구", "학교", "축구"] },
    "E5": { "type": "ALLOCATION", "title": "이어달리기", "desc": "가장 빠른 친구를 마지막(앵커)에 배치하세요.", "slots": ["1번 주자", "2번 주자", "3번 주자", "4번(앵커)"], "items": ["거북이", "토끼", "치타(빠름)", "강아지"], "answer": { "4번(앵커)": "치타(빠름)" } }
}

def to_js(obj):
    return json.dumps(obj, indent=4, ensure_ascii=False)

def generate_code(id, data):
    type_ = data['type']
    render_method = ""
    check_method = ""
    extra_methods = ""

    if type_ == 'SORTING':
        render_method = """
    renderUI() {
        const list = document.createElement('div');
        list.className = 'sort-list interact-container';
        let items = [...this.data.items];
        items.sort(() => Math.random() - 0.5);
        this.state.currentOrder = items;

        items.forEach((item, idx) => {
            const el = this.createDraggable(item, 'sort');
            list.appendChild(el);
        });

        list.addEventListener('dragover', e => {
            e.preventDefault();
            try {
                const afterElement = this.getDragAfterElement(list, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (!draggable) return;
                if (afterElement == null) list.appendChild(draggable);
                else list.insertBefore(draggable, afterElement);
            } catch(e) { console.error(e); }
        });
        this.container.appendChild(list);
    }"""
        check_method = """
    checkAnswer() {
        const current = [...document.querySelectorAll('.sort-list .draggable-item')].map(e => e.innerText);
        const isCorrect = (JSON.stringify(current) === JSON.stringify(this.data.answer));
        this.showFeedback(isCorrect);
    }"""
        extra_methods = """
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
            else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    createDraggable(text, type) {
        const el = document.createElement('div');
        el.className = 'draggable-item';
        el.draggable = true;
        el.innerText = text;
        el.addEventListener('dragstart', () => el.classList.add('dragging'));
        el.addEventListener('dragend', () => el.classList.remove('dragging'));
        return el;
    }"""

    elif type_ == 'SELECTION':
        is_multi = data.get('mode') == 'multi'
        src = data.get('items') or data.get('textParts')
        render_method = f"""
    renderUI() {{
        const container = document.createElement('div');
        container.style.cssText = 'display:flex; flex-wrap:wrap; gap:10px; justify-content:center;';
        this.state.selected = [];
        const items = {to_js(src)};
        
        items.forEach(item => {{
            const el = document.createElement('div');
            el.className = 'draggable-item';
            el.style.cursor = 'pointer';
            el.innerText = item;
            el.onclick = () => {{
                {'''
                el.classList.toggle('selected');
                if(el.classList.contains('selected')) this.state.selected.push(item);
                else this.state.selected = this.state.selected.filter(i => i !== item);
                ''' if is_multi else '''
                container.querySelectorAll('.selected').forEach(e => e.classList.remove('selected'));
                this.state.selected = [item];
                el.classList.add('selected');
                '''}
            }};
            container.appendChild(el);
        }});
        this.container.appendChild(container);
    }}"""
        check_method = """
    checkAnswer() {
        const userSet = new Set(this.state.selected);
        const ansSet = new Set(this.data.answer);
        let isCorrect = (userSet.size === ansSet.size);
        if(isCorrect) {
            for(let a of ansSet) if(!userSet.has(a)) isCorrect = false;
        }
        this.showFeedback(isCorrect);
    }"""

    elif type_ == 'ALLOCATION':
        render_method = """
    renderUI() {
        const wrap = document.createElement('div');
        const sourceArea = document.createElement('div');
        sourceArea.style.cssText = 'margin-bottom:20px; padding:10px; border:1px solid #eee;';
        sourceArea.innerHTML = '<small>항목을 아래로 드래그하세요</small><br>';
        
        this.data.items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'draggable-item';
            el.draggable = true;
            el.innerText = item;
            el.addEventListener('dragstart', e => e.dataTransfer.setData('text', item));
            sourceArea.appendChild(el);
        });
        wrap.appendChild(sourceArea);

        const slotContainer = document.createElement('div');
        slotContainer.className = 'slot-container';
        this.state.allocation = {};
        
        this.data.slots.forEach(slotKey => {
            const slot = document.createElement('div');
            slot.className = 'drop-zone';
            slot.innerHTML = '<strong>'+slotKey+'</strong>';
            
            slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
            slot.addEventListener('dragleave', e => slot.classList.remove('drag-over'));
            slot.addEventListener('drop', e => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const data = e.dataTransfer.getData('text');
                const existing = slot.querySelector('.draggable-item');
                if(existing) existing.remove();
                
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
    }"""
        check_method = """
    checkAnswer() {
        const userMap = this.state.allocation;
        const ansMap = this.data.answer;
        let isCorrect = true;
        for(let k in ansMap) {
            if(userMap[k] !== ansMap[k]) isCorrect = false;
        }
        if(Object.keys(userMap).length < Object.keys(ansMap).length) isCorrect = false;
        this.showFeedback(isCorrect);
    }"""

    elif type_ == 'MAZE':
        render_method = """
    renderUI() {
        const grid = document.createElement('div');
        grid.className = 'maze-grid';
        grid.style.gridTemplateColumns = 'repeat(5, 50px)';
        this.state.mazePath = [];

        for(let i=0; i<25; i++) {
            const cell = document.createElement('div');
            cell.className = 'maze-cell';
            const x = i%5; const y = Math.floor(i/5);
            if(x===0 && y===0) cell.classList.add('start');
            if(x===4 && y===4) cell.classList.add('end');
            
            cell.onclick = () => {
                if(cell.classList.contains('path')) {
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
    }"""
        check_method = """
    checkAnswer() {
        const p = this.state.mazePath;
        const isCorrect = (p.includes(0) && p.includes(24) && p.length >= 5);
        this.showFeedback(isCorrect);
    }"""

    elif type_.startswith('GRAPH'):
        render_method = f"""
    renderUI() {{
        const cvs = document.createElement('canvas');
        cvs.width = 600; cvs.height = 400;
        this.container.appendChild(cvs);
        const ctx = cvs.getContext('2d');
        
        let nodeData = this.data.nodes;
        if(typeof nodeData === 'number') nodeData = Array.from({{length:nodeData}}, (_,i)=>String(i+1));
        
        const nodes = nodeData.map((label, i) => {{
            const angle = (i/nodeData.length) * Math.PI * 2;
            return {{ x: 300 + Math.cos(angle)*150, y: 200 + Math.sin(angle)*150, label: label }};
        }});
        
        this.state.edges = [];
        let startNode = null; 
        let draggingNode = null;
        
        const draw = () => {{
            if(!this.container.contains(cvs)) return;
            ctx.clearRect(0,0,600,400);
            
            ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
            this.state.edges.forEach(e => {{
                ctx.beginPath(); ctx.moveTo(e.from.x, e.from.y); ctx.lineTo(e.to.x, e.to.y); ctx.stroke();
                if('{type_}' === 'GRAPH_DIR' || '{type_}' === 'GRAPH_TREE') {{
                    ctx.fillStyle='red'; ctx.beginPath(); ctx.arc(e.to.x, e.to.y, 3, 0, Math.PI*2); ctx.fill();
                }}
            }});
            
            nodes.forEach(n => {{
                ctx.fillStyle = 'white'; ctx.strokeStyle = '#2c3e50';
                ctx.beginPath(); ctx.arc(n.x, n.y, 25, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#333'; ctx.textAlign='center'; ctx.textBaseline='middle';
                ctx.font='bold 12px serif'; ctx.fillText(n.label, n.x, n.y);
            }});
            requestAnimationFrame(draw);
        }};
        draw();
        
        const getPos = (e) => {{ const r=cvs.getBoundingClientRect(); return {{x:e.clientX-r.left, y:e.clientY-r.top}}; }};
        
        cvs.addEventListener('mousedown', e => {{
            const {{x,y}} = getPos(e);
            const clicked = nodes.find(n => Math.hypot(n.x-x, n.y-y) < 25);
            if(clicked) {{ 
                startNode = clicked; 
                draggingNode = clicked; // Enable move
            }}
        }});

        cvs.addEventListener('mousemove', e => {{
            if(draggingNode) {{
                const {{x,y}} = getPos(e);
                draggingNode.x = x; draggingNode.y = y;
            }}
        }});
        
        cvs.addEventListener('mouseup', e => {{
            if(startNode) {{
                const {{x,y}} = getPos(e);
                const endNode = nodes.find(n => Math.hypot(n.x-x, n.y-y) < 25);
                if(endNode && endNode !== startNode) {{
                    this.state.edges.push({{from:startNode, to:endNode}});
                }}
            }}
            startNode = null; draggingNode = null;
        }});
    }}"""
        if type_ in ['GRAPH_DIR', 'GRAPH_TREE']:
             check_method = """
    checkAnswer() {
        const userEdges = this.state.edges.map(e => e.from.label + "->" + e.to.label);
        const reqEdges = this.data.answer.map(e => e[0] + "->" + e[1]);
        const isCorrect = reqEdges.every(r => userEdges.includes(r));
        this.showFeedback(isCorrect);
    }"""
        elif type_ == 'GRAPH_CONNECT': 
             check_method = """
    checkAnswer() {
        const isCorrect = (this.state.edges.length >= this.data.nodes);
        this.showFeedback(isCorrect);
    }"""
        else:
             check_method = """
    checkAnswer() {
        const isCorrect = (this.state.edges.length >= this.data.nodes.length - 1);
        this.showFeedback(isCorrect);
    }"""

    elif type_.startswith('TEXT'):
        render_method = f"""
    renderUI() {{
        const txt = document.createElement('textarea');
        txt.className = 'text-input-area';
        txt.placeholder = '정답을 입력하세요...';
        this.container.appendChild(txt);
        this.state.textInput = txt;
        
        if('{type_}' === 'TEXT_SUMMARY') {{
            const p = document.createElement('div');
            p.innerText = this.data.text;
            p.style.background = '#eee';
            p.style.padding = '10px';
            p.style.marginBottom = '10px';
            this.container.insertBefore(p, txt);
        }}
    }}"""
        if type_ == 'TEXT_CIPHER':
             check_method = """
    checkAnswer() { const val = this.state.textInput.value.trim(); this.showFeedback(val === this.data.answer); }"""
        else:
             check_method = """
    checkAnswer() { const val = this.state.textInput.value; const isCorrect = this.data.keywords.every(k => val.includes(k)); this.showFeedback(isCorrect); }"""

    elif type_ == 'REACTION':
        render_method = """
    renderUI() {
        this.container.innerHTML = '<div style="text-align:center;"><h3>빨간색이 나오면 클릭하세요!</h3><div id="reaction-box" style="width:200px; height:200px; background:#ddd; margin:20px auto; border-radius:50%;"></div><p id="time-res">준비...</p></div>';
        const box = document.getElementById('reaction-box');
        const res = document.getElementById('time-res');
        let startTime = 0; let waiting = true;
        
        setTimeout(() => {
            if(!document.contains(box)) return;
            box.style.background = 'red'; box.style.cursor='pointer';
            startTime = Date.now(); waiting = false;
        }, 2000 + Math.random()*2000);
        
        box.onclick = () => {
            if(waiting) res.innerText = "너무 빨라요!";
            else {
                const time = Date.now() - startTime;
                res.innerText = "반응 속도: " + time + "ms";
                this.state.reactionSuccess = true;
            }
        };
    }"""
        check_method = """checkAnswer() { this.showFeedback(this.state.reactionSuccess); }"""

    return f"""
class Task{id} {{
    constructor(taskId, containerId) {{
        this.taskId = taskId;
        this.container = document.getElementById(containerId);
        this.data = {to_js(data)};
        this.state = {{}};
        this.init();
    }}

    init() {{
        if(typeof curriculumData !== 'undefined' && curriculumData[this.taskId]) {{
            const cd = curriculumData[this.taskId];
            const titleEl = document.getElementById('task-title');
            if(titleEl) titleEl.innerHTML = cd.activity.title;
            const descEl = document.getElementById('task-desc');
            if(descEl) descEl.innerHTML = cd.activity.desc; // FIXED: innerHTML for tags
            const goalEl = document.getElementById('mission-goal');
            if(goalEl) goalEl.innerHTML = cd.goal;
        }}
        this.renderUI();
        
        if(!document.querySelector('.feedback-msg')) {{
            const msg = document.createElement('div');
            msg.className = 'feedback-msg';
            document.body.appendChild(msg);
        }}
    }}

    showFeedback(isCorrect, msgText) {{
        const msg = document.querySelector('.feedback-msg');
        if(!msg) return;
        msg.innerText = msgText || (isCorrect ? "정답입니다! 훌륭해요! 🎉" : "다시 생각해보세요. 🤔");
        msg.className = 'feedback-msg show ' + (isCorrect ? 'correct' : 'wrong');
        setTimeout(() => {{ msg.classList.remove('show'); }}, 2000);
    }}

    {render_method}
    {check_method}
    {extra_methods}
}}

window.engine = new Task{id}('{id}', 'task-stage');
"""

# Main Execution
task_dir = "js/tasks"
if not os.path.exists(task_dir):
    os.makedirs(task_dir)

for task_id, task_data in TASKS.items():
    code = generate_code(task_id, task_data)
    with open(os.path.join(task_dir, f"{task_id}.js"), "w", encoding="utf-8") as f:
        f.write(code)
    print(f"Generated {task_id}.js")
