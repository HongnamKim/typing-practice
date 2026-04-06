/* eslint-disable no-undef */
// ===== 헬퍼 함수 =====
function isDark() {
    return document.getElementById('body').classList.contains('dark');
}

// 폰트 크기
let fontSize = 1.5;

function sliderToFontSize(v) {
    return 0.8 + (v / 100) * 2.7;
}

function fontSizeToSlider(f) {
    return ((f - 0.8) / 2.7) * 100;
}

function updateFontSize(size) {
    fontSize = size;
    ['characterContainer', 'inputDisplay', 'quoteInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.fontSize = size + 'rem';
            if (id === 'quoteInput') {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            }
        }
    });
    localStorage.setItem('Typing-Practice-fontSize', size);
}

const slider = document.getElementById('fontSizeSlider');
const savedFontSize = localStorage.getItem('Typing-Practice-fontSize');
if (savedFontSize) {
    fontSize = parseFloat(savedFontSize);
    updateFontSize(fontSize);
    slider.value = fontSizeToSlider(fontSize);
} else {
    updateFontSize(1.5);
}
slider.addEventListener('input', e => updateFontSize(sliderToFontSize(parseFloat(e.target.value))));

// Font Size 라벨(Tt) 클릭 시 리셋
document.querySelector('.info-tt-label').addEventListener('click', () => {
    updateFontSize(1.5);
    slider.value = fontSizeToSlider(1.5);
});

// 다크모드
function toggleTheme() {
    document.getElementById('body').classList.toggle('dark');
    document.documentElement.classList.remove('dark-pending');
    document.getElementById('iconSun').classList.toggle('display-none');
    document.getElementById('iconMoon').classList.toggle('display-none');
    document.querySelectorAll('.notice-icon, .nav-logo, .header-btn, .profile-btn, .dropdown-menu, .dropdown-item, .dropdown-divider, .dark-mode-icon, .author-text, .character, .input-char-correct, .input, .contact, .upload-popup, .upload-popup-close-btn, .upload-type-hint, .upload-type-info, .upload-type-tooltip, .upload-entry, .upload-input, .upload-entry-delete-btn, .upload-entry-type-btn, .upload-entry-message.success, .upload-add-btn, .upload-cancel-btn, .upload-submit-btn, .confirm-popup, .confirm-popup-message, .confirm-popup-cancel-btn, .confirm-popup-ok-btn').forEach(el => el.classList.toggle('dark'));
    localStorage.setItem('Typing-Practice-darkMode', isDark());
}

document.getElementById('iconSun').addEventListener('click', toggleTheme);
document.getElementById('iconMoon').addEventListener('click', toggleTheme);
if (localStorage.getItem('Typing-Practice-darkMode') === 'true') toggleTheme();

// textarea 높이 자동 조절
const textarea = document.getElementById('quoteInput');
textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

// 평균점수 토글 (제거됨 - info 영역 통합)

// 모드 토글 (Default / Compact)
let isCompactMode = localStorage.getItem('Typing-Practice-compactMode') === 'true';
const modeToggle = document.getElementById('modeToggle');
const modeLabel = document.getElementById('modeLabel');
const quoteContainer = document.getElementById('quoteContainer');
const quoteInput = document.getElementById('quoteInput');

function updateMode() {
    if (isCompactMode) {
        modeToggle.classList.add('active');
        quoteContainer.classList.remove('default-mode');
        quoteInput.placeholder = '';
    } else {
        modeToggle.classList.remove('active');
        quoteContainer.classList.add('default-mode');
        quoteInput.placeholder = '위 문장을 입력하세요.';
    }
}

updateMode();

function toggleMode() {
    isCompactMode = !isCompactMode;
    localStorage.setItem('Typing-Practice-compactMode', isCompactMode);
    updateMode();
}

modeToggle.addEventListener('click', toggleMode);
modeLabel.addEventListener('click', toggleMode);

// Info 컨트롤 접기/펼치기
const infoControls = document.getElementById('infoControls');
const infoControlsToggle = document.getElementById('infoControlsToggle');
const infoControlsToggleIcon = document.getElementById('infoControlsToggleIcon');
let userControlsPref = localStorage.getItem('Typing-Practice-controlsCollapsed'); // 'true' | 'false' | null
let isControlsCollapsed = false;
let isNarrowMode = false;

function applyControlsState(collapsed) {
    isControlsCollapsed = collapsed;
    if (collapsed) {
        infoControls.classList.add('collapsed');
        infoControlsToggleIcon.classList.remove('fa-chevron-right');
        infoControlsToggleIcon.classList.add('fa-chevron-left');
    } else {
        infoControls.classList.remove('collapsed');
        infoControlsToggleIcon.classList.remove('fa-chevron-left');
        infoControlsToggleIcon.classList.add('fa-chevron-right');
    }
    if (isNarrowMode) {
        infoControls.classList.add('narrow-mode');
    } else {
        infoControls.classList.remove('narrow-mode');
    }
}

function resolveControlsState() {
    isNarrowMode = window.innerWidth <= 1080;
    if (isNarrowMode) {
        applyControlsState(true);
    } else if (userControlsPref !== null) {
        applyControlsState(userControlsPref === 'true');
    } else {
        applyControlsState(false);
    }
}

resolveControlsState();

infoControlsToggle.addEventListener('click', () => {
    const next = !isControlsCollapsed;
    if (!isNarrowMode) {
        userControlsPref = String(next);
        localStorage.setItem('Typing-Practice-controlsCollapsed', userControlsPref);
    }
    applyControlsState(next);
});

// overlay 상태에서 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
    if (isNarrowMode && !isControlsCollapsed && !infoControls.contains(e.target)) {
        applyControlsState(true);
    }
});

window.addEventListener('resize', resolveControlsState);

// 업데이트 공지 데이터
const updateHistory = [
    {
        version: "1.2.0",
        date: "2024년 11월 27일",
        features: [
            "평균점수 영역 접기/펼치기 기능 추가",
            "Default/Compact 모드 전환 기능 추가"
        ],
        improvements: [
            "문장 셔플 알고리즘 개선 (더 균등한 랜덤 분배)",
            "예문 101개 추가 (총 1138개)"
        ]
    },
    {
        version: "1.1.0",
        date: "2024년 11월 20일",
        features: [
            "폰트 크기 조절 슬라이더 추가",
            "Vercel Analytics 적용"
        ],
        improvements: [
            "한글 IME 입력 안정화",
            "textarea 높이 자동 조절"
        ]
    },
    {
        version: "1.0.0",
        date: "2024년 11월 15일",
        features: [
            "타자 연습 서비스 오픈",
            "실시간 타자 속도(CPM) 측정",
            "정확도 분석",
            "다크 모드 지원"
        ],
        improvements: []
    }
];

// 업데이트 페이지
function renderUpdateCard(update) {
    let html = `
        <div class="update-card">
            <div class="update-card-header">
                <span class="update-card-version">v${update.version}</span>
                <span class="update-card-date">${update.date}</span>
            </div>`;

    if (update.features && update.features.length > 0) {
        html += `
            <div class="update-card-section">
                <div class="update-card-section-title">새로운 기능</div>
                <ul class="update-card-list">
                    ${update.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>`;
    }

    if (update.improvements && update.improvements.length > 0) {
        html += `
            <div class="update-card-section">
                <div class="update-card-section-title">개선사항</div>
                <ul class="update-card-list">
                    ${update.improvements.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>`;
    }

    html += '</div>';
    return html;
}

function openUpdatesPage() {
    document.getElementById('updatesPage').classList.remove('display-none');
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
    document.getElementById('navUpdates').classList.add('active');

    const content = document.getElementById('updatesContent');
    content.innerHTML = updateHistory.map(u => renderUpdateCard(u)).join('');
}

function closeUpdatesPage() {
    document.getElementById('updatesPage').classList.add('display-none');
    document.body.style.overflow = '';
    document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
    document.getElementById('navSentence').classList.add('active');
}

document.getElementById('navUpdates').addEventListener('click', openUpdatesPage);
document.getElementById('updatesBackBtn').addEventListener('click', closeUpdatesPage);

// 첫 진입 시 업데이트 알림 팝업
const CURRENT_VERSION = updateHistory[0].version;

function showUpdatePopupIfNew() {
    const lastSeenVersion = localStorage.getItem('Typing-Practice-lastSeenVersion');
    if (lastSeenVersion !== CURRENT_VERSION) {
        const latest = updateHistory[0];
        let html = `
            <div class="update-popup-version">v${latest.version}</div>
            <div class="update-popup-date">${latest.date}</div>`;

        if (latest.features && latest.features.length > 0) {
            html += `<div class="update-popup-section">
                <div class="update-popup-section-title">새로운 기능</div>
                <ul class="update-popup-list">${latest.features.map(f => `<li>${f}</li>`).join('')}</ul>
            </div>`;
        }
        if (latest.improvements && latest.improvements.length > 0) {
            html += `<div class="update-popup-section">
                <div class="update-popup-section-title">개선사항</div>
                <ul class="update-popup-list">${latest.improvements.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>`;
        }

        document.getElementById('updatePopupContent').innerHTML = html;
        document.getElementById('updatePopupOverlay').classList.remove('display-none');
    }
}

document.getElementById('updatePopupClose').addEventListener('click', () => {
    document.getElementById('updatePopupOverlay').classList.add('display-none');
    localStorage.setItem('Typing-Practice-lastSeenVersion', CURRENT_VERSION);
});

showUpdatePopupIfNew();

// ============ 로그인 관련 ============

// 로딩 표시
function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('display-none');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('display-none');
}

// 닉네임 팝업
function showNicknamePopup(defaultNickname) {
    const overlay = document.getElementById('nicknamePopupOverlay');
    const popup = document.getElementById('nicknamePopup');
    const input = document.getElementById('nicknameInput');

    overlay.classList.remove('display-none');
    input.value = defaultNickname || '';

    // 다크모드 적용
    if (isDark()) {
        popup.classList.add('dark');
        input.classList.add('dark');
        document.querySelector('.nickname-popup-description').classList.add('dark');
        document.querySelector('.nickname-label').classList.add('dark');
        document.querySelector('.nickname-helper').classList.add('dark');
    }
}

function hideNicknamePopup() {
    document.getElementById('nicknamePopupOverlay').classList.add('display-none');
}

// 로그인 버튼 클릭 (시뮬레이션)
document.getElementById('loginBtn').addEventListener('click', () => {
    // 1. 로딩 표시
    showLoading();

    // 2. 구글 로그인 시뮬레이션 (실제로는 OAuth 처리)
    setTimeout(() => {
        hideLoading();

        // 3. 신규 가입자인 경우 닉네임 설정 팝업
        const isNewMember = true; // 임시로 true
        const defaultNickname = "구글사용자123"; // 구글에서 받은 이름

        if (isNewMember) {
            showNicknamePopup(defaultNickname);
        } else {
            // 기존 회원은 바로 로그인 처리
            handleLoginSuccess({nickname: "홍남김"});
        }
    }, 300);
});

// 닉네임 제출
document.getElementById('nicknameSubmitBtn').addEventListener('click', () => {
    const input = document.getElementById('nicknameInput');
    const error = document.getElementById('nicknameError');
    const nickname = input.value.trim();

    // 유효성 검증
    if (nickname.length < 2 || nickname.length > 10) {
        error.classList.add('show');
        return;
    }

    error.classList.remove('show');
    hideNicknamePopup();

    // 로그인 처리
    handleLoginSuccess({nickname});
});

// 닉네임 입력 시 에러 제거
document.getElementById('nicknameInput').addEventListener('input', () => {
    document.getElementById('nicknameError').classList.remove('show');
});

// 로그인 성공 처리
function handleLoginSuccess(user) {
    // UI 업데이트
    document.getElementById('loginBtn').classList.add('display-none');
    document.getElementById('profileContainer').classList.remove('display-none');
    document.getElementById('username').textContent = user.nickname;

    // 다크모드 적용
    if (isDark()) {
        document.getElementById('profileBtn').classList.add('dark');
        document.getElementById('dropdownMenu').classList.add('dark');
        document.querySelectorAll('.dropdown-item').forEach(item => item.classList.add('dark'));
        document.querySelector('.dropdown-divider').classList.add('dark');
    }
}

// 프로필 드롭다운 토글 (이벤트 위임 방식)
document.addEventListener('click', (e) => {
    const profileBtn = document.getElementById('profileBtn');
    const dropdown = document.getElementById('dropdownMenu');

    // 프로필 버튼 클릭
    if (profileBtn && (e.target === profileBtn || profileBtn.contains(e.target))) {
        e.stopPropagation();
        dropdown.classList.toggle('display-none');
    }
    // 외부 클릭 시 드롭다운 닫기
    else {
        dropdown.classList.add('display-none');
    }
});

// 로그아웃
document.getElementById('logoutBtn').addEventListener('click', () => {
    document.getElementById('profileContainer').classList.add('display-none');
    document.getElementById('loginBtn').classList.remove('display-none');
    document.getElementById('dropdownMenu').classList.add('display-none');
});

// 드롭다운 메뉴 아이템들
document.getElementById('uploadBtn').addEventListener('click', () => {
    openUploadPopup();
});

// ============ 문장 업로드 ============

const MAX_UPLOAD_ENTRIES = 5;
let currentEntryCount = 0;

const uploadPopupOverlay = document.getElementById('uploadPopupOverlay');
const uploadPopup = document.getElementById('uploadPopup');
const uploadEntries = document.getElementById('uploadEntries');
const uploadAddBtn = document.getElementById('uploadAddBtn');

// 단일 입력 필드 생성
function createUploadEntry(index) {
    const entry = document.createElement('div');
    entry.className = 'upload-entry';
    entry.id = `uploadEntry${index}`;
    entry.dataset.index = index;
    entry.dataset.type = 'public'; // 기본값: 공개

    if (isDark()) entry.classList.add('dark');

    entry.innerHTML = `
        <div class="upload-entry-header">
            <span class="upload-entry-number">${index + 1}</span>
            <button class="upload-entry-delete-btn${isDark() ? ' dark' : ''}" title="삭제">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="upload-entry-type-toggle">
            <button class="upload-entry-type-btn${isDark() ? ' dark' : ''} active" data-type="public">
                <i class="fa-solid fa-globe"></i>
                <span>공개</span>
            </button>
            <button class="upload-entry-type-btn${isDark() ? ' dark' : ''}" data-type="private">
                <i class="fa-solid fa-lock"></i>
                <span>비공개</span>
            </button>
        </div>
        <div class="upload-entry-inputs">
            <div class="upload-sentence-wrapper">
                <input 
                    type="text" 
                    class="upload-input${isDark() ? ' dark' : ''}" 
                    id="uploadSentence${index}"
                    placeholder="문장을 입력하세요 (5-100자)"
                    maxlength="100"
                />
            </div>
            <div class="upload-author-wrapper">
                <input 
                    type="text" 
                    class="upload-input${isDark() ? ' dark' : ''}" 
                    id="uploadAuthor${index}"
                    placeholder="출처 (선택)"
                    maxlength="20"
                />
            </div>
        </div>
        <div class="upload-entry-message" id="uploadMessage${index}"></div>
    `;

    // 삭제 버튼 이벤트
    entry.querySelector('.upload-entry-delete-btn').addEventListener('click', () => {
        removeUploadEntry(entry);
    });

    // 공개/비공개 토글 이벤트
    entry.querySelectorAll('.upload-entry-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            entry.querySelectorAll('.upload-entry-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            entry.dataset.type = btn.dataset.type;
        });
    });

    return entry;
}

