import "./Quote.css";
import { useEffect, useState } from "react";
import { defaultSentences } from "../../utils/sentences";

const QUOTE_INDEX = 0;
const AUTHOR_INDEX = 1;

const shuffledSentences = defaultSentences.sort(() => Math.random() - 0.5);

const shuffledSentencesIndex = Math.floor(
  Math.random() * shuffledSentences.length,
);

const Quote = () => {
  const [sentence, setSentence] = useState(
    shuffledSentences[shuffledSentencesIndex][QUOTE_INDEX],
  );
  const [author, setAuthor] = useState(
    shuffledSentences[shuffledSentencesIndex][AUTHOR_INDEX],
  );
  const [sentencesIndex, setSentencesIndex] = useState(0);

  useEffect(() => {}, []);

  return (
    <div className={"container"}>
      <div>
        {/* QuoteDisplay*/}
        <span>{sentence}</span>
        <span>{author}</span>
      </div>
      {/* QuoteInput */}
      <textarea />
    </div>
  );
};

export default Quote;
