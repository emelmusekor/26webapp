window.D2_LEVELS = {
    generate: function (lvl) {
        // Informatics: Tree Structure & Hierarchy
        // Lvl 1: Depth 2 (Grandpa -> Pa -> Me)
        // Lvl 10: Depth 3

        const depth = lvl < 10 ? 2 : (lvl < 25 ? 3 : (lvl < 40 ? 4 : 5));

        // Build Tree
        let id = 1;
        const root = { id: id++, name: "할아버지", items: [] };

        // Add children
        const addChildren = (node, d) => {
            if (d === 0) return;
            // Branching factor: 2 to 3 children
            const count = (lvl > 20 && Math.random() > 0.5) ? 3 : 2;
            for (let i = 0; i < count; i++) {
                const child = { id: id++, name: "가족 " + id, items: [] };
                node.items.push(child);
                addChildren(child, d - 1);
            }
        };
        addChildren(root, depth);

        // Relationship Path Logic
        // "From X, go [Up/Down/Side]..."

        // 1. Pick a valid Start Node
        const allNodes = getAllNodes(root);
        // Remove root from start if we want to go up?
        // Let's just pick any.
        const startNode = allNodes[Math.floor(Math.random() * allNodes.length)];

        // 2. Generate Path
        const steps = lvl < 10 ? 1 : (lvl < 25 ? 2 : 3);
        let current = startNode;
        let pathDesc = [];

        for (let i = 0; i < steps; i++) {
            const moves = [];
            // Check possible moves
            if (current.parent) moves.push('parent');
            if (current.items.length > 0) moves.push('child');
            if (current.parent && current.parent.items.length > 1) moves.push('sibling');

            if (moves.length === 0) break;

            const move = moves[Math.floor(Math.random() * moves.length)];

            if (move === 'parent') {
                current = current.parent;
                pathDesc.push("부모님");
            } else if (move === 'child') {
                current = current.items[Math.floor(Math.random() * current.items.length)];
                pathDesc.push("자식");
            } else if (move === 'sibling') {
                const siblings = current.parent.items.filter(x => x.id !== current.id);
                current = siblings[Math.floor(Math.random() * siblings.length)];
                pathDesc.push("형제/자매");
            }
        }

        const answerName = current.name;
        // Construct Question
        // "Find [Start]'s [Path1]'s [Path2]..."
        let qText = `${startNode.name}의 **${pathDesc.join('의 ')}**를 찾으세요.`;

        // Pass startNode ID to highlight it?
        return { root, targetName: answerName, question: qText, startId: startNode.id };
    }
};
