import React, {useState} from 'react';
import {useTheme} from '../../Context/ThemeContext';
import {useAuth} from '../../Context/AuthContext';
import {checkNickname, updateNickname} from '../../utils/authApi';
import './ProfilePopup.css';

// UUID 형식 체크 함수
const isUuidFormat = (str) => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const ProfilePopup = ({onClose}) => {
    const {isDark} = useTheme();
    const {user, updateUser} = useAuth();

    // UUID 형식이면 빈 값으로 시작, 아니면 user.nickname 사용
    const [nickname, setNickname] = useState(isUuidFormat(user?.nickname) ? '' : (user?.nickname || ''));
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
    const [checkedNickname, setCheckedNickname] = useState('');

    // UUID 형식이면 항상 변경된 것으로 간주
    const isNicknameChanged = isUuidFormat(user?.nickname) || nickname.trim() !== user?.nickname;

    const handleCheckNickname = async () => {
        const trimmedNickname = nickname.trim();

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
                setCheckedNickname('');
            } else {
                setError('');
                setIsNicknameAvailable(true);
                setCheckedNickname(trimmedNickname);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || '중복 확인에 실패했습니다.';
            setError(errorMessage);
            setIsNicknameAvailable(false);
            setCheckedNickname('');
        } finally {
            setIsChecking(false);
        }
    };

    const handleSave = async () => {
        if (!isNicknameAvailable) {
            setError('닉네임 중복 확인을 먼저 해주세요.');
            return;
        }

        const trimmedNickname = nickname.trim();

        if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            setError('닉네임은 2-10자여야 합니다.');
            return;
        }

        setIsSaving(true);
        try {
            await updateNickname(trimmedNickname);

            // user state 업데이트 (닉네임 + isNewMember false 처리)
            updateUser({
                ...user,
                nickname: trimmedNickname,
                isNewMember: false, // 닉네임 설정 후 신규 회원 상태 해제
            });

            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || '닉네임 수정에 실패했습니다.';
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const newNickname = e.target.value;
        setNickname(newNickname);
        setError('');

        if (newNickname.trim() === '') {
            setIsNicknameAvailable(false);
            return;
        }

        if (newNickname.trim() === checkedNickname) {
            setIsNicknameAvailable(true);
        } else {
            setIsNicknameAvailable(false);
        }
    };

    const isCheckButtonEnabled = nickname.trim().length >= 2 && nickname.trim() !== checkedNickname;

    return (
        <div className="profile-popup-overlay" onClick={onClose}>
            <div className={`profile-popup ${isDark ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
                <h2 className="profile-popup-title">프로필</h2>

                <div className="profile-content">
                    <div className="profile-section">
                        <label className={`profile-label ${isDark ? 'dark' : ''}`}>이메일</label>
                        <div className={`profile-value ${isDark ? 'dark' : ''}`}>{user?.email || '-'}</div>
                    </div>

                    <div className="profile-section">
                        <label className={`profile-label ${isDark ? 'dark' : ''}`}>닉네임</label>
                        <div className="nickname-input-wrapper">
                            <input
                                type="text"
                                className={`profile-input ${isDark ? 'dark' : ''}`}
                                placeholder="닉네임 입력"
                                maxLength={10}
                                value={nickname}
                                onChange={handleInputChange}
                            />
                            {isNicknameChanged && (
                                <button
                                    className={`nickname-check-btn ${isDark ? 'dark' : ''}`}
                                    onClick={handleCheckNickname}
                                    disabled={isChecking || !isCheckButtonEnabled}
                                >
                                    {isChecking ? '확인 중...' : '중복확인'}
                                </button>
                            )}
                        </div>
                        {error && <div className="profile-error">{error}</div>}
                        {isNicknameAvailable && !error && (
                            <div className="profile-success">사용 가능한 닉네임입니다.</div>
                        )}
                    </div>

                    <div className="profile-section">
                        <label className={`profile-label ${isDark ? 'dark' : ''}`}>가입일</label>
                        <div className={`profile-value ${isDark ? 'dark' : ''}`}>
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                        </div>
                    </div>
                </div>

                <div className="profile-buttons">
                    <button
                        className={`profile-btn profile-btn-save ${isDark ? 'dark' : ''}`}
                        onClick={handleSave}
                        disabled={!isNicknameChanged || !isNicknameAvailable || isSaving}
                    >
                        {isSaving ? '저장 중...' : '저장하기'}
                    </button>
                    <button
                        className={`profile-btn profile-btn-close ${isDark ? 'dark' : ''}`}
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePopup;
