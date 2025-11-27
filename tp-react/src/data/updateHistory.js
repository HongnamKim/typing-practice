export const updateHistory = [
    {
        version: "1.1.0",
        date: "2025년 11월 27일",
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
