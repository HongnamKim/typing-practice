import {useTheme} from '@/Context/ThemeContext.tsx';
import {t} from '@/utils/i18n.ts';
import './ReportFilters.css';

const ReportFilters = ({statusFilter, onStatusChange}) => {
    const {isDark} = useTheme();

    const statusOptions = [
        {value: 'all', label: t('all')},
        {value: 'PENDING', label: t('pending')},
        {value: 'PROCESSED', label: t('processed')}
    ];

    return (
        <div className="report-filters">
            <div className="report-filter-group">
                {statusOptions.map(option => (
                    <button
                        key={option.value}
                        className={`report-filter-btn ${statusFilter === option.value ? 'active' : ''} ${isDark ? 'dark' : ''}`}
                        onClick={() => onStatusChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ReportFilters;
