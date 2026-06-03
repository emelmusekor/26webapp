window.A5_LEVELS = {
    generate: function (lvl) {
        // Optimization Problem
        // Stars: Value points
        // Walls: Blockers
        const starCount = Math.min(20, 5 + Math.floor(lvl / 2));
        const wallCount = Math.min(10, 3 + Math.floor(lvl / 2));

        const walls = [];
        for (let i = 0; i < wallCount; i++) {
            walls.push({
                x: Math.random() * 300 + 50,
                y: Math.random() * 300 + 50,
                w: Math.random() * 50 + 20,
                h: Math.random() * 50 + 20
            });
        }

        // Generate stars avoiding walls
        const stars = [];
        let attempts = 0;
        while (stars.length < starCount && attempts < 1000) {
            attempts++;
            const s = { x: Math.random() * 340 + 30, y: Math.random() * 340 + 30 };

            // Check collision with walls
            let hit = false;
            for (let w of walls) {
                if (s.x >= w.x && s.x <= w.x + w.w && s.y >= w.y && s.y <= w.y + w.h) {
                    hit = true; break;
                }
            }
            if (!hit) stars.push(s);
        }

        return { stars, walls, threshold: 0.6 }; // Lower threshold slightly for safety
    }
};
