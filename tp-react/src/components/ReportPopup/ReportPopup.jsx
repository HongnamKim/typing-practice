import {useState} from 'react';
import {FaFlag, FaXmark} from 'react-icons/fa6';
import {useTheme} from '../../Context/ThemeContext';
import {useError} from '../../Context/ErrorContext';
import {createReport} from '../../utils/reportApi';
import ReportReasonOption from './ReportReasonOption';
import './ReportPopup.css';

const REASON_OPTIONS = [
    {value: 'MODIFY', title: '수정 요청', description: '오타, 맞춤법 오류 등'},
    {value: 'DELETE', title: '삭제 요청', description: '부적절한 내용, 저작권 위반 등'},
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
            const message = error.response?.data?.detail || '신고 접수에 실패했습니다.';
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
                    <h3 className="report-popup-title">문장 신고</h3>
                    <button className="report-popup-close-btn" onClick={onClose}>
                        <FaXmark/>
                    </button>
                </div>

                <div className={`report-quote-preview ${isDark ? 'dark' : ''}`}>
                    <span className="report-quote-label">신고 대상</span>
                    <p className="report-quote-sentence">{quote.sentence}</p>
                    {quote.author && (
                        <span className="report-quote-author">- {quote.author}</span>
                    )}
                </div>

                <div className="report-reason-section">
                    <span className={`report-section-label ${isDark ? 'dark' : ''}`}>신고 사유</span>
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
                        상세 설명 <span className="report-optional">(선택)</span>
                    </label>
                    <textarea
                        id="reportDetail"
                        className={`report-detail-input ${isDark ? 'dark' : ''}`}
                        placeholder="신고 사유를 자세히 설명해주세요."
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
                        취소
                    </button>
                    <button
                        className="report-submit-btn"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <FaFlag/>
                        <span>{isSubmitting ? '신고 중...' : '신고'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportPopup;
