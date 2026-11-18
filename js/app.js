// app.js - 핵심 로직 및 인터랙션 제어

let currentBook = null;
let charts = {};

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  renderBookGrids();
  populateRounds();
  bindEvents();
  renderHomeCharts();
}

/* 1. 도서 목록 렌더링 */
function renderBookGrids() {
  const grid2027 = document.getElementById("grid-2027");
  const grid2026 = document.getElementById("grid-2026");

  grid2027.innerHTML = APP_DATA.books2027.map(book => createBookCardHTML(book)).join("");
  grid2026.innerHTML = APP_DATA.books2026.map(book => createBookCardHTML(book)).join("");
}

function createBookCardHTML(book) {
  if (book.ready) {
    return `
      <div class="book-card ready-state">
        <div class="ready-content">
          <div class="ready-icon-wrapper">
            <span class="ready-clock-icon">🕒</span>
          </div>
          <div class="ready-text">교재 준비중...</div>
          <div class="ready-subtext">Coming Soon</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="book-card" data-id="${book.id}">
      <div class="book-cover-container" onclick="openDetailView('${book.id}')">
        <div class="book-cover-3d">
          <img src="${book.coverImage}" class="book-cover-img" alt="${book.title}" loading="lazy">
          <div class="book-shine"></div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn-book-info" onclick="showBookInfo('${book.title}')" title="도서 상세 안내">
          <span class="btn-icon">ℹ</span> 교재정보
        </button>
        <button class="btn-start-grade" onclick="openDetailView('${book.id}')" title="채점 시작">
          <span class="btn-icon">✎</span> 채점하기
        </button>
      </div>
    </div>
  `;
}

function showBookInfo(title) {
  alert(`[교재 정보 안내]\n\n📖 도서명: ${title}\n- 출판사: 영진닷컴 / 이기적 수험서\n- 지원: 2026-2027 최신 출제기준 완벽 반영 자동 채점\n- 혜택: 전강의 동영상 무료 & CBT 모의고사 제공`);
}

/* 2. 회차 옵션 목록 */
function populateRounds() {
  const select = document.getElementById("select-round");
  select.innerHTML = APP_DATA.examRounds.map(round => `
    <option value="${round}">${round}</option>
  `).join("");
}

/* 3. 뷰 전환 제어 */
function showHomeView() {
  document.getElementById("home-view").classList.add("active");
  document.getElementById("detail-view").classList.remove("active");
  const archiveView = document.getElementById("archive-view");
  if (archiveView) archiveView.classList.remove("active");
  window.scrollTo(0, 0);
}

function openDetailView(bookId) {
  const allBooks = [...APP_DATA.books2027, ...APP_DATA.books2026];
  const book = allBooks.find(b => b.id === bookId) || APP_DATA.books2027[1];
  currentBook = book;

  // 도서 배너 정보 갱신
  const thumb = document.getElementById("detail-book-thumb");
  if (thumb) {
    if (book.coverImage) {
      thumb.innerHTML = `<img src="${book.coverImage}" alt="${book.title}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">`;
      thumb.style.background = "transparent";
      thumb.style.padding = "0";
    } else {
      thumb.style.background = book.coverBg || "#4a90e2";
      thumb.innerHTML = `
        <span style="font-size:10px; background:rgba(0,0,0,0.3); padding:1px 4px; border-radius:2px; margin-bottom:4px;">${book.year || '2027'}</span>
        <span id="detail-book-title-short">${book.category || book.title}</span>
      `;
    }
  }

  // 뷰 전환
  document.getElementById("home-view").classList.remove("active");
  document.getElementById("detail-view").classList.add("active");
  const archiveView = document.getElementById("archive-view");
  if (archiveView) archiveView.classList.remove("active");
  window.scrollTo(0, 0);

  // 점수 및 결과 초기화
  resetGrades();

  // 순위 차트 렌더링
  setTimeout(() => {
    renderDetailRankCharts();
  }, 100);
}

function showArchiveView() {
  document.getElementById("home-view").classList.remove("active");
  document.getElementById("detail-view").classList.remove("active");
  const archiveView = document.getElementById("archive-view");
  if (archiveView) {
    archiveView.classList.add("active");
  }
  window.scrollTo(0, 0);

  // 자료실 목록 최초 렌더링
  renderArchiveTable(APP_DATA.archivePosts);
}

/* 3-1. 출판사 자료실 렌더링 및 인터랙션 */
function renderArchiveTable(posts) {
  const tbody = document.getElementById("archive-table-body");
  if (!tbody) return;

  if (!posts || posts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 60px 0; color: #888;">
          검색 결과가 없습니다. 다른 검색어로 다시 시도해보세요.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = posts.map(post => `
    <tr class="archive-row" onclick="downloadArchiveItem(${post.id})">
      <td style="text-align:center; color:#888;">${post.id}</td>
      <td class="archive-title-cell">
        <a href="javascript:void(0)" class="archive-item-title">${post.title}</a>
      </td>
      <td style="text-align:center; color:#555;">${post.author}</td>
      <td style="text-align:center; color:#888; font-size:12px;">${post.date}</td>
      <td style="text-align:center;">
        <button class="btn-disk-dl" onclick="event.stopPropagation(); downloadArchiveItem(${post.id})" title="부록 및 정답자료 다운로드">
          💾
        </button>
      </td>
      <td style="text-align:center; color:#888; font-size:12px;">${post.views ? post.views.toLocaleString() : '-'}</td>
    </tr>
  `).join("");
}

function downloadArchiveItem(postId) {
  const post = APP_DATA.archivePosts.find(p => p.id === postId);
  if (!post) return;

  const msg = `[영진닷컴 출판사 도서 자료실]\n\n📖 도서명:\n${post.title}\n\n📦 다운로드 파일:\n${post.fileName} (${post.fileType.toUpperCase()} 압축파일)\n\n※ 실기 부록 실습용 소스파일 및 정답·해설 PDF가 포함되어 있습니다.\n다운로드를 진행하시겠습니까?`;
  
  if (confirm(msg)) {
    alert(`'${post.fileName}' 다운로드를 시작했습니다.\n다운로드 완료 후 실기 채점소에서 문제 풀이 및 자동 채점을 진행하실 수 있습니다.`);
  }
}

function searchArchive() {
  const typeSelect = document.getElementById("archive-search-type");
  const input = document.getElementById("archive-search-input");
  if (!input) return;

  const keyword = input.value.trim().toLowerCase();
  const type = typeSelect ? typeSelect.value : "title";

  if (!keyword) {
    renderArchiveTable(APP_DATA.archivePosts);
    return;
  }

  const filtered = APP_DATA.archivePosts.filter(post => {
    if (type === "title") {
      return post.title.toLowerCase().includes(keyword);
    } else if (type === "code") {
      return post.bookCode.toLowerCase().includes(keyword) || post.title.toLowerCase().includes(keyword);
    } else if (type === "author") {
      return post.author.toLowerCase().includes(keyword);
    }
    return post.title.toLowerCase().includes(keyword);
  });

  renderArchiveTable(filtered);
}

/* 4. 채점 리셋 및 시뮬레이션 */
function resetGrades() {
  document.getElementById("score-part1").innerText = "0점";
  document.getElementById("score-part2").innerText = "0점";
  document.getElementById("score-part3").innerText = "0점";
  document.getElementById("score-part4").innerText = "0점";
  document.getElementById("total-score-num").innerHTML = `0 <span style="font-size:20px; font-weight:normal;">점</span>`;

  // 합격 상태 뱃지 초기화
  const passPill = document.getElementById("pass-status-pill");
  if (passPill) {
    passPill.className = "pass-status-pill waiting";
    document.getElementById("pass-status-text").innerText = "채점 대기";
  }

  document.getElementById("dropzone-text").innerHTML = `<span>⬆</span> 채점할 파일 선택 (클릭 또는 드래그)`;
  
  const tbody = document.getElementById("deduct-table-body");
  tbody.innerHTML = `
    <tr>
      <td colspan="5" style="text-align: center; padding: 60px 0; color: #888;">
        채점할 파일을 선택하고 <strong>[채점시작]</strong> 버튼을 누르면 감점 내역이 분석됩니다.
      </td>
    </tr>
  `;
}

function runGradeSimulation() {
  const fileText = document.getElementById("dropzone-text").innerText;
  const btn = document.getElementById("btn-start-grade");

  btn.disabled = true;
  btn.innerHTML = `<span>⏳</span> 채점중...`;

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = `<span>✓</span> 채점시작`;

    const res = APP_DATA.mockResults;
    const isPass = res.scores.total >= APP_DATA.gradingCriteria.passScore;
    
    // 점수 채우기
    document.getElementById("score-part1").innerText = `${res.scores.part1.score}점`;
    document.getElementById("score-part2").innerText = `${res.scores.part2.score}점`;
    document.getElementById("score-part3").innerText = `${res.scores.part3.score}점`;
    document.getElementById("score-part4").innerText = `${res.scores.part4.score}점`;

    // 합격/불합격 상태 뱃지 업데이트 (기준: 70점 이상 합격)
    const passPill = document.getElementById("pass-status-pill");
    const passText = document.getElementById("pass-status-text");
    if (passPill && passText) {
      if (isPass) {
        passPill.className = "pass-status-pill passed";
        passText.innerText = "🎉 최종 합격 (70점 이상)";
      } else {
        passPill.className = "pass-status-pill failed";
        passText.innerText = "😢 불합격 (기준: 70점)";
      }
    }

    // 총점수 카운팅 애니메이션
    animateScore(res.scores.total);

    // 감점 내역 테이블 렌더링 (2급 기준 부분점수 여부 포함)
    renderDeductions(res.deductions);

    const resultMessage = isPass
      ? `🎉 채점이 완료되었습니다!\n\n총점: ${res.scores.total}점 [합격]\n(컴퓨터활용능력 2급 실기 합격 기준: 70점 이상 통과!)`
      : `채점이 완료되었습니다.\n\n총점: ${res.scores.total}점 [불합격]\n(컴퓨터활용능력 2급 실기 합격 기준: 70점 이상)`;

    alert(resultMessage);
  }, 800);
}

function animateScore(targetScore) {
  const el = document.getElementById("total-score-num");
  let cur = 0;
  const step = Math.ceil(targetScore / 20);
  const timer = setInterval(() => {
    cur += step;
    if (cur >= targetScore) {
      cur = targetScore;
      clearInterval(timer);
    }
    el.innerHTML = `${cur} <span style="font-size:20px; font-weight:normal;">점</span>`;
  }, 30);
}

function renderDeductions(deductions) {
  const tbody = document.getElementById("deduct-table-body");
  if (!deductions || deductions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px 0; color: #2a9d8f; font-weight: bold;">
          🎉 축하합니다! 감점 내역이 없습니다. (100점 만점)
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = deductions.map(item => {
    const partialTag = item.hasPartial
      ? `<span class="badge-tag-partial has">부분점수 인정</span>`
      : `<span class="badge-tag-partial none">부분점수 없음</span>`;

    return `
      <tr>
        <td style="font-weight:bold; color:#1a4f8b; text-align:center;">${item.part}</td>
        <td style="font-weight:600;">${item.title}</td>
        <td style="text-align:center;" class="td-score-minus">${item.points}</td>
        <td style="text-align:center;">${partialTag}</td>
        <td style="color:#555; line-height:1.4;">${item.detail}</td>
      </tr>
    `;
  }).join("");
}

/* 5. 이벤트 바인딩 */
function bindEvents() {
  // 상단 네비게이션
  document.getElementById("nav-home").addEventListener("click", showHomeView);
  
  const navArchive = document.getElementById("nav-archive");
  if (navArchive) {
    navArchive.addEventListener("click", showArchiveView);
  }

  document.getElementById("nav-help").addEventListener("click", () => {
    document.getElementById("modal-help").classList.add("active");
  });

  // 자료실 검색 이벤트
  const btnArchiveSearch = document.getElementById("btn-archive-search");
  if (btnArchiveSearch) {
    btnArchiveSearch.addEventListener("click", searchArchive);
  }

  const inputArchiveSearch = document.getElementById("archive-search-input");
  if (inputArchiveSearch) {
    inputArchiveSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchArchive();
      }
    });
  }

  const btnArchiveReset = document.getElementById("btn-archive-reset");
  if (btnArchiveReset) {
    btnArchiveReset.addEventListener("click", () => {
      if (inputArchiveSearch) inputArchiveSearch.value = "";
      renderArchiveTable(APP_DATA.archivePosts);
    });
  }

  // 채점 기준 모달 이벤트
  const navCriteria = document.getElementById("nav-criteria");
  if (navCriteria) {
    navCriteria.addEventListener("click", () => {
      document.getElementById("modal-criteria").classList.add("active");
    });
  }

  const btnCriteriaDetail = document.getElementById("btn-open-criteria-modal");
  if (btnCriteriaDetail) {
    btnCriteriaDetail.addEventListener("click", () => {
      document.getElementById("modal-criteria").classList.add("active");
    });
  }

  const modalCriteriaClose = document.getElementById("modal-criteria-close");
  if (modalCriteriaClose) {
    modalCriteriaClose.addEventListener("click", () => {
      document.getElementById("modal-criteria").classList.remove("active");
    });
  }

  const modalCriteriaConfirm = document.getElementById("modal-criteria-confirm");
  if (modalCriteriaConfirm) {
    modalCriteriaConfirm.addEventListener("click", () => {
      document.getElementById("modal-criteria").classList.remove("active");
    });
  }

  // 도움말 모달
  document.getElementById("modal-help-close").addEventListener("click", () => {
    document.getElementById("modal-help").classList.remove("active");
  });
  document.getElementById("modal-help-confirm").addEventListener("click", () => {
    document.getElementById("modal-help").classList.remove("active");
  });

  // 문제파일 다운로드 모달
  document.getElementById("btn-download-round").addEventListener("click", () => {
    document.getElementById("modal-download").classList.add("active");
  });
  document.getElementById("modal-download-close").addEventListener("click", () => {
    document.getElementById("modal-download").classList.remove("active");
  });

  // 점수별 통계보기 모달
  document.getElementById("btn-open-stats-modal").addEventListener("click", () => {
    document.getElementById("modal-stats").classList.add("active");
    renderModalPieCharts();
  });
  document.getElementById("modal-stats-close").addEventListener("click", () => {
    document.getElementById("modal-stats").classList.remove("active");
  });
  document.getElementById("modal-stats-confirm").addEventListener("click", () => {
    document.getElementById("modal-stats").classList.remove("active");
  });

  // 파일 업로더
  const fileInput = document.getElementById("file-uploader");
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      document.getElementById("dropzone-text").innerHTML = `📄 <strong>${fileName}</strong> 준비완료`;
    }
  });

  // 채점 버튼
  document.getElementById("btn-start-grade").addEventListener("click", runGradeSimulation);
}

/* 6. Chart.js 차트 렌더링 */
function renderHomeCharts() {
  if (charts.homeTotal) charts.homeTotal.destroy();
  if (charts.homeHourly) charts.homeHourly.destroy();

  // 채점인원 누적통계
  const ctxTotal = document.getElementById("homeTotalChart").getContext("2d");
  charts.homeTotal = new Chart(ctxTotal, {
    type: "line",
    data: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월"],
      datasets: [{
        label: "누적 응시자수",
        data: [1200, 2400, 4800, 7900, 11500, 16800, 21000, 27500, 34000, 41200, 48900],
        borderColor: "#8e7dbe",
        backgroundColor: "rgba(200, 182, 255, 0.28)",
        tension: 0.35,
        fill: true,
        pointBackgroundColor: "#6c5ce7",
        pointBorderColor: "#ffffff",
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: false } }
    }
  });

  // 시간대별 채점자수
  const ctxHourly = document.getElementById("homeHourlyChart").getContext("2d");
  charts.homeHourly = new Chart(ctxHourly, {
    type: "bar",
    data: {
      labels: ["09시", "12시", "15시", "18시", "21시", "24시"],
      datasets: [{
        label: "시간대별",
        data: [350, 680, 890, 1420, 2100, 1100],
        backgroundColor: [
          "#90dbf4", "#80ed99", "#57cc99", "#ffd166", "#f4a261", "#f72585"
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

function renderDetailRankCharts() {
  const students = APP_DATA.mockResults.studentRankings;
  const teachers = APP_DATA.mockResults.teacherRankings;

  if (charts.studentRank) charts.studentRank.destroy();
  if (charts.teacherRank) charts.teacherRank.destroy();

  const ctxStudent = document.getElementById("studentRankChart").getContext("2d");
  charts.studentRank = new Chart(ctxStudent, {
    type: "bar",
    data: {
      labels: students.map(s => s.name),
      datasets: [{
        label: "점수",
        data: students.map(s => s.score),
        backgroundColor: [
          "#ffd166", "#c8b6ff", "#ffafcc", "#bde0fe",
          "#d8f3dc", "#e2e8f0", "#f1f5f9", "#f8fafc"
        ],
        borderRadius: 8
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });

  const ctxTeacher = document.getElementById("teacherRankChart").getContext("2d");
  charts.teacherRank = new Chart(ctxTeacher, {
    type: "bar",
    data: {
      labels: teachers.map(t => t.name),
      datasets: [{
        label: "채점 횟수",
        data: teachers.map(t => t.score),
        backgroundColor: [
          "#ffd166", "#c8b6ff", "#ffafcc", "#bde0fe", "#d8f3dc"
        ],
        borderRadius: 8
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

function renderModalPieCharts() {
  const stats = APP_DATA.mockResults.statsCharts;

  if (charts.pieTotal) charts.pieTotal.destroy();
  if (charts.piePart1) charts.piePart1.destroy();
  if (charts.piePart2) charts.piePart2.destroy();

  const ctxTotal = document.getElementById("pieTotalChart").getContext("2d");
  charts.pieTotal = new Chart(ctxTotal, {
    type: "pie",
    data: {
      labels: stats.totalScoreDist.labels,
      datasets: [{
        data: stats.totalScoreDist.values,
        backgroundColor: stats.totalScoreDist.colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" }
      }
    }
  });

  const ctxPart1 = document.getElementById("piePart1Chart").getContext("2d");
  charts.piePart1 = new Chart(ctxPart1, {
    type: "pie",
    data: {
      labels: stats.part1Dist.labels,
      datasets: [{
        data: stats.part1Dist.values,
        backgroundColor: stats.part1Dist.colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" }
      }
    }
  });

  const ctxPart2 = document.getElementById("piePart2Chart").getContext("2d");
  charts.piePart2 = new Chart(ctxPart2, {
    type: "pie",
    data: {
      labels: stats.part2Dist.labels,
      datasets: [{
        data: stats.part2Dist.values,
        backgroundColor: stats.part2Dist.colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" }
      }
    }
  });
}
