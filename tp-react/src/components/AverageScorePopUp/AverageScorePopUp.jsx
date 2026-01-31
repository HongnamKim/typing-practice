import "./AverageScorePopUp.css";
import { useScore } from "../../Context/ScoreContext";
import { useTheme } from "../../Context/ThemeContext";

const AverageScorePopUp = () => {
  const { showPopup, setShowPopup, popupData } = useScore();
  const { isDark } = useTheme();

  if (!showPopup) {
    return null;
  }

  const handleBackgroundClick = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="popup-background" onClick={handleBackgroundClick} />
      <div className={`popup ${isDark ? "popup-dark" : ""}`}>
        <h1 className={`popup-title ${isDark ? "dark" : ""}`}>Typing Practice</h1>
        <div className={`popup-info ${isDark ? "dark" : ""}`}>
          <span>Avg CPM</span>
          <span className={`popup-value ${isDark ? "dark" : ""}`}>{popupData.avgCpm}</span>
        </div>
        <div className={`popup-info ${isDark ? "dark" : ""}`}>
          <span>Max CPM</span>
          <span className={`popup-value ${isDark ? "dark" : ""}`}>{popupData.maxCpm}</span>
        </div>
        <div className={`popup-info ${isDark ? "dark" : ""}`}>
          <span>ACC</span>
          <span className={`popup-value ${isDark ? "dark" : ""}`}>{popupData.acc}%</span>
        </div>
        <div className={`popup-close ${isDark ? "dark" : ""}`}>
          <span>press ESC to continue</span>
        </div>
      </div>
    </>
  );
};

export default AverageScorePopUp;
