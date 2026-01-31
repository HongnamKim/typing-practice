import {useSetting} from "../../Context/SettingContext";
import {Storage_Compact_Mode} from "../../const/config.const";
import "./ModeToggle.css";

const ModeToggle = () => {
    const {isCompactMode, setIsCompactMode} = useSetting();

    const handleModeToggle = () => {
        const newMode = !isCompactMode;
        setIsCompactMode(newMode);
        localStorage.setItem(Storage_Compact_Mode, newMode.toString());
    };

    return (
        <div className="mode-toggle-container">
      <span
          className="mode-toggle-label"
          onClick={handleModeToggle}
      >
        Compact
      </span>
            <div
                className={`mode-toggle ${isCompactMode ? "active" : ""}`}
                onClick={handleModeToggle}
            >
                <div className="mode-toggle-knob"></div>
            </div>
        </div>
    );
};

export default ModeToggle;
