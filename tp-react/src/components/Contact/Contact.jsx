import {useTheme} from "../../Context/ThemeContext";
import {Link} from "react-router-dom";
import "./Contact.css";

const Contact = () => {
    const {isDark} = useTheme();

    return (
        <div className={`contact-wrapper ${isDark && "dark"}`}>
            <div className="contact-links">
                <a
                    href={"mailto:khn4636@gmail.com"}
                    className={`contact ${isDark && "dark"}`}
                >
                    Email
                </a>
                <a
                    href={"https://open.kakao.com/o/sMHDrAog"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`contact ${isDark && "dark"}`}
                >
                    KakaoTalk
                </a>
                <Link to="/privacy" className={`contact ${isDark && "dark"}`}>
                    Privacy Policy
                </Link>
                <Link to="/terms" className={`contact ${isDark && "dark"}`}>
                    Terms
                </Link>
            </div>
            <span className="contact-copyright">&copy; 2025 typing-practice.com</span>
        </div>
    );
};

export default Contact;
