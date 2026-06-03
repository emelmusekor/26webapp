window.D5_LEVELS = {
    generate: function (lvl) {
        // Informatics: Shortest Path Algorithms (Dijkstra) & Cost Optimization
        // Labels: Start -> A -> B ... -> End
        // Difficulty: Increases nodes and edges significantly per level

        // More conservative node count scaling (Max 12)
        const nodeCount = Math.min(12, 3 + Math.floor(lvl / 3));
        // Lower edge density to keep graph readable
        const edgeDensity = 1.0 + (Math.min(lvl, 50) * 0.02); // Max 2.0 density

        const nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            let label;
            if (i === 0) label = "Start";
            else if (i === nodeCount - 1) label = "End";
            else label = String.fromCharCode(65 + (i - 1)); // A, B, C...

            nodes.push({
                id: i,
                label: label,
                x: Math.random() * 500 + 50,
                y: Math.random() * 300 + 50
            });
        }

        const edges = [];
        // Ensure connectivity (Spanning Tree first)
        for (let i = 0; i < nodeCount - 1; i++) {
            // Connect to random previous node to ensure reachability from 0
            // But prefer creating a chain that isn't straight 0->1->2 to make it interesting
            const target = i; // Simplified chain 0-1, 1-2 to guarantee basic path
            const weight = Math.floor(Math.random() * 10) + 1;
            edges.push({ from: i, to: i + 1, weight });
        }

        // Add random edges for complexity
        const extraEdges = Math.floor(nodeCount * edgeDensity);
        const endNode = nodeCount - 1;

        // Remove direct connection if it exists in initial tree (Unlikely with loop 0->1->...->N-1 unless N=2)
        // But to be safe, if nodeCount > 2, we shouldn't have 0 -> N-1 directly.
        // The chain 0->1->2... ensures 0 connects to 1, N-2 connects to N-1.
        // So direct 0->N-1 only happens if N=2. If N=2, we can't help it.

        for (let i = 0; i < extraEdges; i++) {
            const u = Math.floor(Math.random() * nodeCount);
            const v = Math.floor(Math.random() * nodeCount);

            // Prevent self-loop, existing, OR Start-End direct connection (if nodes > 2)
            const isStartEnd = (u === 0 && v === endNode) || (v === 0 && u === endNode);

            if (u !== v &&
                !edges.some(e => (e.from === u && e.to === v) || (e.from === v && e.to === u)) &&
                (!isStartEnd || nodeCount <= 2)
            ) {
                edges.push({ from: u, to: v, weight: Math.floor(Math.random() * 10) + 1 });
            }
        }

        return { nodes, edges, start: 0, end: nodeCount - 1 };
    }
};
