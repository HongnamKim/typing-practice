import { useContext } from "react";
import { ScoreContext } from "../Context/ScoreContext";

export const useResetScore = () => {
  const { setCurrentCpm, setInputCheck, setCorrectCount, setIncorrectCount } =
    useContext(ScoreContext);

  return () => {
    setCurrentCpm(0);
    setInputCheck((prev) => prev.map(() => "none"));
    setCorrectCount(0);
    setIncorrectCount(0);
  };
};
