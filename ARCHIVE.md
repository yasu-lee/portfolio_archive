# STUDY FILES — 개인 학습 아카이브

Claude Design의 `project/Study Archive.dc.html` 프로토타입을 빌드 없는 정적 사이트로 구현했습니다. 사이트 코드는 `site/` 폴더에 있습니다.

## 구성

```
site/
  index.html            캐비닛 뷰 (폴더 5개) + 바인더 시트 오버레이
  assets/entries.js     ← 모든 기록 데이터. 기록을 추가할 때는 이 파일만 고치면 됩니다
  assets/dossier.js     바인더 시트 렌더러 (캐비닛 오버레이와 개별 페이지가 함께 씀)
  assets/app.js         캐비닛 동작 (아코디언, 검색·필터, 탭 스크롤, 1.5초 호버 열기, 페이지 넘김)
  assets/entry-page.js  개별 기록 페이지 동작
  assets/styles.css
  <category>/<slug>.html  기록 하나 = HTML 파일 하나 (예: notes/transformer.html)
scripts/make-pages.mjs  아직 없는 기록 페이지를 만들어 줌
.github/workflows/pages.yml  main에 푸시하면 GitHub Pages로 배포
```

폴더: **Notes**(파랑) · **Dialogues**(빨강) · **Skills**(보라) · **Projects**(노랑) · **Colophon**(초록)

## 기록 추가하기

1. `site/assets/entries.js`의 `RAW` 배열에 항목을 하나 추가합니다 (`cat`, `slug`, `title`, `summary`, `points` 등 필드 설명은 파일 맨 위에 있습니다).
2. `node scripts/make-pages.mjs`를 실행하면 `site/<cat>/<slug>.html`이 생깁니다. 배포 워크플로도 이 스크립트를 실행하므로 빠뜨려도 괜찮습니다.
3. 에이전트가 만든 HTML 리포트가 있으면 그 파일로 `site/<cat>/<slug>.html`을 덮어쓰세요. 스크립트는 이미 있는 파일을 건드리지 않습니다 (`--force`를 줄 때만 다시 만듭니다).
4. PPT는 `site/<cat>/<slug>.pptx`에 두면 됩니다. 시트의 "PPT 경로 복사" 버튼이 이 경로를 복사합니다.
5. 썸네일 이미지는 `image: 'assets/thumbs/파일.png'` 필드로 지정합니다. 없으면 빗금 무늬 자리 표시가 나옵니다.
6. 프로젝트에 `demo: 'https://...'`를 넣으면 "데모 열기" 버튼이 생깁니다.

링크 공유: `https://<도메인>/#n1`은 캐비닛에서 해당 파일을 열고, `https://<도메인>/notes/transformer.html`은 그 기록만 단독으로 엽니다.

표시 옵션(디자인의 Tweaks)은 `site/index.html`의 `window.STUDY_CONFIG`에서 바꿉니다: `pageTurn: 'flip'|'fade'`, `highlight: 'marker'|'block'`, `showThumbs`.

## 로컬에서 보기

```
python3 -m http.server -d site 8000   # http://localhost:8000
```

빌드 단계가 없어서 `site/index.html`을 브라우저로 바로 열어도 동작합니다.

## 개인 도메인으로 배포 (GitHub Pages)

1. 저장소 **Settings → Pages → Build and deployment**에서 Source를 **GitHub Actions**로 바꿉니다.
2. `main`에 푸시하면 `.github/workflows/pages.yml`이 `site/`를 배포합니다.
3. 같은 Pages 화면의 **Custom domain**에 도메인(예: `archive.내도메인.com`)을 입력하고 **Enforce HTTPS**를 켭니다. Actions로 배포할 때는 `CNAME` 파일이 아니라 이 설정이 쓰입니다.
4. DNS: 서브도메인이면 `CNAME` 레코드를 `<github-사용자명>.github.io`로, 루트 도메인이면 `A` 레코드 4개(`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`)를 추가합니다.
