window.E4_LEVELS = {
    generate: function (lvl) {
        // Informatics: Database Query (SQL WHERE)
        // Lvl 1: One condition (Type='Apple')
        // Lvl 10: Two conditions (Type='Apple' AND Color='Red')
        // Lvl 30: Range (Price < 500)

        const count = 10;
        const items = [];
        const types = ['사과', '바나나', '포도', '수박'];
        const colors = ['빨강', '노랑', '보라', '초록'];

        for (let i = 0; i < count; i++) {
            items.push({
                id: i,
                type: types[Math.floor(Math.random() * types.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                price: Math.floor(Math.random() * 10) * 100 + 100 // 100~1000
            });
        }

        // Generate Query
        const targetType = types[Math.floor(Math.random() * types.length)];
        const targetColor = colors[Math.floor(Math.random() * colors.length)];
        const targetPrice = Math.floor(Math.random() * 8) * 100 + 200; // 200-900

        let queryText = "";
        let filterFunc = null;

        if (lvl < 10) {
            queryText = `"${targetType}"를 모두 찾으세요.`;
            filterFunc = (item) => item.type === targetType;
        } else if (lvl < 20) {
            queryText = `"${targetColor}" 색깔의 "${targetType}"를 모두 찾으세요.`;
            filterFunc = (item) => item.type === targetType && item.color === targetColor;
        } else if (lvl < 35) {
            queryText = `가격이 ${targetPrice}원 이하인 과일을 찾으세요.`;
            filterFunc = (item) => item.price <= targetPrice;
        } else {
            // Complex: Type OR (Color AND Price)
            // Let's do: (Red OR Blue) AND Price < 500
            // Or simple Compound: Red AND Price < 500
            queryText = `"${targetColor}" 색깔이면서 ${targetPrice}원 이하인 과일을 찾으세요.`;
            filterFunc = (item) => item.color === targetColor && item.price <= targetPrice;
        }

        // Return structured criteria instead of function string
        // targetType, targetColor, targetPrice, mode (1=Type, 2=Color+Type, 3=Price, 4=Complex)
        return {
            items,
            queryText,
            criteria: {
                level: lvl,
                targetType,
                targetColor,
                targetPrice,
                mode: (lvl < 10) ? 1 : ((lvl < 20) ? 2 : ((lvl < 35) ? 3 : 4))
            }
        };
    }
};
