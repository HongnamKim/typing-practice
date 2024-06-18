import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import "./Info.css";
import ToggleCurrentCpm from "./ToggleCurrentCpm/ToggleCurrentCpm";
import ResultPeriod from "./ResultPeriod/ResultPeriod";

const Info = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className={isDark ? "info-background info-dark" : "info-background"}>
      <div className={"info-settings"}>
        <ToggleCurrentCpm />
        <ResultPeriod />
      </div>
      <div className={"info-CPMs"}>
        <span>Current CPM</span>
        <span>Highest CPM</span>
      </div>
      <div className={"info-averages"}>
        <span>CPM</span>
        <span>ACC</span>
        <span>CNT</span>
      </div>
    </div>
  );
};

export default Info;
