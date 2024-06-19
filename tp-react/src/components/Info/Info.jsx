import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import "./Info.css";
import ToggleDisplayCpm from "./ToggleDisplayCpm/ToggleDisplayCpm";
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
      <div className={"info-settings"}>
        <ToggleDisplayCpm />
        <ResultPeriod />
      </div>
      <div className={"info-CPMs"}>
        <CurrentLastCpm />
        <HighestCpm />
      </div>
      <div className={"info-averages"}>
        {Object.keys(totalScore).map((value, index) => (
          <AverageScore type={value} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Info;
