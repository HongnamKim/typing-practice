import { useContext } from "react";
import { ScoreContext } from "../../../Context/ScoreContext";
import { ThemeContext } from "../../../Context/ThemeContext";
import "./Cpms.css";

const HighestCpm = () => {
  const { totalScore } = useContext(ScoreContext);
  const { isDark } = useContext(ThemeContext);

  return (
    <div>
      <span className={"speed-check"}>Highest CPM</span>
      <span className={isDark ? "speed-check speed-check-num dark" : "speed-check speed-check-num"}>
        {totalScore.highestCpm}
      </span>
    </div>
  );
};

export default HighestCpm;
