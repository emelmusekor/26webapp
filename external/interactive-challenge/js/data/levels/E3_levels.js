window.E3_LEVELS = {
    generate: function (lvl) {
        // Informatics: Event Handling
        // Lvl 1: One trigger (Click when Red)
        // Lvl 10: Logic (Click when Red AND Circle)

        // Let's do a sequence of events to react to.
        const conditions = lvl < 10 ? 1 : (lvl < 25 ? 2 : 3);

        let targetColor = Math.random() > 0.5 ? 'red' : 'green';
        let targetShape = Math.random() > 0.5 ? 'circle' : 'square';
        let targetSize = Math.random() > 0.5 ? 'big' : 'small'; // New feature

        let instruction = "";
        const cText = targetColor === 'red' ? '빨간' : '녹색';
        const sText = targetShape === 'circle' ? '동그라미' : '네모';
        const zText = targetSize === 'big' ? '큰' : '작은';

        if (conditions === 1) {
            instruction = `${cText}색이 나오면 클릭하세요!`;
        } else if (conditions === 2) {
            instruction = `${cText} ${sText}가 나오면 클릭하세요!`;
        } else {
            instruction = `${zText} ${cText} ${sText}가 나오면 클릭하세요!`;
        }

        return { instruction, targetColor, targetShape, targetSize, conditions };
    }
};
