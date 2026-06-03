window.A3_LEVELS = {
    generate: function (lvl) {
        // Informatics Concept: Search Algorithms (BFS/DFS) & Partial Observability
        // Lvl 1-10: Small maze, fully visible. (Global Path Planning)
        // Lvl 11-30: Larger maze, Fog of War (Radius 3). (Local Search / Reactive)
        // Lvl 31-50: Huge maze, Fog of War (Radius 2), Dynamic Obstacles?

        let size = Math.min(31, 6 + Math.floor(lvl / 1.5)); // Max 31x31 for Level 50
        if (size % 2 === 0) size++; // Ensure odd size
        const fogRadius = lvl > 10 ? (lvl > 30 ? 2 : 4) : 999;

        // Recursive Backtracker Maze Gen
        const grid = Array(size * size).fill(1); // 1=Wall
        const idx = (r, c) => r * size + c;
        const stack = [];
        const start = { r: 1, c: 1 };
        grid[idx(1, 1)] = 0;
        stack.push(start);
        const dirs = [{ r: -2, c: 0 }, { r: 2, c: 0 }, { r: 0, c: -2 }, { r: 0, c: 2 }];
        while (stack.length > 0) {
            const curr = stack[stack.length - 1];
            const neighbors = [];
            dirs.forEach(d => {
                const nr = curr.r + d.r;
                const nc = curr.c + d.c;
                if (nr > 0 && nr < size - 1 && nc > 0 && nc < size - 1 && grid[idx(nr, nc)] === 1) {
                    neighbors.push({ r: nr, c: nc, dr: d.r / 2, dc: d.c / 2 });
                }
            });
            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                grid[idx(curr.r + next.dr, curr.c + next.dc)] = 0;
                grid[idx(next.r, next.c)] = 0;
                stack.push({ r: next.r, c: next.c });
            } else {
                stack.pop();
            }
        }

        return {
            size: size,
            grid: grid,
            start: start,
            end: { r: size - 2, c: size - 2 },
            fogRadius: fogRadius
        };
    }
};
