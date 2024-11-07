import { createContext, useContext, useEffect, useState } from "react";
import { defaultQuotes } from "../const/default-quotes.const";
import { ScoreContext } from "./ScoreContext";

export const QuoteContext = createContext();

export const QuoteContextProvider = ({ children }) => {
  const { inputCheck, setInputCheck } = useContext(ScoreContext);

  const [quotes, setQuotes] = useState(defaultQuotes);
  const [quotesIndex, setQuotesIndex] = useState(0);
  const [sentence, setSentence] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    // 문장 세트 순서
    // 문장 업로드 기능 추가 시 수정
    const initQuotes = defaultQuotes.sort(() => Math.random() - 0.5);

    const initQuotesIndex = Math.floor(Math.random() * initQuotes.length);
    //console.log(initQuotesIndex);

    setQuotes(initQuotes);
    setQuotesIndex(initQuotesIndex);

    setSentence(initQuotes[initQuotesIndex].sentence);
    setAuthor(initQuotes[initQuotesIndex].author);
  }, []);

  useEffect(() => {
    if (quotesIndex < 0) {
      setQuotesIndex(quotes.length - 1);
    } else if (quotesIndex >= quotes.length) {
      setQuotesIndex(0);
    } else {
      /*if (!quotes[quotesIndex]) {
        return;
      }*/

      setInputCheck(() => {
        const sentence = quotes[quotesIndex].sentence;

        return new Array(sentence.length).fill("none");
      });

      setSentence(() => {
        return quotes[quotesIndex].sentence;
      });
      setAuthor(() => {
        return quotes[quotesIndex].author;
      });
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
