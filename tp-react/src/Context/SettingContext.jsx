import { createContext, useEffect, useState } from "react";
import {
  Storage_Display_Cpm,
  Storage_Result_Period,
} from "../utils/ConfigConstant";

export const SettingContext = createContext();

export const resultPeriodSet = [5, 10, 15, Infinity];

export const SettingContextProvider = ({ children }) => {
  const [displayCpm, setDisplayCpm] = useState(null);
  const [resultPeriod, setResultPeriod] = useState(null);

  useEffect(() => {
    setDisplayCpm(() => {
      if (localStorage.getItem(Storage_Display_Cpm)) {
        return localStorage.getItem(Storage_Display_Cpm);
      } else {
        return "current";
      }
    });

    setResultPeriod(() => {
      if (localStorage.getItem(Storage_Result_Period)) {
        return +localStorage.getItem(Storage_Result_Period);
      } else {
        return 0;
      }
    });
  }, []);

  return (
    <SettingContext.Provider
      value={{ displayCpm, setDisplayCpm, resultPeriod, setResultPeriod }}
    >
      {children}
    </SettingContext.Provider>
  );
};
