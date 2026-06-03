window.E2_LEVELS = {
    generate: function (lvl) {
        // Informatics: Image Representation (Bitmap)
        // Lvl 1: 5x5 Pattern
        // Lvl 10: 8x8 Pattern
        // Lvl 30: 8x8 Random Noise (Hard check)

        const size = lvl < 10 ? 5 : (lvl < 25 ? 8 : (lvl < 40 ? 10 : 12));
        const grid = [];

        // Patterns or Noise
        for (let i = 0; i < size * size; i++) {
            // High levels = more random noise (Harder to memorize/copy?)
            // Actually, E2 is 'Image Representation'. Usually just copying pattern.
            // Random noise is fine.
            grid.push(Math.random() > 0.5 ? 1 : 0);
        }

        return { size, grid };
    }
};
