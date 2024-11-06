import { useContext, useEffect, useState } from "react";
import "./Sentence.css";
import { ThemeContext } from "../../../Context/ThemeContext";
import { QuoteContext } from "../../../Context/QuoteContext";

const Sentence = () => {
  const { isDark } = useContext(ThemeContext);
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
          className={`character ${isDark ? "character-dark" : ""}`}
          key={index}
        >
          {character}
        </span>
      ))}
    </div>
  );
};

export default Sentence;
