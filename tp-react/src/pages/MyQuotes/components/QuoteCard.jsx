import './QuoteCard.css';

const QuoteCard = ({quote, onEdit, onDelete, onPublish, onCancelPublish}) => {
    return (
        <div className="my-quote-card">
            <div className="my-quote-card-header">
                <span className={`my-quote-badge ${quote.type === 'PUBLIC' ? 'type-public' : 'type-private'}`}>
                    {quote.type === 'PUBLIC' ? '공개' : '비공개'}
                </span>
                <span className={`my-quote-badge ${quote.status === 'PENDING' ? 'status-pending' : 'status-active'}`}>
                    {quote.status === 'PENDING' ? '대기중' : '활성'}
                </span>
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
