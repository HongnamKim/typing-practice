import {useState} from 'react';
import {FaGlobe, FaUser} from 'react-icons/fa';
import './QuoteSourceSelector.css';
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useQuote} from "@/Context/QuoteContext.tsx";
import {t} from "@/utils/i18n.ts";
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
                    <span>{t('allSentences')}</span>
                </button>
                <button
                    className={`quote-source-btn ${quoteSource === 'my' ? 'active' : ''} ${isDark ? 'dark' : ''}`}
                    onClick={handleMyClick}
                >
                    <FaUser/>
                    <span>{t('mySentencesOnly')}</span>
                </button>
            </div>

            {showLoginPopup && (
                <LoginRequiredPopup
                    message={t('mySentencesLoginRequired')}
                    onClose={() => setShowLoginPopup(false)}
                />
            )}
        </>
    );
};

export default QuoteSourceSelector;
