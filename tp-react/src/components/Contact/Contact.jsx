import { useTheme } from "../../Context/ThemeContext";
import { Link } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
  const { isDark } = useTheme();

  return (
    <div className={`contact-wrapper ${isDark && "dark"}`}>
      <a
        href={"https://open.kakao.com/o/sMHDrAog"}
        target="_blank"
        rel="noopener noreferrer"
        className={`contact ${isDark && "dark"}`}
      >
        Contact
      </a>
      <Link to="/privacy" className={`contact ${isDark && "dark"}`}>
        Privacy Policy
      </Link>
    </div>
  );
};

export default Contact;
