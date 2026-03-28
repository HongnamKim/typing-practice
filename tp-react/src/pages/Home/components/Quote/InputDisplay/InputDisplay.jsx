import "./InputDisplay.css";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useScore} from "@/Context/ScoreContext.tsx";
import {useSetting} from "@/Context/SettingContext.tsx";

const InputDisplay = ({input}) => {
    const {isDark} = useTheme();
    const {inputCheck} = useScore();
    const {fontSize} = useSetting();


    if (!input || !inputCheck) {
        return null;
    }

    return (
        <div className="input-display" style={{fontSize: `${fontSize}rem`}}>
            {input.split("").map((char, index) => {
                const status = inputCheck[index];
                const className =
                    status === "correct"
                        ? isDark ? "input-char-correct dark" : "input-char-correct"
                        : status === "incorrect"
                            ? "input-char-incorrect"
                            : isDark ? "input-char-none dark" : "input-char-none";

                return (
                    <span key={index} className={className}>
            {char}
          </span>
                );
            })}
        </div>
    );
};

export default InputDisplay;
