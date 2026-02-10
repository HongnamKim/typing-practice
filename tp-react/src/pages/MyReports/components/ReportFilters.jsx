import {useTheme} from '../../../Context/ThemeContext';
import './ReportFilters.css';

const ReportFilters = ({statusFilter, onStatusChange}) => {
    const {isDark} = useTheme();

    const statusOptions = [
        {value: 'all', label: '전체'},
        {value: 'PENDING', label: '대기중'},
        {value: 'PROCESSED', label: '처리완료'}
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
