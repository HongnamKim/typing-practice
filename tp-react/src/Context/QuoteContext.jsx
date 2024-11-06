import { createContext, useEffect, useState } from "react";
import { defaultQuotes } from "../const/default-quotes.const";

export const QuoteContext = createContext();

//export const useQuoteContext = useContext(QuoteContext);

export const QuoteContextProvider = ({ children }) => {
  const [quotes, setQuotes] = useState(null);
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

    setSentence(initQuotes[initQuotesIndex].sentence);
    setAuthor(initQuotes[initQuotesIndex].author);
  }, []);

  console.log(quotesIndex);

  useEffect(() => {
    if (quotesIndex) {
      setSentence(quotes[quotesIndex].sentence);
      setAuthor(quotes[quotesIndex].author);
    }
  }, [quotesIndex]);

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
