import './NavBadge.css';

/**
 * 빨간 점 형태의 알림 뱃지. show 가 false 면 렌더링 안 함.
 * 부모 요소가 position: relative 여야 우측 상단에 절대 배치된다.
 */
const NavBadge = ({show}) => {
    if (!show) return null;
    return <span className="nav-badge-dot" aria-label="new" />;
};

export default NavBadge;
