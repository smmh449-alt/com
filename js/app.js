// app.js - 핵심 로직 및 인터랙션 제어 (회원가입/로그인 & 사용자별 누적 채점 기록 포함)

let currentBook = null;
let charts = {};

/* ==========================================================================
   0. 회원가입, 로그인 및 사용자별 누적 채점 기록 (localStorage)
   ========================================================================== */

const STORAGE_KEYS = {
  USERS: "com_users",
  CURRENT_USER: "com_currentUser",
  RECORDS_PREFIX: "com_records_"
};

// 1) 사용자 계정 관리 함수
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
  } catch (e) {
    return [];
  }
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

function removeCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// 2) 로그인 상태에 따른 화면 토글 (SPA 구조)
function checkAuthState() {
  const user = getCurrentUser();
  const authSection = document.getElementById("auth-section");
  const appSection = document.getElementById("app-main-section");
  const headerUserArea = document.getElementById("header-user-area");
  const headerNav = document.getElementById("header-nav");
  const headerUserId = document.getElementById("header-user-id");

  if (user && user.username) {
    // 로그인 상태 -> 메인 앱 표시
    if (authSection) authSection.style.display = "none";
    if (appSection) appSection.style.display = "block";
    if (headerUserArea) headerUserArea.style.display = "flex";
    if (headerNav) headerNav.style.display = "flex";
    if (headerUserId) headerUserId.innerText = user.username;

    // 학생 닉네임 입력 필드에 자동 반영
    const inputStudent = document.getElementById("input-student");
    if (inputStudent && !inputStudent.value) {
      inputStudent.value = user.username;
    }

    // 누적 채점 기록 표 렌더링
    renderUserHistoryTable();
  } else {
    // 비로그인 상태 -> 로그인/회원가입 화면 표시
    if (authSection) authSection.style.display = "flex";
    if (appSection) appSection.style.display = "none";
    if (headerUserArea) headerUserArea.style.display = "none";
    if (headerNav) headerNav.style.display = "none";

    // 폼 초기화 및 메시지 리셋
    resetAuthForms();
  }
}

function resetAuthForms() {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const msgBox = document.getElementById("auth-msg-box");

  if (loginForm) loginForm.reset();
  if (signupForm) signupForm.reset();
  if (msgBox) {
    msgBox.style.display = "none";
    msgBox.innerText = "";
  }
}

function showAuthMessage(text, isError = true) {
  const msgBox = document.getElementById("auth-msg-box");
  if (!msgBox) return;
  msgBox.style.display = "block";
  msgBox.className = isError ? "auth-msg-box error" : "auth-msg-box success";
  msgBox.innerText = text;
}

// 3) 회원가입 및 로그인 이벤트 바인딩
function initAuth() {
  const tabBtnLogin = document.getElementById("tab-btn-login");
  const tabBtnSignup = document.getElementById("tab-btn-signup");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const linkToSignup = document.getElementById("link-to-signup");
  const linkToLogin = document.getElementById("link-to-login");
  const btnLogout = document.getElementById("btn-logout");

  // 탭 전환: 로그인 선택
  function activateLoginTab() {
    tabBtnLogin.classList.add("active");
    tabBtnSignup.classList.remove("active");
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    const msgBox = document.getElementById("auth-msg-box");
    if (msgBox) msgBox.style.display = "none";
  }

  // 탭 전환: 회원가입 선택
  function activateSignupTab() {
    tabBtnSignup.classList.add("active");
    tabBtnLogin.classList.remove("active");
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    const msgBox = document.getElementById("auth-msg-box");
    if (msgBox) msgBox.style.display = "none";
  }

  if (tabBtnLogin) tabBtnLogin.addEventListener("click", activateLoginTab);
  if (tabBtnSignup) tabBtnSignup.addEventListener("click", activateSignupTab);
  if (linkToSignup) linkToSignup.addEventListener("click", activateSignupTab);
  if (linkToLogin) linkToLogin.addEventListener("click", activateLoginTab);

  // 로그인 제출
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById("login-username");
      const passwordInput = document.getElementById("login-password");
      const username = usernameInput ? usernameInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";

      if (!username || !password) {
        showAuthMessage("아이디와 비밀번호를 모두 입력해주세요.", true);
        return;
      }

      const users = getUsers();
      const matched = users.find(u => u.username === username && u.password === password);

      if (matched) {
        // 로그인 성공
        setCurrentUser({ username: matched.username, createdAt: matched.createdAt });
        showAuthMessage(`환영합니다, ${matched.username}님! 채점소로 이동합니다.`, false);
        setTimeout(() => {
          checkAuthState();
          showHomeView();
        }, 400);
      } else {
        // 아이디 존재 여부 확인하여 친절한 힌트 제공
        const userExists = users.some(u => u.username === username);
        if (userExists) {
          showAuthMessage("비밀번호가 올바르지 않습니다. 다시 확인해주세요.", true);
        } else {
          showAuthMessage("등록되지 않은 아이디입니다. 먼저 회원가입을 진행해주세요.", true);
        }
      }
    });
  }

  // 회원가입 제출
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("signup-username").value.trim();
      const password = document.getElementById("signup-password").value;
      const passwordConfirm = document.getElementById("signup-password-confirm").value;

      if (username.length < 3) {
        showAuthMessage("아이디는 최소 3자 이상 입력해주세요.", true);
        return;
      }
      if (password.length < 4) {
        showAuthMessage("비밀번호는 최소 4자 이상 입력해주세요.", true);
        return;
      }
      if (password !== passwordConfirm) {
        showAuthMessage("비밀번호 확인이 일치하지 않습니다.", true);
        return;
      }

      const users = getUsers();
      if (users.some(u => u.username === username)) {
        showAuthMessage("이미 존재하는 아이디입니다. 다른 아이디를 입력해주세요.", true);
        return;
      }

      // 회원가입 처리
      const newUser = {
        username: username,
        password: password,
        createdAt: new Date().toISOString()
      };
      saveUser(newUser);

      // 자동 로그인 처리 및 안내
      setCurrentUser({ username: newUser.username, createdAt: newUser.createdAt });
      showAuthMessage("🎉 회원가입이 완료되었습니다! 자동으로 로그인됩니다.", false);
      
      setTimeout(() => {
        checkAuthState();
        showHomeView();
      }, 700);
    });
  }

  // 로그아웃 버튼
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      if (confirm("로그아웃 하시겠습니까?")) {
        removeCurrentUser();
        checkAuthState();
      }
    });
  }

  // 누적 기록 전체 초기화 버튼
  const btnClearHistory = document.getElementById("btn-clear-history");
  if (btnClearHistory) {
    btnClearHistory.addEventListener("click", clearAllUserScoreRecords);
  }
}

// 4) 사용자별 채점 점수 누적 기록 함수들
function getUserScoreRecords(username) {
  if (!username) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS_PREFIX + username);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveUserScoreRecord(record) {
  const user = getCurrentUser();
  if (!user || !user.username) return;

  const username = user.username;
  const records = getUserScoreRecords(username);
  records.unshift(record); // 최신순으로 앞쪽에 추가
  localStorage.setItem(STORAGE_KEYS.RECORDS_PREFIX + username, JSON.stringify(records));

  // 테이블 실시간 갱신
  renderUserHistoryTable();
}

function deleteUserScoreRecord(recordId) {
  const user = getCurrentUser();
  if (!user || !user.username) return;

  if (!confirm("해당 채점 기록을 삭제하시겠습니까?")) return;

  const username = user.username;
  let records = getUserScoreRecords(username);
  records = records.filter(r => r.id !== recordId);
  localStorage.setItem(STORAGE_KEYS.RECORDS_PREFIX + username, JSON.stringify(records));

  renderUserHistoryTable();
}

function clearAllUserScoreRecords() {
  const user = getCurrentUser();
  if (!user || !user.username) return;

  const records = getUserScoreRecords(user.username);
  if (records.length === 0) {
    alert("삭제할 누적 채점 기록이 없습니다.");
    return;
  }

  if (confirm(`정말로 ${user.username}님의 모든 채점 기록(${records.length}건)을 초기화하시겠습니까?`)) {
    localStorage.removeItem(STORAGE_KEYS.RECORDS_PREFIX + user.username);
    renderUserHistoryTable();
    alert("모든 누적 채점 기록이 초기화되었습니다.");
  }
}

function renderUserHistoryTable() {
  const tbody = document.getElementById("history-table-body");
  const countBadge = document.getElementById("history-count-badge");
  const userTag = document.getElementById("history-user-tag");
  if (!tbody) return;

  const user = getCurrentUser();
  if (!user || !user.username) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="history-empty-row">
          로그인 후 이용할 수 있습니다.
        </td>
      </tr>
    `;
    return;
  }

  const username = user.username;
  if (userTag) userTag.innerText = `${username} 님의 기록`;

  const records = getUserScoreRecords(username);
  if (countBadge) countBadge.innerText = `총 ${records.length}회`;

  if (records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="history-empty-row">
          아직 저장된 채점 기록이 없습니다. 상단에서 문제를 풀고 <strong>[채점시작]</strong>을 눌러보세요!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = records.map(r => {
    const resultBadge = r.isPass
      ? `<span class="badge-tag-partial has">🎉 합격 (${r.totalScore}점)</span>`
      : `<span class="badge-tag-partial none">불합격 (${r.totalScore}점)</span>`;

    return `
      <tr>
        <td style="color:#666; font-size:12px;">${r.dateStr}</td>
        <td>
          <div style="font-weight:600; color:#2b2d42;">${r.bookTitle}</div>
          <div style="font-size:11px; color:#6c5ce7;">${r.roundName}</div>
        </td>
        <td style="text-align:center; font-weight:bold; color:#1a4f8b;">${r.part1}점</td>
        <td style="text-align:center; font-weight:bold; color:#1a4f8b;">${r.part2}점</td>
        <td style="text-align:center; font-weight:bold; color:#1a4f8b;">${r.part3}점</td>
        <td style="text-align:center; font-weight:bold; color:#1a4f8b;">${r.part4}점</td>
        <td style="text-align:center; font-size:15px; font-family:'Jua',sans-serif; color:${r.isPass ? '#0ca678' : '#e03131'};">
          ${r.totalScore}점
        </td>
        <td style="text-align:center;">${resultBadge}</td>
        <td style="text-align:center;">
          <button class="btn-del-record" onclick="deleteUserScoreRecord('${r.id}')" title="기록 삭제">🗑️</button>
        </td>
      </tr>
    `;
  }).join("");
}

/* ==========================================================================
   기본 애플리케이션 초기화
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  initAuth();
  checkAuthState();
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

  // 로그인 사용자 아이디 자동 기입
  const user = getCurrentUser();
  const inputStudent = document.getElementById("input-student");
  if (user && inputStudent) {
    inputStudent.value = user.username;
  }

  // 점수 및 결과 초기화
  resetGrades();

  // 사용자 누적 채점 기록 렌더링
  renderUserHistoryTable();

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

    // [신규 기능] 현재 로그인한 사용자 고유 데이터에 이번 채점 결과 저장 (localStorage)
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const bookTitle = currentBook ? currentBook.title : "컴퓨터활용능력 2급 실기";
    const roundSelect = document.getElementById("select-round");
    const roundName = roundSelect ? roundSelect.value : "대표기출따라하기";

    const newRecord = {
      id: "rec_" + Date.now(),
      dateStr: dateStr,
      bookTitle: bookTitle,
      roundName: roundName,
      part1: res.scores.part1.score,
      part2: res.scores.part2.score,
      part3: res.scores.part3.score,
      part4: res.scores.part4.score,
      totalScore: res.scores.total,
      isPass: isPass
    };
    saveUserScoreRecord(newRecord);

    const resultMessage = isPass
      ? `🎉 채점이 완료되었습니다!\n\n총점: ${res.scores.total}점 [합격]\n(컴퓨터활용능력 2급 실기 합격 기준: 70점 이상 통과!)\n\n※ 하단 '나의 누적 채점 기록'에 이번 결과가 저장되었습니다.`
      : `채점이 완료되었습니다.\n\n총점: ${res.scores.total}점 [불합격]\n(컴퓨터활용능력 2급 실기 합격 기준: 70점 이상)\n\n※ 하단 '나의 누적 채점 기록'에 이번 결과가 저장되었습니다.`;

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
