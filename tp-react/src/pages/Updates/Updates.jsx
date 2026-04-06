import {formatUpdateDate, localize, updateHistory} from '@/data/updateHistory.ts';
import {t} from '@/utils/i18n.ts';
import './Updates.css';

function Updates() {
    const visibleUpdates = updateHistory.filter(u => !u.hidden);

    return (
        <div className="updates-container">
            <div className="updates-header">
                <h1 className="updates-title">{t('updateHistory')}</h1>
            </div>
            <div className="updates-list">
                {visibleUpdates.map((update) => (
                    <div className="update-card" key={update.version}>
                        <div className="update-card-header">
                            <span className="update-card-version">v{update.version}</span>
                            <span className="update-card-date">{formatUpdateDate(update.date)}</span>
                        </div>
                        {update.features && update.features.length > 0 && (
                            <div className="update-card-section">
                                <div className="update-card-section-title">{t('updateFeatures')}</div>
                                <ul className="update-card-list">
                                    {update.features.map((item, i) => <li key={i}>{localize(item)}</li>)}
                                </ul>
                            </div>
                        )}
                        {update.improvements && update.improvements.length > 0 && (
                            <div className="update-card-section">
                                <div className="update-card-section-title">{t('updateImprovements')}</div>
                                <ul className="update-card-list">
                                    {update.improvements.map((item, i) => <li key={i}>{localize(item)}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Updates;