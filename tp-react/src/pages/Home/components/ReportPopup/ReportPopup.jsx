import {useState} from 'react';
import {FaFlag, FaXmark} from 'react-icons/fa6';
//import {createReport} from '../../utils/reportApi';
import ReportReasonOption from './ReportReasonOption';
import './ReportPopup.css';
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useError} from "@/Context/ErrorContext.tsx";
import {t} from "@/utils/i18n.ts";
import {createReport} from "@/utils/reportApi.ts";

const REASON_OPTIONS = [
    {value: 'MODIFY', title: t('reportModify'), description: t('reportModifyDesc')},
    {value: 'DELETE', title: t('reportDelete'), description: t('reportDeleteDesc')},
];

const DETAIL_MAX_LENGTH = 120;

const ReportPopup = ({quote, onClose, onSuccess}) => {
    const {isDark} = useTheme();
    const {showError} = useError();

    const [reason, setReason] = useState('MODIFY');
    const [detail, setDetail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await createReport({
                quoteId: quote.quoteId,
                reason,
                detail: detail.trim() || null
            });
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('신고 실패:', error);
            const message = error.response?.data?.detail || t('reportFailed');
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDetailChange = (e) => {
        const value = e.target.value;
        if (value.length <= DETAIL_MAX_LENGTH) {
            setDetail(value);
        }
    };

    return (
        <div className="report-popup-overlay" onClick={handleOverlayClick}>
            <div className={`report-popup ${isDark ? 'dark' : ''}`}>
                <div className="report-popup-header">
                    <h3 className="report-popup-title">{t('reportSentence')}</h3>
                    <button className="report-popup-close-btn" onClick={onClose}>
                        <FaXmark/>
                    </button>
                </div>

                <div className={`report-quote-preview ${isDark ? 'dark' : ''}`}>
                    <span className="report-quote-label">{t('reportTarget')}</span>
                    <p className="report-quote-sentence">{quote.sentence}</p>
                    {quote.author && (
                        <span className="report-quote-author">- {quote.author}</span>
                    )}
                </div>

                <div className="report-reason-section">
                    <span className={`report-section-label ${isDark ? 'dark' : ''}`}>{t('reportReason')}</span>
                    <div className="report-reason-options">
                        {REASON_OPTIONS.map((option) => (
                            <ReportReasonOption
                                key={option.value}
                                value={option.value}
                                checked={reason === option.value}
                                onChange={(e) => setReason(e.target.value)}
                                title={option.title}
                                description={option.description}
                            />
                        ))}
                    </div>
                </div>

                <div className="report-detail-section">
                    <label className={`report-section-label ${isDark ? 'dark' : ''}`} htmlFor="reportDetail">
                        {t('reportDetail')} <span className="report-optional">({t('optional')})</span>
                    </label>
                    <textarea
                        id="reportDetail"
                        className={`report-detail-input ${isDark ? 'dark' : ''}`}
                        placeholder={t('reportDetailPlaceholder')}
                        maxLength={DETAIL_MAX_LENGTH}
                        rows={3}
                        value={detail}
                        onChange={handleDetailChange}
                    />
                    <span className={`report-detail-count ${isDark ? 'dark' : ''}`}>
                        {detail.length}/{DETAIL_MAX_LENGTH}
                    </span>
                </div>

                <div className="report-popup-actions">
                    <button
                        className={`report-cancel-btn ${isDark ? 'dark' : ''}`}
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        className="report-submit-btn"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <FaFlag/>
                        <span>{isSubmitting ? t('reporting') : t('report')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportPopup;
