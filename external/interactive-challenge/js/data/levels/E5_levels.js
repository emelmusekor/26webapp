window.E5_LEVELS = {
    generate: function (lvl) {
        // Informatics: Supervised Learning (Classification)
        // Lvl 1: One clear feature (Color: Red vs Blue)
        // Lvl 10: Two features (Red Circle vs Blue Square)
        // Lvl 30: Noisy data / Rule exception

        // Classes: A vs B
        const features = ['color', 'shape', 'size'];
        const colors = ['red', 'blue'];
        const shapes = ['circle', 'square'];

        // Define Rule
        // e.g. "If Red -> Group A, Blue -> Group B"
        // Multi-feature rules logic
        const ruleType = lvl < 20 ? 'single' : 'multi';
        const ruleFeature = lvl < 10 ? 'color' : 'shape';

        let ruleFunc = null;
        if (ruleType === 'single') {
            if (ruleFeature === 'color') ruleFunc = (o) => o.color === 'red' ? 'A' : 'B';
            else ruleFunc = (o) => o.shape === 'circle' ? 'A' : 'B';
        } else {
            // Multi: Red Circle -> A, else B? Or X-OR?
            // Let's do: Red AND Circle -> A, else B
            ruleFunc = (o) => (o.color === 'red' && o.shape === 'circle') ? 'A' : 'B';
        }

        // Generate Training Data (Labeled)
        const training = [];
        for (let i = 0; i < 8; i++) { // More data
            const c = colors[Math.floor(Math.random() * 2)];
            const s = shapes[Math.floor(Math.random() * 2)];
            // Avoid logic where A is empty if random luck
            const obj = { color: c, shape: s };
            obj.group = ruleFunc(obj);
            training.push(obj);
        }

        // Generate Test Data (Unlabeled)
        const c = colors[Math.floor(Math.random() * 2)];
        const s = shapes[Math.floor(Math.random() * 2)];

        const testObj = { color: c, shape: s };
        let answer = ruleFunc(testObj);

        return { training, test: testObj, answer, ruleFeature };
    }
};
