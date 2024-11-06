import "./Quote.css";
import { useContext } from "react";
import Sentence from "./Sentence/Sentence";
import Author from "./Author/Author";
import { ThemeContext } from "../../Context/ThemeContext";
import Input from "./Input/Input";
import { QuoteContext } from "../../Context/QuoteContext";

const Quote = () => {
  const { isDark } = useContext(ThemeContext);
  const { author } = useContext(QuoteContext);
  /**
   * Quote : 인용문 = 문장 (sentence) + 저자 (author)
   * Sentence : 문장
   * Author : 저자
   */
  /*const [quotes, setQuotes] = useState(null);
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
  }, []);*/

  return (
    <div className={`quote-container ${isDark ? "quote-dark" : ""}`}>
      <div className={"quote-container-upper"}>
        {/* QuoteDisplay*/}
        <div className={`author-container ${isDark ? "author-dark" : ""}`}>
          <Author author={author} />
        </div>
        <Sentence />
      </div>
      {/* QuoteInput */}
      <Input />
    </div>
  );
};

export default Quote;
