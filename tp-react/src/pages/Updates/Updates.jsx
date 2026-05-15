import {useCallback, useEffect, useRef, useState} from 'react';
import {MdAutoAwesome, MdTune} from 'react-icons/md';
import {getUpdateNotes} from '@/utils/updateNoteApi.ts';
import {formatLocalizedDate} from '@/utils/formatDate.ts';
import {localized} from '@/utils/localizedText.ts';
import {t} from '@/utils/i18n.ts';
import './Updates.css';

function Updates() {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    const isLoadingRef = useRef(false);
    const hasNextRef = useRef(true);
    const cursorRef = useRef(null);
    const loadMoreRef = useRef(null);

    const loadNotes = useCallback(async (isFirst = false) => {
        if (isLoadingRef.current) return;
        if (!isFirst && !hasNextRef.current) return;
        isLoadingRef.current = true;
        if (isFirst) setIsLoading(true);
        else setIsLoadingMore(true);
        setError(false);
        try {
            const cursor = isFirst ? undefined : cursorRef.current;
            const res = await getUpdateNotes({
                cursorReleasedAt: cursor?.releasedAt,
                cursorId: cursor?.id,
                size: 50,
            });
            setNotes(prev => isFirst ? res.content : [...prev, ...res.content]);
            cursorRef.current = res.nextCursor;
            hasNextRef.current = res.hasNext;
        } catch {
            setError(true);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        loadNotes(true);
    }, [loadNotes]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingRef.current && hasNextRef.current) {
                    loadNotes();
                }
            },
            {threshold: 0.1}
        );
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [loadNotes, notes.length]);

    const handleRetry = () => loadNotes(true);

    if (isLoading) {
        return (
            <div className="updates-container">
                <header className="updates-header">
                    <h1 className="updates-title">{t('updateHistoryTitle')}</h1>
                </header>
                <div className="updates-timeline">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="timeline-entry">
                            <div className="updates-skeleton-version" />
                            <div className="updates-skeleton-line" />
                            <div className="updates-skeleton-line short" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error && notes.length === 0) {
        return (
            <div className="updates-container">
                <header className="updates-header">
                    <h1 className="updates-title">{t('updateHistoryTitle')}</h1>
                </header>
                <div className="updates-error">
                    <p>{t('errorTemporary')}</p>
                    <button className="updates-retry-btn" onClick={handleRetry}>
                        {t('errorRetry')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="updates-container">
            <header className="updates-header">
                {notes[0] && <span className="updates-latest-badge">{notes[0].version} Released</span>}
                <h1 className="updates-title">{t('updateHistoryTitle')}</h1>
            </header>
            <div className="updates-timeline">
                <div className="timeline-line"/>
                {notes.map((note, idx) => {
                    const isLatest = idx === 0;
                    return (
                        <section className={`timeline-entry${isLatest ? '' : ' past'}`} key={note.id}>
                            <div className={`timeline-dot${isLatest ? ' latest' : ''}`}>
                                <div className="timeline-dot-inner"/>
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-version-row">
                                    <h2 className="timeline-version">{note.version}</h2>
                                    <time className="timeline-date">{formatLocalizedDate(note.releasedAt)}</time>
                                </div>
                                <div className="timeline-sections">
                                    {note.newFeatures && note.newFeatures.length > 0 && (
                                        <div className="timeline-section">
                                            <div className="timeline-section-header">
                                                <MdAutoAwesome className="timeline-section-icon primary"/>
                                                <h3 className="timeline-section-title">{t('updateFeatures')}</h3>
                                            </div>
                                            <ul className="timeline-list">
                                                {note.newFeatures.map((item, i) => (
                                                    <li key={i}>
                                                        <span className={`timeline-bullet${isLatest ? ' primary' : ''}`}/>
                                                        <span>{localized(item)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {note.improvements && note.improvements.length > 0 && (
                                        <div className="timeline-section">
                                            <div className="timeline-section-header">
                                                <MdTune className="timeline-section-icon"/>
                                                <h3 className="timeline-section-title">{t('updateImprovements')}</h3>
                                            </div>
                                            <ul className="timeline-list">
                                                {note.improvements.map((item, i) => (
                                                    <li key={i}>
                                                        <span className="timeline-bullet"/>
                                                        <span>{localized(item)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    );
                })}
                <div ref={loadMoreRef} style={{height: '1px'}} />
                {isLoadingMore && (
                    <div className="updates-loading-more">{t('loading')}</div>
                )}
                {error && notes.length > 0 && (
                    <div className="updates-error-inline">
                        <p>{t('errorTemporary')}</p>
                        <button className="updates-retry-btn" onClick={() => loadNotes()}>
                            {t('errorRetry')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Updates;
