import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Storage_Read_Notices} from "@/const/config.const";
import {getLatestUnreadPopupNotice, localized, Notice} from "@/data/noticeData";
import {t} from "@/utils/i18n";
import "./NoticePopup.css";

const readIds = (): string[] => {
    try {
        const raw = localStorage.getItem(Storage_Read_Notices);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const markAsRead = (id: string) => {
    const list = readIds();
    if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem(Storage_Read_Notices, JSON.stringify(list));
    }
};

const NoticePopup = () => {
    const navigate = useNavigate();
    const [notice, setNotice] = useState<Notice | null>(null);

    useEffect(() => {
        const target = getLatestUnreadPopupNotice(readIds());
        if (target) setNotice(target);
    }, []);

    if (!notice) return null;

    const handleClose = () => {
        markAsRead(notice.id);
        setNotice(null);
    };

    const handleAction = () => {
        if (!notice.actionLink) return;
        markAsRead(notice.id);
        const url = notice.actionLink.url;
        if (url.startsWith('/')) {
            navigate(url);
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
        setNotice(null);
    };

    return (
        <div className="notice-popup-overlay">
            <div className="notice-popup">
                <div className="notice-popup-header">
                    <span className="notice-popup-date">{notice.date}</span>
                    <h2 className="notice-popup-title">{localized(notice.title)}</h2>
                </div>
                <p className="notice-popup-content">{localized(notice.content)}</p>
                <div className="notice-popup-actions">
                    {notice.actionLink && (
                        <button className="notice-popup-action-btn" onClick={handleAction}>
                            {localized(notice.actionLink.label)}
                        </button>
                    )}
                    <button className="notice-popup-close-btn" onClick={handleClose}>
                        {t('updateClose')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoticePopup;
