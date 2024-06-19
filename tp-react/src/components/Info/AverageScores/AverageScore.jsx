import { useContext, useEffect, useState } from "react";
import { ScoreContext } from "../../../Context/ScoreContext";

/**
 * 평균 점수 디스플레이
 * @param type totalScore 의 key 중 하나
 * @constructor
 */
const AverageScore = ({ type }) => {
  const { totalScore } = useContext(ScoreContext);
  const [avgScore, setAvgScore] = useState(() => {
    if (totalScore === "cpms") {
      return totalScore.cpms;
    } else if (totalScore === "accs") {
      return totalScore.accs;
    } else {
      return totalScore.cnt;
    }
  });

  // count 바뀔 때마다 평균 값 계산
  useEffect(() => {}, [totalScore.cnt]);

  return (
    <span>{`${type.toUpperCase().slice(0, 3)} ${avgScore === 0 ? "-" : avgScore} `}</span>
  );
};

export default AverageScore;
