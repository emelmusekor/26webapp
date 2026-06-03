window.A2_LEVELS = {
    generate: function (lvl) {
        // Informatics: Classification & Pattern Recognition
        // Lvl 1: Single Feature (Red vs Blue)
        // Lvl 10: Conjunction (Red AND Round)
        // Lvl 30: Disjunction (Red OR Round)
        // Lvl 40: Exception (Red, but NOT Square)

        const type = lvl < 10 ? 'simple' : (lvl < 25 ? 'and' : (lvl < 40 ? 'or' : 'not'));
        const features = ['color', 'eye', 'horn', 'mouth'];
        const featureDetails = {
            color: ['red', 'blue', 'green', 'yellow'],
            eye: ['one', 'two', 'three', 'four'],
            horn: ['none', 'one', 'two'],
            mouth: ['smile', 'flat', 'sad']
        };

        // Define Rule
        let rule = {};
        if (type === 'simple') {
            const f = features[Math.floor(Math.random() * features.length)];
            rule = { type: 'simple', key: f, val: featureDetails[f][0], desc: `${f}=${featureDetails[f][0]}` };
        } else if (type === 'and') {
            const f1 = features[0]; const f2 = features[1]; // Simplify to Eyes & Horns for now or random
            // Random pairs
            const k1 = features[Math.floor(Math.random() * features.length)];
            let k2 = features[Math.floor(Math.random() * features.length)];
            while (k2 === k1) k2 = features[Math.floor(Math.random() * features.length)];

            rule = {
                type: 'and',
                k1: k1, v1: featureDetails[k1][0],
                k2: k2, v2: featureDetails[k2][0],
                desc: `${k1}=${featureDetails[k1][0]} AND ${k2}=${featureDetails[k2][0]}`
            };
        } else {
            // OR logic or NOT
            // For now, let's keep it simple 'AND' is hard enough visually.
            // Let's make 'NOT'
            const f = features[Math.floor(Math.random() * features.length)];
            rule = { type: 'not', key: f, val: featureDetails[f][0], desc: `NOT ${f}=${featureDetails[f][0]}` };
        }

        // Return rule for engine to generate aliens
        const alienCount = lvl < 10 ? 3 : (lvl < 25 ? 4 : (lvl < 40 ? 5 : 6));

        return { rule, featureDetails, alienCount };
    }
};
