import "./UpdateSection.css";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {t} from "@/utils/i18n.ts";
import {localize} from "@/data/updateHistory.ts";

const UpdateSection = ({update}) => {
    const {isDark} = useTheme();

    return (
        <>
            {update.notices && update.notices.length > 0 && (
                <div className="update-popup-section">
                    <div className={`update-popup-section-title ${isDark ? "dark" : ""}`}>
                        {t('updateNotices')}
                    </div>
                    <ul className="update-popup-list">
                        {update.notices.map((item, index) => (
                            <li key={index} className={isDark ? "dark" : ""}>{localize(item)}</li>
                        ))}
                    </ul>
                </div>
            )}
            {update.features && update.features.length > 0 && (
                <div className="update-popup-section">
                    <div className={`update-popup-section-title ${isDark ? "dark" : ""}`}>
                        ✨ {t('updateFeatures')}
                    </div>
                    <ul className="update-popup-list">
                        {update.features.map((item, index) => (
                            <li key={index} className={isDark ? "dark" : ""}>{localize(item)}</li>
                        ))}
                    </ul>
                </div>
            )}
            {update.improvements && update.improvements.length > 0 && (
                <div className="update-popup-section">
                    <div className={`update-popup-section-title ${isDark ? "dark" : ""}`}>
                        🔧 {t('updateImprovements')}
                    </div>
                    <ul className="update-popup-list">
                        {update.improvements.map((item, index) => (
                            <li key={index} className={isDark ? "dark" : ""}>{localize(item)}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default UpdateSection;
