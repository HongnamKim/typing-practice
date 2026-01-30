import "./Title.css";
import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

const Title = () => {
  const { isDark } = useContext(ThemeContext);
  return <h1 className={`title ${isDark ? "dark" : ""}`}>Typing Practice</h1>;
};

export default Title;
