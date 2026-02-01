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

function showUploadConfirm(entries) {
    pendingUploadEntries = entries;
    
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
    hideUploadConfirm();
    executeUpload(pendingUploadEntries);
});

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
            entries.push({ index: i, sentence, author, type });
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
    
    for (const entry of entries) {
        const { index, sentence, author, type } = entry;
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
            
            // 시뮬레이션: 랜덤하게 성공/실패
            await new Promise(resolve => setTimeout(resolve, 500));
            const isSuccess = Math.random() > 0.3; // 70% 성공률
            
            if (isSuccess) {
                messageEl.textContent = '업로드 성공!';
                messageEl.classList.add('success');
                if (document.getElementById('body').classList.contains('dark')) {
                    messageEl.classList.add('dark');
                }
                entryEl.classList.add('success');
                
                // 성공한 입력 필드 비우기
                sentenceInput.value = '';
                authorInput.value = '';
                successCount++;
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
    
    // 결과 알림
    if (successCount === entries.length) {
        alert(`${successCount}개의 문장이 모두 업로드되었습니다!`);
        closeUploadPopup();
    } else if (successCount > 0) {
        alert(`${entries.length}개 중 ${successCount}개 업로드 성공, ${entries.length - successCount}개 실패`);
    }
}

document.getElementById('mysentencesBtn').addEventListener('click', () => {
    alert('내 문장 기능 (준비 중)');
    document.getElementById('dropdownMenu').classList.add('display-none');
});

document.getElementById('statsBtn').addEventListener('click', () => {
    alert('통계 기능 (준비 중)');
    document.getElementById('dropdownMenu').classList.add('display-none');
});

document.getElementById('settingsBtn').addEventListener('click', () => {
    alert('설정 기능 (준비 중)');
    document.getElementById('dropdownMenu').classList.add('display-none');
});
