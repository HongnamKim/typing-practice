import "./AppDiv.css";
import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

const AppDiv = ({ children }) => {
  const { isDark } = useContext(ThemeContext);
  return <div className={`background ${isDark ? "dark" : ""}`}>{children}</div>;
};

export default AppDiv;
