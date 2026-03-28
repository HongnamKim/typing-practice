import {Storage_Result_Period} from "@/const/config.const.ts";
import {FaChevronDown, FaChevronUp} from "react-icons/fa6";
import "./ResultPeriod.css";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {resultPeriodDisplaySet, useSetting} from "@/Context/SettingContext.tsx";


const ResultPeriod = () => {
    const {isDark} = useTheme();
    const {resultPeriod, setResultPeriod} = useSetting();

    const handleResultPeriod = (event) => {
        const length = resultPeriodDisplaySet.length;
        let newPeriod;

        if (event.currentTarget.id === "result-period-up") {
            newPeriod = (resultPeriod + 1) % length;
        } else {
            newPeriod = (resultPeriod - 1 + length) % length;
        }

        setResultPeriod(newPeriod);
        localStorage.setItem(Storage_Result_Period, newPeriod.toString());
    };

    return (
        <div className={"result-period-container"}>
            {/*감소 버튼*/}
            <button
                onClick={handleResultPeriod}
                id={"result-period-down"}
                className={isDark ? "result-period-button dark" : "result-period-button"}
            >
                <FaChevronDown
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
                className={isDark ? "result-period-button dark" : "result-period-button"}
            >
                <FaChevronUp
                    className={isDark ? "result-period-dark" : ""}
                />
            </button>
        </div>
    );
};

export default ResultPeriod;
