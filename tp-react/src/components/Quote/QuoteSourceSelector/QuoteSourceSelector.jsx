import {useState} from 'react';
import {FaGlobe, FaUser} from 'react-icons/fa';
import {useTheme} from '../../../Context/ThemeContext';
import {useQuote} from '../../../Context/QuoteContext';
import {useAuth} from '../../../Context/AuthContext';
import ConfirmPopup from '../../ConfirmPopup/ConfirmPopup';
import './QuoteSourceSelector.css';

const QuoteSourceSelector = () => {
    const {isDark} = useTheme();
    const {quoteSource, changeQuoteSource} = useQuote();
    const {triggerLogin} = useAuth();
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const handleAllClick = () => {
        changeQuoteSource('all');
    };

    const handleMyClick = () => {
        const success = changeQuoteSource('my');
        if (!success) {
            setShowLoginPopup(true);
        }
    };

    const handleLoginConfirm = () => {
        setShowLoginPopup(false);
        // AuthContext의 triggerLogin 호출 → Head에서 googleLogin 실행
        triggerLogin();
    };

    const handleLoginCancel = () => {
        setShowLoginPopup(false);
    };

    return (
        <>
            <div className="quote-source-selector">
                <button
                    className={`quote-source-btn ${quoteSource === 'all' ? 'active' : ''} ${isDark ? 'dark' : ''}`}
                    onClick={handleAllClick}
                >
                    <FaGlobe/>
                    <span>전체 문장</span>
                </button>
                <button
                    className={`quote-source-btn ${quoteSource === 'my' ? 'active' : ''} ${isDark ? 'dark' : ''}`}
                    onClick={handleMyClick}
                >
                    <FaUser/>
                    <span>내 문장만</span>
                </button>
            </div>

            {showLoginPopup && (
                <ConfirmPopup
                    message="내 문장을 사용하려면 로그인이 필요합니다."
                    onConfirm={handleLoginConfirm}
                    onCancel={handleLoginCancel}
                    confirmText="로그인"
                    cancelText="취소"
                />
            )}
        </>
    );
};

export default QuoteSourceSelector;
