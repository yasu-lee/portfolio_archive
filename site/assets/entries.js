/*
 * STUDY FILES — archive data.
 *
 * This is the only file you edit to add a record.
 *   1. Add an object to RAW below (cat, slug, title, ...).
 *   2. Run `node scripts/make-pages.mjs` to create its standalone page
 *      at site/<cat>/<slug>.html (existing pages are never overwritten,
 *      so you can replace a page with an agent-made HTML report).
 *
 * Fields
 *   id      unique id, also used in links: index.html#<id>
 *   cat     notes | dialogues | skills | projects | colophon
 *   slug    file name of the entry page (site/<cat>/<slug>.html)
 *   format  e.g. ['HTML', 'PPT'], ['Git'], ['Notion'], ['Demo'], ['Guide']
 *   path    optional; where the source lives (Git/Notion URL). Defaults to the page path.
 *   demo    optional; live URL for a project (adds a "데모 열기" button)
 */
(function () {
  const CATS = [
    { key: 'notes', name: 'Notes', ko: '따라 하며 정리한 노트', color: '#1E4BD7', fg: '#FDFAF7', ink: '#1E4BD7', prefix: 'N',
      desc: '유튜브 강의, 아티클, 공식 문서를 따라 하며 정리한 기록. 에이전트가 핵심을 추려 HTML 리포트나 PPT 슬라이드로 다시 만들어 둡니다.' },
    { key: 'dialogues', name: 'Dialogues', ko: '에이전트와 묻고 답한 기록', color: '#D71E1E', fg: '#FDFAF7', ink: '#D71E1E', prefix: 'D',
      desc: '궁금한 것을 AI 에이전트와 서로 묻고 답하며 정리한 문답. 질문에서 결론까지의 흐름을 그대로 남겨 HTML·PPT로 시각화합니다.' },
    { key: 'skills', name: 'Skills', ko: '꺼내 쓰는 스킬 보관함', color: '#581E70', fg: '#FDFAF7', ink: '#581E70', prefix: 'S',
      desc: 'Git과 Notion에 저장해 둔 에이전트 스킬. 정리 방식 자체를 도구로 만들어, 필요할 때 경로를 복사해 바로 꺼내 씁니다.' },
    { key: 'projects', name: 'Projects', ko: '만들어 본 프로젝트', color: '#FFE927', fg: '#141414', ink: '#141414', prefix: 'P',
      desc: '지금까지 만든 프로젝트와 미니 프로젝트. 무엇을 만들었는지, 어떻게 만들었는지, 무엇을 배웠는지를 파일 하나씩으로 남깁니다.' },
    { key: 'colophon', name: 'Colophon', ko: '이 아카이브가 작동하는 방식', color: '#1F7A4C', fg: '#FDFAF7', ink: '#1F7A4C', prefix: 'C',
      desc: '기록이 파일이 되기까지의 과정, 개인 도메인 배포, 그리고 기록 하나당 HTML 하나라는 운영 원칙.' },
  ];

  const RAW = [
    { id: 'n1', cat: 'notes', title: 'Transformer 구조를 한 장으로: Attention부터 Decoder까지', source: 'YouTube · 딥러닝 강의', format: ['HTML', 'PPT'], date: '2026.10.28', tags: ['AI', 'LLM'], thumb: 'slide capture — attention diagram', slug: 'transformer',
      summary: '1시간 분량의 강의를 따라가며 Self-Attention, Multi-Head, Positional Encoding의 흐름을 정리했다. 수식보다 데이터가 어떻게 이동하는지에 집중했고, 마지막에는 전체 구조를 한 장의 다이어그램으로 다시 그렸다.',
      points: ['Attention은 “어떤 토큰을 얼마나 볼지” 정하는 가중 평균이다.', 'Multi-Head는 서로 다른 관점의 관계를 병렬로 학습한다.', '순서 정보는 Positional Encoding으로 따로 주입된다.'] },
    { id: 'n2', cat: 'notes', title: 'React Server Components 따라 만들며 이해하기', source: 'Docs · 공식 문서', format: ['HTML'], date: '2026.10.14', tags: ['Frontend'], thumb: 'screenshot — component tree', slug: 'rsc',
      summary: '공식 문서 예제를 직접 따라 만들며 서버와 클라이언트의 경계가 어디서 나뉘는지 정리했다. 경계를 잘못 그었을 때 생기는 에러를 일부러 재현해 본 것이 가장 도움이 됐다.',
      points: ['서버 컴포넌트는 클라이언트 번들에 포함되지 않는다.', "'use client'는 경계선 선언이지 파일 단위 옵션이 아니다.", '데이터 패칭을 컴포넌트 가까이에 둘 수 있다.'] },
    { id: 'n3', cat: 'notes', title: 'Figma Auto Layout 실전 패턴 12가지', source: 'YouTube · 디자인 튜토리얼', format: ['PPT'], date: '2026.09.30', tags: ['Design'], thumb: 'slide capture — layout patterns', slug: 'auto-layout',
      summary: '튜토리얼을 따라 하며 자주 쓰는 레이아웃 패턴을 슬라이드 12장으로 압축했다. 각 장에는 패턴 이름, 언제 쓰는지, 흔한 실수를 한 줄씩만 남겼다.',
      points: ['Hug / Fill / Fixed 세 가지만 이해하면 대부분 해결된다.', '중첩 프레임은 3단계 이하로 유지한다.', '간격은 gap으로, padding은 컨테이너에만 준다.'] },
    { id: 'n4', cat: 'notes', title: 'DCF 밸류에이션 기초: 엑셀 없이 개념부터', source: 'Article · 투자 블로그', format: ['HTML', 'PPT'], date: '2026.09.12', tags: ['Finance'], thumb: 'chart — cash flow timeline', slug: 'dcf',
      summary: '아티클 시리즈를 따라 현금흐름 할인 모델의 핵심 가정을 정리했다. 숫자를 넣기 전에 어떤 가정이 결과를 가장 크게 흔드는지부터 이해하는 데 집중했다.',
      points: ['가치는 미래 현금흐름의 현재가치 합이다.', '할인율과 영구성장률 가정이 결과를 좌우한다.', '민감도 표로 가정의 위험을 같이 본다.'] },

    { id: 'd1', cat: 'dialogues', title: 'RAG와 Fine-tuning, 언제 무엇을 써야 할까?', source: 'with Claude', format: ['HTML'], date: '2026.11.02', tags: ['AI'], slug: 'rag-vs-ft', thumb: 'diagram — decision tree',
      summary: '“내 문서로 답하게 하려면?”이라는 질문에서 시작해 비용, 정확도, 업데이트 주기로 비교했다. 세 번의 왕복 질문 끝에 지식은 RAG, 말투와 형식은 Fine-tuning이라는 기준으로 정리됐다.',
      points: ['자주 바뀌는 지식은 검색으로 붙인다.', '출력 형식과 톤을 고정하려면 Fine-tuning이 유리하다.', '대부분은 프롬프트와 RAG로 충분하다.'] },
    { id: 'd2', cat: 'dialogues', title: 'MCP는 왜 필요해졌을까?', source: 'with Claude', format: ['HTML', 'PPT'], date: '2026.10.20', tags: ['AI', 'Agent'], slug: 'mcp', thumb: 'diagram — client / server',
      summary: '에이전트가 외부 도구와 연결되는 방식을 USB 비유로 묻고 답했다. 도구마다 제각각이던 연결 방식을 하나의 프로토콜로 표준화한다는 흐름으로 이해했다.',
      points: ['도구 제공자와 에이전트 사이의 공통 언어다.', '한 번 만든 서버를 여러 클라이언트가 재사용한다.', '권한과 범위를 명시적으로 다룬다.'] },
    { id: 'd3', cat: 'dialogues', title: '좋은 질문은 어떤 구조를 가질까?', source: 'with Claude', format: ['PPT'], date: '2026.10.05', tags: ['Thinking'], slug: 'good-question', thumb: 'slide capture — question frame',
      summary: '프롬프트를 잘 쓰는 법이 아니라, 무엇을 모르는지 정확히 말하는 법에 대한 대화. 맥락, 목표, 제약, 원하는 형식 순서로 질문하면 답의 질이 달라진다는 결론에 도달했다.',
      points: ['내가 이미 아는 것을 먼저 말한다.', '“좋은 답”의 기준을 질문에 포함한다.', '답을 받은 뒤 반론을 요청한다.'] },

    { id: 's1', cat: 'skills', title: 'youtube-summarizer', source: 'Git', format: ['Git'], date: '2026.10.01', tags: ['Agent', 'Notes'], slug: 'youtube-summarizer', path: 'github.com/me/skills/youtube-summarizer', thumb: 'terminal — skill run',
      summary: '영상 링크를 받아 타임라인별 핵심과 요약 노트를 생성하는 스킬. Notes 폴더에 있는 기록의 대부분이 이 스킬에서 시작된다.',
      points: ['입력은 YouTube URL, 출력은 타임스탬프 요약 마크다운이다.', '챕터가 없으면 주제 전환 지점을 추정해 구간을 나눈다.', '마지막에 “다시 볼 구간” 세 개를 추천한다.'] },
    { id: 's2', cat: 'skills', title: 'html-report', source: 'Git', format: ['Git'], date: '2026.09.18', tags: ['Agent', 'HTML'], slug: 'html-report', path: 'github.com/me/skills/html-report', thumb: 'preview — report page',
      summary: '정리된 노트를 이 아카이브와 같은 양식의 단일 HTML 리포트로 시각화하는 스킬.',
      points: ['노트를 한 페이지 HTML로 변환한다.', '아카이브와 같은 타이포·컬러 규칙을 적용한다.', '파일 하나로 열리도록 에셋을 인라인한다.'] },
    { id: 's3', cat: 'skills', title: 'pptx-builder', source: 'Git', format: ['Git'], date: '2026.09.03', tags: ['Agent', 'PPT'], slug: 'pptx-builder', path: 'github.com/me/skills/pptx-builder', thumb: 'preview — slide grid',
      summary: '핵심 내용을 10장 내외의 PPT 슬라이드로 변환하는 스킬. 다시 꺼내 볼 때 한 장씩 넘기며 복습하기 좋다.',
      points: ['핵심 메시지 하나당 슬라이드 하나.', '10장 내외로 압축한다.', '발표자 노트에 원문 출처를 기록한다.'] },
    { id: 's4', cat: 'skills', title: 'dialogue-to-note', source: 'Notion', format: ['Notion'], date: '2026.08.22', tags: ['Agent', 'Dialogues'], slug: 'dialogue-to-note', path: 'notion.so/me/skills/dialogue-to-note', thumb: 'page — notion template',
      summary: '에이전트와의 문답 기록을 질문에서 결론까지의 구조로 재정리하는 스킬. Dialogues 폴더의 양식을 만든다.',
      points: ['질문 → 반론 → 결론 순서로 재구성한다.', '대화 중 바뀐 생각을 따로 표시한다.', 'Dialogues 폴더 양식으로 저장한다.'] },

    { id: 'p1', cat: 'projects', title: 'STUDY FILES — 이 아카이브 자체', source: 'Project · 개인', format: ['HTML', 'Git'], date: '2026.11.05', tags: ['Frontend', 'Design'], slug: 'study-files', path: 'github.com/me/study-files', thumb: 'screenshot — folder cabinet',
      summary: '공부한 기록을 폴더 캐비닛처럼 꺼내 보는 개인 아카이브. 빌드 없이 정적 HTML만으로 만들고, 기록 하나당 파일 하나라는 원칙으로 개인 도메인에 배포했다.',
      points: ['데이터 파일 하나와 기록별 HTML 페이지로만 구성된다.', '사다리꼴 폴더 탭과 바인더 시트로 “꺼내 본다”는 감각을 살렸다.', 'GitHub Pages와 개인 도메인으로 유지 비용 없이 운영한다.'] },
    { id: 'p2', cat: 'projects', title: '가계부 자동 분류 봇', source: 'Mini project · 2주', format: ['Git', 'Demo'], date: '2026.08.10', tags: ['Python', 'Automation'], slug: 'budget-bot', path: 'github.com/me/budget-bot', thumb: 'terminal — categorized csv',
      summary: '카드 내역 CSV를 받아 카테고리를 자동으로 붙이고 월별 요약을 보내 주는 작은 봇. 규칙 기반으로 시작해, 애매한 항목만 LLM에게 묻도록 바꾸면서 비용과 정확도를 함께 잡았다.',
      points: ['규칙으로 80%를 처리하고 나머지만 모델에게 묻는다.', '사람이 고친 분류는 다음 규칙으로 다시 쌓는다.', '작게 만들고 매주 실제로 써 보는 것이 가장 빨랐다.'] },
    { id: 'p3', cat: 'projects', title: '주간 리서치 대시보드', source: 'Mini project · 1주', format: ['HTML'], date: '2026.07.21', tags: ['Data', 'Frontend'], slug: 'research-dashboard', thumb: 'chart — weekly reading log',
      summary: '한 주 동안 읽고 본 자료를 모아 주제별로 묶어 보여 주는 대시보드. 무엇을 많이 봤는지보다, 무엇을 다시 볼지 고르는 데 쓰도록 설계했다.',
      points: ['입력은 북마크 내보내기 파일 하나로 단순하게 유지했다.', '주제별 묶음과 “다시 볼 것” 목록을 분리했다.', '숫자보다 다음 행동을 먼저 보여 준다.'] },

    { id: 'c1', cat: 'colophon', title: 'Source → File: 기록이 파일이 되기까지', source: 'Colophon', format: ['Guide'], date: '2026.11.05', tags: ['Process'], slug: 'process', thumb: 'diagram — 4-step flow',
      summary: '모든 기록은 같은 네 단계를 거친다. 출처를 정하고, 에이전트와 정리하고, 저장된 스킬로 시각화하고, 파일로 보관한다.',
      points: ['Source — 유튜브, 아티클, 문서, 또는 에이전트에게 던진 질문 하나.', 'Agent — 따라 정리하거나 문답을 주고받으며 핵심을 추린다.', 'Visualize — 저장된 스킬로 HTML 리포트나 PPT를 만든다.', 'File — 개인 도메인에 올리고 이 캐비닛에 등록한다.'] },
    { id: 'c2', cat: 'colophon', title: '개인 도메인으로 배포하기', source: 'Colophon', format: ['Guide'], date: '2026.11.05', tags: ['Deploy'], slug: 'domain', thumb: 'diagram — url structure',
      summary: '아카이브는 개인 도메인에서 정적 사이트로 운영한다. 카테고리별 경로로 나눠, 특정 기록을 링크 하나로 공유할 수 있게 했다.',
      points: ['/notes, /dialogues, /skills, /projects 경로로 분리한다.', '링크 하나로 특정 기록을 공유한다.', '정적 호스팅으로 유지 비용을 최소화한다.'] },
    { id: 'c3', cat: 'colophon', title: '기록 하나 = HTML 파일 하나', source: 'Colophon', format: ['Guide'], date: '2026.11.05', tags: ['Principle'], slug: 'one-file', thumb: 'diagram — file per entry',
      summary: '기록 하나당 독립된 HTML 파일 하나. 이 캐비닛은 파일들을 모아 보여주는 목차일 뿐이라, 새 기록은 파일을 추가하는 것만으로 쌓인다.',
      points: ['인덱스는 목차 역할만 한다.', '새 기록은 파일 추가만으로 쌓인다.', '오래된 파일도 독립적으로 열린다.'] },
  ];

  const pad = (n) => String(n).padStart(2, '0');
  const ENTRIES = [];
  CATS.forEach((c) => RAW.filter((e) => e.cat === c.key).forEach((e, i) => {
    const page = `${e.cat}/${e.slug}.html`;
    ENTRIES.push({
      ...e, no: `${c.prefix}—${pad(i + 1)}`, catName: c.name, color: c.color, fg: c.fg, ink: c.ink,
      fmt: e.format.join(' · '), page, path: e.path || `/${page}`,
    });
  }));
  const BY_ID = Object.fromEntries(ENTRIES.map((e) => [e.id, e]));

  const root = typeof window !== 'undefined' ? window : globalThis;
  root.STUDY = { CATS, ENTRIES, BY_ID, pad };
})();
