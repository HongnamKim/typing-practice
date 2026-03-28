import {useState} from 'react';
import {getTypoDetailStats} from '@/utils/statsApi.ts';
import {t} from '@/utils/i18n.ts';
import './TypoList.css';

const displayChar = (ch) => {
    if (ch === '') return '\u2205';
    if (ch === ' ') return '\u2423';
    return ch;
};

function TypoList({typoStats}) {
    const [selectedTypo, setSelectedTypo] = useState(null);
    const [typoDetail, setTypoDetail] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);

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

    const maxCount = typoStats[0].count;

    const handleTypoClick = async (expected) => {
        if (selectedTypo === expected) {
            setSelectedTypo(null);
            setTypoDetail([]);
            return;
        }
        setSelectedTypo(expected);
        setDetailLoading(true);
        try {
            const res = await getTypoDetailStats('KOREAN', expected);
            setTypoDetail(res.data.data.content || []);
        } catch (error) {
            console.error('typo detail load failed:', error);
            setTypoDetail([]);
        } finally {
            setDetailLoading(false);
        }
    };

    return (
        <div className="typo-area">
            <div className="typo-section">
                <div className="typo-section-header">
                    <h3 className="typo-section-title">{t('typoTop10')}</h3>
                </div>
                <div className="typo-list">
                    {typoStats.map((item, i) => (
                        <div
                            key={i}
                            className={'typo-item' + (selectedTypo === item.expected ? ' selected' : '')}
                            onClick={() => handleTypoClick(item.expected)}
                        >
                            <span className="typo-char">{displayChar(item.expected)}</span>
                            <div className="typo-bar-container">
                                <div className="typo-bar-fill" style={{width: (item.count / maxCount * 100) + '%'}}/>
                            </div>
                            <span className="typo-count">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {selectedTypo && (
                <div className="typo-section">
                    <div className="typo-section-header">
                        <h3 className="typo-section-title">
                            &lsquo;<span className="typo-detail-char">{displayChar(selectedTypo)}</span>&rsquo; {t('typoDetailTitle')}
                        </h3>
                    </div>
                    {detailLoading ? (
                        <div className="typo-empty">{t('loading')}</div>
                    ) : typoDetail.length === 0 ? (
                        <div className="typo-empty">{t('noDetailData')}</div>
                    ) : (
                        <div className="typo-detail-list">
                            {typoDetail.map((d, i) => (
                                <div key={i} className="typo-detail-item">
                                    <span className="typo-detail-expected">{displayChar(d.expected)}</span>
                                    <span className="typo-detail-arrow">{'\u2192'}</span>
                                    <span className="typo-detail-actual">{displayChar(d.actual)}</span>
                                    <span className="typo-detail-count">{d.typoCount + t('countUnit')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TypoList;