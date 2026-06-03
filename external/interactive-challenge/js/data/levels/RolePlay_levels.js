window.ROLEPLAY_LEVELS = {
    generate: function (lvl) {
        // Domain: System AI -> Variable Definition / Role Identification
        // Task: Identify necessary roles (variables) for a given system context.

        const scenarios = [
            {
                title: "영화 촬영장 (Movie Set)",
                desc: "영화를 만들기 위해 꼭 필요한 역할을 고르세요.",
                roles: ["감독", "배우", "촬영 감독"],
                distractors: ["요리사", "비행 조종사", "농부"],
                slots: 3
            },
            {
                title: "병원 응급실 (Emergency Room)",
                desc: "환자를 치료하기 위해 필요한 역할을 고르세요.",
                roles: ["의사", "간호사", "약사"],
                distractors: ["판사", "소방관", "건축가"],
                slots: 3
            },
            {
                title: "축구 경기 (Soccer Match)",
                desc: "경기를 진행하기 위해 필요한 역할을 고르세요.",
                roles: ["공격수", "수비수", "골키퍼", "심판"],
                distractors: ["야구 선수", "가수", "요리사"],
                slots: 4
            },
            {
                title: "학교 (School)",
                desc: "수업을 진행하기 위해 필요한 역할을 고르세요.",
                roles: ["선생님", "학생"],
                distractors: ["경찰관", "어부"],
                slots: 2
            },
            {
                title: "소프트웨어 개발 (Software Dev)",
                desc: "앱을 만들기 위해 필요한 역할을 고르세요.",
                roles: ["기획자", "디자이너", "개발자", "테스터"],
                distractors: ["배관공", "운전기사"],
                slots: 4
            },
            {
                title: "우주 정거장 (Space Station)",
                desc: "우주 임무를 수행하기 위해 필요한 역할을 고르세요.",
                roles: ["선장", "비행 조종사", "통신관", "과학자"],
                distractors: ["택시 기사", "농부", "어부", "잠수부"],
                slots: 4
            },
            {
                title: "남극 기지 (Antarctic Base)",
                desc: "기지 운영을 위해 필요한 역할을 고르세요.",
                roles: ["대장", "의사", "요리사", "기계 설비사", "통신 담당"],
                distractors: ["수영 강사", "백화점 직원", "버스 기사"],
                slots: 5
            }
        ];

        const data = scenarios[(lvl - 1) % scenarios.length];

        // Shuffle options
        const options = [...data.roles, ...data.distractors];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return {
            title: data.title,
            desc: data.desc,
            options: options,
            correct: data.roles,
            slots: data.slots
        };
    }
};
