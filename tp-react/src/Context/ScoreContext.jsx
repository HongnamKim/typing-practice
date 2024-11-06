import { createContext, useState } from "react";

export const ScoreContext = createContext();

const initResultScore = {
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
  const [resultScore, setResultScore] = useState(initResultScore);
  const [totalScore, setTotalScore] = useState(initTotalScore);

  return (
    <ScoreContext.Provider
      value={{
        currentCpm,
        setCurrentCpm,
        lastCpm,
        setLastCpm,
        resultScore,
        setResultScore,
        totalScore,
        setTotalScore,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};
