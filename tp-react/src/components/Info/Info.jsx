import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import "./Info.css";
import ResultPeriod from "./ResultPeriod/ResultPeriod";
import CurrentLastCpm from "./Cpms/CurrentLastCpm";
import HighestCpm from "./Cpms/HighestCpm";
import AverageScore from "./AverageScores/AverageScore";
import { ScoreContext } from "../../Context/ScoreContext";

const Info = () => {
  const { isDark } = useContext(ThemeContext);
  const { totalScore } = useContext(ScoreContext);

  return (
    <div className={isDark ? "info-background info-dark" : "info-background"}>
      <div className={isDark ? "info-settings dark" : "info-settings"}>
        <ResultPeriod />
      </div>
      <div className={isDark ? "info-CPMs dark" : "info-CPMs"}>
        <CurrentLastCpm />
        <HighestCpm />
      </div>
      <div className={isDark ? "info-averages dark" : "info-averages"}>
        {Object.keys(totalScore).map(
          (value, index) =>
            value !== "highestCpm" && <AverageScore type={value} key={index} />,
        )}
      </div>
    </div>
  );
};

export default Info;
