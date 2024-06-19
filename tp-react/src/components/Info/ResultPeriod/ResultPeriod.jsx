import { useContext } from "react";
import {
  resultPeriodSet,
  SettingContext,
} from "../../../Context/SettingContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import "./ResultPeriod.css";
import { ThemeContext } from "../../../Context/ThemeContext";

const ResultPeriod = () => {
  const { isDark } = useContext(ThemeContext);
  const { resultPeriod, setResultPeriod } = useContext(SettingContext);

  const handleResultPeriod = (event) => {
    if (event.target.id === "result-period-up") {
      setResultPeriod((prev) => {
        return (prev + 1) % 4;
      });
    } else {
      setResultPeriod((prev) => {
        if (prev === 0) return (prev += 3);
        return prev - 1;
      });
    }
  };

  return (
    <div className={"result-period-container"}>
      <button
        onClick={handleResultPeriod}
        id={"result-period-down"}
        className={"result-period-button"}
      >
        <FaChevronDown
          id={"result-period-down"}
          className={isDark ? "result-period-dark" : ""}
        />
      </button>
      <span
        className={
          isDark
            ? "result-period-text result-period-dark"
            : "result-period-text"
        }
      >
        {resultPeriod === 3 ? "∞" : resultPeriodSet[resultPeriod]}
      </span>
      <button
        onClick={handleResultPeriod}
        id={"result-period-up"}
        className={"result-period-button"}
      >
        <FaChevronUp
          id={"result-period-up"}
          className={isDark ? "result-period-dark" : ""}
        />
      </button>
    </div>
  );
};

export default ResultPeriod;
