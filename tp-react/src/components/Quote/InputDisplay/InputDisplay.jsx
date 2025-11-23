import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import { ScoreContext } from "../../../Context/ScoreContext";
import { SettingContext } from "../../../Context/SettingContext";
import "./InputDisplay.css";

const InputDisplay = ({ input }) => {
  const { isDark } = useContext(ThemeContext);
  const { inputCheck } = useContext(ScoreContext);
  const { fontSize } = useContext(SettingContext);

  // 디버깅용 로그
  console.log("InputDisplay - input:", input);
  console.log("InputDisplay - inputCheck:", inputCheck?.slice(0, input?.length));

  if (!input || !inputCheck) {
    return null;
  }

  return (
    <div className="input-display" style={{ fontSize: `${fontSize}rem` }}>
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

        console.log(`Char ${index} (${char}): status=${status}, className=${className}`);

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
