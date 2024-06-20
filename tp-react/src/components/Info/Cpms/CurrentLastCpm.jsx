import { useContext } from "react";
import { SettingContext } from "../../../Context/SettingContext";
import { ScoreContext } from "../../../Context/ScoreContext";
import "./Cpms.css";

/**
 * 현재 or 마지막 타자 속도 디스플레이
 * 모든 점수 관리는 ScoreContext 에서 진행, 이 컴포넌트는 디스플레이만 집중
 * @return {JSX.Element}
 * @constructor
 */
const CurrentLastCpm = () => {
  const { displayCpm } = useContext(SettingContext);
  const { currentCpm, lastCpm, averageScore } = useContext(ScoreContext);

  /*const [lastCpm, setLastCpm] = useState(0);

  useEffect(() => {
    if (displayCpm === "last") {
      if (totalScore.cnt < 1) {
        setLastCpm(0);
        return;
      }
      setLastCpm(totalScore.cpms[totalScore.cpms.length - 1]);
    }
    // display === 'current' 일 때
    // 실시간 타자 속도 계산은 input 관련 component 에서 계산
  }, [totalScore.cnt]);*/

  return (
    <div>
      <span className={"speed-check"}>
        {displayCpm === "current" ? `Current CPM` : `Last CPM`}
      </span>
      {displayCpm === "current" ? (
        <span className={"speed-check speed-check-num"}>{currentCpm}</span>
      ) : (
        <span className={"speed-check speed-check-num"}>{lastCpm}</span>
      )}
    </div>
  );
};

export default CurrentLastCpm;
