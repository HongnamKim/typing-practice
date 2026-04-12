type Lang = 'ko' | 'ja' | 'en';
const lang: Lang = navigator.language.startsWith('ko') ? 'ko' : navigator.language.startsWith('ja') ? 'ja' : 'en';
document.documentElement.lang = lang;
const l = (ko: string, ja: string, en: string) => lang === 'ko' ? ko : lang === 'ja' ? ja : en;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const translations = {
    // 공통
    confirm: l('확인', '確認', 'OK'),
    cancel: l('취소', 'キャンセル', 'Cancel'),
    back: l('돌아가기', '戻る', 'Back'),
    delete: l('삭제', '削除', 'Delete'),
    save: l('저장', '保存', 'Save'),
    saving: l('저장 중...', '保存中...', 'Saving...'),
    saveChanges: l('저장하기', '保存する', 'Save'),
    close: l('닫기', '閉じる', 'Close'),
    loading: l('로딩 중...', '読み込み中...', 'Loading...'),
    edit: l('수정', '編集', 'Edit'),

    // 로그인/인증
    googleLogin: l('구글 로그인', 'Googleでログイン', 'Sign in with Google'),
    loginRequired: l('로그인이 필요합니다.', 'ログインが必要です。', 'Login required.'),
    logout: l('로그아웃', 'ログアウト', 'Logout'),
    backToHome: l('홈으로 돌아가기', 'ホームに戻る', 'Back to Home'),

    // 닉네임
    welcome: l('환영합니다!', 'ようこそ！', 'Welcome!'),
    setNickname: l('닉네임을 설정해주세요. (2-10자)', 'ニックネームを設定してください（2〜10文字）', 'Please set your nickname. (2-10 characters)'),
    nicknamePlaceholder: l('닉네임 입력', 'ニックネーム入力', 'Enter nickname'),
    nicknameLength: l('닉네임은 2-10자여야 합니다.', 'ニックネームは2〜10文字です。', 'Nickname must be 2-10 characters.'),
    nicknameDuplicate: l('이미 사용 중인 닉네임입니다.', 'このニックネームは既に使用されています。', 'This nickname is already taken.'),
    nicknameCheckFailed: l('중복 확인에 실패했습니다.', '確認に失敗しました。', 'Failed to check nickname.'),
    nicknameCheckFirst: l('닉네임 중복 확인을 먼저 해주세요.', '先にニックネームの重複確認をしてください。', 'Please check nickname availability first.'),
    nicknameAvailable: l('사용 가능한 닉네임입니다.', '使用可能なニックネームです。', 'Nickname is available.'),
    nicknameHelper: l('한글, 영문, 숫자 사용 가능', '韓国語、英語、数字が使用可能', 'Korean, English, numbers allowed'),
    checkDuplicate: l('중복확인', '確認', 'Check'),
    checking: l('확인 중...', '確認中...', 'Checking...'),
    nicknameSetFailed: l('닉네임 설정에 실패했습니다.', 'ニックネームの設定に失敗しました。', 'Failed to set nickname.'),
    nicknameEditFailed: l('닉네임 수정에 실패했습니다.', 'ニックネームの変更に失敗しました。', 'Failed to update nickname.'),
    start: l('시작하기', '始める', 'Start'),
    setting: l('설정 중...', '設定中...', 'Setting...'),
    setNicknameBtn: l('닉네임 설정', 'ニックネーム設定', 'Set Nickname'),

    // 프로필
    profile: l('프로필', 'プロフィール', 'Profile'),
    profileLoadFailed: l('프로필을 불러오는데 실패했습니다.', 'プロフィールの読み込みに失敗しました。', 'Failed to load profile.'),
    email: l('이메일', 'メール', 'Email'),
    nickname: l('닉네임', 'ニックネーム', 'Nickname'),
    joinDate: l('가입일', '登録日', 'Joined'),
    user: l('사용자', 'ユーザー', 'User'),

    // 프로필 드롭다운
    mySentences: l('내 문장', 'マイ文章', 'My Sentences'),
    records: l('기록', '記録', 'Records'),
    reportHistory: l('신고 내역', '報告履歴', 'Report History'),

    // 헤더
    uploadSentence: l('문장 업로드', '文章アップロード', 'Upload'),
    uploadLoginRequired: l('문장을 업로드하려면 로그인이 필요합니다.', '文章をアップロードするにはログインが必要です。', 'Login required to upload sentences.'),
    loginFailed: l('로그인에 실패했습니다. 다시 시도해주세요.', 'ログインに失敗しました。もう一度お試しください。', 'Login failed. Please try again.'),
    googleLoginFailed: l('구글 로그인에 실패했습니다.', 'Googleログインに失敗しました。', 'Google login failed.'),

    // 타이핑 입력
    inputPlaceholder: l('타이핑을 시작하세요.', 'タイピングを始めましょう。', 'Start typing.'),
    pasteBlocked: l('붙여넣기가 금지되어 있습니다!', '貼り付けは禁止されています！', 'Pasting is not allowed!'),

    // 문장 소스
    allSentences: l('전체 문장', 'すべての文章', 'All'),
    mySentencesOnly: l('내 문장만', 'マイ文章のみ', 'Mine'),
    mySentencesLoginRequired: l('내 문장을 사용하려면 로그인이 필요합니다.', 'マイ文章を使用するにはログインが必要です。', 'Login required to use your sentences.'),

    // 문장 로딩/비어있음
    loadingSentences: l('문장을 불러오는 중...', '文章を読み込み中...', 'Loading sentences...'),
    noSentences: l('등록된 문장이 없습니다.', '登録された文章がありません。', 'No sentences found.'),
    sentenceLoadFailed: l('문장을 불러오는데 실패했습니다.', '文章の読み込みに失敗しました。', 'Failed to load sentences.'),

    // 신고
    report: l('신고', '報告', 'Report'),
    reportSentence: l('문장 신고', '文章を報告', 'Report Sentence'),
    reportTarget: l('신고 대상', '対象', 'Target'),
    reportReason: l('신고 사유', '理由', 'Reason'),
    reportDetail: l('상세 설명', '詳細', 'Details'),
    reportDetailPlaceholder: l('신고 사유를 자세히 설명해주세요.', '報告理由を詳しく説明してください。', 'Please describe the reason in detail.'),
    optional: l('선택', '任意', 'optional'),
    reportModify: l('수정 요청', '修正リクエスト', 'Request Edit'),
    reportModifyDesc: l('오타, 맞춤법 오류 등', '誤字、スペルミスなど', 'Typos, grammar errors, etc.'),
    reportDelete: l('삭제 요청', '削除リクエスト', 'Request Delete'),
    reportDeleteDesc: l('부적절한 내용, 저작권 위반 등', '不適切な内容、著作権侵害など', 'Inappropriate content, copyright, etc.'),
    reporting: l('신고 중...', '報告中...', 'Reporting...'),
    reportFailed: l('신고 접수에 실패했습니다.', '報告の送信に失敗しました。', 'Failed to submit report.'),
    reportLoginRequired: l('문장을 신고하려면 로그인이 필요합니다.', '報告するにはログインが必要です。', 'Login required to report.'),
    cancelReport: l('신고 취소', '報告取消', 'Cancel Report'),

    // 내 문장 페이지
    mySentencesTitle: l('내 문장', 'マイ文章', 'My Sentences'),
    noMySentences: l('등록한 문장이 없습니다.', '登録した文章がありません。', 'No sentences registered.'),
    deleteSentenceConfirm: l('이 문장을 삭제하시겠습니까?', 'この文章を削除しますか？', 'Delete this sentence?'),
    editSentence: l('문장 수정', '文章を編集', 'Edit Sentence'),
    sentence: l('문장', '文章', 'Sentence'),
    authorOptional: l('저자 (선택)', '著者（任意）', 'Author (optional)'),
    makePublic: l('공개전환', '公開する', 'Make Public'),
    cancelPublic: l('공개취소', '公開取消', 'Cancel Public'),

    // 필터
    all: l('전체', 'すべて', 'All'),
    public: l('공개', '公開', 'Public'),
    private: l('비공개', '非公開', 'Private'),
    pending: l('대기중', '保留中', 'Pending'),
    active: l('활성', 'アクティブ', 'Active'),
    processed: l('처리완료', '処理済み', 'Processed'),

    // 신고 내역 페이지
    reportHistoryTitle: l('신고 내역', '報告履歴', 'Report History'),
    noReports: l('신고 내역이 없습니다.', '報告履歴がありません。', 'No reports found.'),
    deleteReportConfirm: l('이 신고를 취소하시겠습니까?', 'この報告を取り消しますか？', 'Cancel this report?'),
    reportContent: l('신고 내용', '報告内容', 'Report Details'),
    deleted: l('삭제됨', '削除済み', 'Deleted'),

    // 업로드 페이지
    uploadTitle: l('문장 업로드', '文章アップロード', 'Upload Sentences'),
    uploadTypeHint: l('각 문장마다 공개/비공개를 선택할 수 있습니다.', '各文章ごとに公開/非公開を選択できます。', 'You can set each sentence as public or private.'),
    uploadTooltipPublic: l('관리자 승인 후 모든 사용자에게 노출됩니다.', '管理者の承認後、すべてのユーザーに公開されます。', 'Visible to all users after admin approval.'),
    uploadTooltipPrivate: l('본인만 사용할 수 있습니다.', '自分だけが使用できます。', 'Only visible to you.'),
    sentencePlaceholder: (min: number, max: number) => l(`문장을 입력하세요 (${min}-${max}자)`, `文章を入力してください（${min}〜${max}文字）`, `Enter a sentence (${min}-${max} characters)`),
    authorPlaceholder: l('저자 (선택)', '著者（任意）', 'Author (optional)'),
    addSentence: (cur: number, max: number) => l(`문장 추가 (${cur}/${max})`, `文章追加（${cur}/${max}）`, `Add sentence (${cur}/${max})`),
    maxEntries: (max: number) => l(`최대 ${max}개`, `最大${max}件`, `Max ${max}`),
    upload: l('업로드', 'アップロード', 'Upload'),
    uploading: l('업로드 중...', 'アップロード中...', 'Uploading...'),
    minSentenceLength: (min: number) => l(`문장은 ${min}자 이상이어야 합니다.`, `文章は${min}文字以上必要です。`, `Sentence must be at least ${min} characters.`),
    maxSentenceLength: (max: number) => l(`문장은 ${max}자 이하여야 합니다.`, `文章は${max}文字以下にしてください。`, `Sentence must be at most ${max} characters.`),
    maxAuthorLength: (max: number) => l(`저자는 ${max}자 이하여야 합니다.`, `著者は${max}文字以下にしてください。`, `Author must be at most ${max} characters.`),
    enterAtLeastOne: l('최소 1개의 문장을 입력해주세요.', '少なくとも1つの文章を入力してください。', 'Please enter at least one sentence.'),
    uploadConfirmBoth: (pub: number, priv: number) => l(`공개 ${pub}개, 비공개 ${priv}개의 문장을 업로드합니다.`, `公開${pub}件、非公開${priv}件の文章をアップロードします。`, `Upload ${pub} public and ${priv} private sentences.`),
    uploadConfirmPublic: (n: number) => l(`${n}개의 문장을 공개로 업로드합니다.`, `${n}件の文章を公開でアップロードします。`, `Upload ${n} public sentences.`),
    uploadConfirmPrivate: (n: number) => l(`${n}개의 문장을 비공개로 업로드합니다.`, `${n}件の文章を非公開でアップロードします。`, `Upload ${n} private sentences.`),
    uploadSuccess: (n: number) => l(`${n}개의 문장 업로드에 성공했습니다.`, `${n}件の文章をアップロードしました。`, `${n} sentences uploaded successfully.`),
    uploadFailed: l('업로드에 실패했습니다.', 'アップロードに失敗しました。', 'Upload failed.'),
    similarPublic: l('공개 문장 내에 유사한 문장이 존재합니다.', '公開文章に類似する文章が既に存在します。', 'A similar public sentence already exists.'),
    similarMy: l('내 문장 내에 유사한 문장이 존재합니다.', 'マイ文章に類似する文章が既に存在します。', 'A similar sentence already exists in your sentences.'),
    editSentenceFailed: l('문장 수정에 실패했습니다.', '文章の編集に失敗しました。', 'Failed to edit sentence.'),
    deleteSentenceFailed: l('문장 삭제에 실패했습니다.', '文章の削除に失敗しました。', 'Failed to delete sentence.'),
    makePublicFailed: l('공개 전환에 실패했습니다.', '公開への切り替えに失敗しました。', 'Failed to make public.'),
    cancelPublicFailed: l('공개 취소에 실패했습니다.', '公開の取り消しに失敗しました。', 'Failed to cancel public.'),
    deleteReportFailed: l('신고 삭제에 실패했습니다.', '報告の削除に失敗しました。', 'Failed to delete report.'),

    // 기록 페이지
    myTypingRecords: l('내 타이핑 기록', 'マイタイピング記録', 'My Typing Records'),
    statsSubtitle: l('연습 기록을 확인하고 개선할 부분을 찾아보세요.', '練習記録を確認し、改善点を見つけましょう。', 'Review your progress and identify areas for improvement.'),
    statsLoadFailed: l('기록을 불러오는데 실패했습니다.', '記録の読み込みに失敗しました。', 'Failed to load records.'),
    refreshCooldown: l('새로고침은 1분에 한 번만 가능합니다.', '更新は1分に1回のみ可能です。', 'Refresh is available once per minute.'),
    refreshFailed: l('새로고침에 실패했습니다.', '更新に失敗しました。', 'Refresh failed.'),

    // 종합 통계
    recent7DayAvg: l('7일 평균 CPM', '7日間平均CPM', '7D Avg CPM'),
    best: l('최고', '最高', 'Best'),
    accuracy: l('정확도', '正確度', 'Accuracy'),
    practiceTime: l('연습 시간', '練習時間', 'Practice Time'),
    practiceCount: l('연습 횟수', '練習回数', 'Practices'),
    totalAverage: l('전체 평균', '全体平均', 'Overall Avg'),
    avgReset: l('평균 초기화', '平均リセット', 'Avg Resets'),
    vsOverall: l('vs 전체', 'vs 全体', 'vs overall'),
    times: l('회', '回', ''),
    formatTime: (min: number) => {
        if (!min || min <= 0) return l('0분', '0分', '0m');
        const h = min / 60;
        if (h >= 1) {
            const rounded = Math.round(h * 10) / 10;
            const display = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
            return l(`${display}시간`, `${display}時間`, `${display}h`);
        }
        const m = Math.round(min);
        return l(`${m}분`, `${m}分`, `${m}m`);
    },

    // 에러 컨텍스트
    errorConfirm: l('확인', '確認', 'OK'),

    // 일별 추이 차트
    dailyTrend: l('일별 추이', '日別推移', 'Daily Trend'),
    accuracyTab: l('정확도', '正確度', 'Accuracy'),
    days: (n: number) => l(`${n}일`, `${n}日`, `${n}d`),
    noData: l('데이터가 없습니다.', 'データがありません。', 'No data available.'),
    formatPopupTitle: (dateStr: string) => {
        const parts = dateStr.split('-');
        if (lang === 'ko') return parts[0] + '년 ' + parseInt(parts[1]) + '월 ' + parseInt(parts[2]) + '일';
        if (lang === 'ja') return parts[0] + '年' + parseInt(parts[1]) + '月' + parseInt(parts[2]) + '日';
        return MONTH_NAMES[parseInt(parts[1]) - 1] + ' ' + parseInt(parts[2]) + ', ' + parts[0];
    },
    attempts: l('연습 횟수', '練習回数', 'Attempts'),
    avgSpeed: l('평균 타자 속도', '平均タイピング速度', 'Avg Speed'),
    bestSpeed: l('최고 타자 속도', '最高タイピング速度', 'Best Speed'),
    avgAccuracy: l('평균 정확도', '平均正確度', 'Avg Accuracy'),
    avgResetCount: l('평균 초기화 횟수', '平均リセット回数', 'Avg Resets'),
    countUnit: l('회', '回', ''),

    // 오타 통계
    typoTop10: l('자주 틀리는 글자', 'よく間違える文字', 'Most Missed'),
    typoSubtitle: l('타이핑 흐름을 방해하는 글자들', 'タイピングの流れを妨げる文字', 'Characters causing friction in flow.'),
    errors: l('회', '回', 'errors'),
    keyboardHeatmap: l('키보드 에러 히트맵', 'キーボードエラーヒートマップ', 'Keyboard Error Heatmap'),
    accurate: l('정확', '正確', 'Accurate'),
    errorsLabel: l('오류', 'エラー', 'Errors'),
    sessionTrend: l('세션 추이', 'セッション推移', 'Session Trend'),
    noTypoData: l('오타 데이터가 없습니다.', '誤字データがありません。', 'No typo data available.'),
    typoDetailTitle: l('오타 상세', '誤字の詳細', 'Typo Details'),
    noDetailData: l('상세 데이터가 없습니다.', '詳細データがありません。', 'No detail data available.'),

    // 기능 가이드
    featureGuideTitle: l('이런 기능이 있어요!', 'こんな機能があります！', 'Check out these features!'),
    featureGuideDesc: l(
        '로그인하면 원하는 문장을 직접 업로드하고, 타이핑 기록과 오타 분석을 확인할 수 있어요.',
        'ログインすると、好きな文章をアップロードしたり、タイピング記録や誤字分析を確認できます。',
        'Sign in to upload your own sentences and track your typing speed, accuracy, and typo patterns.'
    ),
    featureGuideConfirm: l('확인', 'OK', 'Got it'),

    // 로그인 유도
    loginPromptTitle: l('타이핑 기록을 저장해보세요', 'タイピング記録を保存しましょう', 'Save your typing records'),
    loginPromptDesc: l(
        '로그인하면 타이핑 속도, 정확도, 오타 분석을 확인할 수 있어요.',
        'ログインすると、タイピング速度・正確度・誤字分析を確認できます。',
        'Sign in to track your typing speed, accuracy, and typo analysis.'
    ),

    // 동의 배너
    consentTitle: l('더 나은 서비스를 위해', 'より良いサービスのために', 'Help us improve'),
    consentDesc: l(
        '서비스 개선을 위해 익명 사용 데이터를 수집합니다. 개인을 식별할 수 없습니다.',
        'サービス改善のため匿名の使用データを収集します。個人を特定することはできません。',
        'We collect anonymous usage data to improve the service. It cannot identify you personally.'
    ),
    consentAnonymousId: l('익명 식별자', '匿名識別子', 'Anonymous ID'),
    consentAnonymousIdDesc: l(
        '이름, 이메일 등 개인정보와 연결되지 않습니다.',
        '名前やメールなどの個人情報とは関連付けられません。',
        'Not linked to any personal information like name or email.'
    ),
    consentDeviceType: l('기기 유형', 'デバイスタイプ', 'Device type'),
    consentDeviceTypeDesc: l(
        '모바일 / 태블릿 / 데스크톱 중 어떤 환경인지 확인합니다.',
        'モバイル/タブレット/デスクトップのどの環境かを確認します。',
        'Whether you\'re on mobile, tablet, or desktop.'
    ),
    consentReferrer: l('유입 경로', '流入経路', 'Referrer'),
    consentReferrerDesc: l(
        '어떤 사이트에서 방문했는지 확인합니다.',
        'どのサイトからアクセスしたかを確認します。',
        'Which site you came from.'
    ),
    consentSession: l('세션 정보', 'セッション情報', 'Session info'),
    consentSessionDesc: l(
        '한 번의 방문 동안만 유지되며, 탭을 닫으면 자동으로 삭제됩니다.',
        '1回の訪問中のみ保持され、タブを閉じると自動的に削除されます。',
        'Only kept during your visit. Automatically deleted when you close the tab.'
    ),
    consentAccept: l('동의', '同意', 'Accept'),
    consentReject: l('거절', '拒否', 'Reject'),
    consentMore: l('자세히 보기', '詳しく見る', 'More info'),
    consentLess: l('접기', '閉じる', 'Less'),

    // 결과 팝업
    popupLoginPrompt: l('이 기록을 저장할까요?', 'この記録を保存しますか？', 'Save this record?'),
    popupCumulativeAvg: l('Overall avg', 'Overall avg', 'Overall avg'),
    popupViewStats: l('자세한 통계 보기 →', '詳しい統計を見る →', 'View detailed stats →'),

    // 모드 전환
    sentenceMode: l('문장 연습', '文章練習', 'Sentence'),
    wordMode: l('단어 연습', '単語練習', 'Word'),

    // 단어 모드 설정 (영어 고정)
    difficulty: 'Difficulty',
    random: 'Random',
    easy: 'Easy',
    normal: 'Normal',
    hard: 'Hard',
    wordCountLabel: 'Words',

    // 단어 모드 진행/결과 (영어 고정)
    wordProgress: (current: number, total: number) => `${current} / ${total}`,
    elapsedTime: 'Time',
    wpm: 'WPM',
    correctWords: 'Correct',
    totalWords: 'Total',
    elapsedTimeResult: 'Time',
    retry: 'Retry',
    retryHint: 'tab + enter to retry',
    wordAccuracy: 'Accuracy',
    formatSeconds: (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    },

    // 업데이트 팝업
    updateNotice: l('업데이트 안내', 'アップデート情報', 'Update'),
    updateHistory: l('업데이트', 'アップデート', 'Updates'),
    updateHistoryTitle: l('업데이트 기록', 'アップデート履歴', 'Update History'),
    updateClose: l('확인', '確認', 'OK'),
    updateViewHistory: l('지난 업데이트 보기', '過去のアップデートを見る', 'View past updates'),
    updateDontShow: l('다시 보지 않기', '次から表示しない', 'Don\'t show again'),
    updateNotices: l('공지 사항', 'お知らせ', 'Notices'),
    updateFeatures: l('새로운 기능', '新機能', 'New features'),
    updateImprovements: l('개선사항', '改善点', 'Improvements'),
} as const;

type TranslationKey = keyof typeof translations;
type TranslationValue<K extends TranslationKey> = (typeof translations)[K];

export function t<K extends TranslationKey>(key: K): TranslationValue<K> {
    return translations[key];
}