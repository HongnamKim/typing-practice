import { useContext } from "react";
import { SettingContext } from "../../../Context/SettingContext";
import { Storage_Display_Cpm } from "../../../const/config.const";
import { ThemeContext } from "../../../Context/ThemeContext";
import "./ToggleDisplayCpm.css";

const ToggleDisplayCpm = () => {
  const { displayCurrentCpm, setDisplayCurrentCpm } =
    useContext(SettingContext);
  const { isDark } = useContext(ThemeContext);

  const handleCurrentCPM = () => {
    localStorage.setItem(Storage_Display_Cpm, (!displayCurrentCpm).toString());
    setDisplayCurrentCpm((prev) => !prev);
  };

  return (
    <div className={"currentCPM-container"}>
      <input
        type={"checkbox"}
        onChange={handleCurrentCPM}
        id="currentCPM"
        checked={!!displayCurrentCpm}
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
