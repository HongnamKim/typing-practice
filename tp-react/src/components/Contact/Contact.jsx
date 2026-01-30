import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import "./Contact.css";

const Contact = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <a
      href={"https://open.kakao.com/o/sMHDrAog"}
      target="_blank"
      rel="noopener noreferrer"
      className={`contact ${isDark && "dark"}`}
    >
      Contact
    </a>
  );
};

export default Contact;
