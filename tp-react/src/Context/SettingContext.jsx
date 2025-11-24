import { createContext, useEffect, useState } from "react";
import {
  Storage_Display_Cpm,
  Storage_Result_Period,
  Storage_Font_Size,
} from "../const/config.const";

export const SettingContext = createContext(null);

export const resultPeriodSet = [5, 10, 15, Infinity];
export const resultPeriodDisplaySet = ["5", "10", "15", "∞"];

export const SettingContextProvider = ({ children }) => {
  const [displayCurrentCpm, setDisplayCurrentCpm] = useState(null);
  const [resultPeriod, setResultPeriod] = useState(null);
  const [fontSize, setFontSize] = useState(2.0);

  useEffect(() => {
    // 실시간 타자 속도 설정 불러오기
    setDisplayCurrentCpm(() => {
      const beforeSetting = localStorage.getItem(Storage_Display_Cpm);

      if (beforeSetting) {
        return beforeSetting === "true";
      } else {
        // 기존 설정 없을 경우 true
        localStorage.setItem(Storage_Display_Cpm, "true");
        return true;
      }
    });

    // 결과 표시 주기 설정 불러오기
    setResultPeriod(() => {
      if (localStorage.getItem(Storage_Result_Period)) {
        return +localStorage.getItem(Storage_Result_Period);
      } else {
        // 기존 설정 없을 경우 0 (5회)
        localStorage.setItem(Storage_Result_Period, "0");
        return 0;
      }
    });

    // 폰트 크기 설정 불러오기
    setFontSize(() => {
      const savedFontSize = localStorage.getItem(Storage_Font_Size);
      if (savedFontSize) {
        return parseFloat(savedFontSize);
      } else {
        localStorage.setItem(Storage_Font_Size, "2.0");
        return 2.0;
      }
    });
  }, []);

  return (
    <SettingContext.Provider
      value={{
        displayCurrentCpm,
        setDisplayCurrentCpm,
        resultPeriod,
        setResultPeriod,
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};
