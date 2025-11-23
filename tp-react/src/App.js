import "./App.css";

import { ThemeContextProvider } from "./Context/ThemeContext";
import Head from "./components/Head/Head";
import AppDiv from "./components/AppDiv/AppDiv";
import Info from "./components/Info/Info";
import { SettingContextProvider } from "./Context/SettingContext";
import { ScoreContextProvider } from "./Context/ScoreContext";
import Quote from "./components/Quote/Quote";
import Contact from "./components/Contact/Contact";
import { QuoteContextProvider } from "./Context/QuoteContext";
import AverageScorePopUp from "./components/AverageScorePopUp/AverageScorePopUp";
import FontSizeSlider from "./components/FontSizeSlider/FontSizeSlider";

function App() {
  return (
    <ThemeContextProvider>
      <AppDiv>
        <Head />
        <SettingContextProvider>
          <FontSizeSlider />
          <ScoreContextProvider>
            <AverageScorePopUp />
            <Info />
            <QuoteContextProvider>
              <Quote />
            </QuoteContextProvider>
          </ScoreContextProvider>
        </SettingContextProvider>
        <Contact />
      </AppDiv>
    </ThemeContextProvider>
  );
}

export default App;

// import React, { useState, useEffect, useRef } from 'react';
// import { Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';
// import './App.css';
//
// // ============ 상수 ============
// const STORAGE_KEYS = {
//   DARK_MODE: 'Typing-Practice-darkMode',
//   CURRENT_CPM: 'Typing-Practice-currentCpm',
//   RESULT_PERIOD: 'Typing-Practice-resultPeriod',
// };
//
// const RESULT_PERIODS = [5, 10, 15, Infinity];
//
// const CHAR_STATUS = {
//   NONE: 'none',
//   CORRECT: 'correct',
//   INCORRECT: 'incorrect',
// };
//
// const KOREAN_CHARS = {
//   START: 44032,
//   END: 55203,
//   FIRST: ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"],
//   MID: ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"],
//   LAST: ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"],
// };
//
// const COMPLEX_VOWELS = {
//   9: ["ㅗ", "ㅏ"], 10: ["ㅗ", "ㅐ"], 11: ["ㅗ", "ㅣ"],
//   14: ["ㅜ", "ㅓ"], 15: ["ㅜ", "ㅔ"], 16: ["ㅜ", "ㅣ"], 19: ["ㅡ", "ㅣ"],
// };
//
// const DOUBLE_CONSONANTS = {
//   3: ["ㄱ", "ㅅ"], 5: ["ㄴ", "ㅈ"], 6: ["ㄴ", "ㅎ"],
//   9: ["ㄹ", "ㄱ"], 10: ["ㄹ", "ㅁ"], 11: ["ㄹ", "ㅂ"],
//   12: ["ㄹ", "ㅅ"], 13: ["ㄹ", "ㅌ"], 14: ["ㄹ", "ㅍ"],
//   15: ["ㄹ", "ㅎ"], 18: ["ㅂ", "ㅅ"],
// };
//
// const SENTENCES = [
//   { quote: "우리는 우물이 마르기 전까지 물의 중요성을 결코 알지 못한다.", author: "토마스 풀러", difficulty: "중" },
//   { quote: "큰 희망은 큰 사람을 만든다.", author: "토마스 풀러", difficulty: "중" },
//   { quote: "모든 일은 어려운 고비를 넘겨야 쉬워진다.", author: "토마스 풀러", difficulty: "중" },
//   { quote: "독서만큼 값이 싸면서도 오랫동안 즐거움을 누릴 수 있는 것은 없다.", author: "몽테뉴", difficulty: "중" },
//   { quote: "산은 모든 자연 풍경의 시작이요, 끝이다.", author: "명언", difficulty: "중" },
//   { quote: "자기 자신을 아는 것은 참된 진보이다.", author: "안데르센", difficulty: "중" },
//   { quote: "새 도랑 내지 말고 옛 도랑 메우지 말라.", author: "속담", difficulty: "중" },
//   { quote: "큰일은 언제나 사소한 데서 시작된다.", author: "노자(老子)", difficulty: "중" },
//   { quote: "폭풍이 지난 뒤에 고요가 온다.", author: "속담", difficulty: "중" },
//   { quote: "가장 높이 나는 갈매기가 가장 멀리 본다.", author: "갈매기의 꿈 中 - 리처드 바크", difficulty: "중" },
//   { quote: "나를 가장 잘 아는 자를 친구로 하고, 나를 가장 잘 모르는 자를 적으로 삼는다면 그보다 더 좋은 일은 없다.", author: "보 나르", difficulty: "상" },
// ];
//
// // ============ 유틸리티 함수들 ============
// const sum = (list) => list.reduce((acc, item) => acc + item, 0);
// const average = (list) => sum(list) / list.length;
// const max = (list) => Math.max(...list);
//
// const separateMidChar = (midIndex) => {
//   return COMPLEX_VOWELS[midIndex] || [KOREAN_CHARS.MID[midIndex]];
// };
//
// const separateLastChar = (lastIndex) => {
//   if (DOUBLE_CONSONANTS[lastIndex]) return DOUBLE_CONSONANTS[lastIndex];
//   return KOREAN_CHARS.LAST[lastIndex] ? [KOREAN_CHARS.LAST[lastIndex]] : [];
// };
//
// const koreanSeparator = (character) => {
//   const charCode = character.charCodeAt(0);
//
//   if (charCode < KOREAN_CHARS.START || charCode > KOREAN_CHARS.END) {
//     return [character];
//   }
//
//   const relativeCode = charCode - KOREAN_CHARS.START;
//   const firstIndex = Math.floor(relativeCode / 588);
//   const midIndex = Math.floor((relativeCode - firstIndex * 588) / 28);
//   const lastIndex = Math.floor(relativeCode % 28);
//
//   return [
//     KOREAN_CHARS.FIRST[firstIndex],
//     ...separateMidChar(midIndex),
//     ...separateLastChar(lastIndex)
//   ];
// };
//
// const calculateCpm = (text, elapsedSeconds) => {
//   const totalChars = text.split('').reduce((sum, char) => {
//     return sum + koreanSeparator(char).length;
//   }, 0);
//   return Math.round((totalChars * 60) / elapsedSeconds);
// };
//
// const getDifficultyLabel = (difficulty) => {
//   const map = { '상': 'Hard', '중': 'Normal', '하': 'Easy' };
//   return map[difficulty] || 'Normal';
// };
//
// const arraysEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);
//
// // ============ 컴포넌트: 결과 팝업 ============
// const ResultPopup = ({ show, onClose, data, isDarkMode }) => {
//   if (!show) return null;
//
//   return (
//       <>
//         <div className="popup-overlay" onClick={onClose} />
//         <div className={`popup-content ${isDarkMode ? 'dark' : ''}`}>
//           <h2 className="popup-title">Typing Practice</h2>
//           <div className="popup-stats">
//             <div className="stat-row">
//               <span>Avg CPM</span>
//               <span className="stat-value">{data.avgCpm}</span>
//             </div>
//             <div className="stat-row">
//               <span>Max CPM</span>
//               <span className="stat-value">{data.maxCpm}</span>
//             </div>
//             <div className="stat-row">
//               <span>ACC</span>
//               <span className="stat-value">{data.acc}%</span>
//             </div>
//           </div>
//           <p className="popup-footer">press ESC to continue</p>
//         </div>
//       </>
//   );
// };
//
// // ============ 메인 앱 컴포넌트 ============
// function App() {
//   // 다크모드 상태
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
//     if (saved === null) {
//       return window.matchMedia('(prefers-color-scheme: dark)').matches;
//     }
//     return saved === 'true';
//   });
//
//   // 설정 상태
//   const [showCurrentCpm, setShowCurrentCpm] = useState(() => {
//     const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_CPM);
//     return saved === null ? true : saved === 'true';
//   });
//
//   const [resultPeriodIndex, setResultPeriodIndex] = useState(() => {
//     const saved = localStorage.getItem(STORAGE_KEYS.RESULT_PERIOD);
//     return saved === null ? 0 : parseInt(saved);
//   });
//
//   // 문장 섞기 및 초기화
//   const [shuffledSentences] = useState(() =>
//       [...SENTENCES].sort(() => Math.random() - 0.5)
//   );
//   const [sentenceIndex, setSentenceIndex] = useState(0);
//
//   // 타이핑 상태
//   const [currentQuote, setCurrentQuote] = useState({ text: '', author: '', difficulty: '' });
//   const [userInput, setUserInput] = useState('');
//   const [quoteArray, setQuoteArray] = useState([]);
//   const [charStatus, setCharStatus] = useState([]);
//
//   // 통계 상태
//   const [currentCpm, setCurrentCpm] = useState(0);
//   const [lastCpm, setLastCpm] = useState(0);
//   const [maxCpm, setMaxCpm] = useState(0);
//   const [cpmList, setCpmList] = useState([]);
//   const [accList, setAccList] = useState([]);
//   const [typedQuoteCnt, setTypedQuoteCnt] = useState(0);
//   const [correctCount, setCorrectCount] = useState(0);
//   const [incorrectCount, setIncorrectCount] = useState(0);
//
//   // 팝업 상태
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupData, setPopupData] = useState({ avgCpm: 0, maxCpm: 0, acc: 0 });
//
//   // 타이머 관련
//   const [startTime, setStartTime] = useState(null);
//   const intervalRef = useRef(null);
//   const inputRef = useRef(null);
//
//   // 다크모드 저장
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode);
//   }, [isDarkMode]);
//
//   // 타이핑 상태 초기화
//   const resetTypingState = (textLength) => {
//     setUserInput('');
//     setStartTime(null);
//     setCorrectCount(0);
//     setIncorrectCount(0);
//     setCharStatus(new Array(textLength).fill(CHAR_STATUS.NONE));
//
//     if (inputRef.current) {
//       inputRef.current.style.height = 'auto';
//     }
//
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   };
//
//   // 새로운 문장 로드
//   const loadQuote = (direction = 0) => {
//     let newIndex = sentenceIndex;
//     if (direction > 0) newIndex++;
//     else if (direction < 0) newIndex--;
//
//     // 순환 처리
//     if (newIndex < 0) newIndex = shuffledSentences.length - 1;
//     if (newIndex >= shuffledSentences.length) newIndex = 0;
//
//     setSentenceIndex(newIndex);
//
//     const sentence = shuffledSentences[newIndex];
//     const difficulty = getDifficultyLabel(sentence.difficulty);
//
//     setCurrentQuote({ text: sentence.quote, author: sentence.author, difficulty });
//     setQuoteArray(sentence.quote.split('').map(char => koreanSeparator(char)));
//
//     resetTypingState(sentence.quote.length);
//
//     // direction이 1인 경우(자동 완료)만 lastCpm 유지, 그 외(ESC, 화살표)는 0으로 초기화
//     setCurrentCpm(direction === 1 ? lastCpm : 0);
//   };
//
//   // 초기 문장 로드
//   useEffect(() => {
//     loadQuote();
//   }, []);
//
//   // 실시간 CPM 업데이트
//   useEffect(() => {
//     if (startTime && showCurrentCpm && userInput.length > 0) {
//       intervalRef.current = setInterval(() => {
//         const elapsed = (Date.now() - startTime) / 1000;
//         setCurrentCpm(calculateCpm(userInput, elapsed));
//       }, 100);
//
//       return () => {
//         if (intervalRef.current) {
//           clearInterval(intervalRef.current);
//           intervalRef.current = null;
//         }
//       };
//     } else if (intervalRef.current && (!startTime || userInput.length === 0)) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   }, [startTime, userInput, showCurrentCpm]);
//
//   // 타이핑 완료 처리
//   const completeTyping = () => {
//     if (!startTime) return;
//
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//
//     const elapsed = (Date.now() - startTime) / 1000;
//     const finalCpm = calculateCpm(userInput, elapsed);
//
//     // 마지막 글자 검증
//     let finalCorrect = correctCount;
//     let finalIncorrect = incorrectCount;
//
//     const lastCharIndex = userInput.length - 1;
//     if (lastCharIndex >= 0 && charStatus[lastCharIndex] === CHAR_STATUS.NONE) {
//       const isCorrect = arraysEqual(
//           koreanSeparator(userInput[lastCharIndex]),
//           quoteArray[lastCharIndex]
//       );
//       isCorrect ? finalCorrect++ : finalIncorrect++;
//     }
//
//     const finalAcc = Math.round((finalCorrect / (finalCorrect + finalIncorrect)) * 100);
//
//     const newCpmList = [...cpmList, finalCpm];
//     const newAccList = [...accList, finalAcc];
//
//     setCpmList(newCpmList);
//     setAccList(newAccList);
//     setMaxCpm(Math.max(maxCpm, finalCpm));
//     setLastCpm(finalCpm);
//     setTypedQuoteCnt(prev => prev + 1);
//
//     // 결과 팝업 체크
//     if (resultPeriodIndex < RESULT_PERIODS.length - 1 &&
//         (typedQuoteCnt + 1) % RESULT_PERIODS[resultPeriodIndex] === 0) {
//       const period = RESULT_PERIODS[resultPeriodIndex];
//       const recentCpm = newCpmList.slice(-period);
//       const recentAcc = newAccList.slice(-period);
//
//       setPopupData({
//         avgCpm: Math.round(average(recentCpm)),
//         maxCpm: Math.round(max(recentCpm)),
//         acc: Math.round(average(recentAcc))
//       });
//       setShowPopup(true);
//     }
//
//     loadQuote(1);
//   };
//
//   // 글자 채점
//   const gradeCharacter = (userChar, quoteChars, currentStatus) => {
//     const userSeparated = koreanSeparator(userChar);
//
//     // 완성된 글자
//     if (userSeparated.length >= quoteChars.length) {
//       if (currentStatus === CHAR_STATUS.NONE) {
//         const isCorrect = arraysEqual(userSeparated, quoteChars);
//         return {
//           status: isCorrect ? CHAR_STATUS.CORRECT : CHAR_STATUS.INCORRECT,
//           shouldUpdateCount: true,
//           isCorrect
//         };
//       }
//     }
//     // 입력 중인 글자
//     else {
//       const hasError = userSeparated.some((char, i) => char !== quoteChars[i]);
//       if (hasError && currentStatus === CHAR_STATUS.NONE) {
//         return {
//           status: CHAR_STATUS.INCORRECT,
//           shouldUpdateCount: true,
//           isCorrect: false
//         };
//       }
//     }
//
//     return { status: currentStatus, shouldUpdateCount: false };
//   };
//
//   // 입력 처리
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setUserInput(value);
//
//     // textarea 높이 자동 조절
//     if (inputRef.current) {
//       inputRef.current.style.height = 'auto';
//       inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
//     }
//
//     // 첫 입력시 타이머 시작
//     if (!startTime && value.length > 0) {
//       setStartTime(Date.now());
//     }
//
//     // 입력이 비어있으면 초기화
//     if (value.length === 0) {
//       resetTypingState(currentQuote.text.length);
//       setCurrentCpm(0);
//       return;
//     }
//
//     // 채점 로직
//     const newStatus = [...charStatus];
//     const userChars = value.split('');
//     const lastCharIndex = userChars.length - 1;
//
//     let newCorrectCount = correctCount;
//     let newIncorrectCount = incorrectCount;
//
//     // 건너뛴 글자 처리
//     for (let i = 0; i < lastCharIndex; i++) {
//       if (newStatus[i] === CHAR_STATUS.NONE) {
//         newStatus[i] = CHAR_STATUS.INCORRECT;
//         newIncorrectCount++;
//       }
//     }
//
//     // 현재 입력 중인 글자 채점
//     if (lastCharIndex < currentQuote.text.length) {
//       const result = gradeCharacter(
//           userChars[lastCharIndex],
//           quoteArray[lastCharIndex],
//           newStatus[lastCharIndex]
//       );
//
//       newStatus[lastCharIndex] = result.status;
//       if (result.shouldUpdateCount) {
//         result.isCorrect ? newCorrectCount++ : newIncorrectCount++;
//       }
//     }
//
//     // 현재 입력 위치 이후는 모두 none
//     for (let i = lastCharIndex + 1; i < newStatus.length; i++) {
//       newStatus[i] = CHAR_STATUS.NONE;
//     }
//
//     setCharStatus(newStatus);
//     setCorrectCount(newCorrectCount);
//     setIncorrectCount(newIncorrectCount);
//
//     // 완료 체크
//     if (value.length > currentQuote.text.length) {
//       completeTyping();
//     }
//   };
//
//   // 키보드 이벤트
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       if (userInput.length >= currentQuote.text.length) {
//         completeTyping();
//       }
//       return;
//     }
//
//     if (e.key === 'Escape') {
//       showPopup ? setShowPopup(false) : loadQuote();
//     } else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
//       e.preventDefault();
//       loadQuote(-1);
//     } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
//       e.preventDefault();
//       loadQuote(1);
//     }
//   };
//
//   // 문자 색상 결정
//   const getCharClass = (index) => {
//     const status = charStatus[index];
//     if (status === CHAR_STATUS.NONE) return isDarkMode ? 'char-none-dark' : 'char-none-light';
//     if (status === CHAR_STATUS.CORRECT) return isDarkMode ? 'char-correct-dark' : 'char-correct-light';
//     return 'char-incorrect';
//   };
//
//   return (
//       <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
//         <ResultPopup
//             show={showPopup}
//             onClose={() => setShowPopup(false)}
//             data={popupData}
//             isDarkMode={isDarkMode}
//         />
//
//         {/* 헤더 */}
//         <div className="header">
//           <h1 className="title">Typing Practice</h1>
//           <button
//               onClick={() => setIsDarkMode(!isDarkMode)}
//               className="theme-button"
//           >
//             {isDarkMode ? <Moon size={32} /> : <Sun size={32} />}
//           </button>
//         </div>
//
//         {/* 상단 컨테이너 */}
//         <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
//           <div className="settings-row">
//             <label className="checkbox-label">
//               <input
//                   type="checkbox"
//                   checked={showCurrentCpm}
//                   onChange={(e) => {
//                     setShowCurrentCpm(e.target.checked);
//                     localStorage.setItem(STORAGE_KEYS.CURRENT_CPM, e.target.checked);
//                     if (!e.target.checked && startTime) {
//                       setCurrentCpm(lastCpm);
//                     }
//                   }}
//                   className="checkbox"
//               />
//               <span>실시간 타자 속도</span>
//             </label>
//
//             <div className="period-selector">
//               <button
//                   onClick={() => {
//                     const newIndex = resultPeriodIndex - 1 < 0
//                         ? RESULT_PERIODS.length - 1
//                         : resultPeriodIndex - 1;
//                     setResultPeriodIndex(newIndex);
//                     localStorage.setItem(STORAGE_KEYS.RESULT_PERIOD, newIndex);
//                   }}
//                   className="period-button"
//               >
//                 <ChevronDown size={20} />
//               </button>
//               <span className="period-value">
//               {resultPeriodIndex === RESULT_PERIODS.length - 1 ? '∞' : RESULT_PERIODS[resultPeriodIndex]}
//             </span>
//               <button
//                   onClick={() => {
//                     const newIndex = (resultPeriodIndex + 1) % RESULT_PERIODS.length;
//                     setResultPeriodIndex(newIndex);
//                     localStorage.setItem(STORAGE_KEYS.RESULT_PERIOD, newIndex);
//                   }}
//                   className="period-button"
//               >
//                 <ChevronUp size={20} />
//               </button>
//             </div>
//           </div>
//
//           <div className="stats-row">
//             <div>
//               <span>{showCurrentCpm ? 'Current CPM' : 'Last CPM'}</span>
//               <span className="stat-value-inline">{currentCpm}</span>
//             </div>
//             <div>
//               <span>Highest CPM</span>
//               <span className="stat-value-inline">{maxCpm}</span>
//             </div>
//           </div>
//         </div>
//
//         {/* 타이핑 정보 */}
//         <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
//           <div className="stats-row-around">
//             <div>
//               <span>CPM</span>
//               <span className="stat-value-inline">
//               {cpmList.length > 0 ? Math.round(average(cpmList)) : '-'}
//             </span>
//             </div>
//             <div>
//               <span>ACC</span>
//               <span className="stat-value-inline">
//               {accList.length > 0 ? Math.round(average(accList)) + '%' : '-'}
//             </span>
//             </div>
//             <div>
//               <span>CNT</span>
//               <span className="stat-value-inline">{typedQuoteCnt || '-'}</span>
//             </div>
//           </div>
//         </div>
//
//         {/* 문장 입력 영역 */}
//         <div className={`container typing-area ${isDarkMode ? 'dark' : 'light'}`}>
//           <div className="quote-meta">
//             <span className={isDarkMode ? 'meta-text-dark' : 'meta-text-light'}>{currentQuote.difficulty}</span>
//             <span className={isDarkMode ? 'meta-text-dark' : 'meta-text-light'}>-{currentQuote.author}-</span>
//           </div>
//
//           <div className="quote-text">
//             {currentQuote.text.split('').map((char, idx) => (
//                 <span key={idx} className={getCharClass(idx)}>{char}</span>
//             ))}
//           </div>
//
//           <textarea
//               ref={inputRef}
//               value={userInput}
//               onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//               onPaste={(e) => e.preventDefault()}
//               placeholder="위 문장을 입력하세요."
//               className={`input-textarea ${isDarkMode ? 'dark' : 'light'}`}
//               rows={1}
//               autoFocus
//           />
//         </div>
//
//         <div className="spacer" />
//
//         <a
//             href="https://open.kakao.com/o/sMHDrAog"
//             className={`contact-link ${isDarkMode ? 'dark' : 'light'}`}
//             target="_blank"
//             rel="noopener noreferrer"
//         >
//           Contact
//         </a>
//       </div>
//   );
// }
//
// export default App;
