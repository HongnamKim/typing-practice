import { useContext } from "react";
import { SettingContext } from "../../../Context/SettingContext";
import { Storage_Display_Cpm } from "../../../utils/ConfigConstant";
import { ThemeContext } from "../../../Context/ThemeContext";
import "./ToggleDisplayCpm.css";

const ToggleDisplayCpm = () => {
  const { displayCpm, setDisplayCpm } = useContext(SettingContext);
  const { isDark } = useContext(ThemeContext);

  const handleCurrentCPM = () => {
    localStorage.setItem(
      Storage_Display_Cpm,
      displayCpm === "current" ? "last" : "current",
    );
    setDisplayCpm((prev) => (prev === "current" ? "last" : "current"));
  };

  return (
    <div className={"currentCPM-container"}>
      <input
        type={"checkbox"}
        onChange={handleCurrentCPM}
        id="currentCPM"
        checked={displayCpm === "current"}
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

export default ToggleDisplayCpm;
