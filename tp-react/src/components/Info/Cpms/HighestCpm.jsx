import { useContext, useEffect, useState } from "react";
import { ScoreContext } from "../../../Context/ScoreContext";

const HighestCpm = () => {
  const { totalScore } = useContext(ScoreContext);
  const [highestCpm, setHighestCpm] = useState(0);

  useEffect(() => {
    if (totalScore.cnt < 1) {
      setHighestCpm(0);
      return;
    }
    setHighestCpm(() => Math.max(...totalScore.cpms));
  }, [totalScore.cnt]);

  return (
    <div>
      <span>Highest CPM</span>
      <span>{highestCpm === 0 ? "-" : highestCpm}</span>
    </div>
  );
};

export default HighestCpm;
