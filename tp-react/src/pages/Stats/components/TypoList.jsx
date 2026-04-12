import {t} from '@/utils/i18n.ts';
import './TypoList.css';

const displayChar = (ch) => {
    if (ch === '') return '\u2205';
    if (ch === ' ') return '\u2423';
    return ch;
};

function TypoList({typoStats}) {
    if (!typoStats || typoStats.length === 0) {
        return (
            <div className="typo-section">
                <div className="typo-section-header">
                    <h3 className="typo-section-title">{t('typoTop10')}</h3>
                </div>
                <div className="typo-empty">{t('noTypoData')}</div>
            </div>
        );
    }

    const displayItems = typoStats.slice(0, 4);
    const maxCount = typoStats[0].count;

    return (
        <div className="typo-section">
            <div className="typo-section-header">
                <h3 className="typo-section-title">{t('typoTop10')}</h3>
            </div>
            <div className="typo-list">
                {displayItems.map((item, i) => (
                    <div key={i} className="typo-item">
                        <div className="typo-item-header">
                            <span className="typo-char">{displayChar(item.expected)}</span>
                            <span className="typo-count">{item.count} {t('errors')}</span>
                        </div>
                        <div className="typo-bar-container">
                            <div className="typo-bar-fill" style={{width: (item.count / maxCount * 100) + '%'}}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TypoList;