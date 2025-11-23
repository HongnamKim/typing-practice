import "./Author.css";
import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

const Author = ({ author }) => {
  const { isDark } = useContext(ThemeContext);

  return (
    <span className={`author-text ${isDark ? "author-dark" : ""}`}>
      {/*{"- " + author + " -"}*/}
        {"- " + author}
    </span>
  );
};

export default Author;
