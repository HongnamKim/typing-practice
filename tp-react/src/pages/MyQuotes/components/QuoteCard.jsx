import Badge from '../../../components/Badge/Badge';
import './QuoteCard.css';

// 타입 매핑
const TYPE_MAP = {
    PUBLIC: {variant: 'type-public', text: '공개'},
    PRIVATE: {variant: 'type-private', text: '비공개'},
};

// 상태 매핑
const STATUS_MAP = {
    PENDING: {variant: 'status-pending', text: '대기중'},
    ACTIVE: {variant: 'status-active', text: '활성'},
};

const QuoteCard = ({quote, onEdit, onDelete, onPublish, onCancelPublish}) => {
    const type = TYPE_MAP[quote.type] || TYPE_MAP.PRIVATE;
    const status = STATUS_MAP[quote.status] || STATUS_MAP.ACTIVE;

    return (
        <div className="my-quote-card">
            <div className="my-quote-card-header">
                <Badge variant={type.variant}>{type.text}</Badge>
                <Badge variant={status.variant}>{status.text}</Badge>
            </div>
            <div className="my-quote-sentence">{quote.sentence}</div>
            {quote.author && <div className="my-quote-author">- {quote.author}</div>}
            <div className="my-quote-card-footer">
                {quote.type === 'PRIVATE' && quote.status === 'ACTIVE' && (
                    <>
                        <button className="my-quote-action-btn" onClick={() => onEdit(quote)}>
                            수정
                        </button>
                        <button className="my-quote-action-btn danger" onClick={() => onDelete(quote.quoteId)}>
                            삭제
                        </button>
                        <button className="my-quote-action-btn primary" onClick={() => onPublish(quote.quoteId)}>
                            공개전환
                        </button>
                    </>
                )}
                {quote.type === 'PUBLIC' && quote.status === 'PENDING' && (
                    <button className="my-quote-action-btn" onClick={() => onCancelPublish(quote.quoteId)}>
                        공개취소
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuoteCard;
