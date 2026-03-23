import './QuoteFilters.css';

const QuoteFilters = ({typeFilter, statusFilter, onTypeChange, onStatusChange}) => {
    return (
        <div className="my-quotes-filters">
            <div className="my-quotes-filter-group">
                <button
                    className={`my-quotes-filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => onTypeChange('all')}
                >
                    전체
                </button>
                <button
                    className={`my-quotes-filter-btn ${typeFilter === 'PUBLIC' ? 'active' : ''}`}
                    onClick={() => onTypeChange('PUBLIC')}
                >
                    공개
                </button>
                <button
                    className={`my-quotes-filter-btn ${typeFilter === 'PRIVATE' ? 'active' : ''}`}
                    onClick={() => onTypeChange('PRIVATE')}
                >
                    비공개
                </button>
            </div>
            <div className="my-quotes-filter-group">
                <button
                    className={`my-quotes-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => onStatusChange('all')}
                >
                    전체
                </button>
                <button
                    className={`my-quotes-filter-btn ${statusFilter === 'PENDING' ? 'active' : ''}`}
                    onClick={() => onStatusChange('PENDING')}
                >
                    대기중
                </button>
                <button
                    className={`my-quotes-filter-btn ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
                    onClick={() => onStatusChange('ACTIVE')}
                >
                    활성
                </button>
            </div>
        </div>
    );
};

export default QuoteFilters;
