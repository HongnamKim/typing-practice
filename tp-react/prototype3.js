/* eslint-disable no-undef */
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
function showLoginRequiredPopup(customMessage) {
    const message = customMessage || '내 문장을 사용하려면 로그인이 필요합니다.';

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
    if (isDark()) {
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
    quoteSourceAllBtn.classList.toggle('dark', isDark());
    quoteSourceMyBtn.classList.toggle('dark', isDark());
};

// 초기 다크모드 상태 반영
if (isDark()) {
    quoteSourceAllBtn.classList.add('dark');
    quoteSourceMyBtn.classList.add('dark');
}

// ===== 신고 기능 =====
const quoteMoreBtn = document.getElementById('quoteMoreBtn');
const quoteMoreMenu = document.getElementById('quoteMoreMenu');
const quoteReportBtn = document.getElementById('quoteReportBtn');

// 신고 팝업 요소
const reportPopupOverlay = document.getElementById('reportPopupOverlay');
const reportPopup = document.getElementById('reportPopup');
const reportPopupCloseBtn = document.getElementById('reportPopupCloseBtn');
const reportQuoteSentence = document.getElementById('reportQuoteSentence');
const reportQuoteAuthor = document.getElementById('reportQuoteAuthor');
const reportDetail = document.getElementById('reportDetail');
const reportDetailCount = document.getElementById('reportDetailCount');
const reportCancelBtn = document.getElementById('reportCancelBtn');
const reportSubmitBtn = document.getElementById('reportSubmitBtn');

// 더보기 메뉴 토글
quoteMoreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    quoteMoreMenu.classList.toggle('display-none');
});

// 더보기 메뉴 - 신고 클릭
quoteReportBtn.addEventListener('click', () => {
    quoteMoreMenu.classList.add('display-none');

    // 비로그인 상태 체크
    if (!document.getElementById('loginBtn').classList.contains('display-none')) {
        showLoginRequiredPopup('문장을 신고하려면 로그인이 필요합니다.');
        return;
    }

    showReportPopup();
});

// 외부 클릭 시 더보기 메뉴 닫기
document.addEventListener('click', () => {
    quoteMoreMenu.classList.add('display-none');
});

// 신고 팝업 표시
function showReportPopup() {
    // 현재 문장 정보 가져오기
    const sentence = document.getElementById('characterContainer').textContent;
    const author = document.querySelector('.author-text').textContent;

    reportQuoteSentence.textContent = sentence;
    reportQuoteAuthor.textContent = author ? `- ${author}` : '';
    reportQuoteAuthor.style.display = author ? 'block' : 'none';

    // 초기화
    reportDetail.value = '';
    reportDetailCount.textContent = '0/120';
    document.querySelector('input[name="reportReason"][value="MODIFY"]').checked = true;

    reportPopupOverlay.classList.remove('display-none');
}

// 신고 팝업 닫기
function closeReportPopup() {
    reportPopupOverlay.classList.add('display-none');
}

reportPopupCloseBtn.addEventListener('click', closeReportPopup);
reportCancelBtn.addEventListener('click', closeReportPopup);

// 오버레이 클릭 시 닫기
reportPopupOverlay.addEventListener('click', (e) => {
    if (e.target === reportPopupOverlay) {
        closeReportPopup();
    }
});

// 상세 설명 글자수 카운트
reportDetail.addEventListener('input', () => {
    const length = reportDetail.value.length;
    reportDetailCount.textContent = `${length}/120`;
});

// 신고 제출
reportSubmitBtn.addEventListener('click', () => {
    const reason = document.querySelector('input[name="reportReason"]:checked').value;
    const detail = reportDetail.value.trim();

    if (!detail) {
        alert('상세 설명을 입력해주세요.');
        reportDetail.focus();
        return;
    }

    console.log('신고 제출:', {reason, detail});
    alert('신고가 접수되었습니다.');
    closeReportPopup();
});

// ===== 내 신고 내역 =====
let myReportsCurrentPage = 1;
let myReportsHasNext = true;
let myReportsIsLoading = false;
let myReportsStatusFilter = 'all';
let deletingReportId = null;

// 더미 데이터 생성
function generateMockReports(page, status) {
    const mockData = [];
    const reasons = ['MODIFY', 'DELETE'];
    const statuses = ['PENDING', 'PROCESSED'];
    const sentences = [
        '가시에 절리지 않고서는 장미를 모을 수 없다.',
        '오늘 할 수 있는 일을 내일로 미루지 마라.',
        '실패는 성공의 어머니다.',
        '노력 없이 얻는 것은 없다.',
        '시작이 반이다.'
    ];
    const authors = ['웰러비', '벤자민 프랭클린', '토마스 에디슨', null, '플라톤'];
    const details = [
        '오타가 있습니다. "절리지"가 아니라 "찔리지"입니다.',
        '맞춤법 오류가 있어 수정이 필요합니다.',
        '부적절한 내용이 포함되어 있습니다.',
        '저작권 문제가 있을 수 있는 문장입니다.',
        '띄어쓰기가 잘못되어 있습니다.'
    ];

    for (let i = 0; i < 5; i++) {
        const reportStatus = statuses[Math.floor(Math.random() * statuses.length)];
        if (status !== 'all' && reportStatus !== status) continue;

        const idx = (page - 1) * 5 + i;
        mockData.push({
            id: idx + 1,
            reason: reasons[Math.floor(Math.random() * reasons.length)],
            status: reportStatus,
            quoteDeleted: reportStatus === 'PROCESSED' && Math.random() > 0.5,
            detail: details[i % details.length],
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            quote: {
                quoteId: idx + 100,
                sentence: sentences[i % sentences.length],
                author: authors[i % authors.length]
            }
        });
    }

    return { page, size: 5, hasNext: page < 3, content: mockData };
}

function openMyReportsPopup() {
    myReportsCurrentPage = 1;
    myReportsHasNext = true;
    myReportsStatusFilter = 'all';

    document.querySelectorAll('.my-reports-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.status === 'all') btn.classList.add('active');
    });

    document.getElementById('myReportsList').innerHTML = '';
    document.getElementById('myReportsLoading').classList.add('display-none');
    document.getElementById('myReportsEmpty').classList.add('display-none');
    document.getElementById('myReportsPopupOverlay').classList.remove('display-none');

    loadMyReports();
}

function closeMyReportsPopup() {
    document.getElementById('myReportsPopupOverlay').classList.add('display-none');
}

document.getElementById('myReportsBtn').addEventListener('click', () => {
    document.getElementById('dropdownMenu').classList.add('display-none');
    openMyReportsPopup();
});

document.getElementById('myReportsCloseBtn').addEventListener('click', closeMyReportsPopup);
document.getElementById('myReportsPopupOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeMyReportsPopup();
});

document.querySelectorAll('.my-reports-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.my-reports-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        myReportsStatusFilter = btn.dataset.status;

        myReportsCurrentPage = 1;
        myReportsHasNext = true;
        document.getElementById('myReportsList').innerHTML = '';
        document.getElementById('myReportsEmpty').classList.add('display-none');
        loadMyReports();
    });
});

async function loadMyReports() {
    if (myReportsIsLoading || !myReportsHasNext) return;

    myReportsIsLoading = true;
    document.getElementById('myReportsLoading').classList.remove('display-none');

    await new Promise(resolve => setTimeout(resolve, 500));
    const response = generateMockReports(myReportsCurrentPage, myReportsStatusFilter);

    document.getElementById('myReportsLoading').classList.add('display-none');
    myReportsIsLoading = false;

    if (response.content.length === 0 && myReportsCurrentPage === 1) {
        document.getElementById('myReportsEmpty').classList.remove('display-none');
        return;
    }

    const listEl = document.getElementById('myReportsList');
    response.content.forEach(report => listEl.appendChild(createReportCard(report)));

    myReportsHasNext = response.hasNext;
    myReportsCurrentPage++;
}

function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'my-report-card';
    card.dataset.reportId = report.id;

    const reasonClass = report.reason === 'MODIFY' ? 'reason-modify' : 'reason-delete';
    const reasonText = report.reason === 'MODIFY' ? '수정 요청' : '삭제 요청';
    const statusClass = report.status === 'PENDING' ? 'status-pending' : 'status-processed';
    const statusText = report.status === 'PENDING' ? '대기중' : '처리완료';

    const date = new Date(report.createdAt);
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

    const quoteDeletedClass = report.quoteDeleted ? 'quote-deleted' : '';
    const quoteDeletedText = report.quoteDeleted ? ' (삭제됨)' : '';

    const deleteBtn = report.status === 'PENDING'
        ? `<button class="my-report-delete-btn" onclick="openReportDeleteConfirm(${report.id})"><i class="fa-solid fa-trash"></i></button>`
        : '';

    card.innerHTML = `
        <div class="my-report-card-header">
            <div class="my-report-badges">
                <span class="my-report-badge ${reasonClass}">${reasonText}</span>
                <span class="my-report-badge ${statusClass}">${statusText}</span>
            </div>
            ${deleteBtn}
        </div>
        <div class="my-report-quote ${quoteDeletedClass}">
            <p class="my-report-sentence">${report.quote.sentence}${quoteDeletedText}</p>
            ${report.quote.author ? `<span class="my-report-author">- ${report.quote.author}</span>` : ''}
        </div>
        <div class="my-report-detail">
            <span class="my-report-detail-label">신고 내용</span>
            <p class="my-report-detail-text">${report.detail}</p>
        </div>
        <div class="my-report-card-footer">
            <span class="my-report-date">${dateStr}</span>
        </div>
    `;
    return card;
}

document.getElementById('myReportsList').addEventListener('scroll', (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) loadMyReports();
});

function openReportDeleteConfirm(reportId) {
    deletingReportId = reportId;
    document.getElementById('reportDeleteConfirmOverlay').classList.remove('display-none');
}

function closeReportDeleteConfirm() {
    document.getElementById('reportDeleteConfirmOverlay').classList.add('display-none');
    deletingReportId = null;
}

document.getElementById('reportDeleteConfirmCancelBtn').addEventListener('click', closeReportDeleteConfirm);
document.getElementById('reportDeleteConfirmOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeReportDeleteConfirm();
});

document.getElementById('reportDeleteConfirmOkBtn').addEventListener('click', () => {
    const card = document.querySelector(`.my-report-card[data-report-id="${deletingReportId}"]`);
    if (card) card.remove();
    closeReportDeleteConfirm();
    if (document.getElementById('myReportsList').children.length === 0) {
        document.getElementById('myReportsEmpty').classList.remove('display-none');
    }
});