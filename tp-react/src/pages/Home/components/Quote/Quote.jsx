import "./Quote.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaPlus} from "react-icons/fa";
import {FaXmark} from "react-icons/fa6";
import Sentence from "./Sentence/Sentence";
import Author from "./Author/Author";
import Input from "./Input/Input";
import InputDisplay from "./InputDisplay/InputDisplay";
import QuoteSourceSelector from "./QuoteSourceSelector/QuoteSourceSelector";
import QuoteMoreMenu from "./QuoteMoreMenu/QuoteMoreMenu";
import QuoteLoading from "./QuoteLoading/QuoteLoading";
import QuoteEmpty from "./QuoteEmpty/QuoteEmpty";
import GoogleLogo from "@/components/GoogleLogo/GoogleLogo.jsx";
import ConsentBanner from "@/components/ConsentBanner/ConsentBanner.jsx";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useQuote} from "@/Context/QuoteContext.tsx";
import {useSetting} from "@/Context/SettingContext.tsx";
import {useAuth} from "@/Context/AuthContext.tsx";
import {Session_Typing_Count, LOGIN_PROMPT_THRESHOLD, Session_Login_Prompt_Dismissed} from "@/const/config.const.ts";
import {t} from "@/utils/i18n.ts";

const Quote = () => {
    const navigate = useNavigate();
    const {isDark} = useTheme();
    const {user, triggerLogin} = useAuth();
    const {author, sentence, isLoading, isEmpty, quotesIndex} = useQuote();
    const {isCompactMode} = useSetting();
    const [inputValue, setInputValue] = useState("");
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    // 비로그인 시 타이핑 완료 횟수 체크
    useEffect(() => {
        if (user || sessionStorage.getItem(Session_Login_Prompt_Dismissed)) {
            setShowLoginPrompt(false);
            return;
        }
        const count = parseInt(sessionStorage.getItem(Session_Typing_Count) || '0', 10);
        setShowLoginPrompt(count >= LOGIN_PROMPT_THRESHOLD);
    }, [user, quotesIndex]);

    const dismissLoginPrompt = () => {
        sessionStorage.setItem(Session_Login_Prompt_Dismissed, 'true');
        setShowLoginPrompt(false);
    };

    useEffect(() => {
        setInputValue("");
    }, [sentence]);

    const getQuoteContainerClassName = () => {
        let className = "quote-container";
        if (isDark) className += " quote-dark";
        if (!isCompactMode) className += " default-mode";
        return className;
    };

    const handleUploadClick = () => {
        if (user) {
            navigate('/quote/upload');
        } else {
            triggerLogin();
        }
    };

    const showLoading = isLoading && !sentence;
    const showEmpty = isEmpty && !isLoading;
    const showContent = !isEmpty && sentence;

    return (
        <div className={getQuoteContainerClassName()}>
            <div className="quote-container-upper">
                <div className="quote-top-row">
                    <QuoteSourceSelector/>
                    <button className="upload-inline-btn" onClick={handleUploadClick}>
                        <FaPlus/>
                        <span>{t('uploadSentence')}</span>
                    </button>
                </div>
                <div className="quote-sub-row">
                    <div className={`author-container ${isDark ? "author-dark" : ""}`}>
                        <Author author={author}/>
                        <QuoteMoreMenu/>
                    </div>
                </div>

                {showLoading && <QuoteLoading/>}
                {showEmpty && <QuoteEmpty/>}
                {showContent && (
                    <div className="sentence-input-wrapper">
                        <Sentence inputLength={inputValue.length} inputValue={inputValue}/>
                        <InputDisplay input={inputValue}/>
                        <Input onInputChange={setInputValue}/>
                    </div>
                )}
                {showLoginPrompt && (
                    <div className="login-prompt-wrapper">
                        <div className="login-prompt">
                            <div className="login-prompt-text">
                                <span className="login-prompt-title">{t('loginPromptTitle')}</span>
                                <span className="login-prompt-desc">{t('loginPromptDesc')}</span>
                            </div>
                            <div className="login-prompt-actions">
                                <button className="login-prompt-btn" onClick={triggerLogin}>
                                    <GoogleLogo/>
                                    <span>{t('googleLogin')}</span>
                                </button>
                                <button className="login-prompt-close" onClick={dismissLoginPrompt}><FaXmark/></button>
                            </div>
                        </div>
                        <ConsentBanner/>
                    </div>
                )}
                {!showLoginPrompt && <ConsentBanner/>}
            </div>
        </div>
    );
};

export default Quote;
