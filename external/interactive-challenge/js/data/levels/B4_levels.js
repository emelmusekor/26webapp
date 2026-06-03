window.B4_LEVELS = {
    generate: function (lvl) {
        // Domain: Logic AI(B) -> Debugging/Sequencing
        // Task: Reorder items to make logical sense (Sorting).
        // Lvl 1-10: Small numbers (1-10)
        // Lvl 11-30: Large numbers or Negative
        // Lvl 31-50: Alphabet or Mixed or Logic Statements? -> Stick to Sorting for infinite scaling.

        const count = Math.min(10, 3 + Math.floor(lvl / 5)); // 3 to 10 items
        let items = [];
        let hint = "";

        const type = lvl < 20 ? 'number' : 'alphabet';

        if (type === 'number') {
            const range = lvl < 10 ? 20 : 100;
            const useNegative = lvl > 15;

            while (items.length < count) {
                let n = Math.floor(Math.random() * range);
                if (useNegative && Math.random() > 0.7) n = -n;
                if (!items.includes(n)) items.push(n);
            }
            hint = "작은 수부터 큰 수 순서로 나열하세요.";
        } else {
            // Alphabet
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            while (items.length < count) {
                const c = chars[Math.floor(Math.random() * chars.length)];
                if (!items.includes(c)) items.push(c);
            }
            hint = "알파벳 순서(A->Z)로 나열하세요.";
        }

        // Correct order (Sorted)
        // Note: Sort behavior for numbers needs helper
        const correct = [...items].sort((a, b) => {
            if (typeof a === 'number') return a - b;
            return a.localeCompare(b);
        });

        // Shuffle for display
        let shuffled = [...items];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return {
            correct: correct, // Array of values
            shuffled: shuffled,
            hint: hint
        };
    }
};
