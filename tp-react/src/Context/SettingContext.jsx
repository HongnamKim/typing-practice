import { createContext, useEffect, useState } from "react";
import {
  Storage_Current_Cpm,
  Storage_Result_Period,
} from "../utils/ConfigConstant";

export const SettingContext = createContext();

export const resultPeriodSet = [5, 10, 15, Infinity];

export const SettingContextProvider = ({ children }) => {
  const [currentCPM, setCurrentCPM] = useState(null);
  const [resultPeriod, setResultPeriod] = useState(null);

  useEffect(() => {
    setCurrentCPM(localStorage.getItem(Storage_Current_Cpm) === "true");
    setResultPeriod(+localStorage.getItem(Storage_Result_Period));
  }, []);

  return (
    <SettingContext.Provider
      value={{ currentCPM, setCurrentCPM, resultPeriod, setResultPeriod }}
    >
      {children}
    </SettingContext.Provider>
  );
};
