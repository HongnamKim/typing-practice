import {useState} from 'react';
import {useTheme} from '../../Context/ThemeContext';
import {Storage_Anonymous_Id, Storage_Consent} from '@/const/config.const.ts';
import './ConsentBanner.css';

export const hasConsent = () => localStorage.getItem(Storage_Consent);

const isKorean = navigator.language.startsWith('ko');

function ConsentBanner() {
    const {isDark} = useTheme();
    const [visible, setVisible] = useState(() => !hasConsent());
    const [showDetails, setShowDetails] = useState(false);

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
        <div className="consent-overlay">
            <div className={`consent-banner ${isDark ? 'dark' : ''}`}>
                <p className="consent-title">
                    {isKorean ? '더 나은 서비스를 위해' : 'Help us improve'}
                </p>
                <p className="consent-desc">
                    {isKorean
                        ? '서비스 개선을 위해 익명 사용 데이터를 수집합니다. 개인을 식별할 수 없습니다.'
                        : 'We collect anonymous usage data to improve the service. It cannot identify you personally.'}
                </p>

                {showDetails && (
                    <div className="consent-details">
                        <div className="consent-detail-item">
                            <span className="consent-detail-label">
                                {isKorean ? '익명 식별자' : 'Anonymous ID'}
                            </span>
                            <span className="consent-detail-desc">
                                {isKorean
                                    ? '이름, 이메일 등 개인정보와 연결되지 않습니다.'
                                    : 'Not linked to any personal information like name or email.'}
                            </span>
                        </div>
                        <div className="consent-detail-item">
                            <span className="consent-detail-label">
                                {isKorean ? '기기 유형' : 'Device type'}
                            </span>
                            <span className="consent-detail-desc">
                                {isKorean
                                    ? '모바일 / 태블릿 / 데스크톱 중 어떤 환경인지 확인합니다.'
                                    : 'Whether you\'re on mobile, tablet, or desktop.'}
                            </span>
                        </div>
                        <div className="consent-detail-item">
                            <span className="consent-detail-label">
                                {isKorean ? '유입 경로' : 'Referrer'}
                            </span>
                            <span className="consent-detail-desc">
                                {isKorean
                                    ? '어떤 사이트에서 방문했는지 확인합니다.'
                                    : 'Which site you came from.'}
                            </span>
                        </div>
                        <div className="consent-detail-item">
                            <span className="consent-detail-label">
                                {isKorean ? '세션 정보' : 'Session info'}
                            </span>
                            <span className="consent-detail-desc">
                                {isKorean
                                    ? '한 번의 방문 동안만 유지되며, 탭을 닫으면 자동으로 삭제됩니다.'
                                    : 'Only kept during your visit. Automatically deleted when you close the tab.'}
                            </span>
                        </div>
                    </div>
                )}

                <div className="consent-actions">
                    <button className="consent-btn consent-btn-accept" onClick={handleAccept}>
                        {isKorean ? '동의' : 'Accept'}
                    </button>
                    <button className="consent-btn consent-btn-reject" onClick={handleReject}>
                        {isKorean ? '거절' : 'Reject'}
                    </button>
                </div>
                <button
                    className="consent-more-btn"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails
                        ? (isKorean ? '접기' : 'Less')
                        : (isKorean ? '자세히 보기' : 'More info')}
                </button>
            </div>
        </div>
    );
}

export default ConsentBanner;
