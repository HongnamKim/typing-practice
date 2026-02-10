import './Badge.css';

/**
 * 공통 뱃지 컴포넌트
 * @param {string} variant - 뱃지 스타일 (type-public, type-private, status-pending, status-active, status-processed, reason-modify, reason-delete)
 * @param {string} children - 뱃지 텍스트
 */
const Badge = ({variant, children}) => {
    return (
        <span className={`badge badge-${variant}`}>
            {children}
        </span>
    );
};

export default Badge;
