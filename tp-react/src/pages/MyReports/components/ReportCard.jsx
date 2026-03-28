import {FaTrash} from 'react-icons/fa6';
import {useTheme} from '../../../Context/ThemeContext';
import Badge from '../../../components/Badge/Badge';
import {formatDate} from '../../../utils/formatDate';
import './ReportCard.css';

// 신고 사유 매핑
const REASON_MAP = {
    MODIFY: {variant: 'reason-modify', text: '수정 요청'},
    DELETE: {variant: 'reason-delete', text: '삭제 요청'},
};

// 신고 상태 매핑
const STATUS_MAP = {
    PENDING: {variant: 'status-pending', text: '대기중'},
    PROCESSED: {variant: 'status-processed', text: '처리완료'},
};

const ReportCard = ({report, onDelete}) => {
    const {isDark} = useTheme();

    const reason = REASON_MAP[report.reason] || REASON_MAP.MODIFY;
    const status = STATUS_MAP[report.status] || STATUS_MAP.PENDING;

    return (
        <div className={`report-card ${isDark ? 'dark' : ''}`}>
            <div className="report-card-header">
                <div className="report-badges">
                    <Badge variant={reason.variant}>{reason.text}</Badge>
                    <Badge variant={status.variant}>{status.text}</Badge>
                </div>
                {report.status === 'PENDING' && (
                    <button
                        className={`report-delete-btn ${isDark ? 'dark' : ''}`}
                        onClick={() => onDelete(report.id)}
                        title="신고 취소"
                    >
                        <FaTrash/>
                    </button>
                )}
            </div>

            <div className={`report-quote ${report.quoteDeleted ? 'quote-deleted' : ''} ${isDark ? 'dark' : ''}`}>
                <p className="report-sentence">
                    {report.quote?.sentence}
                    {report.quoteDeleted && ' (삭제됨)'}
                </p>
                {report.quote?.author && (
                    <span className="report-author">- {report.quote.author}</span>
                )}
            </div>

            {report.detail && (
                <div className={`report-detail ${isDark ? 'dark' : ''}`}>
                    <span className="report-detail-label">신고 내용</span>
                    <p className="report-detail-text">{report.detail}</p>
                </div>
            )}

            <div className="report-card-footer">
                <span className={`report-date ${isDark ? 'dark' : ''}`}>
                    {formatDate(report.createdAt)}
                </span>
            </div>
        </div>
    );
};

export default ReportCard;
