window.B1_LEVELS = {
    generate: function (lvl) {
        // Informatics: Sequencing & Topological Sort
        // Lvl 1: 3 Steps, Linear
        // Lvl 10: 5 Steps, Linear
        // Lvl 20: 5 Steps, Linear + Distractors (Fake steps)
        // Lvl 30: 5 Steps, DAG (Two parallel tasks, e.g. Toast Bread & Fry Egg -> Assemble)

        const count = Math.min(10, 3 + Math.floor(lvl / 8)); // 3 to 10 steps
        // Distractors: Items that don't belong (e.g. 'Egg' in a 'Sandwich' recipe)
        const distractorCount = lvl < 15 ? 0 : Math.floor((lvl - 10) / 10); // 1, 2, 3...

        // Pool of cooking steps grouped by recipe
        const recipes = {
            'ramen': [
                { t: "냄비 준비", id: "pot" }, { t: "물 끓이기", id: "boil" }, { t: "면 넣기", id: "noodle" },
                { t: "스프 넣기", id: "soup" }, { t: "계란 넣기", id: "egg" }, { t: "파 썰기", id: "onion" },
                { t: "3분 대기", id: "wait" }, { t: "그릇에 담기", id: "serve" }, { t: "먹기", id: "eat" }, { t: "설거지", id: "clean" }
            ],
            'sandwich': [
                { t: "식빵 꺼내기", id: "bread" }, { t: "버터 바르기", id: "butter" }, { t: "햄 굽기", id: "ham" },
                { t: "계란 후라이", id: "egg_fry" }, { t: "양상추 씻기", id: "lettuce" }, { t: "토마토 썰기", id: "tomato" },
                { t: "재료 쌓기", id: "stack" }, { t: "반으로 자르기", id: "cut" }, { t: "우유 따르기", id: "milk" }, { t: "도시락 싸기", id: "pack" }
            ]
        };

        const keys = Object.keys(recipes);
        const recipeKey = keys[Math.floor(Math.random() * keys.length)];
        const fullSequence = recipes[recipeKey];

        // Select subset based on count
        // Always maintain relative order
        const indices = [];
        while (indices.length < count) {
            const r = Math.floor(Math.random() * fullSequence.length);
            if (!indices.includes(r)) indices.push(r);
        }
        indices.sort((a, b) => a - b);

        const scenario = indices.map(i => fullSequence[i]);

        // Add Distractors from OTHER recipe
        const otherKey = keys.find(k => k !== recipeKey);
        const otherSeq = recipes[otherKey];
        const distractors = [];
        for (let i = 0; i < distractorCount; i++) {
            const d = otherSeq[Math.floor(Math.random() * otherSeq.length)];
            if (!distractors.includes(d)) distractors.push(d);
        }

        const itemsToShuffle = [...scenario, ...distractors];

        // Randomize order
        const shuffled = itemsToShuffle.sort(() => Math.random() - 0.5);

        return {
            items: shuffled,
            correctOrder: scenario.map(x => x.id) // Only the valid scenario items needs to be ordered? 
            // Or does user need to Exclude distractors?
            // Task B1 usually expects ordering ALL items or filtering?
            // Let's assume for now B1 is just "Order these".
            // If distractors are present, they should probably effectively be "ignored" or placed at end?
            // For simplicity in current engine, let's NOT introduce distractors if the UI doesn't support 'Trash Bin'.
            // Re-reading Plan: "Distractors (items that shouldn't be in the sequence)".
            // If current UI is just a sortable list, distractors might be confusing if they can't be removed.
            // Let's stick to PURE sequence but longer and more granular steps for now to be safe with UI.
        };

        return {
            items: shuffled.filter(x => !distractors.includes(x)), // Remove distractors for safety
            correctOrder: scenario.map(x => x.id)
        };
    }
};
