// 구축 사례 — 홈·구축 사례 페이지 공용 데이터. 고객사는 업종으로만 표기한다.
// status: live(운영 중) · build(구축 중) · pilot(시범 운영). before/after 가 있으면 '대표 사례' 표에 나온다.
(function () {
  var GROUPS = [
    ["ops", "정산·자금·업무"],
    ["crm", "고객·리드"],
    ["ads", "광고·마케팅 자동화"],
    ["ai", "AI 콘텐츠 제작"],
    ["edu", "교육"],
  ];
  var NOT_LIVE = { build: "구축 중", pilot: "시범 운영" };

  var SYSTEMS = [
    { cat: "ops", ind: "유통", title: "벤더 정산·발주 자동화", status: "live",
      short: "정산서·발주·입금 대조를 한 화면에서. 입금자명과 세금계산서는 AI가 짝지어 줍니다.",
      before: "월말 한 주, 엑셀로 대조", after: "클릭 몇 번으로 마감" },
    { cat: "ops", ind: "건설", title: "현장 자금·결제 관리", status: "live",
      short: "통장·세금계산서 자동 매칭, 현장별 원가 집계. 요청→승인→지급 단계로 이중지급 차단.",
      before: "통장·계산서를 손으로 대조", after: "자동 매칭 · 이중지급 차단" },
    { cat: "ops", ind: "유통", title: "전사 업무대장", status: "live",
      short: "노션·카톡방에 흩어진 업무를 한 대장으로. 담당 자동 넘김, 회계 원장 연결." },
    { cat: "ops", ind: "교육", title: "회원·수강생 통합 관리", status: "live",
      short: "명단·출석·분반·이월을 한곳에서. 외부 툴 구독 없이 자체 운영." },
    { cat: "crm", ind: "자사 운영", title: "광고 리드 자동 수집", status: "live",
      short: "광고·홈페이지 문의가 시트, 메일 알림, 휴대폰 주소록까지 자동으로." },
    { cat: "crm", ind: "생활용품 D2C", title: "자체 CRM", status: "build",
      short: "주문 데이터로 고객을 나누고 재구매 시점에 메시지 발송." },
    { cat: "crm", ind: "건설", title: "AI 인테리어 견적 시뮬레이터", status: "live",
      short: "공간·자재를 고르면 견적과 실사 렌더 이미지가 바로 나옵니다." },
    { cat: "ads", ind: "광고 다계정", title: "메타 광고 자동화 + 일일 리포트", status: "live",
      short: "여러 계정 성과를 매일 아침 슬랙으로. 예산 조정은 말로 지시." },
    { cat: "ads", ind: "일본 이커머스", title: "큐텐 키워드 자동 입찰", status: "live",
      short: "상품×키워드 50건의 입찰가를 4가지 전략으로 자동 조정." },
    { cat: "ads", ind: "광고 운영", title: "광고 소재 분석기", status: "live",
      short: "메타·네이버 성과와 경쟁사 소재 패턴을 모아 다음 소재 기획까지." },
    { cat: "ads", ind: "뷰티·병원·생활", title: "SNS 콘텐츠 자동 발행", status: "live",
      short: "AI가 카드뉴스·쓰레드 글을 만들고, 승인한 것만 예약 발행. 한국어·일본어.",
      before: "기획·디자인·업로드를 손으로", after: "승인하면 정해진 시간에 발행" },
    { cat: "ads", ind: "생활용품·패션", title: "인플루언서 발굴·섭외", status: "live",
      short: "브랜드 톤에 맞는 개인 계정을 찾아 AI 적합도 평가, 협찬 DM 초안까지." },
    { cat: "ads", ind: "생활용품", title: "AI 브랜드 본부", status: "live",
      short: "콘텐츠·퍼포먼스·MD 역할의 AI 담당자가 일하고, 사람은 승인만." },
    { cat: "ai", ind: "패션", title: "AI 모델 컷 스튜디오", status: "live",
      short: "제품 사진으로 룩북 모델 컷. 브랜드 체형·헤어 기준과 치수 점검까지.",
      before: "촬영 일정 잡고 모델 섭외", after: "제품 사진으로 룩북 컷 완성" },
    { cat: "ai", ind: "패션", title: "라이브 영상 → 숏폼 자동 편집", status: "live",
      short: "라이브 녹화본에서 제품 설명·룩북 장면을 찾아 숏폼으로." },
    { cat: "ai", ind: "광고", title: "광고 영상 멀티컷", status: "live",
      short: "긴 영상 하나로 메타 광고용 15초·30초 버전 여러 개." },
    { cat: "ai", ind: "패션", title: "촬영 사진 AI 셀렉", status: "pilot",
      short: "수백 장 중 쓸 컷을 골라 추천. 비슷한 컷·실패 컷은 먼저 제외." },
    { cat: "ai", ind: "패션", title: "옷 사진 → 패션 도식화", status: "live",
      short: "손으로 그리던 생산용 도식화를 사진 한 장으로." },
    { cat: "ai", ind: "생활용품", title: "브랜드 콘텐츠 생성기", status: "live",
      short: "브랜드 톤을 지킨 피드 이미지·문구, 피드 분석으로 다음 게시물 추천." },
    { cat: "edu", ind: "교육기관", title: "마케팅 실습 플랫폼 3종", status: "live",
      short: "메타 광고관리자 체험, GA4형 분석 실습, 광고 소재 투표 도구." },
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function featuredRow(s) {
    return '<div class="gc-ba__row"><div class="gc-ba__name"><small>' + esc(s.ind) + "</small><strong>" + esc(s.title) + "</strong></div>" +
      '<div class="gc-ba__before"><b>전에는</b>' + esc(s.before) + "</div>" +
      '<span class="gc-ba__arrow material-symbols-outlined" aria-hidden="true">arrow_forward</span>' +
      '<div class="gc-ba__after"><b>지금은</b>' + esc(s.after) + "</div></div>";
  }

  function item(s) {
    return "<li><strong>" + esc(s.title) + "</strong><em>" + esc(s.ind) + "</em>" +
      (NOT_LIVE[s.status] ? "<i>" + NOT_LIVE[s.status] + "</i>" : "") + "<p>" + esc(s.short) + "</p></li>";
  }

  document.querySelectorAll("[data-systems]").forEach(function (root) {
    var feat = root.querySelector("[data-systems-featured]");
    var groups = root.querySelector("[data-systems-groups]");
    if (feat) {
      feat.innerHTML = '<div class="gc-ba__head"><span>시스템</span><span>전에는</span><span></span><span>지금은</span></div>' +
        SYSTEMS.filter(function (s) { return s.before; }).map(featuredRow).join("");
    }
    if (groups) {
      groups.innerHTML = GROUPS.map(function (g) {
        var list = SYSTEMS.filter(function (s) { return s.cat === g[0]; });
        return '<div class="gc-group"><h4>' + g[1] + "<span>" + list.length + "</span></h4><ul>" + list.map(item).join("") + "</ul></div>";
      }).join("");
    }
  });
})();
