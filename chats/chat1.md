# 학습 아카이브 포트폴리오 구상

_Started 2026-11-05 10:50 UTC_

---

## User

https://www.mosbyfiles.com/2. 지속적으로 공부하고, 궁금해 했던 내역들을 저장하는 Archive?
    1. 내 Domain을 활용해서 배포할지.
    2. 개별 HTML을 활용할지. 
    3. Youtube나 외부 소스들을 따라하면서 정리 → Agent가 정리해서 HTML이나 PPT로 시각화해서 내가 나중에 꺼내보기 편안하게하는거.
    4. AI Agent와 서로 물어보면서…. Archive 정리하고, 똑같이 HTML이나 PPT로 시각화해서 나중에 꺼내보기 편안하게 하는거. 
    5. Git/Notion 같은 곳에 Skill을 저장해두고, 지속적으로 꺼내쓸 수 있도록 관리하는 Archive.

를만들고 싶고, 참고용으로 활용할 사이트 가져왔어. 저 느낌으로 레퍼런스 할 수 있는 포트폴리오 만들고싶어

## Assistant

_[tool: read_file]_

_[tool: web_fetch]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

I built `Study Archive.dc.html` to look like your Mosby's Files reference: its colours (blue, red, yellow, purple on off-white), a tall condensed headline font, a serif for body text and a monospace font for labels. The verifier is still checking it.

- **Notes (blue):** what you write up while following YouTube videos or other sources.
- **Dialogues (red):** what you work out by going back and forth with an AI agent.
- **Skills (yellow):** the skills you keep in Git or Notion. Each row has a button that copies its path.
- **How it works (purple):** how a source becomes a file, how it's published on your own domain, and the one-HTML-file-per-entry setup.

Everything is functional: search (press `/`), filtering by HTML or PPT, switching between grid and list, and clicking a card to open a side panel with a summary and links to the HTML/PPT. You can also switch between grid and list and turn thumbnails on or off from the Tweaks panel.

**Caveats:**
- The reference site's fonts are paid, so I used free Google look-alikes (Antonio, Noto Serif KR, IBM Plex Mono).
- All the entries are made-up samples, and the thumbnails are placeholders.

**Next steps:** replace the samples with your real records and links, and make a template for a single entry page (one record = one HTML file).

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I fixed the layout problems the check found. It's being re-checked now.

- **Line breaks:** the logo ("STUDY FILES ®"), the Grid/List button and the two labels at the top of the page now stay on one line instead of breaking awkwardly.
- **Skills table on phones:** on screens narrower than 640px, each skill's details now stack in one column and the column headings are hidden, so the skill name and description stay readable.

## User

"Study Archive.dc.html을 현재의 스크롤+사이드바 형태에서 Mosby's Files 스타일의 2-View 인터랙티브 애플리케이션으로 전면 재작성해 줘.

1. [Main View - Folder Cabinet (캐비닛 뷰)]

전체 배경은 #141414, 상단 중앙에 STUDY FILES, 그리고 거대한 ARCHIVE 타이틀을 흰색(#FDFAF7)으로 배치.

화면 하단에는 카테고리별 가로형 컬러 폴더 바(Notes #1E4BD7, Dialogues #D71E1E, Skills #581E70, Colophon #1F7A4C)가 층층이 겹쳐진 스택(Stack) 형태로 배치됨.

각 컬러 바 위에는 해당 카테고리에 속한 항목(ENTRIES)들의 제목이 **사다리꼴 모양의 폴더 탭(Trapezoid folder tabs)**으로 솟아나 있음. 탭에 호버하면 탭이 위로 살짝 올라오는 애니메이션 적용.

카테고리 우측 끝의 화살표나 바를 클릭하면 해당 폴더가 아코디언처럼 열리며 카테고리 설명과 검색/필터가 나타남.

2. [Detail View - Open Dossier Sheet (바인더 상세 뷰)]

사다리꼴 파일 탭을 클릭하면 사이드바가 열리는 대신, 미색 종이 시트(#FDFAF7)가 화면 중앙으로 슬라이드 업 되며 전체 바인더 페이지가 열림.

좌측 가장자리: 세로로 일정한 간격의 검은색 바인더 타공 구멍(Punch holes) 배치.

우측 가장자리: 다른 파일이나 카테고리로 바로 점프할 수 있는 **세로형 컬러 인덱스 탭(writing-mode: vertical-rl)**이 종이 밖으로 튀어나와 있고, 클릭 시 종이가 넘어가는 트랜지션과 함께 내용이 바뀜.

내부 2단 레이아웃: 좌측 컬럼에는 클립(SVG)으로 고정되어 살짝 기울어진 썸네일 카드(호버 시 반듯해짐)와 IBM Plex Mono 메타데이터 배치. 우측 컬럼에는 거대한 제목, 첫 글자 Drop-cap이 적용된 본문, 그리고 클릭하면 노란색(#FFE927) 하이라이트가 칠해지는 인터랙티브 Key Takeaways 리스트 배치."

## Assistant

_[tool: copy_files]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

I rewrote `Study Archive.dc.html` as the two-view app you described; it's being checked now. The previous version is saved as `Study Archive v1.dc.html`.

- **Cabinet view:** a black background with STUDY FILES and a huge ARCHIVE title. Four colored folders stack at the bottom, each with trapezoid tabs that lift on hover. Clicking a folder bar opens it like an accordion, showing the description, a search box, a format filter and the full list.
- **Dossier view:** clicking a tab slides a cream sheet up with punch holes on the left. On the right, vertical index tabs jump to other files in the same folder or to other folders, with a page-flip effect.
- **Inside the sheet:**
  - Left column: a tilted thumbnail held by a paper clip (it straightens on hover) and the file details.
  - Right column: a large title, a drop-cap first letter and the Key Takeaways list. Clicking a takeaway marks it in yellow, and the marks are remembered after reloading.

Esc closes the sheet and the ← → arrow keys move between files in the same folder.

The new Tweaks options are:
- the page-turn effect (flip or fade)
- the highlight style (a marker line under the text, or a full yellow block)
- thumbnails on or off

The download buttons copy each file's path instead of opening anything, because the real HTML and PPT files don't exist yet. To give Skills and Colophon tabs something to open, I wrote 7 new sample entries for them, which you'll want to replace with your own.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I fixed two of the three issues the check found; the page is being re-checked.

- **Prev/next arrows:** the ← and → buttons at the top of the open sheet were white on the cream paper, so you couldn't see them. They're now black.
- **ARCHIVE title:** the line under it overlapped the bottom of the big letters. I added more space between them.

The check also saw one error on page load with no details. I didn't find its cause, so it may still be there.

## User

Apply drawing

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I've made both changes; the page is being checked now.

- **Open on hover:** holding the mouse over the file count and ↓ button on the right of a folder bar for 1.5 seconds opens it. The circle fills up while you wait, so you can see the countdown. Moving the mouse away cancels it, and clicking still works as before.
- **Scrolling the folder tabs:** the tabs above each folder bar now keep a fixed width and scroll sideways instead of squeezing together. You can scroll them with the mouse wheel (up/down or sideways) or by click-dragging. A drag won't open a file by mistake. The right edge fades out to show there are more tabs. With the current sample files, most rows aren't long enough to scroll yet.

