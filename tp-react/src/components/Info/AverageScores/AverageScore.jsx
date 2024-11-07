import { useContext, useEffect, useState } from "react";
import { ScoreContext } from "../../../Context/ScoreContext";
import "./AverageScore.css";

/**
 * 전체 평균 점수 디스플레이
 * @param type totalScore 의 key 중 하나 (cpms, accs, cnt)
 * @constructor
 */
const AverageScore = ({ type }) => {
  const { totalScore } = useContext(ScoreContext);
  const [avgScore, setAvgScore] = useState(0);

  totalScore.cpms.reduce((total, curr) => total + curr, 0);

  // count 바뀔 때마다 평균 값 계산
  useEffect(() => {
    if (type === "cnt") {
      setAvgScore(totalScore.cnt);
      return;
    }
    setAvgScore(() => {
      if (totalScore.cnt === 0) {
        return 0;
      }
      return Math.round(
        totalScore[type].reduce((prev, curr) => prev + curr, 0) /
          totalScore.cnt,
      );
    });
  }, [totalScore]);

  return (
    <div className={"average-info"}>
      <span className={"average-info-title"}>
        {type.toUpperCase().slice(0, 3)}
      </span>
      <span className={"average-info-num"}>
        {avgScore === 0 ? "-" : avgScore}
      </span>
    </div>
  );
};

export default AverageScore;
