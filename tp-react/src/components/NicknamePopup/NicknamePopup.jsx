import React, {useState} from 'react';
import {useTheme} from '../../Context/ThemeContext';
import {checkNickname, updateNickname} from '@/utils/authApi.ts';
import {t} from '@/utils/i18n.ts';
import './NicknamePopup.css';

// UUID 형식 체크 함수
const isUuidFormat = (str) => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const NicknamePopup = ({initialNickname, onSubmit}) => {
    const {isDark} = useTheme();
    // UUID 형식이면 빈 값으로 시작, 아니면 initialNickname 사용
    const [nickname, setNickname] = useState(isUuidFormat(initialNickname) ? '' : (initialNickname || ''));
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
    const [lastCheckedNickname, setLastCheckedNickname] = useState(''); // 마지막으로 중복확인 통과한 닉네임

    const handleCheckNickname = async () => {
        const trimmedNickname = nickname.trim();

        // 유효성 검증
        if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            setError(t('nicknameLength'));
            return;
        }

        setIsChecking(true);
        setError('');

        try {
            const isDuplicate = await checkNickname(trimmedNickname);

            if (isDuplicate) {
                setError(t('nicknameDuplicate'));
                setIsNicknameAvailable(false);
                setLastCheckedNickname(''); // 실패 시 초기화
            } else {
                setError('');
                setIsNicknameAvailable(true);
                setLastCheckedNickname(trimmedNickname); // 통과한 닉네임 저장
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || t('nicknameCheckFailed');
            setError(errorMessage);
            setIsNicknameAvailable(false);
            setLastCheckedNickname(''); // 에러 시 초기화
        } finally {
            setIsChecking(false);
        }
    };

    const handleSubmit = async () => {
        if (!isNicknameAvailable) {
            setError(t('nicknameCheckFirst'));
            return;
        }

        const trimmedNickname = nickname.trim();

        if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            setError(t('nicknameLength'));
            return;
        }

        setIsSubmitting(true);
        try {
            await updateNickname(trimmedNickname);
            onSubmit(trimmedNickname);
        } catch (err) {
            // axios 에러 메시지 파싱
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || t('nicknameSetFailed');
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const newNickname = e.target.value;
        setNickname(newNickname);
        setError('');

        // 빈 값이면 사용 불가
        if (newNickname.trim() === '') {
            setIsNicknameAvailable(false);
            return;
        }

        // 입력값이 마지막 중복확인 통과한 닉네임과 같으면 사용 가능 상태 유지
        if (newNickname.trim() === lastCheckedNickname) {
            setIsNicknameAvailable(true);
        } else {
            setIsNicknameAvailable(false);
        }
    };

    // 중복확인 버튼 활성화 조건: 현재 입력값이 마지막 중복확인 통과한 닉네임과 다름
    const isCheckButtonEnabled = nickname.trim().length >= 2 && nickname.trim() !== lastCheckedNickname;

    return (
        <div className="nickname-popup-overlay">
            <div className={`nickname-popup ${isDark ? 'dark' : ''}`}>
                <h2 className="nickname-popup-title">{t('welcome')}</h2>
                <p className={`nickname-popup-description ${isDark ? 'dark' : ''}`}>
                    {t('setNickname')}
                </p>
                <div className="nickname-input-group">
                    <div className="nickname-input-wrapper">
                        <input
                            type="text"
                            className={`nickname-input ${isDark ? 'dark' : ''}`}
                            id="nicknameInput"
                            placeholder={t('nicknamePlaceholder')}
                            maxLength={10}
                            value={nickname}
                            onChange={handleInputChange}
                        />
                        <button
                            className={`nickname-check-btn ${isDark ? 'dark' : ''}`}
                            onClick={handleCheckNickname}
                            disabled={isChecking || !isCheckButtonEnabled}
                        >
                            {isChecking ? t('checking') : t('checkDuplicate')}
                        </button>
                    </div>
                    {error && <div className="nickname-error show">{error}</div>}
                    {isNicknameAvailable && !error && (
                        <div className="nickname-success">{t('nicknameAvailable')}</div>
                    )}
                    <div className={`nickname-helper ${isDark ? 'dark' : ''}`}>
                        {t('nicknameHelper')}
                    </div>
                </div>
                <button
                    className="nickname-popup-btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isNicknameAvailable}
                >
                    {isSubmitting ? t('setting') : t('start')}
                </button>
            </div>
        </div>
    );
};

export default NicknamePopup;
