import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../../Context/ThemeContext";
import {CiBullhorn} from "react-icons/ci";
import {CURRENT_VERSION, updateHistory} from "../../data/updateHistory";
import {Storage_Last_Seen_Version} from "../../const/config.const";
import "./UpdatePopup.css";

const UpdatePopup = () => {
    const {isDark} = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isHistoryMode, setIsHistoryMode] = useState(false);

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem(Storage_Last_Seen_Version);
        if (lastSeenVersion !== CURRENT_VERSION) {
            setIsOpen(true);
            setIsHistoryMode(false);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem(Storage_Last_Seen_Version, CURRENT_VERSION);
    };

    const handleIconClick = () => {
        setIsOpen(true);
        setIsHistoryMode(true);
    };

    const handleHistoryClick = () => {
        setIsHistoryMode(true);
    };

    const renderUpdateSection = (update) => (
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

    return (
        <>
            {/* 공지 아이콘 */}
            <CiBullhorn
                className={`notice-icon ${isDark ? "dark" : ""}`}
                title="업데이트 안내"
                onClick={handleIconClick}
            />

            {/* 팝업 */}
            {isOpen && (
                <div className="update-popup-overlay">
                    <div className={`update-popup ${isDark ? "dark" : ""} ${isHistoryMode ? "history-mode" : ""}`}>
                        <div className="update-popup-header">
                            <span className="update-popup-title">
                                {isHistoryMode ? "📋 업데이트 내역" : "🎉 업데이트 안내"}
                            </span>
                        </div>

                        <div className="update-content">
                            {isHistoryMode ? (
                                // 모든 업데이트 표시
                                updateHistory.map((update, index) => (
                                    <div key={index} className={`update-history-item ${isDark ? "dark" : ""}`}>
                                        <div className="update-history-header">
                                            <span className="update-history-version">v{update.version}</span>
                                            <span className={`update-history-date ${isDark ? "dark" : ""}`}>
                                                {update.date}
                                            </span>
                                        </div>
                                        {renderUpdateSection(update, true)}
                                    </div>
                                ))
                            ) : (
                                // 최신 업데이트만 표시
                                <>
                                    <div className={`update-popup-version ${isDark ? "dark" : ""}`}>
                                        v{updateHistory[0].version}
                                    </div>
                                    <div className={`update-popup-date ${isDark ? "dark" : ""}`}>
                                        {updateHistory[0].date}
                                    </div>
                                    {renderUpdateSection(updateHistory[0])}
                                </>
                            )}
                        </div>

                        <button className="update-popup-close" onClick={handleClose}>
                            확인
                        </button>
                        {!isHistoryMode && (
                            <button
                                className={`update-popup-history-btn ${isDark ? "dark" : ""}`}
                                onClick={handleHistoryClick}
                            >
                                지난 업데이트 보기
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdatePopup;
