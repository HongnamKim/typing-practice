import {useTheme} from '../../Context/ThemeContext';
import {t} from '@/utils/i18n.ts';
import './ConfirmPopup.css';

const ConfirmPopup = ({message, onConfirm, onCancel, confirmText = t('confirm'), cancelText = t('cancel'), isDanger = false, showCancel = true}) => {
    const {isDark} = useTheme();
    
    return (
        <div className={`confirm-popup-overlay ${isDark ? 'dark' : ''}`} onClick={showCancel ? onCancel : undefined}>
            <div className="confirm-popup" onClick={e => e.stopPropagation()}>
                <p className="confirm-popup-message">{message}</p>
                <div className="confirm-popup-actions">
                    {showCancel && (
                        <button className="confirm-popup-cancel-btn" onClick={onCancel}>
                            {cancelText}
                        </button>
                    )}
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
