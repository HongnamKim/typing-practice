import React, {useState} from 'react';
import {useTheme} from '../../Context/ThemeContext';
import {checkNickname, updateNickname} from '../../utils/authApi';
import './NicknamePopup.css';

// UUID 형식 체크 함수
const isUuidFormat = (str) => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const NicknamePopup = ({defaultNickname, isNewMember, onSubmit, onClose}) => {
    const {isDark} = useTheme();
    // UUID 형식이면 빈 값으로 시작, 아니면 defaultNickname 사용
    const [nickname, setNickname] = useState(isUuidFormat(defaultNickname) ? '' : (defaultNickname || ''));
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
    const [lastCheckedNickname, setLastCheckedNickname] = useState(''); // 마지막으로 중복확인 통과한 닉네임

    const handleCheckNickname = async () => {
        const trimmedNickname = nickname.trim();

        // 유효성 검증
        if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            setError('닉네임은 2-10자여야 합니다.');
            return;
        }

        setIsChecking(true);
        setError('');

        try {
            const isDuplicate = await checkNickname(trimmedNickname);

            if (isDuplicate) {
                setError('이미 사용 중인 닉네임입니다.');
                setIsNicknameAvailable(false);
                setLastCheckedNickname(''); // 실패 시 초기화
            } else {
                setError('');
                setIsNicknameAvailable(true);
                setLastCheckedNickname(trimmedNickname); // 통과한 닉네임 저장
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || '중복 확인에 실패했습니다.';
            setError(errorMessage);
            setIsNicknameAvailable(false);
            setLastCheckedNickname(''); // 에러 시 초기화
        } finally {
            setIsChecking(false);
        }
    };

    const handleSubmit = async () => {
        if (!isNicknameAvailable) {
            setError('닉네임 중복 확인을 먼저 해주세요.');
            return;
        }

        const trimmedNickname = nickname.trim();

        if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            setError('닉네임은 2-10자여야 합니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateNickname(trimmedNickname);
            onSubmit(trimmedNickname);
        } catch (err) {
            // axios 에러 메시지 파싱
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || '닉네임 설정에 실패했습니다.';
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
                <h2 className="nickname-popup-title">환영합니다! 🎉</h2>
                <p className={`nickname-popup-description ${isDark ? 'dark' : ''}`}>
                    닉네임을 설정해주세요. (2-10자)
                </p>
                <div className="nickname-input-group">
                    <label className={`nickname-label ${isDark ? 'dark' : ''}`} htmlFor="nicknameInput">
                        닉네임
                    </label>
                    <div className="nickname-input-wrapper">
                        <input
                            type="text"
                            className={`nickname-input ${isDark ? 'dark' : ''}`}
                            id="nicknameInput"
                            placeholder="닉네임 입력"
                            maxLength={10}
                            value={nickname}
                            onChange={handleInputChange}
                        />
                        <button
                            className={`nickname-check-btn ${isDark ? 'dark' : ''}`}
                            onClick={handleCheckNickname}
                            disabled={isChecking || !isCheckButtonEnabled}
                        >
                            {isChecking ? '확인 중...' : '중복확인'}
                        </button>
                    </div>
                    {error && <div className="nickname-error show">{error}</div>}
                    {isNicknameAvailable && !error && (
                        <div className="nickname-success">사용 가능한 닉네임입니다.</div>
                    )}
                    <div className={`nickname-helper ${isDark ? 'dark' : ''}`}>
                        한글, 영문, 숫자 사용 가능
                    </div>
                </div>
                <button
                    className="nickname-popup-btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isNicknameAvailable}
                >
                    {isSubmitting ? '설정 중...' : '시작하기'}
                </button>
            </div>
        </div>
    );
};

export default NicknamePopup;
