import {useCallback, useEffect, useRef, useState} from 'react';
import {MdPushPin} from 'react-icons/md';
import {getAnnouncements, getPinnedAnnouncements} from '@/utils/noticeApi.ts';
import {formatLocalizedDate} from '@/utils/formatDate.ts';
import {localized} from '@/utils/localizedText.ts';
import {t} from '@/utils/i18n.ts';
import NoticeDetail from './NoticeDetail';
import './NoticeList.css';

function NoticeList() {
    const [selectedId, setSelectedId] = useState(null);
    const [pinned, setPinned] = useState([]);
    const [normal, setNormal] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(false);
    const [pageError, setPageError] = useState(false);

    const isLoadingRef = useRef(false);
    const hasNextRef = useRef(true);
    const cursorRef = useRef(null);
    const loadMoreRef = useRef(null);

    const loadInitial = useCallback(async () => {
        setIsLoading(true);
        setError(false);
        setPageError(false);
        try {
            const [pinnedRes, listRes] = await Promise.all([
                getPinnedAnnouncements(),
                getAnnouncements({size: 50}),
            ]);
            setPinned(pinnedRes.items);
            setNormal(listRes.content);
            cursorRef.current = listRes.nextCursor;
            hasNextRef.current = listRes.hasNext;
        } catch {
            setPageError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadMore = useCallback(async () => {
        if (isLoadingRef.current || !hasNextRef.current) return;
        isLoadingRef.current = true;
        setIsLoadingMore(true);
        setError(false);
        try {
            const cursor = cursorRef.current;
            const res = await getAnnouncements({
                cursorPostedAt: cursor?.postedAt,
                cursorId: cursor?.id,
                size: 50,
            });
            setNormal(prev => [...prev, ...res.content]);
            cursorRef.current = res.nextCursor;
            hasNextRef.current = res.hasNext;
        } catch {
            setError(true);
        } finally {
            isLoadingRef.current = false;
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingRef.current && hasNextRef.current) {
                    loadMore();
                }
            },
            {threshold: 0.1}
        );
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [loadMore, normal.length]);

    const renderItem = (item, isPinned) => (
        <li
            key={`${isPinned ? 'p' : 'n'}-${item.id}`}
            className={`notice-item${isPinned ? ' pinned' : ''}`}
            onClick={() => setSelectedId(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setSelectedId(item.id); }}
        >
            <div className="notice-item-title-row">
                {isPinned && <MdPushPin className="notice-pin-icon" aria-label={t('pinned')} />}
                <span className="notice-item-title">{localized(item.title)}</span>
            </div>
            <time className="notice-item-date">{formatLocalizedDate(item.postedAt)}</time>
        </li>
    );

    let body;
    if (isLoading) {
        body = (
            <ul className="notices-list">
                {[0, 1, 2, 3].map(i => (
                    <li key={i} className="notice-item notice-skeleton-item">
                        <div className="notice-skeleton-title" />
                        <div className="notice-skeleton-date" />
                    </li>
                ))}
            </ul>
        );
    } else if (pageError) {
        body = (
            <div className="notices-error">
                <p>{t('errorTemporary')}</p>
                <button className="notices-retry-btn" onClick={loadInitial}>
                    {t('errorRetry')}
                </button>
            </div>
        );
    } else if (pinned.length === 0 && normal.length === 0) {
        body = <p className="notices-empty">{t('noticesEmpty')}</p>;
    } else {
        body = (
            <>
                <ul className="notices-list">
                    {pinned.map(item => renderItem(item, true))}
                    {normal.map(item => renderItem(item, false))}
                </ul>
                <div ref={loadMoreRef} style={{height: '1px'}} />
                {isLoadingMore && (
                    <div className="notices-loading-more">{t('loading')}</div>
                )}
                {error && (
                    <div className="notices-error-inline">
                        <p>{t('errorTemporary')}</p>
                        <button className="notices-retry-btn" onClick={loadMore}>
                            {t('errorRetry')}
                        </button>
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <div className="notices-container">
                <h1 className="notices-title">{t('noticesTitle')}</h1>
                {body}
            </div>
            {selectedId !== null && (
                <NoticeDetail id={selectedId} onClose={() => setSelectedId(null)} />
            )}
        </>
    );
}

export default NoticeList;
