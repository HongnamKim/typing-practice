import { createContext, useEffect, useState } from "react";
import { Storage_Dark_Mode } from "../utils/ConfigConstant";

export const ThemeContext = createContext();
export const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(null);

  useEffect(() => {
    if (localStorage.getItem(Storage_Dark_Mode) === "true") {
      setIsDark(true);
      return;
    } else if (localStorage.getItem(Storage_Dark_Mode) === "false") {
      setIsDark(false);
      return;
    }
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      // 다크모드 지원 브라우저 + 다크모드 세팅
      setIsDark(true);
      localStorage.setItem(Storage_Dark_Mode, "true");
    } else {
      // 다크모드 지원 X 또는 다크모드 세팅 X
      setIsDark(false);
      localStorage.setItem(Storage_Dark_Mode, "false");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
