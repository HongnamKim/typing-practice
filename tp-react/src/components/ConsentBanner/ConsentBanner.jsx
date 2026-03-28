import {useState} from 'react';
import {useTheme} from '../../Context/ThemeContext';
import {Storage_Consent} from '@/const/config.const.ts';
import './ConsentBanner.css';

export const hasConsent = () => localStorage.getItem(Storage_Consent);

function ConsentBanner({onAccept, onReject}) {
    const {isDark} = useTheme();
    const [visible, setVisible] = useState(() => !hasConsent());

    if (!visible) return null;

    const isKorean = navigator.language.startsWith('ko');

    const handleAccept = () => {
        localStorage.setItem(Storage_Consent, 'accepted');
        setVisible(false);
        if (onAccept) onAccept();
    };

    const handleReject = () => {
        localStorage.setItem(Storage_Consent, 'rejected');
        setVisible(false);
        if (onReject) onReject();
    };

    return (
        <>
            <div className="consent-overlay"/>
            <div className={`consent-banner ${isDark ? 'dark' : ''}`}>
                <p className="consent-text">
                    {isKorean
                        ? '이 사이트는 설정 저장 및 익명 분석을 위해 로컬 저장소를 사용합니다.'
                        : 'This site uses local storage for your preferences and anonymous analytics to improve the service.'}
                </p>
                <div className="consent-actions">
                    <button className="consent-btn consent-btn-reject" onClick={handleReject}>
                        {isKorean ? '거절' : 'Reject'}
                    </button>
                    <button className="consent-btn consent-btn-accept" onClick={handleAccept}>
                        {isKorean ? '확인' : 'Accept'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default ConsentBanner;