import {useCallback, useEffect, useState} from 'react';
import {MdPushPin, MdClose} from 'react-icons/md';
import {getAnnouncement} from '@/utils/noticeApi.ts';
import {formatLocalizedDate} from '@/utils/formatDate.ts';
import {localized} from '@/utils/localizedText.ts';
import {t} from '@/utils/i18n.ts';
import './NoticeDetail.css';

function NoticeDetail({id, onClose}) {
    const [notice, setNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        const numericId = Number(id);
        if (!Number.isFinite(numericId)) {
            setNotFound(true);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(false);
        setNotFound(false);
        try {
            const data = await getAnnouncement(numericId);
            setNotice(data);
        } catch (e) {
            if (e?.response?.status === 404) {
                setNotFound(true);
            } else {
                setError(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="notice-detail-popup" role="dialog" aria-modal="true">
            <button className="notice-detail-popup-close" onClick={onClose} aria-label={t('close')}>
                <MdClose />
            </button>
            <div className="notice-detail-popup-body">
                {isLoading && (
                    <>
                        <div className="notice-detail-skeleton-title" />
                        <div className="notice-detail-skeleton-date" />
                        <div className="notice-detail-skeleton-body" />
                    </>
                )}
                {!isLoading && notFound && (
                    <div className="notice-detail-message">
                        <p>{t('noticeNotFound')}</p>
                    </div>
                )}
                {!isLoading && !notFound && error && (
                    <div className="notice-detail-message">
                        <p>{t('errorTemporary')}</p>
                        <button className="notice-detail-btn" onClick={load}>
                            {t('errorRetry')}
                        </button>
                    </div>
                )}
                {!isLoading && !notFound && !error && notice && (
                    <>
                        <header className="notice-detail-header">
                            <div className="notice-detail-title-row">
                                {notice.pinned && <MdPushPin className="notice-detail-pin" aria-label={t('pinned')} />}
                                <h1 className="notice-detail-title">{localized(notice.title)}</h1>
                            </div>
                            <time className="notice-detail-date">{formatLocalizedDate(notice.postedAt)}</time>
                        </header>
                        <div className="notice-detail-content">{localized(notice.content)}</div>
                    </>
                )}
            </div>
        </div>
    );
}

export default NoticeDetail;
