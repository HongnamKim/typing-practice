const isKorean = navigator.language.startsWith('ko');
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const translations = {
    // 공통
    confirm: isKorean ? '확인' : 'OK',
    cancel: isKorean ? '취소' : 'Cancel',
    back: isKorean ? '돌아가기' : 'Back',
    delete: isKorean ? '삭제' : 'Delete',
    save: isKorean ? '저장' : 'Save',
    saving: isKorean ? '저장 중...' : 'Saving...',
    saveChanges: isKorean ? '저장하기' : 'Save',
    close: isKorean ? '닫기' : 'Close',
    loading: isKorean ? '로딩 중...' : 'Loading...',
    edit: isKorean ? '수정' : 'Edit',

    // 로그인/인증
    googleLogin: isKorean ? '구글 로그인' : 'Sign in with Google',
    loginRequired: isKorean ? '로그인이 필요합니다.' : 'Login required.',
    logout: isKorean ? '로그아웃' : 'Logout',
    backToHome: isKorean ? '홈으로 돌아가기' : 'Back to Home',

    // 닉네임
    welcome: isKorean ? '환영합니다! 🎉' : 'Welcome! 🎉',
    setNickname: isKorean ? '닉네임을 설정해주세요. (2-10자)' : 'Please set your nickname. (2-10 characters)',
    nicknamePlaceholder: isKorean ? '닉네임 입력' : 'Enter nickname',
    nicknameLength: isKorean ? '닉네임은 2-10자여야 합니다.' : 'Nickname must be 2-10 characters.',
    nicknameDuplicate: isKorean ? '이미 사용 중인 닉네임입니다.' : 'This nickname is already taken.',
    nicknameCheckFailed: isKorean ? '중복 확인에 실패했습니다.' : 'Failed to check nickname.',
    nicknameCheckFirst: isKorean ? '닉네임 중복 확인을 먼저 해주세요.' : 'Please check nickname availability first.',
    nicknameAvailable: isKorean ? '사용 가능한 닉네임입니다.' : 'Nickname is available.',
    nicknameHelper: isKorean ? '한글, 영문, 숫자 사용 가능' : 'Korean, English, numbers allowed',
    checkDuplicate: isKorean ? '중복확인' : 'Check',
    checking: isKorean ? '확인 중...' : 'Checking...',
    nicknameSetFailed: isKorean ? '닉네임 설정에 실패했습니다.' : 'Failed to set nickname.',
    nicknameEditFailed: isKorean ? '닉네임 수정에 실패했습니다.' : 'Failed to update nickname.',
    start: isKorean ? '시작하기' : 'Start',
    setting: isKorean ? '설정 중...' : 'Setting...',
    setNicknameBtn: isKorean ? '닉네임 설정' : 'Set Nickname',

    // 프로필
    profile: isKorean ? '프로필' : 'Profile',
    profileLoadFailed: isKorean ? '프로필을 불러오는데 실패했습니다.' : 'Failed to load profile.',
    email: isKorean ? '이메일' : 'Email',
    nickname: isKorean ? '닉네임' : 'Nickname',
    joinDate: isKorean ? '가입일' : 'Joined',
    user: isKorean ? '사용자' : 'User',

    // 프로필 드롭다운
    mySentences: isKorean ? '내 문장' : 'My Sentences',
    records: isKorean ? '기록' : 'Records',
    reportHistory: isKorean ? '신고 내역' : 'Report History',

    // 헤더
    uploadSentence: isKorean ? '문장 업로드' : 'Upload',
    uploadLoginRequired: isKorean ? '문장을 업로드하려면 로그인이 필요합니다.' : 'Login required to upload sentences.',
    loginFailed: isKorean ? '로그인에 실패했습니다. 다시 시도해주세요.' : 'Login failed. Please try again.',
    googleLoginFailed: isKorean ? '구글 로그인에 실패했습니다.' : 'Google login failed.',

    // 타이핑 입력
    inputPlaceholder: isKorean ? '위 문장을 입력하세요.' : 'Type the sentence above.',
    pasteBlocked: isKorean ? '붙여넣기가 금지되어 있습니다!' : 'Pasting is not allowed!',

    // 문장 소스
    allSentences: isKorean ? '전체 문장' : 'All',
    mySentencesOnly: isKorean ? '내 문장만' : 'Mine',
    mySentencesLoginRequired: isKorean ? '내 문장을 사용하려면 로그인이 필요합니다.' : 'Login required to use your sentences.',

    // 문장 로딩/비어있음
    loadingSentences: isKorean ? '문장을 불러오는 중...' : 'Loading sentences...',
    noSentences: isKorean ? '등록된 문장이 없습니다.' : 'No sentences found.',
    sentenceLoadFailed: isKorean ? '문장을 불러오는데 실패했습니다.' : 'Failed to load sentences.',

    // 신고
    report: isKorean ? '신고' : 'Report',
    reportSentence: isKorean ? '문장 신고' : 'Report Sentence',
    reportTarget: isKorean ? '신고 대상' : 'Target',
    reportReason: isKorean ? '신고 사유' : 'Reason',
    reportDetail: isKorean ? '상세 설명' : 'Details',
    reportDetailPlaceholder: isKorean ? '신고 사유를 자세히 설명해주세요.' : 'Please describe the reason in detail.',
    optional: isKorean ? '선택' : 'optional',
    reportModify: isKorean ? '수정 요청' : 'Request Edit',
    reportModifyDesc: isKorean ? '오타, 맞춤법 오류 등' : 'Typos, grammar errors, etc.',
    reportDelete: isKorean ? '삭제 요청' : 'Request Delete',
    reportDeleteDesc: isKorean ? '부적절한 내용, 저작권 위반 등' : 'Inappropriate content, copyright, etc.',
    reporting: isKorean ? '신고 중...' : 'Reporting...',
    reportFailed: isKorean ? '신고 접수에 실패했습니다.' : 'Failed to submit report.',
    reportLoginRequired: isKorean ? '문장을 신고하려면 로그인이 필요합니다.' : 'Login required to report.',
    cancelReport: isKorean ? '신고 취소' : 'Cancel Report',

    // 내 문장 페이지
    mySentencesTitle: isKorean ? '내 문장' : 'My Sentences',
    noMySentences: isKorean ? '등록한 문장이 없습니다.' : 'No sentences registered.',
    deleteSentenceConfirm: isKorean ? '이 문장을 삭제하시겠습니까?' : 'Delete this sentence?',
    editSentence: isKorean ? '문장 수정' : 'Edit Sentence',
    sentence: isKorean ? '문장' : 'Sentence',
    authorOptional: isKorean ? '저자 (선택)' : 'Author (optional)',
    makePublic: isKorean ? '공개전환' : 'Make Public',
    cancelPublic: isKorean ? '공개취소' : 'Cancel Public',

    // 필터
    all: isKorean ? '전체' : 'All',
    public: isKorean ? '공개' : 'Public',
    private: isKorean ? '비공개' : 'Private',
    pending: isKorean ? '대기중' : 'Pending',
    active: isKorean ? '활성' : 'Active',
    processed: isKorean ? '처리완료' : 'Processed',

    // 신고 내역 페이지
    reportHistoryTitle: isKorean ? '신고 내역' : 'Report History',
    noReports: isKorean ? '신고 내역이 없습니다.' : 'No reports found.',
    deleteReportConfirm: isKorean ? '이 신고를 취소하시겠습니까?' : 'Cancel this report?',
    reportContent: isKorean ? '신고 내용' : 'Report Details',
    deleted: isKorean ? '삭제됨' : 'Deleted',

    // 업로드 페이지
    uploadTitle: isKorean ? '문장 업로드' : 'Upload Sentences',
    uploadTypeHint: isKorean ? '각 문장마다 공개/비공개를 선택할 수 있습니다.' : 'You can set each sentence as public or private.',
    uploadTooltipPublic: isKorean ? '관리자 승인 후 모든 사용자에게 노출됩니다.' : 'Visible to all users after admin approval.',
    uploadTooltipPrivate: isKorean ? '본인만 사용할 수 있습니다.' : 'Only visible to you.',
    sentencePlaceholder: (min: number, max: number) => isKorean ? `문장을 입력하세요 (${min}-${max}자)` : `Enter a sentence (${min}-${max} characters)`,
    authorPlaceholder: isKorean ? '저자 (선택)' : 'Author (optional)',
    addSentence: (cur: number, max: number) => isKorean ? `문장 추가 (${cur}/${max})` : `Add sentence (${cur}/${max})`,
    maxEntries: (max: number) => isKorean ? `최대 ${max}개` : `Max ${max}`,
    upload: isKorean ? '업로드' : 'Upload',
    uploading: isKorean ? '업로드 중...' : 'Uploading...',
    minSentenceLength: (min: number) => isKorean ? `문장은 ${min}자 이상이어야 합니다.` : `Sentence must be at least ${min} characters.`,
    maxSentenceLength: (max: number) => isKorean ? `문장은 ${max}자 이하여야 합니다.` : `Sentence must be at most ${max} characters.`,
    maxAuthorLength: (max: number) => isKorean ? `저자는 ${max}자 이하여야 합니다.` : `Author must be at most ${max} characters.`,
    enterAtLeastOne: isKorean ? '최소 1개의 문장을 입력해주세요.' : 'Please enter at least one sentence.',
    uploadConfirmBoth: (pub: number, priv: number) => isKorean ? `공개 ${pub}개, 비공개 ${priv}개의 문장을 업로드합니다.` : `Upload ${pub} public and ${priv} private sentences.`,
    uploadConfirmPublic: (n: number) => isKorean ? `${n}개의 문장을 공개로 업로드합니다.` : `Upload ${n} public sentences.`,
    uploadConfirmPrivate: (n: number) => isKorean ? `${n}개의 문장을 비공개로 업로드합니다.` : `Upload ${n} private sentences.`,
    uploadSuccess: (n: number) => isKorean ? `${n}개의 문장 업로드에 성공했습니다.` : `${n} sentences uploaded successfully.`,
    uploadFailed: isKorean ? '업로드에 실패했습니다.' : 'Upload failed.',
    similarPublic: isKorean ? '공개 문장 내에 유사한 문장이 존재합니다.' : 'A similar public sentence already exists.',
    similarMy: isKorean ? '내 문장 내에 유사한 문장이 존재합니다.' : 'A similar sentence already exists in your sentences.',
    editSentenceFailed: isKorean ? '문장 수정에 실패했습니다.' : 'Failed to edit sentence.',
    deleteSentenceFailed: isKorean ? '문장 삭제에 실패했습니다.' : 'Failed to delete sentence.',
    makePublicFailed: isKorean ? '공개 전환에 실패했습니다.' : 'Failed to make public.',
    cancelPublicFailed: isKorean ? '공개 취소에 실패했습니다.' : 'Failed to cancel public.',
    deleteReportFailed: isKorean ? '신고 삭제에 실패했습니다.' : 'Failed to delete report.',

    // 기록 페이지
    myTypingRecords: isKorean ? '내 타이핑 기록' : 'My Typing Records',
    statsLoadFailed: isKorean ? '기록을 불러오는데 실패했습니다.' : 'Failed to load records.',
    refreshCooldown: isKorean ? '새로고침은 1분에 한 번만 가능합니다.' : 'Refresh is available once per minute.',
    refreshFailed: isKorean ? '새로고침에 실패했습니다.' : 'Refresh failed.',

    // 종합 통계
    recent7DayAvg: isKorean ? '최근 7일 평균' : '7-Day Average',
    best: isKorean ? '최고' : 'Best',
    accuracy: isKorean ? '정확도' : 'Accuracy',
    practiceTime: isKorean ? '연습 시간' : 'Practice Time',
    practiceCount: isKorean ? '연습 횟수' : 'Practices',
    totalAverage: isKorean ? '전체 평균' : 'Overall Avg',
    avgReset: isKorean ? '평균 초기화' : 'Avg Resets',
    times: isKorean ? '회' : '',
    formatTime: (min: number) => {
        if (!min || min <= 0) return isKorean ? '0분' : '0m';
        const h = Math.floor(min / 60);
        const m = Math.round(min % 60);
        if (isKorean) return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    },

    // 에러 컨텍스트
    errorConfirm: isKorean ? '확인' : 'OK',

    // 일별 추이 차트
    dailyTrend: isKorean ? '일별 추이' : 'Daily Trend',
    accuracyTab: isKorean ? '정확도' : 'Accuracy',
    days: (n: number) => isKorean ? `${n}일` : `${n}d`,
    noData: isKorean ? '데이터가 없습니다.' : 'No data available.',
    formatPopupTitle: (dateStr: string) => {
        const parts = dateStr.split('-');
        if (isKorean) return parts[0] + '년 ' + parseInt(parts[1]) + '월 ' + parseInt(parts[2]) + '일';
        return MONTH_NAMES[parseInt(parts[1]) - 1] + ' ' + parseInt(parts[2]) + ', ' + parts[0];
    },
    attempts: isKorean ? '연습 횟수' : 'Attempts',
    avgSpeed: isKorean ? '평균 타자 속도' : 'Avg Speed',
    bestSpeed: isKorean ? '최고 타자 속도' : 'Best Speed',
    avgAccuracy: isKorean ? '평균 정확도' : 'Avg Accuracy',
    avgResetCount: isKorean ? '평균 초기화 횟수' : 'Avg Resets',
    countUnit: isKorean ? '회' : '',

    // 오타 통계
    typoTop10: isKorean ? '자주 틀리는 글자 TOP 10' : 'Most Missed Characters TOP 10',
    noTypoData: isKorean ? '오타 데이터가 없습니다.' : 'No typo data available.',
    typoDetailTitle: isKorean ? '오타 상세' : 'Typo Details',
    noDetailData: isKorean ? '상세 데이터가 없습니다.' : 'No detail data available.',

    // 기능 가이드
    featureGuideTitle: isKorean ? '이런 기능이 있어요!' : 'Check out these features!',
    featureGuideDesc: isKorean
        ? '로그인하면 원하는 문장을 직접 업로드하고, 타이핑 기록과 오타 분석을 확인할 수 있어요.'
        : 'Sign in to upload your own sentences and track your typing speed, accuracy, and typo patterns.',
    featureGuideConfirm: isKorean ? '확인' : 'Got it',
} as const;

type TranslationKey = keyof typeof translations;
type TranslationValue<K extends TranslationKey> = (typeof translations)[K];

export function t<K extends TranslationKey>(key: K): TranslationValue<K> {
    return translations[key];
}