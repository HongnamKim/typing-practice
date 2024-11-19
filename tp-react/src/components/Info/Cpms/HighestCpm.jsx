import { useContext } from "react";
import { ScoreContext } from "../../../Context/ScoreContext";
import "./Cpms.css";

const HighestCpm = () => {
  const { totalScore } = useContext(ScoreContext);

  return (
    <div>
      <span className={"speed-check"}>Highest CPM</span>
      <span className={"speed-check speed-check-num"}>
        {totalScore.highestCpm}
      </span>
    </div>
  );
};

export default HighestCpm;
