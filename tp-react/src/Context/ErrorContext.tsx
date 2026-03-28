import {createContext, ReactNode, useContext, useState} from 'react';
import {FaExclamationCircle} from 'react-icons/fa';
import {useTheme} from './ThemeContext';
import {t} from '../utils/i18n';

interface ErrorContextType {
    showError: (message: string) => void;
    clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export const useError = (): ErrorContextType => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within ErrorProvider');
    }
    return context;
};

interface ErrorProviderProps {
    children: ReactNode;
}

export const ErrorProvider = ({children}: ErrorProviderProps) => {
    const {isDark} = useTheme();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const showError = (message: string) => {
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
                            <FaExclamationCircle/>
                        </div>
                        <p className="error-popup-message">{errorMessage}</p>
                        <button className="error-popup-btn" onClick={clearError}>{t('errorConfirm')}</button>
                    </div>
                </div>
            )}
        </ErrorContext.Provider>
    );
};
