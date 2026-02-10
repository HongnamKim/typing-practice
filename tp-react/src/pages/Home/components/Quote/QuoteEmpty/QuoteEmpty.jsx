import {useNavigate} from 'react-router-dom';
import {FaFileCircleQuestion, FaPlus} from 'react-icons/fa6';
import './QuoteEmpty.css';
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useQuote} from "@/Context/QuoteContext.tsx";

const QuoteEmpty = () => {
    const navigate = useNavigate();
    const {isDark} = useTheme();
    const {quoteSource} = useQuote();

    return (
        <div className={`quote-empty ${isDark ? 'dark' : ''}`}>
            <FaFileCircleQuestion/>
            <p>등록된 문장이 없습니다.</p>
            {quoteSource === 'my' && (
                <button
                    className="quote-empty-upload-btn"
                    onClick={() => navigate('/quote/upload')}
                >
                    <FaPlus/>
                    <span>문장 업로드</span>
                </button>
            )}
        </div>
    );
};

export default QuoteEmpty;
