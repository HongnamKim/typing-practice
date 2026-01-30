# Typing Practice (React)

한글 타자 연습 웹 애플리케이션

## 📋 프로젝트 소개

한글 명언/문장을 활용한 타자 연습 서비스입니다. 실시간 타자 속도(CPM) 측정, 정확도 계산, 다크모드 등의 기능을 제공합니다.

## ✨ 주요 기능

- 🎯 **타자 연습**: 1000개 이상의 한글 명언/문장
- 📊 **실시간 통계**: CPM(Characters Per Minute), 정확도, 완료 개수
- 🌓 **다크 모드**: 라이트/다크 테마 지원
- 🔤 **폰트 크기 조절**: 0.9rem ~ 3.0rem 범위 조절
- ⚙️ **결과 주기 설정**: 평균 통계 계산 주기 조절 (1-15개, 비활성화)
- 💾 **로컬 스토리지**: 사용자 설정 및 기록 저장

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 자동으로 열림

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `build/` 폴더에 생성됨

## 🛠️ 기술 스택

- React 18.3.1
- React Scripts 5.0.1
- JavaScript (ES6+)
- CSS3
- Font Awesome 6.4.0

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── AppDiv/              # 메인 컨테이너 & 배경
│   ├── Head/                # 헤더 영역
│   │   ├── title/           # 타이틀
│   │   └── themeButton/     # 다크모드 토글
│   ├── FontSizeSlider/      # 폰트 크기 조절 슬라이더
│   ├── Info/                # 통계 정보 영역
│   │   ├── Cpms/            # 현재/최고 CPM 표시
│   │   ├── AverageScores/   # 평균 CPM, 정확도, 카운트
│   │   ├── ResultPeriod/    # 결과 주기 선택기
│   │   └── ToggleDisplayCpm/ # 실시간 CPM 토글
│   ├── Quote/               # 타이핑 영역
│   │   ├── Author/          # 작가명 표시
│   │   ├── Sentence/        # 문장 표시 (회색 텍스트)
│   │   ├── InputDisplay/    # 입력 결과 표시 (정확/오류)
│   │   └── Input/           # 투명 textarea (실제 입력)
│   ├── AverageScorePopUp/   # 결과 팝업 (ESC로 닫기)
│   └── Contact/             # 하단 연락처 링크
├── Context/
│   └── SettingContext.jsx   # 전역 상태 관리 (Context API)
├── const/
│   └── config.const.js      # localStorage 키 상수
├── utils/
│   └── sentences.js         # 300+ 한글 문장 데이터
├── App.js                   # 메인 앱 컴포넌트
└── index.js                 # React 엔트리 포인트
```

## 🎮 사용 방법

1. **타이핑**: 화면에 표시된 문장을 입력창에 타이핑
2. **제출**: 문장 완료 후 `Enter` 키로 다음 문장
3. **통계**: 상단에서 실시간 CPM, 정확도, 완료 개수 확인
4. **설정**:
    - 왼쪽 상단: 폰트 크기 슬라이더
    - 오른쪽 상단: 다크모드 토글
    - 통계 영역 우측: 결과 주기 조절 (↓ 5 ↑)

## 💾 LocalStorage 키

- `Typing-Practice-darkMode`: 다크모드 설정 (boolean)
- `Typing-Practice-displayCurrentCpm`: 실시간 CPM 표시 여부 (boolean)
- `Typing-Practice-resultPeriod`: 결과 주기 (1-10)
- `Typing-Practice-fontSize`: 폰트 크기 (0.8-3.5)

## 🎨 주요 디자인 특징

- **3레이어 입력 구조**:
    1. 회색 문장 표시 (Sentence)
    2. 입력된 텍스트 색상 표시 (InputDisplay)
    3. 투명 textarea (Input)

- **색상 테마**:
    - 라이트: `#fafafa` 배경
    - 다크: `#0f0f0f` 배경
    - 정확: `#333` (라이트), `#ffffff` (다크)
    - 오류: `#dc2626`
    - 캐럿: `#6d28d9` (라이트), `#8b5cf6` (다크)

## 🐛 해결된 이슈

- ✅ 한글 IME 조합 중 엔터키 처리 (`isComposing` 체크)
- ✅ textarea 높이 자동 조절 (`useEffect` + `scrollHeight`)
- ✅ localStorage key 관리 일관성 (상수화)

## 🔧 향후 계획

- [ ] 사용자 로그인/회원가입
- [ ] 문장 업로드 기능
- [ ] 통계 페이지 (그래프, 기록 추이)
- [ ] 내 문장 관리
- [ ] 타이핑 랭킹 시스템

## 📝 라이선스

MIT License

## 👨‍💻 개발자

HongnamKim

---
