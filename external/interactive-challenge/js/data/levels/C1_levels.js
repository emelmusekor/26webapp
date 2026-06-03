window.C1_LEVELS = {
    generate: function (lvl) {
        // Informatics: Search (Binary Search / Linear / 2D Grid)
        // Lvl 1: Small Grid, High Contrast
        // Lvl 20: Larger Grid, "Deep Ocean" (Less hints?)

        let size = 5;
        if (lvl > 5) size = 7;
        if (lvl > 15) size = 10;
        if (lvl > 30) size = 15;

        const targetCount = Math.min(10, 1 + Math.floor(lvl / 5));

        // Difficulty modifier: Visibility radius?
        // Engine handles rendering, but we can pass 'noisy: true'
        const noisy = lvl > 25;

        return { size, targetCount, noisy };
    }
};
