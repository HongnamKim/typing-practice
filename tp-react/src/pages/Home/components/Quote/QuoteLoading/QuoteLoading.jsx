import './QuoteLoading.css';
import {useTheme} from "@/Context/ThemeContext.tsx";
import {t} from "@/utils/i18n.ts";

const QuoteLoading = () => {
    const {isDark} = useTheme();

    return (
        <div className={`quote-loading ${isDark ? 'dark' : ''}`}>
            <div className="quote-loading-spinner"></div>
            <span>{t('loadingSentences')}</span>
        </div>
    );
};

export default QuoteLoading;
