import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../Context/ThemeContext";
import "./Title.css";

const Title = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  return (
    <h1 
      className={`title ${isDark ? "dark" : ""}`}
      onClick={() => navigate("/")}
    >
      Typing Practice
    </h1>
  );
};

export default Title;
