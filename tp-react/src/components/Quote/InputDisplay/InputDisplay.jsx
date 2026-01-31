import {useContext} from "react";
import {useTheme} from "../../../Context/ThemeContext";
import {ScoreContext} from "../../../Context/ScoreContext";
import {useSetting} from "../../../Context/SettingContext";
import "./InputDisplay.css";

const InputDisplay = ({input}) => {
    const {isDark} = useTheme();
    const {inputCheck} = useContext(ScoreContext);
    const {fontSize} = useSetting();


    if (!input || !inputCheck) {
        return null;
    }

    return (
        <div className="input-display" style={{fontSize: `${fontSize}rem`}}>
            {input.split("").map((char, index) => {
                const status = inputCheck[index];
                let className = "";

                if (status === "correct") {
                    className = isDark ? "input-char-correct dark" : "input-char-correct";
                } else if (status === "incorrect") {
                    className = "input-char-incorrect";
                } else {
                    // none 상태 - 입력 중인 글자는 회색으로 표시
                    className = isDark ? "input-char-none dark" : "input-char-none";
                }


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
