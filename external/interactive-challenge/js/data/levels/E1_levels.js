window.E1_LEVELS = {
    generate: function (lvl) {
        // Informatics: Environment Variables (Input)
        // Scenario: Weather Caster
        // Inputs: Sky (Sunny, Rainy, Snowy), Wind (Calm, Strong), Temp (Hot, Cold)
        // Output: Equipment (Umbrella, Hat, Coat, Scarf, Sunglasses)

        const skies = ['맑음', '비', '눈', '흐림'];
        const winds = ['약함', '강함'];
        const temps = ['더움', '추움', '선선함'];

        // Random Environment
        const sky = skies[Math.floor(Math.random() * skies.length)];
        const wind = winds[Math.floor(Math.random() * winds.length)];
        const temp = temps[Math.floor(Math.random() * temps.length)];

        // Determine correct answer(s) logically
        // Level 1: Simple (Rain -> Umbrella)
        // Level 10: Composite (Sunny + Hot -> Sunglasses)

        let correctItems = [];
        let scenario = "";

        if (sky === '비') correctItems.push('우산', '레인부츠');
        if (sky === '눈') correctItems.push('장갑', '목도리');
        if (sky === '맑음' && temp === '더움') correctItems.push('선글라스', '모자');
        if (temp === '추움') correctItems.push('패딩', '목도리');
        if (wind === '강함') correctItems.push('바람막이');

        // Ensure at least one correct item
        if (correctItems.length === 0) {
            // Default for mild weather
            correctItems.push('가벼운옷');
        }

        // Available options
        const allItems = ['우산', '레인부츠', '장갑', '목도리', '선글라스', '모자', '패딩', '바람막이', '가벼운옷', '수영복', '부채'];

        return {
            env: { sky, wind, temp },
            correctItems: correctItems,
            options: allItems
        };
    }
};
