import { useContext } from "react";
import { SettingContext } from "../../../Context/SettingContext";

const ResultPeriod = () => {
  const { resultPeriod, setResultPeriod } = useContext(SettingContext);

  const handleResultPeriod = () => {
    setResultPeriod((prev) => prev + 1);
  };

  return (
    <>
      <span
        onClick={handleResultPeriod}
      >{`result period ${resultPeriod}`}</span>
    </>
  );
};

export default ResultPeriod;
