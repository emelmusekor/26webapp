window.B3_LEVELS = {
    generate: function (lvl) {
        // Informatics: Algorithm Execution (Maze/Graph Traversal)
        // Lvl 1: Simple Path, 4x4
        // Lvl 10: 6x6, 2 Obstacles
        // Lvl 30: 8x8, Many Obstacles
        // Lvl 50: 10x10, Dense Obstacles

        const size = lvl < 10 ? 4 : (lvl < 25 ? 6 : (lvl < 40 ? 8 : 10)); // Max 10x10
        // Obstacles: roughly 10% to 30% of map
        let obstacleCount = 0;
        if (lvl > 5) obstacleCount = Math.floor((size * size) * (0.1 + (lvl / 150)));
        obstacleCount = Math.min(Math.floor(size * size * 0.4), obstacleCount); // Cap at 40%

        const start = 0;
        // End point should be far away
        let end;
        do {
            end = Math.floor(Math.random() * (size * size));
            const sr = 0, sc = 0;
            const er = Math.floor(end / size), ec = end % size;
            const dist = Math.abs(sr - er) + Math.abs(sc - ec);
            if (dist < size / 2) end = start; // Retry if too close
        } while (end === start);

        const obstacles = [];
        for (let i = 0; i < obstacleCount; i++) {
            let pos;
            do {
                pos = Math.floor(Math.random() * (size * size));
            } while (pos === start || pos === end || obstacles.includes(pos));
            obstacles.push(pos);
        }

        return { size, start, end, obstacles };
    }
};
