import "./Quote.css";
import {useEffect, useState} from "react";
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

const Quote = () => {
    const {isDark} = useTheme();
    const {author, sentence, isLoading, isEmpty} = useQuote();
    const {isCompactMode} = useSetting();
    const [inputValue, setInputValue] = useState("");

    // 문장이 변경되면 inputValue 초기화
    useEffect(() => {
        setInputValue("");
    }, [sentence]);

    const getQuoteContainerClassName = () => {
        let className = "quote-container";
        if (isDark) className += " quote-dark";
        if (!isCompactMode) className += " default-mode";
        return className;
    };

    const showLoading = isLoading && !sentence;
    const showEmpty = isEmpty && !isLoading;
    const showContent = !isEmpty && sentence;

    return (
        <div className={getQuoteContainerClassName()}>
            <div className="quote-container-upper">
                {/* 문장 소스 선택 + 저자 */}
                <div className="quote-top-row">
                    <QuoteSourceSelector/>
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
