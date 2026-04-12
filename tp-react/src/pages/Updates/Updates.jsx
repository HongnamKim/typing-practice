import {formatUpdateDate, localize, updateHistory} from '@/data/updateHistory.ts';
import {t} from '@/utils/i18n.ts';
import {MdAutoAwesome, MdTune, MdCampaign} from 'react-icons/md';
import './Updates.css';

function Updates() {
    const visibleUpdates = updateHistory.filter(u => !u.hidden);

    return (
        <div className="updates-container">
            <header className="updates-header">
                <span className="updates-latest-badge">v{visibleUpdates[0]?.version} Released</span>
                <h1 className="updates-title">{t('updateHistoryTitle')}</h1>
            </header>
            <div className="updates-timeline">
                <div className="timeline-line"/>
                {visibleUpdates.map((update, idx) => {
                    const isLatest = idx === 0;
                    return (
                        <section className={`timeline-entry${isLatest ? '' : ' past'}`} key={update.version}>
                            <div className={`timeline-dot${isLatest ? ' latest' : ''}`}>
                                <div className="timeline-dot-inner"/>
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-version-row">
                                    <h2 className="timeline-version">v{update.version}</h2>
                                    <time className="timeline-date">{formatUpdateDate(update.date)}</time>
                                </div>
                                <div className="timeline-sections">
                                    {update.notices && update.notices.length > 0 && (
                                        <div className="timeline-section timeline-section-full">
                                            <div className="timeline-section-header">
                                                <MdCampaign className="timeline-section-icon primary"/>
                                                <h3 className="timeline-section-title">{t('updateNotices')}</h3>
                                            </div>
                                            <ul className="timeline-list">
                                                {update.notices.map((item, i) => (
                                                    <li key={i}>
                                                        <span className="timeline-bullet primary"/>
                                                        <span>{localize(item)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {update.features && update.features.length > 0 && (
                                        <div className="timeline-section">
                                            <div className="timeline-section-header">
                                                <MdAutoAwesome className="timeline-section-icon primary"/>
                                                <h3 className="timeline-section-title">{t('updateFeatures')}</h3>
                                            </div>
                                            <ul className="timeline-list">
                                                {update.features.map((item, i) => (
                                                    <li key={i}>
                                                        <span className={`timeline-bullet${isLatest ? ' primary' : ''}`}/>
                                                        <span>{localize(item)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {update.improvements && update.improvements.length > 0 && (
                                        <div className="timeline-section">
                                            <div className="timeline-section-header">
                                                <MdTune className="timeline-section-icon"/>
                                                <h3 className="timeline-section-title">{t('updateImprovements')}</h3>
                                            </div>
                                            <ul className="timeline-list">
                                                {update.improvements.map((item, i) => (
                                                    <li key={i}>
                                                        <span className="timeline-bullet"/>
                                                        <span>{localize(item)}</span>
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
            </div>
        </div>
    );
}

export default Updates;