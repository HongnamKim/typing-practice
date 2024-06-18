import { useContext } from "react";
import { SettingContext } from "../../../Context/SettingContext";
import { Storage_Current_Cpm } from "../../../utils/ConfigConstant";
import { ThemeContext } from "../../../Context/ThemeContext";
import "./ToggleCurrentCpm.css";

const ToggleCurrentCpm = () => {
  const { currentCPM, setCurrentCPM } = useContext(SettingContext);
  const { isDark } = useContext(ThemeContext);

  const handleCurrentCPM = () => {
    localStorage.setItem(Storage_Current_Cpm, (!currentCPM).toString());
    setCurrentCPM((prev) => !prev);
  };

  return (
    <div className={"currentCPM-container"}>
      <input
        type={"checkbox"}
        onChange={handleCurrentCPM}
        id="currentCPM"
        checked={!!currentCPM}
      />
      <label
        htmlFor={"currentCPM"}
        className={isDark ? "toggle-current-cpm-dark" : ""}
      >
        실시간 타자 속도
      </label>
    </div>
  );
};

export default ToggleCurrentCpm;
