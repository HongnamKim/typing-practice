import {FaExclamationCircle, FaGoogle} from 'react-icons/fa';
import {useTheme} from '../../Context/ThemeContext';
import {useAuth} from '../../Context/AuthContext';
import './LoginRequiredPopup.css';

const LoginRequiredPopup = ({message, onClose}) => {
    const {isDark} = useTheme();
    const {triggerLogin} = useAuth();

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleLogin = () => {
        onClose();
        triggerLogin();
    };

    return (
        <div className={`login-required-overlay ${isDark ? 'dark' : ''}`} onClick={handleOverlayClick}>
            <div className={`login-required-popup ${isDark ? 'dark' : ''}`}>
                <FaExclamationCircle className="login-required-icon"/>
                <p className="login-required-message">{message}</p>
                <div className="login-required-actions">
                    <button
                        className="login-required-login-btn"
                        onClick={handleLogin}
                    >
                        <FaGoogle/>
                        <span>구글 로그인</span>
                    </button>
                    <button
                        className={`login-required-cancel-btn ${isDark ? 'dark' : ''}`}
                        onClick={onClose}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginRequiredPopup;
