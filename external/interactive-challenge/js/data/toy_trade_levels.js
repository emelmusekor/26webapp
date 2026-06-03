const LEVELS = {
    1: {
        nodes: [
            { id: 'S', x: 200, y: 300, label: 'S' },
            { id: 'E', x: 600, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'E', cost: 1 }
        ],
        start: 'S', end: 'E', optimal: 1
    },
    2: {
        nodes: [
            { id: 'S', x: 150, y: 300, label: 'S' },
            { id: 'A', x: 400, y: 150, label: 'A' },
            { id: 'B', x: 400, y: 450, label: 'B' },
            { id: 'E', x: 650, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 5 },
            { u: 'A', v: 'E', cost: 5 },
            { u: 'S', v: 'B', cost: 2 },
            { u: 'B', v: 'E', cost: 3 }
        ],
        start: 'S', end: 'E', optimal: 5
    },
    3: {
        nodes: [
            { id: 'S', x: 100, y: 300, label: 'S' },
            { id: 'A', x: 300, y: 150, label: 'A' },
            { id: 'B', x: 300, y: 450, label: 'B' },
            { id: 'E', x: 600, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 1 },
            { u: 'S', v: 'B', cost: 4 },
            { u: 'A', v: 'E', cost: 8 },
            { u: 'B', v: 'E', cost: 4 }
        ],
        start: 'S', end: 'E', optimal: 8
    },
    4: {
        nodes: [
            { id: 'S', x: 100, y: 300, label: 'S' },
            { id: 'A', x: 300, y: 200, label: 'A' },
            { id: 'B', x: 300, y: 400, label: 'B' },
            { id: 'E', x: 600, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 5 },
            { u: 'S', v: 'B', cost: 8 },
            { u: 'A', v: 'B', cost: 1 },
            { u: 'A', v: 'E', cost: 10 },
            { u: 'B', v: 'E', cost: 2 }
        ],
        start: 'S', end: 'E', optimal: 8
    },
    5: {
        nodes: [
            { id: 'S', x: 100, y: 400, label: 'S' },
            { id: 'A', x: 250, y: 200, label: 'A' },
            { id: 'B', x: 400, y: 400, label: 'B' },
            { id: 'C', x: 550, y: 200, label: 'C' },
            { id: 'E', x: 700, y: 400, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 2 },
            { u: 'A', v: 'B', cost: 2 },
            { u: 'B', v: 'C', cost: 2 },
            { u: 'C', v: 'E', cost: 2 },
            { u: 'S', v: 'B', cost: 5 },
            { u: 'A', v: 'C', cost: 5 }
        ],
        start: 'S', end: 'E', optimal: 8
    },
    6: {
        nodes: [
            { id: 'S', x: 100, y: 300, label: 'S' },
            { id: 'A', x: 400, y: 300, label: 'A' },
            { id: 'E', x: 700, y: 300, label: 'E' },
            { id: 'B', x: 400, y: 500, label: 'B' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 5 },
            { u: 'A', v: 'E', cost: 10 },
            { u: 'S', v: 'B', cost: 6 },
            { u: 'B', v: 'E', cost: 6 }
        ],
        start: 'S', end: 'E', optimal: 12
    },
    7: {
        nodes: [
            { id: 'S', x: 100, y: 300, label: 'S' },
            { id: 'A', x: 300, y: 200, label: 'A' },
            { id: 'B', x: 300, y: 400, label: 'B' },
            { id: 'E', x: 600, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 1 },
            { u: 'S', v: 'B', cost: 5 },
            { u: 'A', v: 'E', cost: 20 },
            { u: 'B', v: 'E', cost: 2 }
        ],
        start: 'S', end: 'E', optimal: 7
    },
    8: {
        nodes: [
            { id: 'S', x: 50, y: 300, label: 'S' },
            { id: 'A', x: 200, y: 150, label: 'A' },
            { id: 'B', x: 200, y: 450, label: 'B' },
            { id: 'C', x: 400, y: 150, label: 'C' },
            { id: 'D', x: 400, y: 450, label: 'D' },
            { id: 'E', x: 600, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 2 },
            { u: 'A', v: 'C', cost: 2 },
            { u: 'C', v: 'E', cost: 20 },
            { u: 'S', v: 'B', cost: 5 },
            { u: 'B', v: 'D', cost: 5 },
            { u: 'D', v: 'E', cost: 5 }
        ],
        start: 'S', end: 'E', optimal: 15
    },
    9: {
        nodes: [
            { id: 'S', x: 50, y: 300, label: 'S' },
            { id: 'A', x: 250, y: 100, label: 'A' },
            { id: 'B', x: 250, y: 500, label: 'B' },
            { id: 'C', x: 450, y: 300, label: 'C' },
            { id: 'E', x: 650, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 5 },
            { u: 'S', v: 'B', cost: 6 },
            { u: 'A', v: 'C', cost: 5 },
            { u: 'B', v: 'C', cost: 3 },
            { u: 'C', v: 'E', cost: 5 },
            { u: 'A', v: 'E', cost: 12 },
            { u: 'B', v: 'E', cost: 10 }
        ],
        start: 'S', end: 'E', optimal: 14
    },
    10: {
        nodes: [
            { id: 'S', x: 50, y: 300, label: 'S' },
            { id: 'A', x: 200, y: 150, label: 'A' },
            { id: 'B', x: 200, y: 450, label: 'B' },
            { id: 'C', x: 400, y: 150, label: 'C' },
            { id: 'D', x: 400, y: 450, label: 'D' },
            { id: 'E', x: 700, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 3 },
            { u: 'S', v: 'B', cost: 8 },
            { u: 'A', v: 'C', cost: 5 },
            { u: 'B', v: 'D', cost: 5 },
            { u: 'A', v: 'B', cost: 1 },
            { u: 'C', v: 'D', cost: 1 },
            { u: 'C', v: 'E', cost: 8 },
            { u: 'D', v: 'E', cost: 2 },
            { u: 'B', v: 'C', cost: 1 }
        ],
        start: 'S', end: 'E', optimal: 8
    },
    11: {
        nodes: [
            { id: 'S', x: 100, y: 300, label: 'S' },
            { id: 'A', x: 400, y: 100, label: 'A' },
            { id: 'B', x: 400, y: 500, label: 'B' },
            { id: 'M', x: 400, y: 300, label: 'M' },
            { id: 'E', x: 700, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 10 },
            { u: 'S', v: 'B', cost: 10 },
            { u: 'S', v: 'M', cost: 5 },
            { u: 'A', v: 'E', cost: 2 },
            { u: 'B', v: 'E', cost: 2 },
            { u: 'M', v: 'E', cost: 20 }
        ],
        start: 'S', end: 'E', optimal: 12
    },
    12: {
        nodes: [
            { id: 'S', x: 50, y: 300, label: 'S' },
            { id: 'A', x: 200, y: 100, label: 'A' },
            { id: 'B', x: 500, y: 100, label: 'B' },
            { id: 'C', x: 200, y: 300, label: 'C' },
            { id: 'D', x: 500, y: 300, label: 'D' },
            { id: 'F', x: 200, y: 500, label: 'F' },
            { id: 'G', x: 500, y: 500, label: 'G' },
            { id: 'E', x: 700, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 5 }, { u: 'A', v: 'B', cost: 5 }, { u: 'B', v: 'E', cost: 5 },
            { u: 'S', v: 'C', cost: 4 }, { u: 'C', v: 'D', cost: 8 }, { u: 'D', v: 'E', cost: 4 },
            { u: 'S', v: 'F', cost: 6 }, { u: 'F', v: 'G', cost: 2 }, { u: 'G', v: 'E', cost: 6 },
            { u: 'A', v: 'C', cost: 1 }, { u: 'D', v: 'G', cost: 1 }
        ],
        start: 'S', end: 'E', optimal: 14
    },
    13: {
        nodes: [
            { id: 'S', x: 50, y: 500, label: 'S' },
            { id: 'A', x: 150, y: 400, label: 'A' },
            { id: 'B', x: 250, y: 300, label: 'B' },
            { id: 'C', x: 350, y: 200, label: 'C' },
            { id: 'D', x: 450, y: 100, label: 'D' },
            { id: 'F', x: 550, y: 200, label: 'F' },
            { id: 'G', x: 650, y: 300, label: 'G' },
            { id: 'X', x: 350, y: 500, label: 'X' },
            { id: 'E', x: 750, y: 400, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 2 }, { u: 'A', v: 'B', cost: 2 }, { u: 'B', v: 'C', cost: 2 },
            { u: 'C', v: 'D', cost: 2 }, { u: 'D', v: 'F', cost: 2 }, { u: 'F', v: 'G', cost: 2 },
            { u: 'G', v: 'E', cost: 2 },
            { u: 'S', v: 'X', cost: 5 }, { u: 'X', v: 'E', cost: 30 }
        ],
        start: 'S', end: 'E', optimal: 14
    },
    14: {
        nodes: [
            { id: 'S', x: 50, y: 300, label: 'S' },
            { id: 'M', x: 400, y: 300, label: 'M' },
            { id: 'A', x: 250, y: 150, label: 'A' },
            { id: 'B', x: 550, y: 150, label: 'B' },
            { id: 'C', x: 250, y: 450, label: 'C' },
            { id: 'D', x: 550, y: 450, label: 'D' },
            { id: 'E', x: 750, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'M', cost: 15 }, { u: 'M', v: 'E', cost: 15 },
            { u: 'S', v: 'A', cost: 8 }, { u: 'A', v: 'B', cost: 8 }, { u: 'B', v: 'E', cost: 8 },
            { u: 'S', v: 'C', cost: 5 }, { u: 'C', v: 'D', cost: 15 }, { u: 'D', v: 'E', cost: 5 },
            { u: 'A', v: 'M', cost: 2 }, { u: 'C', v: 'M', cost: 2 },
            { u: 'M', v: 'B', cost: 2 }, { u: 'M', v: 'D', cost: 2 }
        ],
        start: 'S', end: 'E', optimal: 17
    },
    15: {
        nodes: [
            { id: 'S', x: 100, y: 300, label: 'S' },
            { id: 'A', x: 250, y: 200, label: 'A' },
            { id: 'B', x: 250, y: 400, label: 'B' },
            { id: 'M', x: 400, y: 300, label: 'M' },
            { id: 'C', x: 550, y: 200, label: 'C' },
            { id: 'D', x: 550, y: 400, label: 'D' },
            { id: 'E', x: 700, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 4 }, { u: 'A', v: 'M', cost: 4 },
            { u: 'S', v: 'B', cost: 3 }, { u: 'B', v: 'M', cost: 6 },
            { u: 'M', v: 'C', cost: 4 }, { u: 'C', v: 'E', cost: 4 },
            { u: 'M', v: 'D', cost: 2 }, { u: 'D', v: 'E', cost: 5 },
            { u: 'A', v: 'B', cost: 1 },
            { u: 'C', v: 'D', cost: 1 }
        ],
        start: 'S', end: 'E', optimal: 15
    },
    16: {
        nodes: [
            { id: 'S', x: 50, y: 300, label: 'S' },
            { id: 'A', x: 250, y: 300, label: 'A' }, { id: 'B', x: 450, y: 300, label: 'B' },
            { id: 'C', x: 200, y: 500, label: 'C' }, { id: 'D', x: 350, y: 500, label: 'D' },
            { id: 'F', x: 500, y: 500, label: 'F' }, { id: 'G', x: 650, y: 500, label: 'G' },
            { id: 'E', x: 750, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 2 }, { u: 'A', v: 'B', cost: 2 }, { u: 'B', v: 'E', cost: 25 },
            { u: 'S', v: 'C', cost: 2 }, { u: 'C', v: 'D', cost: 2 }, { u: 'D', v: 'F', cost: 2 },
            { u: 'F', v: 'G', cost: 2 }, { u: 'G', v: 'E', cost: 8 },
            { u: 'S', v: 'E', cost: 40 }
        ],
        start: 'S', end: 'E', optimal: 16
    },
    17: {
        nodes: [
            { id: 'S', x: 50, y: 200, label: 'S' },
            { id: 'A', x: 200, y: 100, label: 'A' }, { id: 'B', x: 400, y: 100, label: 'B' }, { id: 'C', x: 600, y: 100, label: 'C' },
            { id: 'D', x: 200, y: 300, label: 'D' }, { id: 'F', x: 400, y: 300, label: 'F' }, { id: 'G', x: 600, y: 300, label: 'G' },
            { id: 'E', x: 750, y: 200, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 10 }, { u: 'A', v: 'B', cost: 10 }, { u: 'B', v: 'C', cost: 10 }, { u: 'C', v: 'E', cost: 10 },
            { u: 'S', v: 'D', cost: 10 }, { u: 'D', v: 'F', cost: 10 }, { u: 'F', v: 'G', cost: 10 }, { u: 'G', v: 'E', cost: 10 },
            { u: 'A', v: 'D', cost: 2 }, { u: 'B', v: 'F', cost: 2 }, { u: 'C', v: 'G', cost: 2 },
            { u: 'S', v: 'A', cost: 8 }, { u: 'S', v: 'D', cost: 8 },
            { u: 'A', v: 'F', cost: 3 }, { u: 'D', v: 'B', cost: 10 },
            { u: 'F', v: 'C', cost: 3 }, { u: 'B', v: 'G', cost: 10 },
            { u: 'C', v: 'E', cost: 5 }, { u: 'G', v: 'E', cost: 5 }
        ],
        start: 'S', end: 'E', optimal: 19
    },
    18: {
        nodes: [
            { id: 'S', x: 100, y: 300, label: 'S' },
            { id: 'A', x: 300, y: 300, label: 'A' },
            { id: 'B', x: 500, y: 300, label: 'B' },
            { id: 'E', x: 700, y: 300, label: 'E' },
            { id: 'X', x: 300, y: 100, label: 'X' },
            { id: 'Y', x: 500, y: 500, label: 'Y' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 2 }, { u: 'A', v: 'B', cost: 15 }, { u: 'B', v: 'E', cost: 2 },
            { u: 'A', v: 'X', cost: 2 }, { u: 'X', v: 'B', cost: 2 },
            { u: 'A', v: 'Y', cost: 2 }, { u: 'Y', v: 'B', cost: 2 },
            { u: 'S', v: 'X', cost: 10 }
        ],
        start: 'S', end: 'E', optimal: 8
    },
    19: {
        nodes: [
            { id: 'S', x: 300, y: 300, label: 'S' },
            { id: 'A', x: 400, y: 300, label: 'A' },
            { id: 'B', x: 200, y: 300, label: 'B' },
            { id: 'C', x: 400, y: 100, label: 'C' },
            { id: 'E', x: 600, y: 300, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 5 }, { u: 'A', v: 'E', cost: 20 },
            { u: 'S', v: 'B', cost: 2 },
            { u: 'B', v: 'C', cost: 2 },
            { u: 'C', v: 'E', cost: 5 }
        ],
        start: 'S', end: 'E', optimal: 9
    },
    20: {
        nodes: [
            { id: 'S', x: 100, y: 100, label: 'S' },
            { id: 'A', x: 100, y: 300, label: 'A' }, { id: 'B', x: 100, y: 500, label: 'B' },
            { id: 'C', x: 300, y: 100, label: 'C' }, { id: 'D', x: 300, y: 300, label: 'D' }, { id: 'F', x: 300, y: 500, label: 'F' },
            { id: 'G', x: 500, y: 100, label: 'G' }, { id: 'H', x: 500, y: 300, label: 'H' }, { id: 'I', x: 500, y: 500, label: 'I' },
            { id: 'E', x: 700, y: 500, label: 'E' }
        ],
        edges: [
            { u: 'S', v: 'A', cost: 2 }, { u: 'A', v: 'B', cost: 2 },
            { u: 'C', v: 'D', cost: 10 }, { u: 'D', v: 'F', cost: 10 },
            { u: 'G', v: 'H', cost: 2 }, { u: 'H', v: 'I', cost: 2 },
            { u: 'S', v: 'C', cost: 5 }, { u: 'C', v: 'G', cost: 5 },
            { u: 'A', v: 'D', cost: 5 }, { u: 'D', v: 'H', cost: 20 },
            { u: 'B', v: 'F', cost: 2 }, { u: 'F', v: 'I', cost: 2 },
            { u: 'A', v: 'C', cost: 1 },
            { u: 'D', v: 'G', cost: 1 },
            { u: 'F', v: 'H', cost: 1 },
            { u: 'G', v: 'E', cost: 20 },
            { u: 'I', v: 'E', cost: 2 }
        ],
        start: 'S', end: 'E', optimal: 10
    }
};

// ==========================================
// Procedural Generation for Levels 21-100
// ==========================================
// ==========================================
// Procedural Generation for Levels 21-100
// ==========================================
(function generateAdditionalLevels() {
    // Simple seeded RNG for consistent levels
    let seed = 12345;
    function random() {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    function randInt(min, max) {
        return Math.floor(random() * (max - min + 1)) + min;
    }

    // Dijkstra's Algorithm
    function calculateOptimal(nodes, edges, startId, endId) {
        const dist = {};
        const visited = {};
        nodes.forEach(n => dist[n.id] = Infinity);
        dist[startId] = 0;

        while (true) {
            let u = null;
            let minDist = Infinity;
            // Find unvisited node with min dist
            nodes.forEach(n => {
                if (!visited[n.id] && dist[n.id] < minDist) {
                    minDist = dist[n.id];
                    u = n.id;
                }
            });

            if (u === null || u === endId) break;
            visited[u] = true;

            // Relax neighbors
            edges.forEach(e => {
                if (e.u === u || e.v === u) {
                    const v = (e.u === u) ? e.v : e.u;
                    if (!visited[v]) {
                        const alt = dist[u] + e.cost;
                        if (alt < dist[v]) dist[v] = alt;
                    }
                }
            });
        }
        return dist[endId];
    }

    // Prune Unreachable (Dead Ends)
    function pruneGraph(nodes, edges, startId, endId) {
        // 1. Forward Reachability from S
        const forward = new Set([startId]);
        let changed = true;
        while (changed) {
            changed = false;
            edges.forEach(e => {
                const hasU = forward.has(e.u);
                const hasV = forward.has(e.v);
                if (hasU && !hasV) { forward.add(e.v); changed = true; }
                if (hasV && !hasU) { forward.add(e.u); changed = true; }
            });
        }

        // 2. Backward Reachability from E
        const backward = new Set([endId]);
        changed = true;
        while (changed) {
            changed = false;
            edges.forEach(e => {
                const hasU = backward.has(e.u);
                const hasV = backward.has(e.v);
                if (hasU && !hasV) { backward.add(e.v); changed = true; }
                if (hasV && !hasU) { backward.add(e.u); changed = true; }
            });
        }

        // 3. Intersection
        const validNodes = nodes.filter(n => forward.has(n.id) && backward.has(n.id));
        const validIds = new Set(validNodes.map(n => n.id));

        // 4. Filter Edges
        const validEdges = edges.filter(e => validIds.has(e.u) && validIds.has(e.v));

        return { nodes: validNodes, edges: validEdges };
    }

    // Generate Levels
    for (let lvl = 21; lvl <= 100; lvl++) {
        const difficulty = (lvl - 20) / 80; // 0.0 to 1.0
        // Increase node count more significantly
        const nodeCount = 8 + Math.floor(difficulty * 25); // 8 to ~33 nodes

        const newNodes = [];
        const w = 800, h = 600;
        const padding = 50;

        // 1. Create Nodes (Grid-ish layout with jitter)
        newNodes.push({ id: 'S', x: padding, y: h / 2, label: 'S' });
        newNodes.push({ id: 'E', x: w - padding, y: h / 2, label: 'E' });

        const letters = "ABCDFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (let i = 0; i < nodeCount - 2; i++) {
            newNodes.push({
                id: (i < letters.length) ? letters[i] : 'N' + i,
                x: randInt(150, w - 150),
                y: randInt(50, h - 50),
                label: (i < letters.length) ? letters[i] : '' + i
            });
        }

        // Sort by X to make edges flow mostly left-to-right
        newNodes.sort((a, b) => a.x - b.x);

        // 2. Create Edges
        let newEdges = [];
        // Ensure initial connectivity
        for (let i = 0; i < newNodes.length - 1; i++) {
            // Connect to nearby future node
            const targetIdx = randInt(i + 1, Math.min(newNodes.length - 1, i + 4));
            const cost = randInt(1, 10);
            newEdges.push({ u: newNodes[i].id, v: newNodes[targetIdx].id, cost: cost });
        }

        // Add random extra edges
        const extraEdges = Math.floor(nodeCount * 1.5); // More edges for complexity
        for (let i = 0; i < extraEdges; i++) {
            const idx1 = randInt(0, newNodes.length - 1);
            const idx2 = randInt(0, newNodes.length - 1);
            if (idx1 !== idx2) {
                const u = newNodes[idx1];
                const v = newNodes[idx2];

                // Avoid duplicates
                const exists = newEdges.some(e =>
                    (e.u === u.id && e.v === v.id) || (e.u === v.id && e.v === u.id)
                );

                if (!exists) {
                    const dist = Math.hypot(u.x - v.x, u.y - v.y);
                    if (dist < 350) { // Slightly longer reach
                        const cost = randInt(1, 20);
                        newEdges.push({ u: u.id, v: v.id, cost: cost });
                    }
                }
            }
        }

        // 3. Prune Dead Ends (The "Useless Node" fix)
        const pruned = pruneGraph(newNodes, newEdges, 'S', 'E');

        // If graph broken or too simple, retry
        if (pruned.nodes.length < 4 && lvl > 30) {
            lvl--;
            continue;
        }

        // 4. Calculate Optimal
        const optimal = calculateOptimal(pruned.nodes, pruned.edges, 'S', 'E');

        if (optimal === Infinity) {
            lvl--;
            continue;
        }

        LEVELS[lvl] = {
            nodes: pruned.nodes,
            edges: pruned.edges,
            start: 'S',
            end: 'E',
            optimal: optimal
        };
    }
})();
