import {useTheme} from '../../Context/ThemeContext';
import './ConfirmPopup.css';

const ConfirmPopup = ({message, onConfirm, onCancel, confirmText = '확인', cancelText = '취소', isDanger = false}) => {
    const {isDark} = useTheme();
    
    return (
        <div className={`confirm-popup-overlay ${isDark ? 'dark' : ''}`} onClick={onCancel}>
            <div className="confirm-popup" onClick={e => e.stopPropagation()}>
                <p className="confirm-popup-message">{message}</p>
                <div className="confirm-popup-actions">
                    <button className="confirm-popup-cancel-btn" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        className={`confirm-popup-ok-btn ${isDanger ? 'danger' : ''}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPopup;
