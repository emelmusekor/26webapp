window.C2_LEVELS = {
    generate: function (lvl) {
        // Informatics: Sorting & Conditional Logic
        // Lvl 1: Sort by Color (Red vs Blue)
        // Lvl 10: Sort by Shape (Circle vs Square)
        // Lvl 20: Mixed (Red Circle vs Blue Square)
        // Lvl 30: Switching Rules (Every 5 seconds key changes)

        const goal = 10 + lvl;
        const speed = Math.min(6, 2 + (lvl * 0.1)); // Cap speed at 6

        const ruleType = lvl < 10 ? 'color' : (lvl < 20 ? 'shape' : 'mixed');

        // Define Bins dynamically based on level
        const possibleColors = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fdcb6e'];
        const possibleShapes = ['circle', 'square', 'triangle', 'star']; // 0, 1, 2, 3

        let bins = [];
        // Lvl 1-5: 2 Bins
        // Lvl 6-15: 4 Bins
        const binCount = lvl < 5 ? 2 : 4;

        for (let i = 0; i < binCount; i++) {
            bins.push({
                id: i,
                color: possibleColors[i % possibleColors.length],
                shape: i % possibleShapes.length // For shape rule
            });
        }

        return { goal, speed, ruleType, bins };
    }
};
