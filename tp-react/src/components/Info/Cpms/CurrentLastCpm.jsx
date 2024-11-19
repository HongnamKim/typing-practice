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
  const { displayCurrentCpm } = useContext(SettingContext);
  const { currentCpm, lastCpm } = useContext(ScoreContext);

  return (
    <div>
      <span className={"speed-check"}>
        {displayCurrentCpm ? `Current CPM` : `Last CPM`}
      </span>
      {displayCurrentCpm ? (
        <span className={"speed-check speed-check-num"}>{currentCpm}</span>
      ) : (
        <span className={"speed-check speed-check-num"}>{lastCpm}</span>
      )}
    </div>
  );
};

export default CurrentLastCpm;
