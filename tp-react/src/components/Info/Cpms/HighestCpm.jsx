import { useScore } from "../../../Context/ScoreContext";
import { useTheme } from "../../../Context/ThemeContext";
import "./Cpms.css";

const HighestCpm = () => {
  const { totalScore } = useScore();
  const { isDark } = useTheme();

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
