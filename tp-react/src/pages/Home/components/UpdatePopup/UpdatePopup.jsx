import {useEffect, useState} from "react";
import {CiBullhorn} from "react-icons/ci";
import UpdateHistoryList from "./UpdateHistoryList/UpdateHistoryList";
import LatestUpdate, {getLatestPopupUpdate} from "./LatestUpdate/LatestUpdate";
import "./UpdatePopup.css";
import {Storage_Last_Seen_Version} from "@/const/config.const.ts";
import {t} from "@/utils/i18n.ts";

const UpdatePopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHistoryMode, setIsHistoryMode] = useState(false);

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem(Storage_Last_Seen_Version);
        const latestPopupUpdate = getLatestPopupUpdate();

        // showPopup: true인 업데이트가 있고, 아직 해당 버전을 본 적 없으면 팝업 표시
        if (latestPopupUpdate && lastSeenVersion !== latestPopupUpdate.version) {
            setIsOpen(true);
            setIsHistoryMode(false);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleDontShowAgain = () => {
        setIsOpen(false);
        const latestPopupUpdate = getLatestPopupUpdate();
        if (latestPopupUpdate) {
            localStorage.setItem(Storage_Last_Seen_Version, latestPopupUpdate.version);
        }
    };

    const handleIconClick = () => {
        setIsOpen(true);
        setIsHistoryMode(true);
    };

    const handleHistoryClick = () => {
        setIsHistoryMode(true);
    };

    return (
        <>
            {/* 공지 아이콘 */}
            <CiBullhorn
                className="notice-icon"
                title={t('updateNotice')}
                onClick={handleIconClick}
            />

            {/* 팝업 */}
            {isOpen && (
                <div className="update-popup-overlay" onClick={handleClose}>
                    <div className={`update-popup ${isHistoryMode ? "history-mode" : ""}`}
                         onClick={e => e.stopPropagation()}>
                        <div className="update-popup-header">
                            <span className="update-popup-title">
                                {isHistoryMode ? t('updateHistory') : t('updateNotice')}
                            </span>
                        </div>

                        <div className="update-content">
                            {isHistoryMode ? (
                                <UpdateHistoryList/>
                            ) : (
                                <LatestUpdate/>
                            )}
                        </div>

                        <button className="update-popup-close" onClick={handleClose}>
                            {t('updateClose')}
                        </button>
                        {!isHistoryMode && (
                            <>
                                <button
                                    className="update-popup-history-btn"
                                    onClick={handleHistoryClick}
                                >
                                    {t('updateViewHistory')}
                                </button>
                                <button
                                    className="update-popup-dont-show-btn"
                                    onClick={handleDontShowAgain}
                                >
                                    {t('updateDontShow')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdatePopup;
