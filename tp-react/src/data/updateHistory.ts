interface UpdateEntry {
    version: string;
    date: string;
    showPopup: boolean;
    hidden: boolean;
    notices?: string[];
    features?: string[];
    improvements?: string[];
}

export const updateHistory: UpdateEntry[] = [
    {
        version: "1.2.1",
        date: "2026년 4월 2일",
        showPopup: true,
        hidden: false,
        notices: [
            "4월 2일 00:48 ~ 15:00 사이에 서버 문제로 타이핑 기록이 저장되지 않았습니다.",
            "해당 시간대의 기록은 복구가 불가능합니다.",
            "불편을 드려 죄송합니다. 현재는 정상 동작 중입니다."
        ]
    },
    {
        version: "1.2.0",
        date: "2026년 3월 29일",
        showPopup: true,
        hidden: false,
        features: [
            "문장 업로드 기능 추가",
            "내 문장 관리 페이지 추가 (수정, 삭제, 공개전환)",
            "전체 문장 / 내 문장 전환 기능 추가",
            "문장 신고 기능 및 신고 내역 페이지 추가",
            "타이핑 기록 페이지 추가 (종합 통계, 일별 추이, 오타 분석)",
            "타이핑 연습 완료 시 기록 자동 저장",
        ],
        improvements: [
            "타이핑 채점 색상 표시 방식 개선",
            "결과 표시 주기 선택 버그 수정",
        ]
    },
    {
        version: "1.1.2",
        date: "2026년 3월 23일",
        showPopup: true,
        hidden: false,
        improvements: [
            "일반 모드에서 입력 시 예문이 변경되지 않고 원본 유지되도록 개선"
        ]
    },
    {
        version: "1.1.1",
        date: "2025년 12월 10일",
        showPopup: false,
        hidden: false,
        improvements: [
            "브라우저 높이가 낮을 때 예문과 Contact가 겹치는 문제 수정"
        ]
    },
    {
        version: "1.1.0",
        date: "2025년 11월 27일",
        showPopup: true,
        hidden: false,
        features: [
            "평균점수 영역 접기/펼치기 기능 추가",
            "Default/Compact 모드 전환 기능 추가",
            "업데이트 알림 팝업 추가",
            "업데이트 내역 보기 기능 추가 (우측 상단)"
        ],
        improvements: [
            "문장 셔플 알고리즘 개선",
            "예문 101개 추가 (총 1,138개)"
        ]
    },
    {
        version: "1.0.0",
        date: "2025년 11월 23일",
        showPopup: true,
        hidden: false,
        features: [
            "새로운 디자인 적용",
            "폰트 크기 조절 기능 추가",
            "예문과 입력 영역 통합"
        ],
        improvements: [
            "타이핑 중인 글자까지 실시간 채점"
        ]
    }
];

export const CURRENT_VERSION = updateHistory[0].version;
