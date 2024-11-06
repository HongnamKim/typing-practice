import React, { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import "./ThemeButton.css";
import { FaRegSun, FaRegMoon } from "react-icons/fa";
import { Storage_Dark_Mode } from "../../../const/config.const";

const DarkModeButton = () => {
  const { isDark, setIsDark } = useContext(ThemeContext);

  const handleDarkMode = () => {
    localStorage.setItem(Storage_Dark_Mode, (!isDark).toString());
    setIsDark((prev) => !prev);
  };

  return isDark ? (
    <FaRegMoon
      onClick={handleDarkMode}
      className={"theme-icon theme-icon-dark"}
    />
  ) : (
    <FaRegSun
      onClick={handleDarkMode}
      className={"theme-icon theme-icon-light"}
    />
  );
};

export default DarkModeButton;
