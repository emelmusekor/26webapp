window.D1_LEVELS = {
    generate: function (lvl) {
        // Informatics: Graph Theory (Directed Graph & Cycles)
        // Lvl 1: 3 Nodes, Find "Who gives to X?"
        // Lvl 10: 5 Nodes, Find cycle (A->B->C->A)
        // Lvl 30: 8 Nodes, Complete mapping

        const count = Math.min(15, 3 + Math.floor(lvl / 3));
        const names = ['철수', '영희', '민수', '지수', '호영', '준호', '나영', '동수', '미란', '경수', '혜진', '성민', '자영', '태호', '순희'];
        const people = names.slice(0, count);

        // Random Directed Graph (Not just 1:1 Cycle)
        // Allow nodes to receive from multiple people.
        const edges = [];

        // Ensure connectivity or just random?
        // Let's add random edges.
        people.forEach(p => {
            // Every person gives to at least 1 person?
            // Or just random.
            let target = people[Math.floor(Math.random() * count)];
            while (target === p) {
                target = people[Math.floor(Math.random() * count)];
            }
            edges.push({ from: p, to: target });

            // Chance to give to another person (Multi-edge)
            if (Math.random() > 0.7) {
                let target2 = people[Math.floor(Math.random() * count)];
                if (target2 !== p && target2 !== target) {
                    edges.push({ from: p, to: target2 });
                }
            }
        });

        // Generate Question with Hops
        // Find a recipient, ideally one with multiple senders for Level > 10
        const counts = {};
        edges.forEach(e => {
            if (!counts[e.to]) counts[e.to] = [];
            counts[e.to].push(e.from);
        });

        // Pick target
        const recipients = Object.keys(counts);
        let target = recipients[Math.floor(Math.random() * recipients.length)];

        // Try to find one with multiple senders if lvl is high
        if (lvl > 5) {
            const multi = recipients.find(r => counts[r].length > 1);
            if (multi) target = multi;
        }

        let qText = `${target}에게 선물을 주는 사람을 **모두** 고르세요.`;
        const answers = counts[target]; // Array of names

        return { people, edges, question: { q: qText, a: answers } };
    }
};
