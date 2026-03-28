import {useNavigate} from 'react-router-dom';
import {FaFileCircleQuestion, FaPlus} from 'react-icons/fa6';
import './QuoteEmpty.css';
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useQuote} from "@/Context/QuoteContext.tsx";
import {t} from "@/utils/i18n.ts";

const QuoteEmpty = () => {
    const navigate = useNavigate();
    const {isDark} = useTheme();
    const {quoteSource} = useQuote();

    return (
        <div className={`quote-empty ${isDark ? 'dark' : ''}`}>
            <FaFileCircleQuestion/>
            <p>{t('noSentences')}</p>
            {quoteSource === 'my' && (
                <button
                    className="quote-empty-upload-btn"
                    onClick={() => navigate('/quote/upload')}
                >
                    <FaPlus/>
                    <span>{t('uploadSentence')}</span>
                </button>
            )}
        </div>
    );
};

export default QuoteEmpty;
