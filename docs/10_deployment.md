# 배포 절차

이 프로젝트는 별도 빌드가 없는 정적 웹앱입니다. `index.html`이 최상위 폴더에 있으므로 GitHub Pages의 `/(root)` 배포를 사용합니다.

## 배포 루트

GitHub Pages에서 선택해야 하는 배포 소스는 다음과 같습니다.

```text
Branch: main
Folder: /(root)
```

최상위 폴더에는 반드시 다음 파일과 폴더가 있어야 합니다.

```text
/
  index.html
  app.js
  styles.css
  assets/
  platform/
  external/
```

`platform/`, `assets/`, `external/`을 다른 폴더로 감싸서 올리면 상대 경로가 깨집니다.

## 처음 GitHub에 올리기

```powershell
cd "H:\내 드라이브\Dev\Webapp"

git init
git branch -M main
git add .
git commit -m "Initial digiteracy webapp"
git remote add origin https://github.com/깃허브아이디/digiteracy-webapp.git
git push -u origin main
```

GitHub CLI를 쓸 수 있다면 다음처럼 저장소 생성과 push를 한 번에 할 수 있습니다.

```powershell
cd "H:\내 드라이브\Dev\Webapp"

gh auth login
gh repo create digiteracy-webapp --public --source=. --remote=origin --push
```

## GitHub Pages 켜기

GitHub 저장소 화면에서 다음 순서로 설정합니다.

```text
Settings
  -> Pages
    -> Build and deployment
      -> Source: Deploy from a branch
      -> Branch: main
      -> Folder: /(root)
      -> Save
```

배포가 끝나면 다음 주소로 접속합니다.

```text
https://깃허브아이디.github.io/digiteracy-webapp/
```

## 수정 후 다시 배포

```powershell
cd "H:\내 드라이브\Dev\Webapp"

git add .
git commit -m "Update learning modules"
git push
```

GitHub Pages는 `main` 브랜치에 push가 들어오면 다시 배포합니다.

## 배포 전 점검

```powershell
cd "H:\내 드라이브\Dev\Webapp"

python -m http.server 4173 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:4173/index.html`을 열어 다음을 확인합니다.

- 메인 카드가 17개 보이는지
- ICT OS가 전체 화면 미니 컴퓨터처럼 열리는지
- 외부 활동 iframe이 깨지지 않는지
- 콘솔에 404 오류가 없는지

## 현재 배포 안정화 메모

- `.nojekyll`을 추가해 GitHub Pages가 정적 파일을 그대로 서빙하게 했습니다.
- `external/legacy-sources/`는 원본 보관용이므로 `.gitignore`로 배포 대상에서 제외했습니다.
- 레거시 프로젝트의 중첩 `.git`은 `external/legacy-sources/interactive-challenge-git-backup/`로 이동했습니다. 루트 Git 저장소에서 embedded repository 경고가 나지 않게 하기 위한 조치입니다.
- `node_modules`는 배포에 필요 없으므로 `.gitignore`로 제외합니다.
