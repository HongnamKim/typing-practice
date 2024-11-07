import { useContext, useEffect, useState } from "react";
import { ScoreContext } from "../../../Context/ScoreContext";
import "./Cpms.css";

const HighestCpm = () => {
  const { totalScore } = useContext(ScoreContext);
  const [highestCpm, setHighestCpm] = useState(0);

  useEffect(() => {
    if (totalScore.cnt < 1) {
      setHighestCpm(0);
      return;
    }

    if (totalScore.cpms.length === 0) {
      return;
    }

    setHighestCpm(() => Math.max(...totalScore.cpms));
  }, [totalScore.cnt]);

  return (
    <div>
      <span className={"speed-check"}>Highest CPM</span>
      <span className={"speed-check speed-check-num"}>{highestCpm}</span>
    </div>
  );
};

export default HighestCpm;
