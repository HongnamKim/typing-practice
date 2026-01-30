import Title from "./title/Title";
import DarkModeButton from "./themeButton/DarkModeButton";
import "./Head.css";

const Head = () => {
  return (
    <div className={"head"}>
      <Title />
      <DarkModeButton />
    </div>
  );
};

export default Head;
