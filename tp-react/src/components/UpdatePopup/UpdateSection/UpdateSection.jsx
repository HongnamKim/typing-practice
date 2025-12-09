import {useContext} from "react";
import {ThemeContext} from "../../../Context/ThemeContext";
import "./UpdateSection.css";

const UpdateSection = ({update}) => {
    const {isDark} = useContext(ThemeContext);

    return (
        <>
            {update.features && update.features.length > 0 && (
                <div className="update-popup-section">
                    <div className={`update-popup-section-title ${isDark ? "dark" : ""}`}>
                        ✨ 새로운 기능
                    </div>
                    <ul className="update-popup-list">
                        {update.features.map((feature, index) => (
                            <li key={index} className={isDark ? "dark" : ""}>{feature}</li>
                        ))}
                    </ul>
                </div>
            )}
            {update.improvements && update.improvements.length > 0 && (
                <div className="update-popup-section">
                    <div className={`update-popup-section-title ${isDark ? "dark" : ""}`}>
                        🔧 개선사항
                    </div>
                    <ul className="update-popup-list">
                        {update.improvements.map((improvement, index) => (
                            <li key={index} className={isDark ? "dark" : ""}>{improvement}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default UpdateSection;
