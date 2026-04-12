import "./UpdateSection.css";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {t} from "@/utils/i18n.ts";
import {localize} from "@/data/updateHistory.ts";
import {MdAutoAwesome, MdTune, MdCampaign} from 'react-icons/md';

const UpdateSection = ({update}) => {
    const {isDark} = useTheme();

    return (
        <>
            {update.notices && update.notices.length > 0 && (
                <div className="update-popup-section">
                    <div className="update-popup-section-header">
                        <MdCampaign className="update-popup-section-icon primary"/>
                        <div className={`update-popup-section-title ${isDark ? "dark" : ""}`}>
                            {t('updateNotices')}
                        </div>
                    </div>
                    <ul className="update-popup-list">
                        {update.notices.map((item, index) => (
                            <li key={index} className={isDark ? "dark" : ""}>
                                <span className="update-popup-bullet primary"/>
                                <span>{localize(item)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {update.features && update.features.length > 0 && (
                <div className="update-popup-section">
                    <div className="update-popup-section-header">
                        <MdAutoAwesome className="update-popup-section-icon primary"/>
                        <div className={`update-popup-section-title ${isDark ? "dark" : ""}`}>
                            {t('updateFeatures')}
                        </div>
                    </div>
                    <ul className="update-popup-list">
                        {update.features.map((item, index) => (
                            <li key={index} className={isDark ? "dark" : ""}>
                                <span className="update-popup-bullet primary"/>
                                <span>{localize(item)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {update.improvements && update.improvements.length > 0 && (
                <div className="update-popup-section">
                    <div className="update-popup-section-header">
                        <MdTune className="update-popup-section-icon"/>
                        <div className={`update-popup-section-title ${isDark ? "dark" : ""}`}>
                            {t('updateImprovements')}
                        </div>
                    </div>
                    <ul className="update-popup-list">
                        {update.improvements.map((item, index) => (
                            <li key={index} className={isDark ? "dark" : ""}>
                                <span className="update-popup-bullet"/>
                                <span>{localize(item)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default UpdateSection;
