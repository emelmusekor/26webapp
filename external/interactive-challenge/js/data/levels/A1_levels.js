window.A1_LEVELS = {
    generate: function (lvl) {
        // Informatics Concept: Feature Extraction & Working Memory
        // Level 1-10: Simple Matching (Direct Compare)
        // Level 11-30: Working Memory (Target disappears) - Simulates Buffer
        // Level 31-50: Noisy Data (Target is pixelated or blurred) - Feature Restoration

        const faces = ['round', 'square', 'oval', 'triangle', 'heart', 'star', 'diamond'];
        const eyes = ['normal', 'wink', 'glasses', 'angry', 'surprised', 'closed', 'teary'];
        const mouths = ['smile', 'flat', 'open', 'frown', 'tongue', 'zipper', 'mask'];
        const noses = ['small', 'long', 'round', 'pointed', 'flat', 'pig', 'button'];

        // Random target
        const target = {
            face: faces[Math.floor(Math.random() * faces.length)],
            eye: eyes[Math.floor(Math.random() * eyes.length)],
            mouth: mouths[Math.floor(Math.random() * mouths.length)],
            nose: noses[Math.floor(Math.random() * noses.length)]
        };

        let memoryTimeout = 0; // 0 = Always visible
        let noiseLevel = 0; // 0 = Clear

        if (lvl > 10 && lvl <= 30) {
            memoryTimeout = Math.max(1000, 5000 - (lvl * 100)); // 5s down to 2s
        } else if (lvl > 30) {
            memoryTimeout = 2000;
            noiseLevel = (lvl - 30) * 2; // Pixel blur amount
        }

        return {
            target: target,
            options: { faces, eyes, mouths, noses },
            constraints: { memoryTimeout, noiseLevel }
        };
    }
};
