import { createContext, useContext, useEffect, useState } from "react";
import { Storage_Dark_Mode } from "../const/config.const";

export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(null);

  useEffect(() => {
    // 기존 다크모드 세팅이 있는 경우
    if (localStorage.getItem(Storage_Dark_Mode) === "true") {
      setIsDark(true);
      return;
    } else if (localStorage.getItem(Storage_Dark_Mode) === "false") {
      setIsDark(false);
      return;
    }

    // 기존 다크모드 세팅이 없는 경우 브라우저 세팅에 따라감
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      // 다크모드 지원 브라우저 + 다크모드 세팅
      setIsDark(true);
      localStorage.setItem(Storage_Dark_Mode, "true");
    } else {
      // 다크모드 지원 X 또는 라이트 모드 세팅
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
