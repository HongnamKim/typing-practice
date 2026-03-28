import {t} from '@/utils/i18n.ts';
import './QuoteFilters.css';

const QuoteFilters = ({typeFilter, statusFilter, onTypeChange, onStatusChange}) => {
    return (
        <div className="my-quotes-filters">
            <div className="my-quotes-filter-group">
                <button
                    className={`my-quotes-filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => onTypeChange('all')}
                >
                    {t('all')}
                </button>
                <button
                    className={`my-quotes-filter-btn ${typeFilter === 'PUBLIC' ? 'active' : ''}`}
                    onClick={() => onTypeChange('PUBLIC')}
                >
                    {t('public')}
                </button>
                <button
                    className={`my-quotes-filter-btn ${typeFilter === 'PRIVATE' ? 'active' : ''}`}
                    onClick={() => onTypeChange('PRIVATE')}
                >
                    {t('private')}
                </button>
            </div>
            <div className="my-quotes-filter-group">
                <button
                    className={`my-quotes-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => onStatusChange('all')}
                >
                    {t('all')}
                </button>
                <button
                    className={`my-quotes-filter-btn ${statusFilter === 'PENDING' ? 'active' : ''}`}
                    onClick={() => onStatusChange('PENDING')}
                >
                    {t('pending')}
                </button>
                <button
                    className={`my-quotes-filter-btn ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
                    onClick={() => onStatusChange('ACTIVE')}
                >
                    {t('active')}
                </button>
            </div>
        </div>
    );
};

export default QuoteFilters;
