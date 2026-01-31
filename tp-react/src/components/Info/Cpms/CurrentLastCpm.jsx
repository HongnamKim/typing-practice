import { useContext } from "react";
import { useSetting } from "../../../Context/SettingContext";
import { ScoreContext } from "../../../Context/ScoreContext";
import { useTheme } from "../../../Context/ThemeContext";
import { Storage_Display_Cpm } from "../../../const/config.const";
import "./Cpms.css";

/**
 * 현재 or 마지막 타자 속도 디스플레이
 * 클릭하여 Current CPM / Last CPM 전환
 * 모든 점수 관리는 ScoreContext 에서 진행, 이 컴포넌트는 디스플레이만 집중
 * @return {JSX.Element}
 * @constructor
 */
const CurrentLastCpm = () => {
  const { displayCurrentCpm, setDisplayCurrentCpm } = useSetting();
  const { currentCpm, lastCpm } = useContext(ScoreContext);
  const { isDark } = useTheme();

  const handleToggle = () => {
    localStorage.setItem(Storage_Display_Cpm, (!displayCurrentCpm).toString());
    setDisplayCurrentCpm((prev) => !prev);
  };

  return (
    <div
      onClick={handleToggle}
      style={{ cursor: 'pointer', userSelect: 'none' }}
      title="Click to toggle between Current and Last CPM"
    >
      <span className={"speed-check"}>
        {displayCurrentCpm ? `Current CPM` : `Last CPM`}
      </span>
      {displayCurrentCpm ? (
        <span className={isDark ? "speed-check speed-check-num dark" : "speed-check speed-check-num"}>{currentCpm}</span>
      ) : (
        <span className={isDark ? "speed-check speed-check-num dark" : "speed-check speed-check-num"}>{lastCpm}</span>
      )}
    </div>
  );
};

export default CurrentLastCpm;
