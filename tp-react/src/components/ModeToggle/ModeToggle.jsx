import {useTheme} from "../../Context/ThemeContext";
import {useSetting} from "../../Context/SettingContext";
import {Storage_Compact_Mode} from "../../const/config.const";
import "./ModeToggle.css";

const ModeToggle = () => {
    const {isDark} = useTheme();
    const {isCompactMode, setIsCompactMode} = useSetting();

    const handleModeToggle = () => {
        const newMode = !isCompactMode;
        setIsCompactMode(newMode);
        localStorage.setItem(Storage_Compact_Mode, newMode.toString());
    };

    return (
        <div className="mode-toggle-container">
      <span
          className={isDark ? "mode-toggle-label dark" : "mode-toggle-label"}
          onClick={handleModeToggle}
      >
        Compact
      </span>
            <div
                className={`mode-toggle ${isCompactMode ? "active" : ""} ${isDark ? "dark" : ""}`}
                onClick={handleModeToggle}
            >
                <div className="mode-toggle-knob"></div>
            </div>
        </div>
    );
};

export default ModeToggle;
