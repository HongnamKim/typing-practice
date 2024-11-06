import { useContext } from "react";
import { Storage_Result_Period } from "../../../utils/ConfigConstant";
import {
  resultPeriodDisplaySet,
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

      localStorage.setItem(
        Storage_Result_Period,
        ((resultPeriod + 1) % 4).toString(),
      );
    } else {
      setResultPeriod((prev) => {
        if (prev === 0) return (prev += 3);
        return prev - 1;
      });

      localStorage.setItem(
        Storage_Result_Period,
        ((resultPeriod - 1) % 4).toString(),
      );
    }
  };

  return (
    <div className={"result-period-container"}>
      {/*감소 버튼*/}
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
      {/*결과 주기 디스플레이*/}
      <span
        className={
          isDark
            ? "result-period-text result-period-dark"
            : "result-period-text"
        }
      >
        {resultPeriodDisplaySet[resultPeriod]}
      </span>
      {/*증가 버튼*/}
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
