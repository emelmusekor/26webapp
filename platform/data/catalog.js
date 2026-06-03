export const AREAS = [
  {
    id: "ict",
    name: "ICT",
    subtitle: "디지터시 기초",
    accent: "#2b6eea",
    modules: [
      {
        id: "ict-controls",
        title: "기능 조작 체험",
        subtitle: "마우스와 키보드를 직접 다루는 첫 체험",
        type: "ictControls",
        status: "체험",
        skills: ["마우스 이동", "클릭", "드래그", "스크롤", "키보드 입력"],
      },
      {
        id: "ict-os",
        title: "OS 동작 체험",
        subtitle: "웹 안의 가상 컴퓨터에서 창, 앱, 파일을 조작",
        type: "virtualOS",
        status: "체험",
        skills: ["시작 메뉴", "메모장", "저장", "파일 탐색기", "휴지통"],
      },
      {
        id: "ict-typing",
        title: "타자연습",
        subtitle: "한글 입력, 수정, 짧은 필사를 연습",
        type: "typingPractice",
        status: "체험",
        skills: ["한글 입력", "스페이스", "백스페이스", "필사"],
      },
    ],
  },
  {
    id: "ct",
    name: "CT",
    subtitle: "컴퓨팅 사고 체험",
    accent: "#e45b55",
    modules: [
      {
        id: "ct-coding-puzzle",
        title: "코딩 퍼즐",
        subtitle: "code.org 수준의 캐릭터 이동 퍼즐",
        type: "codingPuzzle",
        status: "체험",
        skills: ["순차", "반복 전 단계", "명령 움직임"],
      },
      {
        id: "ct-flowchart",
        title: "순서도에서 코드 보기",
        subtitle: "순서도를 만들면 코드가 생기는 과정을 관찰",
        type: "flowchartCode",
        status: "체험",
        skills: ["순서도", "자동 코드 생성", "흐름 이해"],
      },
      {
        id: "ct-unplugged",
        title: "언플러그드 컴퓨팅 시각화 놀이",
        subtitle: "논리, 이진수, 패턴을 몸으로 조작하듯 시각화",
        type: "unpluggedViz",
        status: "체험",
        skills: ["이진 표현", "패턴", "논리"],
      },
      {
        id: "ct-interactive",
        title: "Interactive Challenge",
        subtitle: "첨부된 인터랙티브 챌린지 모음 연결",
        type: "external",
        status: "연결",
        externalPath: "external/interactive-challenge/index.html",
        skills: ["문제 해결", "컴퓨팅 사고", "챌린지"],
      },
    ],
  },
  {
    id: "ait",
    name: "AIT",
    subtitle: "AI 기술 체험",
    accent: "#334155",
    modules: [
      {
        id: "ait-node",
        title: "노드 기반 AI 흐름 실습",
        subtitle: "노드를 연결하며 AI 흐름과 판단 구조를 시각화",
        type: "external",
        status: "연결",
        externalPath: "external/ait-node/index.html",
        skills: ["노드", "AI 흐름", "시각화"],
      },
      {
        id: "ait-space",
        title: "우주 탐사대",
        subtitle: "AI Studio 우주 탐험 활동 연결",
        type: "external",
        status: "체험",
        externalPath: "external/stem-ai-studio/apps/space-explorer.html",
        skills: ["탐사", "데이터", "AI 도우미"],
      },
      {
        id: "ait-history",
        title: "AI 기술 흐름 시각화",
        subtitle: "추상화, 자동화, 지능화, 자율화 흐름 체험",
        type: "aiHistory",
        status: "체험",
        skills: ["AI 역사", "기술 변화", "시각화"],
      },
    ],
  },
  {
    id: "stem",
    name: "STEM",
    subtitle: "융합 실험",
    accent: "#2d9d64",
    modules: [
      {
        id: "stem-fintech",
        title: "핀테크 체험(네오뱅크)",
        subtitle: "네오뱅크 방식의 어린이 금융 체험 자리",
        type: "fintech",
        status: "체험",
        skills: ["네오뱅크", "저축", "소비", "투자"],
      },
      {
        id: "stem-drug",
        title: "AI와 함께하는 신약 개발 실험",
        subtitle: "효과, 안전성, 부작용의 균형을 조정",
        type: "drugLab",
        status: "체험",
        skills: ["실험", "AI 예측", "균형 판단"],
      },
      {
        id: "stem-ai-studio",
        title: "AI Studio STEM 실험실",
        subtitle: "가져온 AI Studio 활동을 STEM 실험 모음으로 열기",
        type: "external",
        status: "체험",
        externalPath: "external/stem-ai-studio/index.html",
        skills: ["태양계", "데이터", "수학 게임", "반응 실험"],
      },
      {
        id: "stem-motion",
        title: "모션 코딩(최초 모션 코딩 프로그램들 디자인 바꿔서 넣기)",
        subtitle: "기존 모션 코딩 프로그램을 통합 디자인으로 다시 붙일 자리",
        type: "placeholder",
        status: "자리",
        skills: ["모션 코딩", "기존 프로그램 리디자인", "추후 연결"],
      },
    ],
  },
  {
    id: "value",
    name: "VALUE",
    subtitle: "AI 가치와 윤리",
    accent: "#f26b4f",
    modules: [
      {
        id: "value-dilemma",
        title: "AI 성향 딜레마 랩",
        subtitle: "가져온 AI 어린이 판사 활동으로 딜레마 판단을 체험",
        type: "external",
        status: "체험",
        externalPath: "external/value-dilemma/ai-kids-judge.html",
        skills: ["딜레마", "성향 검사", "AI 윤리 규칙"],
      },
      {
        id: "value-gemini",
        title: "AI 가치 실습 링크",
        subtitle: "Gemini 공유 활동으로 AI 가치 판단을 이어서 체험",
        type: "external",
        status: "연결",
        externalUrl: "https://gemini.google.com/share/37d553e44c14",
        skills: ["AI 가치", "토론", "외부 실습"],
      },
    ],
  },
];

export function getAllModules() {
  return AREAS.flatMap((area) => area.modules.map((module) => ({ ...module, area })));
}

export function findModule(moduleId) {
  return getAllModules().find((module) => module.id === moduleId) || getAllModules()[0];
}
