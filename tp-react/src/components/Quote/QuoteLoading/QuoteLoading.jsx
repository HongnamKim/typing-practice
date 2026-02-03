import {useTheme} from '../../../Context/ThemeContext';
import './QuoteLoading.css';

const QuoteLoading = () => {
    const {isDark} = useTheme();

    return (
        <div className={`quote-loading ${isDark ? 'dark' : ''}`}>
            <div className="quote-loading-spinner"></div>
            <span>문장을 불러오는 중...</span>
        </div>
    );
};

export default QuoteLoading;
