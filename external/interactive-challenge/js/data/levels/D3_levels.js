window.D3_LEVELS = {
    generate: function (lvl) {
        // Informatics: Network Dependencies (Food Chain)
        // Lvl 1: Simple Chain (Grass -> Rabbit -> Wolf)
        // Lvl 10: Web (Multiple intersecting chains)
        // Lvl 30: Complex Web

        const nodes = [];
        const edges = [];

        const layers = lvl < 10 ? 3 : (lvl < 25 ? 4 : 5);
        const width = lvl < 10 ? 2 : (lvl < 20 ? 3 : 4);

        // Tiers: 0=Producer, 1=Herbivore, 2=Carnivore, 3=Apex, 4=Super
        const names = [
            ['풀', '나무', '꽃', '이끼', '선인장'],
            ['토끼', '사슴', '다람쥐', '메뚜기', '쥐'],
            ['여우', '늑대', '독수리', '뱀', '부엉이'],
            ['호랑이', '사자', '곰', '표범', '악어'],
            ['인간', '외계인', '로봇', '드래곤', '괴물'] // Tier 5
        ];

        // Generate Nodes
        let idCount = 0;
        const tierNodes = [];
        for (let t = 0; t < layers; t++) {
            tierNodes[t] = [];
            for (let w = 0; w < width; w++) {
                const name = names[t][Math.floor(Math.random() * names[t].length)] + " " + (w + 1);
                const n = { id: idCount++, label: name, layer: t, x: 0, y: 0 }; // Pos set by engine
                nodes.push(n);
                tierNodes[t].push(n);
            }
        }

        // Generate Edges (Dependencies)
        for (let t = 0; t < layers - 1; t++) {
            tierNodes[t].forEach(src => {
                // Connect to at least one in next layer
                const targets = tierNodes[t + 1];
                const dest = targets[Math.floor(Math.random() * targets.length)];
                edges.push({ from: src.id, to: dest.id });

                // Randomly add more?
                if (Math.random() > 0.5) {
                    const dest2 = targets[Math.floor(Math.random() * targets.length)];
                    if (dest2 !== dest) edges.push({ from: src.id, to: dest2.id });
                }
            });
        }

        // Question
        const qEdge = edges[Math.floor(Math.random() * edges.length)];
        const fromNode = nodes.find(n => n.id === qEdge.from);

        // Find ALL predators of fromNode
        // Valid answers are any node that has an edge FROM fromNode TO it.
        const validAnswers = edges.filter(e => e.from === fromNode.id).map(e => e.to);

        return { nodes, edges, question: { q: `${fromNode.label}을(를) 먹는 동물은?`, a: validAnswers } };
    }
};
