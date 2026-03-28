/* eslint-disable no-undef */
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

    if (isDark()) {
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

    if (isDark()) {
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

    if (isDark()) {
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


