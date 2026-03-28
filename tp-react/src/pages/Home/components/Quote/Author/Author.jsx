import "./Author.css";
import {useTheme} from "@/Context/ThemeContext.tsx";


const Author = ({author}) => {
    const {isDark} = useTheme();

    return (
        <span className={`author-text ${isDark ? "author-dark" : ""}`}>
      {/*{"- " + author + " -"}*/}
            {author}
    </span>
    );
};

export default Author;
