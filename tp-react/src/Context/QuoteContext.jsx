import {createContext, useContext, useEffect, useState} from "react";
import {defaultQuotes} from "../const/default-quotes.const";
import {ScoreContext} from "./ScoreContext";

export const QuoteContext = createContext();

export const QuoteContextProvider = ({children}) => {
    const {setInputCheck} = useContext(ScoreContext);

    const [quotes, setQuotes] = useState(defaultQuotes);
    const [quotesIndex, setQuotesIndex] = useState(0);
    const [sentence, setSentence] = useState("");
    const [author, setAuthor] = useState("");

    useEffect(() => {
        // Fisher-Yates 셔플
        const shuffleArray = (array) => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        console.log(defaultQuotes.length);

        const initQuotes = shuffleArray(defaultQuotes);

        setQuotes(initQuotes);
        setQuotesIndex(0);

        const initialQuote = initQuotes[0];

        if (initialQuote && initialQuote.sentence) {
            setSentence(initialQuote.sentence);
            setAuthor(initialQuote.author);
            setInputCheck(new Array(initialQuote.sentence.length).fill("none"));
        }
    }, [setInputCheck]);

    useEffect(() => {
        if (quotesIndex < 0) {
            setQuotesIndex(quotes.length - 1);
            return;
        }

        if (quotesIndex >= quotes.length) {
            setQuotesIndex(0);
            return;
        }

        const currentQuote = quotes[quotesIndex];

        if (!currentQuote || !currentQuote.sentence) {
            return;
        }

        setInputCheck(() => {
            return new Array(currentQuote.sentence.length).fill("none");
        });

        setSentence(currentQuote.sentence);
        setAuthor(currentQuote.author);
    }, [quotesIndex, quotes, setInputCheck]);

    return (
        <QuoteContext.Provider
            value={{
                sentence,
                author,
                quotesIndex,
                setQuotesIndex,
            }}
        >
            {children}
        </QuoteContext.Provider>
    );
};
