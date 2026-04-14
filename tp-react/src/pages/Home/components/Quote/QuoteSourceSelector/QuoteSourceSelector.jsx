import './QuoteSourceSelector.css';
import {useQuote} from "@/Context/QuoteContext.tsx";
import {useAuth} from "@/Context/AuthContext.tsx";
import {Session_Post_Login_Quote_Source} from "@/const/config.const.ts";
import {t} from "@/utils/i18n.ts";

const QuoteSourceSelector = () => {
    const {quoteSource, changeQuoteSource} = useQuote();
    const {triggerLogin} = useAuth();

    const handleAllClick = () => {
        changeQuoteSource('all');
    };

    const handleMyClick = () => {
        const success = changeQuoteSource('my');
        if (!success) {
            sessionStorage.setItem(Session_Post_Login_Quote_Source, 'my');
            triggerLogin();
        }
    };

    const handleAdaptiveClick = () => {
        const success = changeQuoteSource('adaptive');
        if (!success) {
            sessionStorage.setItem(Session_Post_Login_Quote_Source, 'adaptive');
            triggerLogin();
        }
    };

    return (
        <div className="quote-source-selector">
            <button
                className={`quote-source-btn ${quoteSource === 'all' ? 'active' : ''}`}
                onClick={handleAllClick}
            >
                {t('allSentences')}
            </button>
            <button
                className={`quote-source-btn ${quoteSource === 'my' ? 'active' : ''}`}
                onClick={handleMyClick}
            >
                {t('mySentencesOnly')}
            </button>
            <button
                className={`quote-source-btn ${quoteSource === 'adaptive' ? 'active' : ''}`}
                onClick={handleAdaptiveClick}
            >
                {t('adaptiveSentences')}
            </button>
        </div>
    );
};

export default QuoteSourceSelector;
