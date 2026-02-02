import {createContext, useContext, useState} from 'react';
import {FaExclamationCircle} from 'react-icons/fa';
import {useTheme} from './ThemeContext';

const ErrorContext = createContext();

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within ErrorProvider');
    }
    return context;
};

export const ErrorProvider = ({children}) => {
    const {isDark} = useTheme();
    const [errorMessage, setErrorMessage] = useState(null);

    const showError = (message) => {
        setErrorMessage(message);
    };

    const clearError = () => {
        setErrorMessage(null);
    };

    return (
        <ErrorContext.Provider value={{showError, clearError}}>
            {children}

            {/* 에러 팝업 */}
            {errorMessage && (
                <div className={`error-popup-overlay ${isDark ? 'dark' : ''}`} onClick={clearError}>
                    <div className="error-popup" onClick={e => e.stopPropagation()}>
                        <div className="error-popup-icon">
                            <FaExclamationCircle />
                        </div>
                        <p className="error-popup-message">{errorMessage}</p>
                        <button className="error-popup-btn" onClick={clearError}>확인</button>
                    </div>
                </div>
            )}
        </ErrorContext.Provider>
    );
};
