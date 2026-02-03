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

// Font Size 라벨 클릭 시 리셋
document.getElementById('fontSizeLabel').addEventListener('click', () => {
    updateFontSize(1.5);
    slider.value = fontSizeToSlider(1.5);
});

// 다크모드
function toggleTheme() {
    document.getElementById('body').classList.toggle('dark');
    document.getElementById('iconSun').classList.toggle('display-none');
    document.getElementById('iconMoon').classList.toggle('display-none');
    document.querySelectorAll('.font-size-label, .font-size-slider, .mode-toggle-label, .mode-toggle, .notice-icon, .title-title, .header-btn, .profile-btn, .dropdown-menu, .dropdown-item, .dropdown-divider, .dark-mode-icon, .result-period-btn, .result-period-value, .CPM-text, .CPM-value, .info-averages, .average-label, .average-value, .averages-toggle-btn, .author-text, .character, .input-char-correct, .input, .contact, .upload-popup, .upload-popup-close-btn, .upload-type-hint, .upload-type-info, .upload-type-tooltip, .upload-entry, .upload-input, .upload-entry-delete-btn, .upload-entry-type-btn, .upload-entry-message.success, .upload-add-btn, .upload-cancel-btn, .upload-submit-btn, .confirm-popup, .confirm-popup-message, .confirm-popup-cancel-btn, .confirm-popup-ok-btn').forEach(el => el.classList.toggle('dark'));
    localStorage.setItem('Typing-Practice-darkMode', document.getElementById('body').classList.contains('dark'));
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

// 평균점수 토글
let averagesVisible = localStorage.getItem('Typing-Practice-averagesVisible') !== 'false';
const infoAverages = document.getElementById('infoAverages');
const averagesToggleIcon = document.getElementById('averagesToggleIcon');

function updateAveragesVisibility() {
    if (averagesVisible) {
        infoAverages.classList.remove('collapsed');
        averagesToggleIcon.classList.remove('fa-chevron-down');
        averagesToggleIcon.classList.add('fa-chevron-up');
    } else {
        infoAverages.classList.add('collapsed');
        averagesToggleIcon.classList.remove('fa-chevron-up');
        averagesToggleIcon.classList.add('fa-chevron-down');
    }
}

updateAveragesVisibility();

document.getElementById('averagesToggleBtn').addEventListener('click', () => {
    averagesVisible = !averagesVisible;
    localStorage.setItem('Typing-Practice-averagesVisible', averagesVisible);
    updateAveragesVisibility();
});

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

const CURRENT_VERSION = updateHistory[0].version;
const updatePopupOverlay = document.getElementById('updatePopupOverlay');
const updatePopup = document.getElementById('updatePopup');
const updatePopupTitle = document.getElementById('updatePopupTitle');
const updateContent = document.getElementById('updateContent');
const updateHistoryBtn = document.getElementById('updateHistoryBtn');

// 최신 업데이트 렌더링 (첫 진입 시)
function renderLatestUpdate(update) {
    const isDark = document.getElementById('body').classList.contains('dark');
    const darkClass = isDark ? ' dark' : '';

    let html = `
            <div class="update-popup-version${darkClass}">v${update.version}</div>
            <div class="update-popup-date${darkClass}">${update.date}</div>
        `;

    if (update.features && update.features.length > 0) {
        html += `
                <div class="update-popup-section">
                    <div class="update-popup-section-title${darkClass}">✨ 새로운 기능</div>
                    <ul class="update-popup-list">
                        ${update.features.map(f => `<li class="${darkClass}">${f}</li>`).join('')}
                    </ul>
                </div>
            `;
    }

    if (update.improvements && update.improvements.length > 0) {
        html += `
                <div class="update-popup-section">
                    <div class="update-popup-section-title${darkClass}">🔧 개선사항</div>
                    <ul class="update-popup-list">
                        ${update.improvements.map(i => `<li class="${darkClass}">${i}</li>`).join('')}
                    </ul>
                </div>
            `;
    }

    return html;
}

// 히스토리 아이템 렌더링 (아이콘 클릭 시)
function renderHistoryItem(update) {
    const isDark = document.getElementById('body').classList.contains('dark');
    const darkClass = isDark ? ' dark' : '';

    let html = `
            <div class="update-history-item${darkClass}">
                <div class="update-history-header">
                    <span class="update-history-version">v${update.version}</span>
                    <span class="update-history-date${darkClass}">${update.date}</span>
                </div>
        `;

    if (update.features && update.features.length > 0) {
        html += `
                <div class="update-popup-section">
                    <div class="update-popup-section-title${darkClass}">✨ 새로운 기능</div>
                    <ul class="update-popup-list">
                        ${update.features.map(f => `<li class="${darkClass}">${f}</li>`).join('')}
                    </ul>
                </div>
            `;
    }

    if (update.improvements && update.improvements.length > 0) {
        html += `
                <div class="update-popup-section">
                    <div class="update-popup-section-title${darkClass}">🔧 개선사항</div>
                    <ul class="update-popup-list">
                        ${update.improvements.map(i => `<li class="${darkClass}">${i}</li>`).join('')}
                    </ul>
                </div>
            `;
    }

    html += '</div>';
    return html;
}

// 모든 업데이트 렌더링
function renderAllUpdates() {
    let html = '';
    for (const update of updateHistory) {
        html += renderHistoryItem(update);
    }
    return html;
}

// 첫 진입 시 최신 업데이트만 표시
function openLatestUpdatePopup() {
    updatePopupOverlay.classList.remove('display-none');
    updatePopup.classList.remove('history-mode');
    updatePopupTitle.textContent = '🎉 업데이트 안내';
    updateContent.innerHTML = renderLatestUpdate(updateHistory[0]);
    updateHistoryBtn.classList.remove('display-none');

    if (document.getElementById('body').classList.contains('dark')) {
        updatePopup.classList.add('dark');
        updateHistoryBtn.classList.add('dark');
    }
}

// 아이콘 클릭 시 모든 업데이트 표시
function openAllUpdatesPopup() {
    updatePopupOverlay.classList.remove('display-none');
    updatePopup.classList.add('history-mode');
    updatePopupTitle.textContent = '📋 업데이트 내역';
    updateContent.innerHTML = renderAllUpdates();
    updateHistoryBtn.classList.add('display-none');

    if (document.getElementById('body').classList.contains('dark')) {
        updatePopup.classList.add('dark');
    }
}

function closeUpdatePopup() {
    updatePopupOverlay.classList.add('display-none');
    localStorage.setItem('Typing-Practice-lastSeenVersion', CURRENT_VERSION);
}

// 새 버전이면 자동으로 팝업 표시
function showUpdatePopupIfNew() {
    const lastSeenVersion = localStorage.getItem('Typing-Practice-lastSeenVersion');
    if (lastSeenVersion !== CURRENT_VERSION) {
        openLatestUpdatePopup();
    }
}

document.getElementById('updatePopupClose').addEventListener('click', closeUpdatePopup);
document.getElementById('iconNotice').addEventListener('click', openAllUpdatesPopup);
updateHistoryBtn.addEventListener('click', openAllUpdatesPopup);

// 페이지 로드 시 팝업 표시
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
    if (document.getElementById('body').classList.contains('dark')) {
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
    }, 1500);
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
    const isDark = document.getElementById('body').classList.contains('dark');
    if (isDark) {
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

    const isDark = document.getElementById('body').classList.contains('dark');
    if (isDark) entry.classList.add('dark');

    entry.innerHTML = `
        <div class="upload-entry-header">
            <span class="upload-entry-number">${index + 1}</span>
            <button class="upload-entry-delete-btn${isDark ? ' dark' : ''}" title="삭제">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="upload-entry-type-toggle">
            <button class="upload-entry-type-btn${isDark ? ' dark' : ''} active" data-type="public">
                <i class="fa-solid fa-globe"></i>
                <span>공개</span>
            </button>
            <button class="upload-entry-type-btn${isDark ? ' dark' : ''}" data-type="private">
                <i class="fa-solid fa-lock"></i>
                <span>비공개</span>
            </button>
        </div>
        <div class="upload-entry-inputs">
            <div class="upload-sentence-wrapper">
                <input 
                    type="text" 
                    class="upload-input${isDark ? ' dark' : ''}" 
                    id="uploadSentence${index}"
                    placeholder="문장을 입력하세요 (5-100자)"
                    maxlength="100"
                />
            </div>
            <div class="upload-author-wrapper">
                <input 
                    type="text" 
                    class="upload-input${isDark ? ' dark' : ''}" 
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

// 입력 영역 추가
function addUploadEntry() {
    if (currentEntryCount >= MAX_UPLOAD_ENTRIES) return;

    const entry = createUploadEntry(currentEntryCount);
    uploadEntries.appendChild(entry);
    currentEntryCount++;

    updateAddButton();
    updateDeleteButtons();
}

// 입력 영역 삭제
function removeUploadEntry(entry) {
    if (currentEntryCount <= 1) return;

    entry.remove();
    currentEntryCount--;

    // 번호 재정렬
    renumberEntries();
    updateAddButton();
    updateDeleteButtons();
}

// 번호 재정렬
function renumberEntries() {
    const entries = uploadEntries.querySelectorAll('.upload-entry');
    entries.forEach((entry, index) => {
        entry.id = `uploadEntry${index}`;
        entry.dataset.index = index;
        entry.querySelector('.upload-entry-number').textContent = index + 1;

        const sentenceInput = entry.querySelector('input[id^="uploadSentence"]');
        const authorInput = entry.querySelector('input[id^="uploadAuthor"]');
        const messageEl = entry.querySelector('div[id^="uploadMessage"]');

        sentenceInput.id = `uploadSentence${index}`;
        authorInput.id = `uploadAuthor${index}`;
        messageEl.id = `uploadMessage${index}`;
    });
}

// 삭제 버튼 표시/숨김
function updateDeleteButtons() {
    const deleteButtons = uploadEntries.querySelectorAll('.upload-entry-delete-btn');
    deleteButtons.forEach(btn => {
        btn.style.display = currentEntryCount <= 1 ? 'none' : 'flex';
    });
}

// + 버튼 상태 업데이트
function updateAddButton() {
    if (currentEntryCount >= MAX_UPLOAD_ENTRIES) {
        uploadAddBtn.disabled = true;
        uploadAddBtn.querySelector('span').textContent = `최대 ${MAX_UPLOAD_ENTRIES}개`;
    } else {
        uploadAddBtn.disabled = false;
        uploadAddBtn.querySelector('span').textContent = `문장 추가 (${currentEntryCount}/${MAX_UPLOAD_ENTRIES})`;
    }
}

// 팝업 열기
function openUploadPopup() {
    uploadPopupOverlay.classList.remove('display-none');

    const isDark = document.getElementById('body').classList.contains('dark');
    if (isDark) {
        uploadPopup.classList.add('dark');
        document.getElementById('uploadPopupCloseBtn').classList.add('dark');
        document.querySelector('.upload-type-hint').classList.add('dark');
        document.querySelector('.upload-type-info').classList.add('dark');
        document.querySelector('.upload-type-tooltip').classList.add('dark');
        uploadAddBtn.classList.add('dark');
        document.getElementById('uploadCancelBtn').classList.add('dark');
        document.getElementById('uploadSubmitBtn').classList.add('dark');
    }

    // 초기화: 입력 영역 비우고 1개만 생성
    uploadEntries.innerHTML = '';
    currentEntryCount = 0;
    addUploadEntry();
    updateDeleteButtons();
}

// 팝업 닫기
function closeUploadPopup() {
    uploadPopupOverlay.classList.add('display-none');
}

// + 버튼 이벤트
uploadAddBtn.addEventListener('click', addUploadEntry);

// 닫기 버튼
document.getElementById('uploadPopupCloseBtn').addEventListener('click', closeUploadPopup);
document.getElementById('uploadCancelBtn').addEventListener('click', closeUploadPopup);

// 확인 팝업
const uploadConfirmOverlay = document.getElementById('uploadConfirmOverlay');
const uploadConfirmPopup = document.getElementById('uploadConfirmPopup');
const uploadConfirmMessage = document.getElementById('uploadConfirmMessage');
let pendingUploadEntries = [];
let isResultPopup = false;

function showUploadConfirm(entries) {
    pendingUploadEntries = entries;
    isResultPopup = false;

    const publicCount = entries.filter(e => e.type === 'public').length;
    const privateCount = entries.filter(e => e.type === 'private').length;

    let message = '';
    if (publicCount > 0 && privateCount > 0) {
        message = `공개 ${publicCount}개, 비공개 ${privateCount}개의 문장을 업로드합니다.`;
    } else if (publicCount > 0) {
        message = `${publicCount}개의 문장을 공개로 업로드합니다.`;
    } else {
        message = `${privateCount}개의 문장을 비공개로 업로드합니다.`;
    }
    uploadConfirmMessage.textContent = message;

    const isDark = document.getElementById('body').classList.contains('dark');
    if (isDark) {
        uploadConfirmPopup.classList.add('dark');
        uploadConfirmMessage.classList.add('dark');
        document.getElementById('uploadConfirmCancelBtn').classList.add('dark');
        document.getElementById('uploadConfirmOkBtn').classList.add('dark');
    } else {
        uploadConfirmPopup.classList.remove('dark');
        uploadConfirmMessage.classList.remove('dark');
        document.getElementById('uploadConfirmCancelBtn').classList.remove('dark');
        document.getElementById('uploadConfirmOkBtn').classList.remove('dark');
    }

    uploadConfirmOverlay.classList.remove('display-none');
}

function hideUploadConfirm() {
    uploadConfirmOverlay.classList.add('display-none');
    pendingUploadEntries = [];
}

document.getElementById('uploadConfirmCancelBtn').addEventListener('click', hideUploadConfirm);
document.getElementById('uploadConfirmOkBtn').addEventListener('click', () => {
    if (isResultPopup) {
        hideResultPopup();
    } else {
        const entriesToUpload = [...pendingUploadEntries];
        hideUploadConfirm();
        executeUpload(entriesToUpload);
    }
});

// 결과 팝업 (확인 버튼만)
function showResultPopup(message) {
    isResultPopup = true;
    uploadConfirmMessage.textContent = message;

    const isDark = document.getElementById('body').classList.contains('dark');
    if (isDark) {
        uploadConfirmPopup.classList.add('dark');
        uploadConfirmMessage.classList.add('dark');
        document.getElementById('uploadConfirmCancelBtn').classList.add('dark');
        document.getElementById('uploadConfirmOkBtn').classList.add('dark');
    } else {
        uploadConfirmPopup.classList.remove('dark');
        uploadConfirmMessage.classList.remove('dark');
        document.getElementById('uploadConfirmCancelBtn').classList.remove('dark');
        document.getElementById('uploadConfirmOkBtn').classList.remove('dark');
    }

    // 취소 버튼 숨김
    document.getElementById('uploadConfirmCancelBtn').classList.add('display-none');

    uploadConfirmOverlay.classList.remove('display-none');
}

function hideResultPopup() {
    uploadConfirmOverlay.classList.add('display-none');
    // 취소 버튼 다시 표시
    document.getElementById('uploadConfirmCancelBtn').classList.remove('display-none');
}

// 업로드 버튼 클릭 - 확인 팝업 표시
document.getElementById('uploadSubmitBtn').addEventListener('click', () => {
    const entries = [];

    // 입력된 문장들 수집
    for (let i = 0; i < currentEntryCount; i++) {
        const entryEl = document.getElementById(`uploadEntry${i}`);
        const sentenceEl = document.getElementById(`uploadSentence${i}`);
        const authorEl = document.getElementById(`uploadAuthor${i}`);

        if (!entryEl || !sentenceEl || !authorEl) continue;

        const sentence = sentenceEl.value.trim();
        const author = authorEl.value.trim();
        const type = entryEl.dataset.type || 'public';
        const messageEl = document.getElementById(`uploadMessage${i}`);

        // 메시지 초기화
        if (messageEl) {
            messageEl.textContent = '';
            messageEl.className = 'upload-entry-message';
        }
        entryEl.classList.remove('error', 'success');

        if (sentence) {
            entries.push({index: i, sentence, author, type});
        }
    }

    if (entries.length === 0) {
        alert('최소 1개의 문장을 입력해주세요.');
        return;
    }

    showUploadConfirm(entries);
});

// 실제 업로드 실행
async function executeUpload(entries) {
    const submitBtn = document.getElementById('uploadSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>업로드 중...</span>';

    // 각 문장 업로드 시뮬레이션
    let successCount = 0;
    const successIndices = [];

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const {index, sentence, author, type} = entry;
        const messageEl = document.getElementById(`uploadMessage${index}`);
        const entryEl = document.getElementById(`uploadEntry${index}`);
        const sentenceInput = document.getElementById(`uploadSentence${index}`);
        const authorInput = document.getElementById(`uploadAuthor${index}`);

        // 유효성 검증
        if (sentence.length < 5 || sentence.length > 100) {
            messageEl.textContent = '문장은 5-100자여야 합니다.';
            messageEl.classList.add('error');
            entryEl.classList.add('error');
            continue;
        }

        // API 호출 시뮬레이션
        try {
            // 실제로는 fetch 호출
            // const response = await fetch(`/quotes/${type}`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            //     body: JSON.stringify({ sentence, author: author || undefined })
            // });

            // 시뮬레이션: 2, 4번째 문장은 실패 (i는 0부터 시작하므로 i=1, i=3이 실패)
            await new Promise(resolve => setTimeout(resolve, 500));
            const isSuccess = i % 2 === 0; // 1, 3, 5번째 성공 / 2, 4번째 실패

            if (isSuccess) {
                successCount++;
                successIndices.push(index);
            } else {
                // 실패 시뮬레이션
                throw new Error('서버 오류가 발생했습니다.');
            }
        } catch (error) {
            messageEl.textContent = error.message || '업로드에 실패했습니다.';
            messageEl.classList.add('error');
            entryEl.classList.add('error');
        }
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-upload"></i><span>업로드</span>';

    // 성공한 entry 제거 및 결과 팝업
    if (successCount > 0) {
        // 성공한 entry 제거
        successIndices.forEach(index => {
            const entryEl = document.getElementById(`uploadEntry${index}`);
            if (entryEl) entryEl.remove();
        });
        currentEntryCount -= successCount;

        // entry가 0개면 1개 추가
        if (currentEntryCount === 0) {
            addUploadEntry();
        } else {
            renumberEntries();
            updateAddButton();
            updateDeleteButtons();
        }

        // 결과 팝업 표시
        showResultPopup(`${successCount}개의 문장 업로드에 성공했습니다.`);
    }
}

document.getElementById('mysentencesBtn').addEventListener('click', () => {
    document.getElementById('dropdownMenu').classList.add('display-none');
    openMyQuotesPopup();
});

document.getElementById('statsBtn').addEventListener('click', () => {
    alert('통계 기능 (준비 중)');
    document.getElementById('dropdownMenu').classList.add('display-none');
});

document.getElementById('settingsBtn').addEventListener('click', () => {
    alert('설정 기능 (준비 중)');
    document.getElementById('dropdownMenu').classList.add('display-none');
});

// ===========================================
// 내 문장 팝업
// ===========================================
let myQuotesCurrentPage = 1;
let myQuotesHasNext = true;
let myQuotesIsLoading = false;
let myQuotesTypeFilter = 'all';
let myQuotesStatusFilter = 'all';
let editingQuoteId = null;
let deletingQuoteId = null;

// 더미 데이터 생성
function generateMockQuotes(page, type, status) {
    const mockData = [];
    const types = ['PUBLIC', 'PRIVATE'];
    const statuses = ['PENDING', 'ACTIVE'];

    for (let i = 0; i < 10; i++) {
        const quoteType = types[Math.floor(Math.random() * types.length)];
        let quoteStatus;

        // PUBLIC은 PENDING, ACTIVE 가능
        // PRIVATE은 ACTIVE만 가능
        if (quoteType === 'PRIVATE') {
            quoteStatus = 'ACTIVE';
        } else {
            quoteStatus = statuses[Math.floor(Math.random() * statuses.length)];
        }

        // 필터 적용
        if (type !== 'all' && quoteType !== type) continue;
        if (status !== 'all' && quoteStatus !== status) continue;

        mockData.push({
            quoteId: (page - 1) * 10 + i + 1,
            sentence: `이것은 ${(page - 1) * 10 + i + 1}번째 테스트 문장입니다. 타이핑 연습을 위한 샘플 텍스트입니다.`,
            author: Math.random() > 0.3 ? '테스트 저자' : null,
            type: quoteType,
            status: quoteStatus,
            createdAt: new Date().toISOString(),
        });
    }

    return {
        page: page,
        size: 10,
        hasNext: page < 3, // 3페이지까지만
        content: mockData,
    };
}

function openMyQuotesPopup() {
    const overlay = document.getElementById('myQuotesPopupOverlay');

    // 상태 초기화
    myQuotesCurrentPage = 1;
    myQuotesHasNext = true;
    myQuotesTypeFilter = 'all';
    myQuotesStatusFilter = 'all';

    // 필터 버튼 초기화
    document.querySelectorAll('.my-quotes-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === 'all') btn.classList.add('active');
        if (btn.dataset.status === 'all') btn.classList.add('active');
    });

    // 목록 초기화
    document.getElementById('myQuotesList').innerHTML = '';
    document.getElementById('myQuotesLoading').classList.add('display-none');
    document.getElementById('myQuotesEmpty').classList.add('display-none');

    overlay.classList.remove('display-none');

    // 초기 데이터 로드
    loadMyQuotes();
}

function closeMyQuotesPopup() {
    document.getElementById('myQuotesPopupOverlay').classList.add('display-none');
}

document.getElementById('myQuotesCloseBtn').addEventListener('click', closeMyQuotesPopup);
document.getElementById('myQuotesPopupOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeMyQuotesPopup();
});

// 필터 버튼 이벤트
document.querySelectorAll('.my-quotes-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.dataset.type) {
            // type 필터
            document.querySelectorAll('.my-quotes-filter-btn[data-type]').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            myQuotesTypeFilter = btn.dataset.type;
        } else if (btn.dataset.status) {
            // status 필터
            document.querySelectorAll('.my-quotes-filter-btn[data-status]').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            myQuotesStatusFilter = btn.dataset.status;
        }

        // 목록 초기화 후 다시 로드
        myQuotesCurrentPage = 1;
        myQuotesHasNext = true;
        document.getElementById('myQuotesList').innerHTML = '';
        document.getElementById('myQuotesEmpty').classList.add('display-none');
        loadMyQuotes();
    });
});

async function loadMyQuotes() {
    if (myQuotesIsLoading || !myQuotesHasNext) return;

    myQuotesIsLoading = true;
    const loadingEl = document.getElementById('myQuotesLoading');

    loadingEl.classList.remove('display-none');

    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = generateMockQuotes(myQuotesCurrentPage, myQuotesTypeFilter, myQuotesStatusFilter);

    loadingEl.classList.add('display-none');
    myQuotesIsLoading = false;

    if (response.content.length === 0 && myQuotesCurrentPage === 1) {
        document.getElementById('myQuotesEmpty').classList.remove('display-none');
        return;
    }

    // 카드 추가
    const listEl = document.getElementById('myQuotesList');
    response.content.forEach(quote => {
        listEl.appendChild(createQuoteCard(quote));
    });

    myQuotesHasNext = response.hasNext;
    myQuotesCurrentPage++;
}

function createQuoteCard(quote) {
    const card = document.createElement('div');
    card.className = 'my-quote-card';
    card.dataset.quoteId = quote.quoteId;

    // 타입 뱃지
    const typeBadgeClass = quote.type === 'PUBLIC' ? 'type-public' : 'type-private';
    const typeText = quote.type === 'PUBLIC' ? '공개' : '비공개';

    // 상태 뱃지
    let statusBadgeClass, statusText;
    switch (quote.status) {
        case 'PENDING':
            statusBadgeClass = 'status-pending';
            statusText = '대기중';
            break;
        case 'ACTIVE':
            statusBadgeClass = 'status-active';
            statusText = '활성';
            break;
    }

    // 액션 버튼 결정
    let actionsHtml = '';
    if (quote.type === 'PRIVATE' && quote.status === 'ACTIVE') {
        // 비공개 + 활성: 수정, 삭제, 공개전환
        actionsHtml = `
            <button class="my-quote-action-btn" onclick="openEditPopup(${quote.quoteId})">수정</button>
            <button class="my-quote-action-btn danger" onclick="openDeleteConfirm(${quote.quoteId})">삭제</button>
            <button class="my-quote-action-btn primary" onclick="publishQuote(${quote.quoteId})">공개전환</button>
        `;
    } else if (quote.type === 'PUBLIC' && quote.status === 'PENDING') {
        // 공개 + 대기중: 공개취소
        actionsHtml = `
            <button class="my-quote-action-btn" onclick="cancelPublish(${quote.quoteId})">공개취소</button>
        `;
    }
    // PUBLIC + ACTIVE: 액션 없음

    card.innerHTML = `
        <div class="my-quote-card-header">
            <span class="my-quote-badge ${typeBadgeClass}">${typeText}</span>
            <span class="my-quote-badge ${statusBadgeClass}">${statusText}</span>
        </div>
        <div class="my-quote-sentence">${quote.sentence}</div>
        ${quote.author ? `<div class="my-quote-author">- ${quote.author}</div>` : ''}
        <div class="my-quote-card-footer">
            ${actionsHtml}
        </div>
    `;

    return card;
}

// 무한 스크롤
document.getElementById('myQuotesList').addEventListener('scroll', (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
        loadMyQuotes();
    }
});

// 문장 수정 팝업
function openEditPopup(quoteId) {
    editingQuoteId = quoteId;
    const card = document.querySelector(`.my-quote-card[data-quote-id="${quoteId}"]`);
    const sentence = card.querySelector('.my-quote-sentence').textContent;
    const authorEl = card.querySelector('.my-quote-author');
    const author = authorEl ? authorEl.textContent.replace('- ', '') : '';

    const overlay = document.getElementById('quoteEditPopupOverlay');
    const sentenceInput = document.getElementById('quoteEditSentence');
    const authorInput = document.getElementById('quoteEditAuthor');

    sentenceInput.value = sentence;
    authorInput.value = author;
    updateEditCharCount();
    updateEditSaveButton(sentence, author);

    overlay.classList.remove('display-none');

    // 팝업이 보인 후 높이 조절
    requestAnimationFrame(() => {
        adjustEditTextareaHeight();
    });
}

function closeEditPopup() {
    document.getElementById('quoteEditPopupOverlay').classList.add('display-none');
    editingQuoteId = null;
}

document.getElementById('quoteEditCancelBtn').addEventListener('click', closeEditPopup);
document.getElementById('quoteEditPopupOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeEditPopup();
});

const quoteEditSentence = document.getElementById('quoteEditSentence');
const quoteEditAuthor = document.getElementById('quoteEditAuthor');

quoteEditSentence.addEventListener('input', () => {
    updateEditCharCount();
    adjustEditTextareaHeight();
    updateEditSaveButton();
});

quoteEditAuthor.addEventListener('input', updateEditSaveButton);

function updateEditCharCount() {
    const count = quoteEditSentence.value.length;
    const countEl = document.getElementById('quoteEditCharCount');
    countEl.textContent = `${count}/100`;

    if (count > 0 && count < 5) {
        countEl.classList.add('warning');
    } else {
        countEl.classList.remove('warning');
    }
}

function adjustEditTextareaHeight() {
    quoteEditSentence.style.height = 'auto';
    quoteEditSentence.style.height = quoteEditSentence.scrollHeight + 'px';
}

function updateEditSaveButton() {
    const sentence = quoteEditSentence.value.trim();
    const saveBtn = document.getElementById('quoteEditSaveBtn');

    if (sentence.length >= 5 && sentence.length <= 100) {
        saveBtn.disabled = false;
    } else {
        saveBtn.disabled = true;
    }
}

document.getElementById('quoteEditSaveBtn').addEventListener('click', async () => {
    const sentence = quoteEditSentence.value.trim();
    const author = quoteEditAuthor.value.trim();

    // API 호출 시뮬레이션
    console.log('수정 요청:', {quoteId: editingQuoteId, sentence, author});

    // 카드 업데이트
    const card = document.querySelector(`.my-quote-card[data-quote-id="${editingQuoteId}"]`);
    card.querySelector('.my-quote-sentence').textContent = sentence;
    const authorEl = card.querySelector('.my-quote-author');
    if (author) {
        if (authorEl) {
            authorEl.textContent = `- ${author}`;
        } else {
            const newAuthorEl = document.createElement('div');
            newAuthorEl.className = 'my-quote-author';
            newAuthorEl.textContent = `- ${author}`;
            card.querySelector('.my-quote-sentence').after(newAuthorEl);
        }
    } else if (authorEl) {
        authorEl.remove();
    }

    closeEditPopup();
});

// 삭제 확인 팝업
function openDeleteConfirm(quoteId) {
    deletingQuoteId = quoteId;
    const overlay = document.getElementById('deleteConfirmOverlay');
    overlay.classList.remove('display-none');
}

function closeDeleteConfirm() {
    document.getElementById('deleteConfirmOverlay').classList.add('display-none');
    deletingQuoteId = null;
}

document.getElementById('deleteConfirmCancelBtn').addEventListener('click', closeDeleteConfirm);
document.getElementById('deleteConfirmOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDeleteConfirm();
});

document.getElementById('deleteConfirmOkBtn').addEventListener('click', async () => {
    // API 호출 시뮬레이션
    console.log('삭제 요청:', deletingQuoteId);

    // 카드 제거
    const card = document.querySelector(`.my-quote-card[data-quote-id="${deletingQuoteId}"]`);
    card.remove();

    closeDeleteConfirm();

    // 목록이 비었는지 확인
    if (document.getElementById('myQuotesList').children.length === 0) {
        document.getElementById('myQuotesEmpty').classList.remove('display-none');
    }
});

// 공개 전환
async function publishQuote(quoteId) {
    console.log('공개 전환 요청:', quoteId);

    // 카드 업데이트 (PRIVATE -> PUBLIC, ACTIVE -> PENDING)
    const card = document.querySelector(`.my-quote-card[data-quote-id="${quoteId}"]`);

    // 뱃지 업데이트
    const header = card.querySelector('.my-quote-card-header');
    header.innerHTML = `
        <span class="my-quote-badge type-public">공개</span>
        <span class="my-quote-badge status-pending">대기중</span>
    `;

    // 액션 버튼 업데이트
    const footer = card.querySelector('.my-quote-card-footer');
    footer.innerHTML = `
        <button class="my-quote-action-btn" onclick="cancelPublish(${quoteId})">공개취소</button>
    `;
}

// 공개 취소
async function cancelPublish(quoteId) {
    console.log('공개 취소 요청:', quoteId);

    // 카드 업데이트 (PUBLIC -> PRIVATE, PENDING -> ACTIVE)
    const card = document.querySelector(`.my-quote-card[data-quote-id="${quoteId}"]`);

    // 뱃지 업데이트
    const header = card.querySelector('.my-quote-card-header');
    header.innerHTML = `
        <span class="my-quote-badge type-private">비공개</span>
        <span class="my-quote-badge status-active">활성</span>
    `;

    // 액션 버튼 업데이트
    const footer = card.querySelector('.my-quote-card-footer');
    footer.innerHTML = `
        <button class="my-quote-action-btn" onclick="openEditPopup(${quoteId})">수정</button>
        <button class="my-quote-action-btn danger" onclick="openDeleteConfirm(${quoteId})">삭제</button>
        <button class="my-quote-action-btn primary" onclick="publishQuote(${quoteId})">공개전환</button>
    `;
}

// ===========================================
// 문장 소스 선택
// ===========================================
let quoteSource = 'all'; // 'all' | 'my'

const quoteSourceAllBtn = document.getElementById('quoteSourceAll');
const quoteSourceMyBtn = document.getElementById('quoteSourceMy');

// 로그인 상태 확인
function isLoggedIn() {
    return !document.getElementById('loginBtn').classList.contains('display-none');
}

// 문장 소스 변경
function setQuoteSource(source) {
    quoteSource = source;

    // 버튼 상태 업데이트
    quoteSourceAllBtn.classList.toggle('active', source === 'all');
    quoteSourceMyBtn.classList.toggle('active', source === 'my');

    // 문장 다시 로드
    console.log('문장 소스 변경:', source);
}

// 전체 문장 버튼
quoteSourceAllBtn.addEventListener('click', () => {
    setQuoteSource('all');
});

// 내 문장만 버튼
quoteSourceMyBtn.addEventListener('click', () => {
    // 비로그인 상태 체크
    if (document.getElementById('loginBtn').classList.contains('display-none') === false) {
        // 로그인 안내 팝업
        showLoginRequiredPopup();
        return;
    }
    setQuoteSource('my');
});

// 로그인 필요 안내 팝업
function showLoginRequiredPopup() {
    const message = '내 문장을 사용하려면 로그인이 필요합니다.';

    // 기존 확인 팝업 재활용
    const overlay = document.getElementById('uploadConfirmOverlay');
    const popup = document.getElementById('uploadConfirmPopup');
    const messageEl = document.getElementById('uploadConfirmMessage');
    const cancelBtn = document.getElementById('uploadConfirmCancelBtn');
    const okBtn = document.getElementById('uploadConfirmOkBtn');

    messageEl.textContent = message;
    cancelBtn.textContent = '취소';
    okBtn.textContent = '로그인';

    // 다크모드 적용
    const isDark = document.getElementById('body').classList.contains('dark');
    if (isDark) {
        popup.classList.add('dark');
        messageEl.classList.add('dark');
        cancelBtn.classList.add('dark');
        okBtn.classList.add('dark');
    }

    // 취소 버튼 보이게
    cancelBtn.classList.remove('display-none');

    // 일회성 이벤트 핸들러
    const handleOk = () => {
        overlay.classList.add('display-none');
        // 로그인 버튼 클릭
        document.getElementById('loginBtn').click();
        okBtn.removeEventListener('click', handleOk);
        cancelBtn.removeEventListener('click', handleCancel);
        // 버튼 텍스트 복원
        cancelBtn.textContent = '취소';
        okBtn.textContent = '확인';
    };

    const handleCancel = () => {
        overlay.classList.add('display-none');
        okBtn.removeEventListener('click', handleOk);
        cancelBtn.removeEventListener('click', handleCancel);
        // 버튼 텍스트 복원
        cancelBtn.textContent = '취소';
        okBtn.textContent = '확인';
    };

    okBtn.addEventListener('click', handleOk);
    cancelBtn.addEventListener('click', handleCancel);

    overlay.classList.remove('display-none');
}

// 다크모드 토글 시 버튼 스타일 업데이트
const originalToggleTheme = toggleTheme;
toggleTheme = function () {
    originalToggleTheme();
    const isDark = document.getElementById('body').classList.contains('dark');
    quoteSourceAllBtn.classList.toggle('dark', isDark);
    quoteSourceMyBtn.classList.toggle('dark', isDark);
};

// 초기 다크모드 상태 반영
if (document.getElementById('body').classList.contains('dark')) {
    quoteSourceAllBtn.classList.add('dark');
    quoteSourceMyBtn.classList.add('dark');
}
