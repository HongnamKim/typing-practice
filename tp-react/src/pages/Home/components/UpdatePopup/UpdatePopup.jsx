import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import LatestUpdate, {getLatestPopupUpdate} from "./LatestUpdate/LatestUpdate";
import "./UpdatePopup.css";
import {Storage_Last_Seen_Version} from "@/const/config.const.ts";
import {t} from "@/utils/i18n.ts";

const UpdatePopup = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const lastSeenVersion = localStorage.getItem(Storage_Last_Seen_Version);
        const latestPopupUpdate = getLatestPopupUpdate();

        if (latestPopupUpdate && lastSeenVersion !== latestPopupUpdate.version) {
            setIsOpen(true);
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

    const handleViewHistory = () => {
        setIsOpen(false);
        navigate('/updates');
    };

    if (!isOpen) return null;

    return (
        <div className="update-popup-overlay" onClick={handleClose}>
            <div className="update-popup" onClick={e => e.stopPropagation()}>
                <div className="update-content">
                    <LatestUpdate/>
                </div>
                <div className="update-popup-actions">
                    <button className="update-popup-close" onClick={handleClose}>
                        {t('updateClose')}
                    </button>
                    <div className="update-popup-secondary">
                        <button className="update-popup-history-btn" onClick={handleViewHistory}>
                            {t('updateViewHistory')}
                        </button>
                        <span className="update-popup-separator">·</span>
                        <button className="update-popup-dont-show-btn" onClick={handleDontShowAgain}>
                            {t('updateDontShow')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePopup;
