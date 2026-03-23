import React from "react";
import {useTheme} from "@/Context/ThemeContext.tsx";
import "./ThemeButton.css";
import {FaRegMoon, FaRegSun} from "react-icons/fa";
import {Storage_Dark_Mode} from "@/const/config.const.ts";

const DarkModeButton = () => {
    const {isDark, setIsDark} = useTheme();

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
