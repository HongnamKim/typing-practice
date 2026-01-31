import { useContext, useState } from "react";
import { useTheme } from "../../Context/ThemeContext";
import "./Info.css";
import ResultPeriod from "./ResultPeriod/ResultPeriod";
import CurrentLastCpm from "./Cpms/CurrentLastCpm";
import HighestCpm from "./Cpms/HighestCpm";
import AverageScore from "./AverageScores/AverageScore";
import { ScoreContext } from "../../Context/ScoreContext";
import { Storage_Averages_Visible } from "../../const/config.const";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

const Info = () => {
  const { isDark } = useTheme();
  const { totalScore } = useContext(ScoreContext);

  const [averagesVisible, setAveragesVisible] = useState(() => {
    return localStorage.getItem(Storage_Averages_Visible) !== "false";
  });

  const toggleAverages = () => {
    const newValue = !averagesVisible;
    setAveragesVisible(newValue);
    localStorage.setItem(Storage_Averages_Visible, newValue);
  };

  const getAveragesClassName = () => {
    let className = "info-averages";
    if (isDark) className += " dark";
    if (!averagesVisible) className += " collapsed";
    return className;
  };

  return (
    <div className={isDark ? "info-background info-dark" : "info-background"}>
      <div className={isDark ? "info-settings dark" : "info-settings"}>
        <ResultPeriod />
      </div>
      <div className={isDark ? "info-CPMs dark" : "info-CPMs"}>
        <CurrentLastCpm />
        <HighestCpm />
      </div>
      <div className={getAveragesClassName()}>
        {Object.keys(totalScore).map(
          (value, index) =>
            value !== "highestCpm" && <AverageScore type={value} key={index} />,
        )}
      </div>
      <div className="averages-toggle-container">
        <button
          className={isDark ? "averages-toggle-btn dark" : "averages-toggle-btn"}
          onClick={toggleAverages}
        >
          {averagesVisible ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
    </div>
  );
};

export default Info;
