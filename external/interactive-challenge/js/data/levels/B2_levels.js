window.B2_LEVELS = {
    generate: function (lvl) {
        // Informatics: Decomposition (Categorization)
        // Level 1: 1 Category, pick valid items (e.g. "School Stuff" vs "Toys")
        // Level 10: 2 Categories (e.g. "Mammals" vs "Reptiles")
        // Level 30: 3 Categories

        const categories = {
            'school': { label: '학교 준비물', items: ['연필', '지우개', '공책', '가방', '필통'] },
            'kitchen': { label: '주방 도구', items: ['냄비', '후라이팬', '국자', '칼', '도마'] },
            'zoo': { label: '동물원', items: ['사자', '호랑이', '기린', '코끼리', '원숭이'] },
            'farm': { label: '농장', items: ['닭', '돼지', '소', '양', '말'] },
            'fruit': { label: '과일', items: ['사과', '바나나', '포도', '수박', '딸기'] },
            'electronics': { label: '가전제품', items: ['TV', '냉장고', '세탁기', '컴퓨터', '에어컨'] }
        };

        const keys = Object.keys(categories);
        // Randomly pick 2 categories (or 3 for high levels)
        const catCount = lvl < 20 ? 2 : 3;
        const selectedKeys = [];
        while (selectedKeys.length < catCount) {
            const k = keys[Math.floor(Math.random() * keys.length)];
            if (!selectedKeys.includes(k)) selectedKeys.push(k);
        }

        const buckets = selectedKeys.map(k => ({ id: k, label: categories[k].label }));

        // Generate items
        let items = [];
        selectedKeys.forEach(k => {
            const list = categories[k].items;
            list.forEach(item => {
                items.push({ text: item, category: k, id: Math.random().toString(36).substr(2, 9) });
            });
        });

        // Add some "Trash" items for difficulty? (Optional)
        // For now, simple categorization. sort all items into buckets.

        // Shuffle items
        items.sort(() => Math.random() - 0.5);

        // Limit item count
        const maxItems = 5 + Math.floor(lvl / 2);
        items = items.slice(0, maxItems);

        return { buckets, items };
    }
};
