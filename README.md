# 디지터시 웹앱

초등학생이 아주 기초적인 ICT와 컴퓨팅 사고를 안전한 웹 환경에서 직접 눌러보고 따라하며 익히는 게임형 체험 플랫폼입니다.

이 프로젝트에서 ICT 기초 역량은 `디지터시`라고 부릅니다. 설명을 듣고 외우는 학습이 아니라, 마우스를 움직이고, 클릭하고, 앱을 열고, 저장하고, 글자를 입력하는 가장 작은 디지털 조작을 몸으로 익히는 능력을 뜻합니다.

## 현재 단계

현재 프로토타입은 메인 플랫폼과 개별 프로그램을 분리한 정적 웹앱입니다. 백엔드 로그인이나 복잡한 저장은 의도적으로 제외하고, 각 영역의 체험 흐름과 유지보수 가능한 폴더 구조를 먼저 잡았습니다.

원본 과업지시서:

- `docs/source/task-brief-12-stage.pdf`

핵심 문서:

- [프로젝트 의도](docs/00_project_intent.md)
- [MVP 범위](docs/01_mvp_scope.md)
- [학습 모듈 구조](docs/02_learning_modules.md)
- [개발 로드맵](docs/03_development_roadmap.md)
- [초기 화면 목록](docs/04_initial_screens.md)
- [게임 중심 설계](docs/05_game_design.md)
- [ICT 계열성 설계](docs/06_ict_learning_matrix.md)
- [웹 가상 컴퓨터와 가이드 시스템](docs/07_virtual_computer_guidance.md)
- [전체 과정 계열성](docs/08_curriculum_progression.md)
- [플랫폼 아키텍처](docs/09_platform_architecture.md)
- [배포 절차](docs/10_deployment.md)

## 플랫폼 구조

메인 화면은 가상 컴퓨터 바탕화면입니다. 학생은 먼저 컴퓨터를 보고, 시작 메뉴, 파일 탐색기, 폴더, 앱, 바탕화면 파일을 조작합니다. 맵은 전체 과정을 한눈에 보는 보조 화면이고, 실제 학습 진입은 컴퓨터 안의 폴더와 앱에서 이루어집니다.

| 대영역 | 모듈 |
| --- | --- |
| ICT | 기능 조작 체험, OS 동작 체험, 타자연습 |
| CT | 코딩 퍼즐, 순서도에서 코드 보기, 언플러그드 컴퓨팅 시각화 놀이, Interactive Challenge |
| AIT | 노드 기반 AI 흐름 실습, 우주 탐사대, AI 기술 흐름 시각화 |
| STEM | 핀테크 체험(네오뱅크), AI와 함께하는 신약 개발 실험, AI Studio STEM 실험실, 모션 코딩(최초 모션 코딩 프로그램들 디자인 바꿔서 넣기) |
| VALUE | AI 성향 딜레마 랩, AI 가치 실습 링크 |

각 체험은 같은 미션 셸, 가이드 콘솔, 진행 표시, 완료 효과, 배지 기록을 공유합니다. 내부 구현 모듈이든 외부 HTML/URL 연결이든 동일한 프로그램 프레임 안에서 전체 화면 활동으로 진입하도록 맞춥니다.

가상 컴퓨터는 미니 OS로 구성합니다. 시작 메뉴, 기본 앱, 앱 창, 작업표시줄, 파일 탐색기, 영역별 학습 폴더, 바탕화면 파일 드래그앤드롭, 탐색기 안 파일 정리, 최소화/최대화/닫기 버튼을 갖습니다.

현재 구현 라운드 수:

| 모듈 타입 | 라운드 |
| --- | ---: |
| ICT 기능 조작 체험 | 15 |
| ICT OS 동작 체험 | 12 |
| ICT 타자연습 | 10 |
| CT 코딩 퍼즐 / 순서도 / 언플러그드 | 각 6 |
| AIT AI 기술 흐름 시각화 | 6 |
| STEM 핀테크(네오뱅크) / 신약 개발 실험 | 각 5 |
| STEM AI Studio 실험실 | 1 |
| 모션 코딩 | 자리만 표시, 실행 차단 |
| VALUE AI 성향 딜레마 랩 | 외부 연결 1 |

## 폴더 구조

```text
/
  index.html                  # 배포 루트의 진입 HTML
  app.js                      # 플랫폼 부트스트랩
  styles.css                  # CSS import 진입점
  .nojekyll                   # GitHub Pages 정적 파일 직접 배포
  .gitignore                  # 로컬/레거시 개발 산출물 제외
  platform/
    data/                     # 모듈 카탈로그, 윤리 원칙 데이터
    core/                     # 상태, 저장소, DOM 유틸, 성공 효과
    runtime/                  # 미션 실행, 라운드 진행, 가이드, 완료 처리
    ui/                       # 플랫폼 맵, 가상 데스크톱, 배지, 교사용 패널, 화면 전환
    modules/                  # ICT, CT, AIT, STEM, VALUE별 체험 렌더러
    styles/                   # 셸, 플랫폼, 미션, 모듈별 CSS
  external/
    ait-node/                 # AIT 노드 기반 실습
    interactive-challenge/    # 첨부된 Interactive Challenge
    stem-ai-studio/           # 가져온 AI Studio STEM 활동 래퍼
    value-dilemma/            # 가져온 AI 성향 딜레마 랩
    legacy-sources/           # 배포 제외 원본 보관 자료
  old/                        # 배포 제외 보관 폴더, README만 추적
  docs/
    source/                   # 원본 과업지시서 등 참고 자료
    *.md                      # 기획/구조 문서
  assets/                     # 플랫폼 이미지, 가상 바탕화면, 패턴
  screenshots/                # 화면 검수 캡처 보관
```

## 프로토타입 실행

작업 폴더에서 실행합니다.

```powershell
cd "H:\내 드라이브\Dev\Webapp"
python -m http.server 4173 --bind 127.0.0.1
```

브라우저 주소:

- http://127.0.0.1:4173/index.html

이미 4173 포트가 사용 중이면 기존 창을 새로고침하거나, 다른 포트로 실행합니다.

```powershell
python -m http.server 4180 --bind 127.0.0.1
```

이 경우 주소는 `http://127.0.0.1:4180/index.html`입니다. 이전 화면이 남아 보이면 `Ctrl+F5`로 강력 새로고침합니다.

## 개발자 진입점

호출 흐름은 다음과 같습니다.

```text
app.js
  -> platform/main.js
      -> core/state.js
      -> ui/elements.js
      -> ui/module-map.js
      -> runtime/mission-runtime.js
          -> modules/registry.js
              -> modules/ict.js, ct.js, ait.js, stem.js, value.js, external.js
```

새 교육 프로그램을 추가할 때는 보통 `platform/data/catalog.js`, `platform/modules/{area}.js`, `platform/modules/registry.js`만 수정하면 됩니다.

## GitHub Pages 배포

이 프로젝트는 정적 웹앱입니다. 빌드 없이 최상위 폴더(`/`)를 그대로 GitHub Pages에 배포합니다.

```powershell
cd "H:\내 드라이브\Dev\Webapp"

git init
git branch -M main
git add .
git commit -m "Initial digiteracy webapp"
git remote add origin https://github.com/깃허브아이디/digiteracy-webapp.git
git push -u origin main
```

GitHub 저장소에서 `Settings` -> `Pages` -> `Build and deployment`로 이동합니다. `Source`는 `Deploy from a branch`, `Branch`는 `main`, 폴더는 `/(root)`로 지정합니다.

업로드 전 확인:

- `external/legacy-sources/`, `external/ai-paradigm-game/`, `old/` 내부 보관 파일, `node_modules/`, `screenshots/`는 `.gitignore`로 제외됩니다.
- 정적 배포에 필요한 파일은 루트의 `index.html`, `app.js`, `styles.css`, `.nojekyll`, `platform/`, `assets/`, 배포 대상 `external/`, `docs/`입니다.

배포 주소는 보통 다음 형태입니다.

```text
https://깃허브아이디.github.io/digiteracy-webapp/
```

자세한 절차와 문제 해결은 [배포 절차](docs/10_deployment.md)를 봅니다.
