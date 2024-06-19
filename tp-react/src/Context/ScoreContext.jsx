import { createContext, useState } from "react";

export const ScoreContext = createContext();

const initAverageScore = {
  avgCpm: 0,
  avgAcc: 0,
  cnt: 0,
};

const initTotalScore = {
  cpms: [],
  accs: [],
  cnt: 0,
};

export const ScoreContextProvider = ({ children }) => {
  const [currentCpm, setCurrentCpm] = useState(0);
  const [lastCpm, setLastCpm] = useState(0);
  const [averageScore, setAverageScore] = useState(initAverageScore);
  const [totalScore, setTotalScore] = useState(initTotalScore);

  return (
    <ScoreContext.Provider
      value={{
        currentCpm,
        setCurrentCpm,
        lastCpm,
        setLastCpm,
        averageScore,
        setAverageScore,
        totalScore,
        setTotalScore,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};
