window.A4_LEVELS = {
    generate: function (lvl) {
        // Domain: Vision AI(A) -> Classification(2) / Pattern Matching
        // Task: Drag & Drop matching patterns.

        const cardCount = Math.min(36, 4 + Math.floor(lvl / 2) * 2); // 4 to 36 cards
        const patterns = ['★', '●', '▲', '■', '♥', '♦', '♣', '♠', '☀', '☁'];

        // Select subset
        const selected = patterns.slice(0, cardCount / 2); // Pairs
        // Create pairs
        let items = [...selected, ...selected];

        // Shuffle
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        // Return objects
        return {
            items: items.map((p, i) => ({ id: i, pattern: p })),
            target: selected
        };
    }
};
