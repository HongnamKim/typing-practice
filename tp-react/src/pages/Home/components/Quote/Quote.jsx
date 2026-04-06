import "./Quote.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaPlus} from "react-icons/fa";
import Sentence from "./Sentence/Sentence";
import Author from "./Author/Author";
import Input from "./Input/Input";
import InputDisplay from "./InputDisplay/InputDisplay";
import QuoteSourceSelector from "./QuoteSourceSelector/QuoteSourceSelector";
import QuoteMoreMenu from "./QuoteMoreMenu/QuoteMoreMenu";
import QuoteLoading from "./QuoteLoading/QuoteLoading";
import QuoteEmpty from "./QuoteEmpty/QuoteEmpty";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useQuote} from "@/Context/QuoteContext.tsx";
import {useSetting} from "@/Context/SettingContext.tsx";
import {useAuth} from "@/Context/AuthContext.tsx";
import {t} from "@/utils/i18n.ts";

const Quote = () => {
    const navigate = useNavigate();
    const {isDark} = useTheme();
    const {user, triggerLogin} = useAuth();
    const {author, sentence, isLoading, isEmpty} = useQuote();
    const {isCompactMode} = useSetting();
    const [inputValue, setInputValue] = useState("");

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
            </div>
        </div>
    );
};

export default Quote;
