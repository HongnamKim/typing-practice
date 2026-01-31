import "./Title.css";
import { useTheme } from "../../../Context/ThemeContext";

const Title = () => {
  const { isDark } = useTheme();
  return <h1 className={`title ${isDark ? "dark" : ""}`}>Typing Practice</h1>;
};

export default Title;
