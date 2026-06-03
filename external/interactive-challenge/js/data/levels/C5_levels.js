window.C5_LEVELS = {
    generate: function (lvl) {
        // Informatics: Data Compression (RLE)
        // Lvl 1: Simple repeats (AAA -> 3A)
        // Lvl 10: Mixed (AABBBCCCC -> 2A3B4C)
        // Lvl 30: Long strings

        const len = Math.min(60, 5 + Math.floor(lvl / 1)); // 5 to 55+
        let raw = "";
        let chunks = lvl < 10 ? 3 : (lvl < 25 ? 5 : 10);

        // Dynamic chunks: sometimes short (A), sometimes long (AAAAA)
        const chars = "ABCDEF"; // More chars for difficulty

        for (let i = 0; i < chunks; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            // Vary repeat count significantly
            // Lvl 1: 2-4
            // Lvl 50: 1-8
            const maxRep = 3 + Math.floor(lvl / 5);
            const count = Math.floor(Math.random() * maxRep) + 1;
            raw += char.repeat(count);
        }

        // Calculate Answer (RLE)
        // Implementation of simple RLE
        let answer = "";
        let count = 1;
        for (let i = 0; i < raw.length; i++) {
            if (raw[i] === raw[i + 1]) {
                count++;
            } else {
                answer += count + raw[i];
                count = 1;
            }
        }

        return { raw, answer };
    }
};
