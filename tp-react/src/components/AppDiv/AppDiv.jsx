import "./AppDiv.css";
import { useTheme } from "../../Context/ThemeContext";
import { useLocation } from "react-router-dom";

const AppDiv = ({ children }) => {
  const { isDark } = useTheme();
  const location = useLocation();
  
  // 상단 여백이 필요 없는 페이지
  const isCompactPage = location.pathname.startsWith('/quote/') || location.pathname === '/stats';
  
  return (
    <div className={`background ${isDark ? "dark" : ""} ${isCompactPage ? "compact" : ""}`}>
      {children}
    </div>
  );
};

export default AppDiv;
