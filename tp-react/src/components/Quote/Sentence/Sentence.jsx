import { useContext, useEffect, useState } from "react";
import "./Sentence.css";
import { ThemeContext } from "../../../Context/ThemeContext";
import { QuoteContext } from "../../../Context/QuoteContext";
import { ScoreContext } from "../../../Context/ScoreContext";

const Sentence = () => {
  const { isDark } = useContext(ThemeContext);
  const { inputCheck } = useContext(ScoreContext);
  const { sentence } = useContext(QuoteContext);
  const [characters, setCharacters] = useState(sentence.split(""));

  useEffect(() => {
    setCharacters(sentence.split(""));
  }, [sentence]);

  //const characters = sentence.split("");

  return (
    <div className={"character-container"}>
      {characters.map((character, index) => (
        <span
          className={`character ${isDark ? "character-dark" : ""} ${inputCheck[index] === "correct" ? "character-correct" : inputCheck[index] === "incorrect" ? "character-incorrect" : ""}`}
          key={index}
        >
          {character}
        </span>
      ))}
    </div>
  );
};

export default Sentence;
