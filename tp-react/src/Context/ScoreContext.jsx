import { createContext, useState } from "react";

export const ScoreContext = createContext();

const initResultScore = {
  totalCpm: 0,
  totalAcc: 0,
  cnt: 0,
};

const initTotalScore = {
  highestCpm: 0,
  cpms: 0,
  accs: 0,
  cnt: 0,
};

export const ScoreContextProvider = ({ children }) => {
  const [speedCheck, setSpeedCheck] = useState(true);
  const [currentCpm, setCurrentCpm] = useState(0);
  const [lastCpm, setLastCpm] = useState(0);
  const [resultScore, setResultScore] = useState(initResultScore);
  const [totalScore, setTotalScore] = useState(initTotalScore);
  const [inputCheck, setInputCheck] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  return (
    <ScoreContext.Provider
      value={{
        // 타자 속도 계산 여부
        speedCheck,
        setSpeedCheck,

        // 현재 타자 속도
        currentCpm,
        setCurrentCpm,

        // 직전 타자 속도
        lastCpm,
        setLastCpm,

        // 결과창 점수
        resultScore,
        setResultScore,

        // 전체 점수 모음
        totalScore,
        setTotalScore,

        // 문장 내 글자별 정답 체크
        inputCheck,
        setInputCheck,

        // 문장 내 정답, 오답 개수
        correctCount,
        setCorrectCount,
        incorrectCount,
        setIncorrectCount,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};
