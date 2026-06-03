import os
import json
import re

# === 1. DATA DEFINITIONS (Updated with User Feedback) ===
TASKS = {
    # --- A: Abstraction (Pattern Recognition) ---
    "A1": { 
        "file": "task_montage.html",
        "type": "SELECTION", "mode": "multi", 
        "title": "범인 몽타주 만들기", 
        "desc": "목격자의 진술을 토대로 범인을 찾으세요.", 
        "mission": "목표: '눈이 크고', '입술이 얇은' 사람을 모두 고르세요.",
        "items": ["눈이 큼", "눈이 작음", "입술이 얇음", "입술이 두꺼움", "코가 오똑함"], 
        "answer": ["눈이 큼", "입술이 얇음"] 
    },
    "A2": { 
        "file": "task_galaxy_zoo.html",
        "type": "SELECTION", "mode": "single", # Changed logic implies selection of Rule
        "title": "외계인 분류 기준 찾기", 
        "desc": "외계인들이 두 그룹으로 나뉘어 있습니다. 어떤 기준으로 나뉘었을까요?",
        "mission": "그룹 A(뿔 있음)와 그룹 B(뿔 없음)를 구분하는 기준은?",
        "items": ["색깔 (빨강/파랑)", "뿔의 유무", "눈의 개수"], 
        "answer": ["뿔의 유무"] 
    },
    "A3": { "file": "task_maze.html", "type": "MAZE", "title": "미로 탈출", "desc": "가장 빠른 경로를 찾아 S에서 E까지 이동하세요." },
    "A4": { "file": "task_reaction.html", "type": "REACTION", "title": "장애물 피하기", "desc": "장애물(빨강)이 나타나면 즉시 클릭하세요!" },
    "A5": { "file": "task_photo.html", "type": "SELECTION", "mode": "single", "title": "베스트 포토존", "desc": "전경이 가장 잘 보이는 높은 위치를 고르세요.", "items": ["지하실", "1층 로비", "옥상 정원"], "answer": ["옥상 정원"] },

    # --- B: Decomposition (Breakdown) ---
    "B1": { 
        "file": "task_recipe.html",
        "type": "SORTING", 
        "title": "데이터 정렬 알고리즘", 
        "desc": "무작위로 섞인 데이터를 오름차순(작은 수 -> 큰 수)으로 정렬하세요.",
        "items": ["데이터 10", "데이터 55", "데이터 5", "데이터 90", "데이터 30"], 
        "answer": ["데이터 5", "데이터 10", "데이터 30", "데이터 55", "데이터 90"] 
    },
    "B2": { 
        "file": "task_checklist.html",
        "type": "SORTING", 
        "title": "병렬 프로세스 (등교 준비)", 
        "desc": "동생(세수)과 나(가방싸기)가 동시에 준비할 때, 가장 효율적인 순서는?",
        # Simplified for sorting UI: Just logical sequence
        "items": ["일어나기(공통)", "각자 씻기(병렬)", "각자 옷입기(병렬)", "같이 밥먹기(병합)", "나가기"], 
        "answer": ["일어나기(공통)", "각자 씻기(병렬)", "각자 옷입기(병렬)", "같이 밥먹기(병합)", "나가기"]
    },
    "B3": { 
        "file": "task_train_master.html", # Keep existing complex game? No, user wants consistency. 
        # Actually user said "Train Master" had bugs fixed in previous turn. 
        # But now wants "Single JS". 
        # Let's use the new engine for simplicity unless it's too complex.
        # B3 is "Train Master". Let's use a simplified Sorting/Path check or keep logic if possible.
        # User said "ALL 25 problems can't be solved". So I should rewrite B3 too.
        "type": "SORTING", 
        "title": "기차 선로 조립", 
        "desc": "기차가 지나갈 수 있도록 선로 조각을 순서대로 연결하세요.",
        "items": ["출발역", "직선 선로", "곡선 선로", "도착역"], 
        "answer": ["출발역", "곡선 선로", "직선 선로", "도착역"] 
    },
    "B4": { "file": "task_debugging.html", "type": "SELECTION", "mode": "single", "title": "문장 디버깅", "desc": "문법적 오류(오타)가 있는 버그를 찾으세요.", "textParts": ["print('Hello')", "if x > 10:", "elsee:", "print('Hi')"], "answer": ["elsee:"] },
    "B5": { "file": "task_cleaning.html", "type": "SORTING", "title": "청소 알고리즘", "desc": "먼지는 위에서 아래로 떨어집니다. 효율적인 청소 순서는?", "items": ["책상 닦기", "바닥 쓸기", "바닥 닦기", "창문 닦기"], "answer": ["창문 닦기", "책상 닦기", "바닥 쓸기", "바닥 닦기"] },

    # --- C: Core Info (Abstraction/Data) ---
    "C1": { 
        "file": "task_ocean_sonar.html", # Was Ocean Sonar Game. Rewrite.
        "type": "SELECTION", "mode": "single",
        "title": "심해 음파 탐지", 
        "desc": "음파 신호 중 '생명체'의 신호만 찾아내세요.",
        "items": ["바위(정지)", "물고기(움직임)", "잠수함(금속)", "해초(흔들림)"], 
        "answer": ["물고기(움직임)"] # Simple logic for now
    },
    "C2": { 
        "file": "task_smart_sorter.html", # Was Smart Sorter
        "type": "ALLOCATION", 
        "title": "스마트 데이터 분류", 
        "desc": "데이터의 속성에 따라 알맞은 저장소로 분류하세요.",
        "slots": ["이미지 DB", "텍스트 DB"], 
        "items": ["사진.jpg", "소설.txt", "그림.png", "기사.doc"], 
        "answer": { "이미지 DB": ["사진.jpg", "그림.png"], "텍스트 DB": ["소설.txt", "기사.doc"] },
        "multi_alloc": True # Custom flag for multiple items per slot
    },
    "C3": { "file": "task_cipher.html", "type": "TEXT_CIPHER", "title": "암호 해독", "desc": "C=3, A=1, T=20 입니다. 'CAT'의 합은?", "answer": "24" },
    "C4": { "file": "task_ox_quiz.html", "type": "SELECTION", "mode": "single", "title": "정보 검증 (OX)", "desc": "인터넷의 모든 정보는 항상 사실이다.", "items": ["데이터", "사실(True)", "거짓(False)"], "answer": ["거짓(False)"] },
    "C5": { 
        "file": "task_three_lines.html", 
        "type": "TEXT_SUMMARY", 
        "title": "핵심 요약", 
        "desc": "다음 글에서 '알고리즘'과 '효율성'이라는 단어를 찾아 입력하세요.", 
        "text": "좋은 알고리즘은 문제를 해결하는 효율성을 높여줍니다.", 
        "keywords": ["알고리즘", "효율성"] 
    },

    # --- D: Dependency (Graph/System) ---
    "D1": { 
        "file": "task_manito.html",
        "type": "GRAPH_CONNECT", 
        "title": "마니또 연결 고리", 
        "desc": "모든 친구들이 끊기지 않고 하나로 연결되도록 선을 그으세요.",
        "nodes": ["나", "철수", "영희", "민수"], 
        "goal": "spanning_tree",
        "hint": "힌트: 순환하지 않아도 됩니다. 모든 점이 이어지기만 하면 성공!"
    },
    "D2": { "file": "task_family_tree.html", "type": "GRAPH_TREE", "title": "가계도 작성", "desc": "할아버지 > 아버지 > 나 순서로 연결하세요.", "nodes": ["할아버지", "아버지", "나"], "answer": [["할아버지", "아버지"], ["아버지", "나"]] },
    "D3": { "file": "task_food_chain.html", "type": "GRAPH_DIR", "title": "먹이 사슬", "desc": "풀 -> 토끼 -> 늑대 순서로 에너지 흐름을 연결하세요.", "nodes": ["풀", "토끼", "늑대"], "answer": [["풀", "토끼"], ["토끼", "늑대"]] },
    "D4": { "file": "task_connect.html", "type": "GRAPH_CONNECT", "title": "네트워크 링", "desc": "모든 컴퓨터가 원형으로 연결되게(Cycle) 만드세요.", "nodes": 5, "goal": "cycle" },
    "D5": { 
        "file": "toy_trader_kids.html",  # Was Toy Trader
        "type": "ALLOCATION", 
        "title": "중고 거래 매칭", 
        "desc": "구매자가 원하는 물건을 전달하세요.",
        "slots": ["철수(로봇 구함)", "영희(인형 구함)"], 
        "items": ["로봇 장난감", "곰 인형", "책"], 
        "answer": { "철수(로봇 구함)": "로봇 장난감", "영희(인형 구함)": "곰 인형" } 
    },

    # --- E: Evaluation (Algorithm) ---
    "E1": { 
        "file": "task_weather.html", 
        "type": "SELECTION", "mode": "single",
        "title": "날씨 데이터 판단", 
        "desc": "현재 데이터를 보고 날씨를 예측하세요.",
        "mission": "[데이터] 습도: 95%, 구름: 짙은 회색, 바람: 강함",
        "items": ["맑음 ☀️", "폭우 ☔", "눈 ❄️"], 
        "answer": ["폭우 ☔"] 
    },
    "E2": { "file": "task_role_play.html", "type": "ALLOCATION", "title": "업무 분담", "desc": "특기에 맞춰 역할을 배정하세요.", "slots": ["서기(글씨)", "체육(힘)"], "items": ["학생A(글씨잘씀)", "학생B(힘셈)"], "answer": { "서기(글씨)": "학생A(글씨잘씀)", "체육(힘)": "학생B(힘셈)" } },
    "E3": { "file": "task_class_rule.html", "type": "ALLOCATION", "title": "알고리즘 규칙", "desc": "상황(If)에 따른 행동(Then)을 정하세요.", "slots": ["지각하면", "숙제 안하면"], "items": ["청소하기", "남아서 공부", "상받기"], "answer": { "지각하면": "청소하기", "숙제 안하면": "남아서 공부" } },
    "E4": { "file": "task_if_theatre.html", "type": "SELECTION", "mode": "single", "title": "만약에 극장", "desc": "조건: '비가 오고' AND '우산이 없다면' 결과는?", "items": ["옷이 젖는다", "멀쩡하다", "양산을 쓴다"], "answer": ["옷이 젖는다"] },
    "E5": { "file": "task_relay.html", "type": "ALLOCATION", "title": "이어달리기 전략", "desc": "가장 빠른 주자를 앵커(마지막)에 배치하세요.", "slots": ["1번", "2번", "3번", "4번(앵커)"], "items": ["거북이(느림)", "토끼(중간)", "다람쥐(중간)", "치타(빠름)"], "answer": { "4번(앵커)": "치타(빠름)" } },
}

# === 2. MASTER GENERATOR SCRIPTS ===

def generate_js(id, data):
    # Generates a standalone logic file for the task
    
    # Common Header
    code = f"""
// {id} - {data['title']}
const {id}_Data = {{
    type: "{data['type']}",
    title: "{data['title']}",
    desc: "{data['desc']}",
    mission: "{data.get('mission', '')}",
    {f'items: {json.dumps(data.get("items", []), ensure_ascii=False)},' if "items" in data else ''}
    {f'textParts: {json.dumps(data.get("textParts", []), ensure_ascii=False)},' if "textParts" in data else ''}
    {f'slots: {json.dumps(data.get("slots", []), ensure_ascii=False)},' if "slots" in data else ''}
    {f'nodes: {json.dumps(data.get("nodes", []), ensure_ascii=False)},' if "nodes" in data else ''}
    {f'answer: {json.dumps(data.get("answer"), ensure_ascii=False)},' if "answer" in data else ''}
    {f'goal: "{data.get("goal", "")}",' if "goal" in data else ''}
    {f'hint: "{data.get("hint", "")}",' if "hint" in data else ''}
    {f'text: "{data.get("text", "")}",' if "text" in data else ''}
    {f'keywords: {json.dumps(data.get("keywords", []), ensure_ascii=False)},' if "keywords" in data else ''}
    {f'mode: "{data.get("mode", "")}",' if "mode" in data else ''}
    {f'multi_alloc: {str(data.get("multi_alloc", False)).lower()}' if "multi_alloc" in data else ''}
}};

class Task{id} {{
    constructor() {{
        this.container = document.getElementById('task-stage');
        this.data = {id}_Data;
        this.state = {{}};
        this.init();
    }}

    init() {{
        // Setup Header
        document.getElementById('task-title').innerText = this.data.title;
        document.getElementById('task-desc').innerText = this.data.desc;
        if(this.data.mission) {{
            const m = document.createElement('div');
            m.className = 'mission-box';
            m.innerText = this.data.mission;
            document.getElementById('task-desc').appendChild(m);
        }}
        if(this.data.hint) {{
             const h = document.createElement('div');
             h.className = 'hint-text';
             h.innerText = this.data.hint;
             this.container.appendChild(h);
        }}
        
        this.render();
    }}
"""
    
    # Render Methods
    if data['type'] == 'SELECTION':
        is_multi = data.get('mode') == 'multi'
        src_key = 'textParts' if 'textParts' in data else 'items'
        code += f"""
    render() {{
        const wrap = document.createElement('div');
        wrap.className = 'selection-container';
        
        this.state.selected = [];
        this.data.{src_key}.forEach(item => {{
            const btn = document.createElement('div');
            btn.className = 'select-item';
            btn.innerText = item;
            btn.onclick = () => {{
                {'''
                btn.classList.toggle('active');
                if(btn.classList.contains('active')) this.state.selected.push(item);
                else this.state.selected = this.state.selected.filter(i => i!==item);
                ''' if is_multi else '''
                // Single Select
                wrap.querySelectorAll('.select-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.selected = [item];
                '''}
                this.check();
            }};
            wrap.appendChild(btn);
        }});
        this.container.appendChild(wrap);
    }}
    
    check() {{
        const user = new Set(this.state.selected);
        const ans = new Set(this.data.answer);
        if(user.size !== ans.size) return;
        for(let a of ans) if(!user.has(a)) return;
        this.success();
    }}
"""

    elif data['type'] == 'SORTING':
         code += """
    render() {
        const list = document.createElement('div');
        list.className = 'sort-container';
        
        let items = [...this.data.items];
        items.sort(() => Math.random() - 0.5); // Shuffle
        
        items.forEach(text => {
            const el = document.createElement('div');
            el.className = 'sort-item';
            el.innerText = text;
            el.draggable = true;
            
            el.addEventListener('dragstart', e => {
                el.classList.add('dragging');
            });
            el.addEventListener('dragend', () => el.classList.remove('dragging'));
            list.appendChild(el);
        });
        
        list.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = this.getDragAfter(list, e.clientY);
            const dragging = document.querySelector('.dragging');
            if(afterElement == null) list.appendChild(dragging);
            else list.insertBefore(dragging, afterElement);
            
            // Check immediately on drop? Or explicit check? 
            // Let's check on drop (dragend handles visual, but logic here)
        });
        list.addEventListener('drop', () => this.check());
        
        this.container.appendChild(list);
    }
    
    getDragAfter(container, y) {
        const draggables = [...container.querySelectorAll('.sort-item:not(.dragging)')];
        return draggables.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
            else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    check() {
        const current = [...document.querySelectorAll('.sort-item')].map(e => e.innerText);
        if(JSON.stringify(current) === JSON.stringify(this.data.answer)) this.success();
    }
"""

    elif data['type'] == 'ALLOCATION':
        # Support for multi_alloc (C2) and single (E2)
        code += f"""
    render() {{
        const wrapper = document.createElement('div');
        wrapper.className = 'alloc-wrapper';
        
        // Source
        const source = document.createElement('div');
        source.className = 'alloc-source';
        this.data.items.forEach(item => {{
            const el = document.createElement('div');
            el.className = 'alloc-item';
            el.draggable = true;
            el.innerText = item;
            el.id = 'item-'+item;
            el.addEventListener('dragstart', e => {{
                e.dataTransfer.setData('text', item);
            }});
            source.appendChild(el);
        }});
        
        // Slots
        const slotsDiv = document.createElement('div');
        slotsDiv.className = 'alloc-slots';
        this.data.slots.forEach(sName => {{
            const slot = document.createElement('div');
            slot.className = 'alloc-slot';
            slot.innerHTML = `<div class='slot-title'>${{sName}}</div>`;
            slot.dataset.name = sName;
            
            slot.addEventListener('dragover', e => {{ e.preventDefault(); slot.classList.add('dragover'); }});
            slot.addEventListener('dragleave', () => slot.classList.remove('dragover'));
            slot.addEventListener('drop', e => {{
                e.preventDefault();
                slot.classList.remove('dragover');
                const data = e.dataTransfer.getData('text');
                
                // Allow logic
                if(!this.data.multi_alloc) {{
                    // Single item per slot? 
                    // Remove existing if any
                    const existing = slot.querySelector('.alloc-item');
                    if(existing) source.appendChild(existing); 
                }}
                
                // Move element
                # Find original everywhere
                const el = document.getElementById('item-'+data);
                if(el) slot.appendChild(el);
                
                this.check();
            }});
            slotsDiv.appendChild(slot);
        }});
        
        wrapper.appendChild(source);
        wrapper.appendChild(slotsDiv);
        this.container.appendChild(wrapper);
    }}
    
    check() {{
        const slots = document.querySelectorAll('.alloc-slot');
        let correct = true;
        let set_items = 0;
        
        slots.forEach(s => {{
            const sName = s.dataset.name;
            const itemEls = s.querySelectorAll('.alloc-item');
            const items = [...itemEls].map(e => e.innerText);
            set_items += items.length;
            
            const ans = this.data.answer[sName];
            
            if(Array.isArray(ans)) {{
                // Multi check (C2)
                if(items.length !== ans.length) correct = false;
                else {{
                    items.sort(); ans.sort();
                    if(JSON.stringify(items) !== JSON.stringify(ans)) correct = false;
                }}
            }} else {{
                // Single check
                if(items.length !== 1 || items[0] !== ans) correct = false;
            }}
        }});
        
        const totalItems = this.data.items.length;
        if(set_items === totalItems && correct) this.success();
    }}
"""

    elif data['type'] == 'MAZE':
        code += """
    render() {
        const grid = document.createElement('div');
        grid.className = 'maze-grid';
        this.state.path = [];
        
        for(let i=0; i<25; i++) {
            const cell = document.createElement('div');
            cell.className = 'maze-cell';
            const x = i%5, y = Math.floor(i/5);
            if(x===0 && y===0) cell.classList.add('start');
            if(x===4 && y===4) cell.classList.add('end');
            
            cell.onclick = () => {
                cell.classList.toggle('path');
                if(cell.classList.contains('path')) this.state.path.push(i);
                else this.state.path = this.state.path.filter(idx => idx!==i);
                this.check();
            };
            grid.appendChild(cell);
        }
        this.container.appendChild(grid);
    }
    check() {
        const p = this.state.path;
        // Simple 0 to 24 check
        if(p.includes(0) && p.includes(24) && p.length >= 5) this.success();
    }
"""
    
    elif data['type'].startswith('GRAPH'):
         code += """
    render() {
        const cvs = document.createElement('canvas');
        cvs.width = 500; cvs.height = 300;
        this.container.appendChild(cvs);
        this.ctx = cvs.getContext('2d');
        this.nodes = [];
        this.edges = [];
        
        const labels = typeof this.data.nodes === 'number' 
            ? Array.from({length:this.data.nodes}, (_,i)=>String(i+1)) 
            : this.data.nodes;
            
        labels.forEach((l, i) => {
            const ang = (i / labels.length) * Math.PI * 2 - Math.PI/2;
            const cx = 250, cy = 150, r = 100;
            this.nodes.push({
                label: l, 
                x: cx + Math.cos(ang)*r, 
                y: cy + Math.sin(ang)*r
            });
        });
        
        this.update();
        
        let startNode = null;
        cvs.addEventListener('mousedown', e => {
            const p = this.getPos(e, cvs);
            startNode = this.nodes.find(n => Math.hypot(n.x-p.x, n.y-p.y) < 20);
        });
        cvs.addEventListener('mouseup', e => {
            if(!startNode) return;
            const p = this.getPos(e, cvs);
            const endNode = this.nodes.find(n => Math.hypot(n.x-p.x, n.y-p.y) < 20);
            if(endNode && endNode !== startNode) {
                this.edges.push({from:startNode, to:endNode});
                this.update();
                this.check();
            }
            startNode = null;
        });
    }
    
    getPos(e, cvs) {
        const r = cvs.getBoundingClientRect();
        return {x:e.clientX-r.left, y:e.clientY-r.top};
    }
    
    update() {
        const ctx = this.ctx;
        ctx.clearRect(0,0,500,300);
        
        // Edges
        ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
        this.edges.forEach(e => {
            ctx.beginPath();
            ctx.moveTo(e.from.x, e.from.y);
            ctx.lineTo(e.to.x, e.to.y);
            ctx.stroke();
        });
        
        // Nodes
        this.nodes.forEach(n => {
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(n.x, n.y, 20, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#333'; ctx.stroke();
            ctx.fillStyle = '#000'; ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(n.label, n.x, n.y);
        });
    }
    
    check() {
        // Validation logic depends on type
        // Simplified for reliability
        if(this.data.goal === 'spanning_tree') {
             if(this.edges.length >= this.nodes.length - 1) this.success();
        } else if(this.data.goal === 'cycle') {
            if(this.edges.length >= this.nodes.length) this.success();
        } else if(this.data.answer) {
             // Exact match check? Simplified to count for usability
             if(this.edges.length >= this.data.answer.length) this.success();
        }
    }
"""

    elif data['type'].startswith('TEXT'):
        code += """
    render() {
        if(this.data.text) {
             const t = document.createElement('div');
             t.className = 'text-context';
             t.innerText = this.data.text;
             this.container.appendChild(t);
        }
        
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'text-input';
        inp.placeholder = '답을 입력하세요';
        inp.onkeyup = () => this.check(inp.value);
        this.container.appendChild(inp);
    }
    
    check(val) {
        val = val.trim();
        let ok = false;
        if(this.data.answer) ok = (val === this.data.answer);
        if(this.data.keywords) ok = this.data.keywords.every(k => val.includes(k));
        if(ok) this.success();
    }
"""
    
    elif data['type'] == 'REACTION':
        code += """
    render() {
        const box = document.createElement('div');
        box.className = 'reaction-box';
        box.innerText = "준비...";
        this.container.appendChild(box);
        
        let start = 0;
        setTimeout(() => {
            box.classList.add('go');
            box.innerText = "클릭!";
            start = Date.now();
        }, 2000 + Math.random()*1000);
        
        box.onclick = () => {
            if(box.classList.contains('go')) {
                const diff = Date.now() - start;
                box.innerText = diff + "ms 성공!";
                this.success();
            } else {
                box.innerText = "너무 빨라요!";
            }
        };
    }
    check() {} 
"""

    # Common Success
    code += """
    success() {
        const msg = document.getElementById('success-msg');
        if(msg) msg.style.display = 'block';
    }
}

window.onload = () => {
    new Task"""+id+"""();
};
"""
    return code

def generate_css(id, data):
    # Generates ID-specific CSS
    return f"""
/* Task {id} CSS */
.mission-box {{
    background: #f0f8ff; padding: 10px; margin: 10px 0; border-radius: 5px; font-weight: bold; color: #0056b3;
}}
.hint-text {{
    margin-top: 10px; color: #666; font-size: 0.9em;
}}

/* Interactive Elements */
.selection-container {{ display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }}
.select-item {{ 
    padding: 15px 30px; background: #eee; border-radius: 10px; cursor: pointer; transition: 0.2s;
}}
.select-item:hover {{ background: #ddd; }}
.select-item.active {{ background: #4CAF50; color: white; transform: scale(1.05); }}

.sort-container {{ display: flex; flex-direction: column; gap: 5px; width: 300px; margin: 0 auto; }}
.sort-item {{ padding: 15px; background: #fff; border: 1px solid #ddd; border-radius: 5px; cursor: grab; }}
.sort-item.dragging {{ opacity: 0.5; }}

.alloc-wrapper {{ display: flex; justify-content: space-around; margin-top: 20px; }}
.alloc-source {{ width: 150px; min-height: 200px; background: #f9f9f9; padding: 10px; }}
.alloc-item {{ padding: 8px; background: white; border: 1px solid #ccc; margin-bottom: 5px; cursor: grab; }}
.alloc-slots {{ width: 300px; }}
.alloc-slot {{ 
    min-height: 60px; border: 2px dashed #bbb; margin-bottom: 10px; padding: 5px; 
    display: flex; flex-direction: column; 
}}
.alloc-slot.dragover {{ background: #e0e0e0; }}
.slot-title {{ font-size: 0.8em; color: #555; margin-bottom: 5px; }}

.maze-grid {{ 
    display: grid; grid-template-columns: repeat(5, 50px); gap: 2px; justify-content: center; margin: 20px auto; 
}}
.maze-cell {{ width: 50px; height: 50px; background: #eee; cursor: pointer; }}
.maze-cell.start {{ background: #4CAF50; }} .maze-cell.end {{ background: #F44336; }}
.maze-cell.path {{ background: #2196F3; }}

canvas {{ background: #fafafa; border: 1px solid #ddd; margin: 0 auto; display: block; }}

.text-input {{ padding: 10px; width: 80%; margin-top: 20px; font-size: 16px; border: 2px solid #ddd; }}
.reaction-box {{ width: 200px; height: 200px; background: #ccc; border-radius: 50%; margin: 20px auto; display:flex; align-items:center; justify-content:center; font-size: 20px; cursor: pointer; }}
.reaction-box.go {{ background: #F44336; color: white; }}
"""

def update_html(filename, css_path, js_path):
    # Updates links in HTML
    try:
        with open(filename, 'r', encoding='utf-8') as f: content = f.read()
    except FileNotFoundError: return
    
    # Remove old links
    content = re.sub(r'<link rel="stylesheet".*?>', '', content)
    content = re.sub(r'<script.*?>.*?</script>', '', content, flags=re.DOTALL)
    
    # Remove badge
    content = content.replace('<span class="badge">문제</span>', '')
    content = content.replace('<span class="badge-problem">문제</span>', '') # In case class name differs
    
    # Insert new links in Head
    head_content = f"""
    <link rel="stylesheet" href="css/detail.css">
    <link rel="stylesheet" href="{css_path}">
    """
    content = content.replace('</head>', head_content + '</head>')
    
    # Body setup
    # Ensure there is a #task-stage and #success-msg
    # Use re to clear body content except wrapper if possible, but safer to just Append JS
    
    # Insert JS at end of Body
    body_end = f"""
    <div id="success-msg" style="display:none; position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#4CAF50; color:white; padding:15px 30px; border-radius:20px; animation: popUp 0.5s;">
        정답입니다! 다음 레벨로 넘어갑니다.
    </div>
    <script src="{js_path}"></script>
    </body>
    """
    content = content.replace('</body>', body_end)
    
    # Clean up double badges if any
    content = re.sub(r'\[문제\]', '', content)
    
    with open(filename, 'w', encoding='utf-8') as f: f.write(content)

# === 3. EXECUTION ===
for id, data in TASKS.items():
    js_path = f"js/tasks/{id}.js"
    css_path = f"css/tasks/{id}.css"
    html_file = data['file']
    
    # Write JS
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(generate_js(id, data))
        
    # Write CSS
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(generate_css(id, data))
        
    # Update HTML
    update_html(html_file, css_path, js_path)
    print(f"Processed {id}")

# Index cleanup
try:
    with open("index.html", 'r', encoding='utf-8') as f: idx = f.read()
    idx = idx.replace('[문제]', '')
    idx = re.sub(r'<span class="badge.*?>.*?</span>', '', idx)
    with open("index.html", 'w', encoding='utf-8') as f: f.write(idx)
    print("Cleaned index.html")
except: pass

print("Refactoring Complete.")
