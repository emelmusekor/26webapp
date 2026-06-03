window.C4_LEVELS = {
    generate: function (lvl) {
        // Informatics: Logic Gates & Truthiness
        // Lvl 1: Simple True/False statements
        // Lvl 10: AND/OR Logic
        // Lvl 30: Complex NOT Logic

        const type = lvl < 10 ? 'simple' : (lvl < 25 ? 'logic' : 'complex');
        let q = "", a = true;

        if (type === 'simple') {
            const v1 = Math.floor(Math.random() * 10);
            const v2 = Math.floor(Math.random() * 10);
            const sum = v1 + v2;
            if (Math.random() > 0.5) {
                q = `${v1} + ${v2} = ${sum}`;
                a = true;
            } else {
                q = `${v1} + ${v2} = ${sum + 1}`;
                a = false;
            }
        } else if (type === 'logic') {
            // (True AND False)
            const b1 = Math.random() > 0.5;
            const b2 = Math.random() > 0.5;
            const op = Math.random() > 0.5 ? 'AND' : 'OR';

            q = `(${b1} ${op} ${b2})`;
            if (op === 'AND') a = b1 && b2;
            else a = b1 || b2;
        } else {
            // Complex algebra: (A OR B) AND (NOT C)
            // Lvl 30+: 3 variables
            const b1 = Math.random() > 0.5;
            const b2 = Math.random() > 0.5;
            const b3 = Math.random() > 0.5;

            const op1 = Math.random() > 0.5 ? 'AND' : 'OR';
            const op2 = Math.random() > 0.5 ? 'AND' : 'OR';
            const neg = Math.random() > 0.7; // 30% chance for NOT C

            let part1 = b1 && b2;
            if (op1 === 'OR') part1 = b1 || b2;

            let val3 = b3;
            let str3 = `${b3}`;
            if (neg) { val3 = !b3; str3 = `NOT ${b3}`; }

            // Expression: (b1 op1 b2) op2 b3
            q = `(${b1} ${op1} ${b2}) ${op2} ${str3}`;

            if (op2 === 'AND') a = part1 && val3;
            else a = part1 || val3;
        }

        return { q, a };
    }
};
