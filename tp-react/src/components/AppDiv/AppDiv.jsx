import "./AppDiv.css";
import { useTheme } from "../../Context/ThemeContext";

const AppDiv = ({ children }) => {
  const { isDark } = useTheme();
  return <div className={`background ${isDark ? "dark" : ""}`}>{children}</div>;
};

export default AppDiv;
