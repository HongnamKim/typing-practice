import {useEffect, useRef, useState} from 'react';
import {FaEllipsisVertical, FaFlag} from 'react-icons/fa6';
import ReportPopup from '../../ReportPopup/ReportPopup';
import './QuoteMoreMenu.css';
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useAuth} from "@/Context/AuthContext.tsx";
import {useQuote} from "@/Context/QuoteContext.tsx";
import {t} from "@/utils/i18n.ts";

const QuoteMoreMenu = () => {
    const {isDark} = useTheme();
    const {user, triggerLogin} = useAuth();
    const {currentQuote} = useQuote();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showReportPopup, setShowReportPopup] = useState(false);

    const menuRef = useRef(null);

    // 외부 클릭 시 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleReportClick = () => {
        setIsMenuOpen(false);

        if (!user) {
            triggerLogin();
            return;
        }

        setShowReportPopup(true);
    };

    const handleReportSuccess = () => {
        // 신고 성공 시 처리 (필요시 토스트 메시지 등)
    };

    if (!currentQuote) return null;

    return (
        <>
            <div className="quote-more-container" ref={menuRef}>
                <button
                    className={`quote-more-btn ${isDark ? 'dark' : ''}`}
                    onClick={handleMenuToggle}
                >
                    <FaEllipsisVertical/>
                </button>

                {isMenuOpen && (
                    <div className={`quote-more-menu ${isDark ? 'dark' : ''}`}>
                        <button
                            className={`quote-more-item ${isDark ? 'dark' : ''}`}
                            onClick={handleReportClick}
                        >
                            <FaFlag/>
                            <span>{t('report')}</span>
                        </button>
                    </div>
                )}
            </div>

            {showReportPopup && (
                <ReportPopup
                    quote={currentQuote}
                    onClose={() => setShowReportPopup(false)}
                    onSuccess={handleReportSuccess}
                />
            )}
        </>
    );
};

export default QuoteMoreMenu;
