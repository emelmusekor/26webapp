window.C3_LEVELS = {
    generate: function (lvl) {
        // Informatics: Cryptography & Encoding
        // Lvl 1: Caesar Cipher (Shift +1)
        // Lvl 10: Reverse String
        // Lvl 30: Substitution Cipher (Random Key)

        const type = lvl < 10 ? 'caesar' : (lvl < 25 ? 'reverse' : 'subst');
        const shift = lvl < 10 ? 1 : Math.floor(Math.random() * 3) + 1;

        const words = ['APPLE', 'BANANA', 'SCHOOL', 'CODE', 'ROBOT', 'FUTURE', 'DATA', 'SMART', 'GALAXY', 'QUANTUM', 'NETWORK', 'ALGORITHM', 'INTELLIGENCE'];
        const word = words[Math.floor(Math.random() * words.length)];

        let encoded = "";
        let keyMap = {};

        if (type === 'caesar') {
            encoded = word.split('').map(c => String.fromCharCode(c.charCodeAt(0) + shift)).join('');
        } else if (type === 'reverse') {
            // Reverse is too easy, maybe mix it? Reverse + Caesar?
            const rev = word.split('').reverse().join('');
            encoded = rev.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 1)).join(''); // Shift 1 after reverse
        } else {
            // Subst: Ensure no self-mapping and complex mix
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const shuffled = alphabet.split('').sort(() => Math.random() - 0.5).join('');
            encoded = word.split('').map(c => shuffled[alphabet.indexOf(c)]).join('');
            for (let i = 0; i < 26; i++) keyMap[shuffled[i]] = alphabet[i]; // Store decode map
        }

        return { type, word, encoded, shift, keyMap };
    }
};
