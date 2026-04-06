import {useEffect, useState} from 'react';
import {Storage_Anonymous_Id, Storage_Consent, Session_Typing_Count, CONSENT_BANNER_THRESHOLD} from '@/const/config.const.ts';
import {t} from '@/utils/i18n.ts';
import './ConsentBanner.css';

export const hasConsent = () => localStorage.getItem(Storage_Consent);

function ConsentBanner() {
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (hasConsent()) return;

        // 마운트 시 현재 카운트 확인
        const currentCount = parseInt(sessionStorage.getItem(Session_Typing_Count) || '0', 10);
        if (currentCount >= CONSENT_BANNER_THRESHOLD) {
            setVisible(true);
            return;
        }

        const handleTypingCount = (e) => {
            if (e.detail >= CONSENT_BANNER_THRESHOLD && !hasConsent()) {
                setVisible(true);
            }
        };

        window.addEventListener('typing-count-update', handleTypingCount);
        return () => window.removeEventListener('typing-count-update', handleTypingCount);
    }, []);

    if (!visible) return null;

    const handleAccept = () => {
        localStorage.setItem(Storage_Consent, 'accepted');
        if (!localStorage.getItem(Storage_Anonymous_Id)) {
            localStorage.setItem(Storage_Anonymous_Id, crypto.randomUUID());
        }
        setVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem(Storage_Consent, 'rejected');
        setVisible(false);
    };

    return (
        <div className="consent-inline">
            <div className="consent-inline-main">
                <div className="consent-inline-text">
                    <span className="consent-inline-title">{t('consentTitle')}</span>
                    <span className="consent-inline-desc">{t('consentDesc')}</span>
                </div>
                <div className="consent-inline-actions">
                    <button className="consent-inline-btn consent-inline-accept" onClick={handleAccept}>
                        {t('consentAccept')}
                    </button>
                    <button className="consent-inline-btn consent-inline-reject" onClick={handleReject}>
                        {t('consentReject')}
                    </button>
                </div>
            </div>
            {showDetails && (
                <div className="consent-inline-details">
                    <div className="consent-inline-detail-item">
                        <span className="consent-inline-detail-label">{t('consentAnonymousId')}</span>
                        <span className="consent-inline-detail-desc">{t('consentAnonymousIdDesc')}</span>
                    </div>
                    <div className="consent-inline-detail-item">
                        <span className="consent-inline-detail-label">{t('consentDeviceType')}</span>
                        <span className="consent-inline-detail-desc">{t('consentDeviceTypeDesc')}</span>
                    </div>
                    <div className="consent-inline-detail-item">
                        <span className="consent-inline-detail-label">{t('consentReferrer')}</span>
                        <span className="consent-inline-detail-desc">{t('consentReferrerDesc')}</span>
                    </div>
                    <div className="consent-inline-detail-item">
                        <span className="consent-inline-detail-label">{t('consentSession')}</span>
                        <span className="consent-inline-detail-desc">{t('consentSessionDesc')}</span>
                    </div>
                </div>
            )}
            <button className="consent-inline-more" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? t('consentLess') : t('consentMore')}
            </button>
        </div>
    );
}

export default ConsentBanner;
