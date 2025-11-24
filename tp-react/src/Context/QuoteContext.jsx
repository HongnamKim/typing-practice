import { createContext, useContext, useEffect, useState } from "react";
import { defaultQuotes } from "../const/default-quotes.const";
import { ScoreContext } from "./ScoreContext";

export const QuoteContext = createContext();

export const QuoteContextProvider = ({ children }) => {
  const { setInputCheck } = useContext(ScoreContext);

  const [quotes, setQuotes] = useState(defaultQuotes);
  const [quotesIndex, setQuotesIndex] = useState(0);
  const [sentence, setSentence] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    // 문장 세트 순서
    // 문장 업로드 기능 추가 시 수정
    const initQuotes = defaultQuotes.sort(() => Math.random() - 0.5);

    const initQuotesIndex = Math.floor(Math.random() * initQuotes.length);


    setQuotes(initQuotes);
    setQuotesIndex(initQuotesIndex);

    const initialQuote = initQuotes[initQuotesIndex];
    
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
