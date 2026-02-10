import {useState} from 'react';
import {FaGlobe, FaUser} from 'react-icons/fa';
import './QuoteSourceSelector.css';
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useQuote} from "@/Context/QuoteContext.tsx";
import LoginRequiredPopup from "@/components/LoginRequiredPopup/LoginRequiredPopup.jsx";

const QuoteSourceSelector = () => {
    const {isDark} = useTheme();
    const {quoteSource, changeQuoteSource} = useQuote();
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
                <LoginRequiredPopup
                    message="내 문장을 사용하려면 로그인이 필요합니다."
                    onClose={() => setShowLoginPopup(false)}
                />
            )}
        </>
    );
};

export default QuoteSourceSelector;
