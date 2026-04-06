interface LocalizedText {
    ko: string;
    en: string;
}

interface UpdateEntry {
    version: string;
    date: string; // ISO format: "YYYY-MM-DD"
    showPopup: boolean;
    hidden: boolean;
    notices?: LocalizedText[];
    features?: LocalizedText[];
    improvements?: LocalizedText[];
}

const isKorean = navigator.language.startsWith('ko');

export function formatUpdateDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-').map(Number);
    if (isKorean) {
        return `${year}년 ${month}월 ${day}일`;
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[month - 1]} ${day}, ${year}`;
}

export function localize(item: LocalizedText): string {
    return isKorean ? item.ko : item.en;
}

export const updateHistory: UpdateEntry[] = [
    {
        version: "1.4.0",
        date: "2026-04-06",
        showPopup: true,
        hidden: false,
        features: [
            {ko: "상단 네비게이션 바 디자인 변경", en: "Redesigned top navigation bar"},
            {ko: "업데이트 내역 페이지 추가", en: "Added update history page"},
            {ko: "타이핑 속도/정확도 표시 및 설정 영역 디자인 변경", en: "Redesigned typing stats and settings area"},
            {
                ko: "단어 연습에 실시간 WPM, 난이도, 단어수, 폰트 크기 설정 추가",
                en: "Added real-time WPM, difficulty, word count, font size settings to word mode"
            },
            {ko: "문장 소스 선택 탭 디자인 변경", en: "Redesigned sentence source selector tabs"},
        ],
        improvements: [
            {ko: "다크모드 배경 및 보라색(primary) 색상 개선", en: "Improved dark mode background and primary colors"},
            {ko: "좁은 화면에서 컨트롤 영역 자동 접기/오버레이 지원", en: "Auto-collapse controls on narrow screens with overlay support"},
        ]
    },
    {
        version: "1.3.0",
        date: "2026-04-06",
        showPopup: true,
        hidden: false,
        features: [
            {ko: "단어 모드 추가 (beta)", en: "Word mode added (beta)"},
            {ko: "난이도 선택 (Random, Easy, Normal, Hard)", en: "Difficulty selection (Random, Easy, Normal, Hard)"},
            {ko: "단어 수 선택 (15, 25, 50)", en: "Word count selection (15, 25, 50)"},
            {ko: "문장/단어 모드 전환 기능 추가", en: "Sentence/Word mode switch"},
        ],
        improvements: [
            {ko: "마지막 사용 모드 자동 기억", en: "Auto-remember last used mode"},
        ]
    },
    {
        version: "1.2.1",
        date: "2026-04-02",
        showPopup: false,
        hidden: true,
        notices: [
            {
                ko: "4월 2일 00:48 ~ 15:00 사이에 서버 문제로 타이핑 기록이 저장되지 않았습니다.",
                en: "Due to a server issue, typing records were not saved between Apr 2, 00:48 – 15:00 KST."
            },
            {
                ko: "해당 시간대의 기록은 복구가 불가능합니다.",
                en: "Records from that period cannot be recovered."
            },
            {
                ko: "불편을 드려 죄송합니다. 현재는 정상 동작 중입니다.",
                en: "We apologize for the inconvenience. The service is now operating normally."
            }
        ]
    },
    {
        version: "1.2.0",
        date: "2026-03-29",
        showPopup: true,
        hidden: false,
        features: [
            {ko: "문장 업로드 기능 추가", en: "Upload your own sentences"},
            {ko: "내 문장 관리 페이지 추가 (수정, 삭제, 공개전환)", en: "My sentences page (edit, delete, toggle visibility)"},
            {ko: "전체 문장 / 내 문장 전환 기능 추가", en: "Switch between all sentences and my sentences"},
            {ko: "문장 신고 기능 및 신고 내역 페이지 추가", en: "Report sentences and view report history"},
            {ko: "타이핑 기록 페이지 추가 (종합 통계, 일별 추이, 오타 분석)", en: "Typing stats page (summary, daily trends, typo analysis)"},
            {ko: "타이핑 연습 완료 시 기록 자동 저장", en: "Auto-save typing records on completion"},
        ],
        improvements: [
            {ko: "타이핑 채점 색상 표시 방식 개선", en: "Improved typing grading color display"},
            {ko: "결과 표시 주기 선택 버그 수정", en: "Fixed result display interval selection bug"},
        ]
    },
    {
        version: "1.1.2",
        date: "2026-03-23",
        showPopup: true,
        hidden: false,
        improvements: [
            {ko: "일반 모드에서 입력 시 예문이 변경되지 않고 원본 유지되도록 개선", en: "Fixed sentence changing during input in normal mode"}
        ]
    },
    {
        version: "1.1.1",
        date: "2025-12-10",
        showPopup: false,
        hidden: false,
        improvements: [
            {
                ko: "브라우저 높이가 낮을 때 예문과 Contact가 겹치는 문제 수정",
                en: "Fixed sentence and contact section overlap on short browser windows"
            }
        ]
    },
    {
        version: "1.1.0",
        date: "2025-11-27",
        showPopup: true,
        hidden: false,
        features: [
            {ko: "평균점수 영역 접기/펼치기 기능 추가", en: "Collapsible average score section"},
            {ko: "Default/Compact 모드 전환 기능 추가", en: "Default/Compact mode toggle"},
            {ko: "업데이트 알림 팝업 추가", en: "Update notification popup"},
            {ko: "업데이트 내역 보기 기능 추가 (우측 상단)", en: "Update history viewer (top right)"}
        ],
        improvements: [
            {ko: "문장 셔플 알고리즘 개선", en: "Improved sentence shuffle algorithm"},
            {ko: "예문 101개 추가 (총 1,138개)", en: "Added 101 sentences (1,138 total)"}
        ]
    },
    {
        version: "1.0.0",
        date: "2025-11-23",
        showPopup: true,
        hidden: false,
        features: [
            {ko: "새로운 디자인 적용", en: "New design"},
            {ko: "폰트 크기 조절 기능 추가", en: "Font size adjustment"},
            {ko: "예문과 입력 영역 통합", en: "Unified sentence and input area"}
        ],
        improvements: [
            {ko: "타이핑 중인 글자까지 실시간 채점", en: "Real-time grading while typing"}
        ]
    }
];

export const CURRENT_VERSION = updateHistory[0].version;
