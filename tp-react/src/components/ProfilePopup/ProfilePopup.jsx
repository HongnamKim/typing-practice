import React, {useEffect, useState} from 'react';
import {useTheme} from '../../Context/ThemeContext';
import {useAuth} from '../../Context/AuthContext';
import {checkNickname, getMyInfo, updateNickname} from '@/utils/authApi.ts';
import {t} from '@/utils/i18n.ts';
import './ProfilePopup.css';

// UUID 형식 체크 함수
const isUuidFormat = (str) => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const ProfilePopup = ({onClose}) => {
    const {isDark} = useTheme();
    const {updateUser} = useAuth();

    // 프로필 정보 상태
    const [profile, setProfile] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    // UUID 형식이면 빈 값으로 시작, 아니면 nickname 사용
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
    const [checkedNickname, setCheckedNickname] = useState('');

    // 프로필 조회
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getMyInfo();
                const data = response.data;
                setProfile(data);
                setNickname(isUuidFormat(data.nickname) ? '' : data.nickname);
            } catch (err) {
                setError(t('profileLoadFailed'));
            } finally {
                setIsLoadingProfile(false);
            }
        };
        fetchProfile();
    }, []);

    // UUID 형식이면 항상 변경된 것으로 간주
    const isNicknameChanged = profile && (isUuidFormat(profile.nickname) || nickname.trim() !== profile.nickname);

    const handleCheckNickname = async () => {
        const trimmedNickname = nickname.trim();

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
                setCheckedNickname('');
            } else {
                setError('');
                setIsNicknameAvailable(true);
                setCheckedNickname(trimmedNickname);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || t('nicknameCheckFailed');
            setError(errorMessage);
            setIsNicknameAvailable(false);
            setCheckedNickname('');
        } finally {
            setIsChecking(false);
        }
    };

    const handleSave = async () => {
        if (!isNicknameAvailable) {
            setError(t('nicknameCheckFirst'));
            return;
        }

        const trimmedNickname = nickname.trim();

        if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            setError(t('nicknameLength'));
            return;
        }

        setIsSaving(true);
        try {
            await updateNickname(trimmedNickname);

            // AuthContext의 user state 업데이트
            updateUser({
                nickname: trimmedNickname,
                email: profile.email,
                role: profile.role,
                createdAt: profile.createdAt,
                isNewMember: false,
            });

            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || t('nicknameEditFailed');
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

    if (isLoadingProfile) {
        return (
            <div className="profile-popup-overlay" onClick={onClose}>
                <div className={`profile-popup ${isDark ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <div className="profile-loading">{t('loading')}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-popup-overlay" onClick={onClose}>
            <div className={`profile-popup ${isDark ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
                <h2 className="profile-popup-title">{t('profile')}</h2>

                <div className="profile-content">
                    <div className="profile-section">
                        <label className={`profile-label ${isDark ? 'dark' : ''}`}>{t('email')}</label>
                        <div className={`profile-value ${isDark ? 'dark' : ''}`}>{profile?.email || '-'}</div>
                    </div>

                    <div className="profile-section">
                        <label className={`profile-label ${isDark ? 'dark' : ''}`}>{t('nickname')}</label>
                        <div className="nickname-input-wrapper">
                            <input
                                type="text"
                                className={`profile-input ${isDark ? 'dark' : ''}`}
                                placeholder={t('nicknamePlaceholder')}
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
                                    {isChecking ? t('checking') : t('checkDuplicate')}
                                </button>
                            )}
                        </div>
                        {error && <div className="profile-error">{error}</div>}
                        {isNicknameAvailable && !error && (
                            <div className="profile-success">{t('nicknameAvailable')}</div>
                        )}
                    </div>

                    <div className="profile-section">
                        <label className={`profile-label ${isDark ? 'dark' : ''}`}>{t('joinDate')}</label>
                        <div className={`profile-value ${isDark ? 'dark' : ''}`}>
                            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}
                        </div>
                    </div>
                </div>

                <div className="profile-buttons">
                    <button
                        className={`profile-btn profile-btn-save ${isDark ? 'dark' : ''}`}
                        onClick={handleSave}
                        disabled={!isNicknameChanged || !isNicknameAvailable || isSaving}
                    >
                        {isSaving ? t('saving') : t('saveChanges')}
                    </button>
                    <button
                        className={`profile-btn profile-btn-close ${isDark ? 'dark' : ''}`}
                        onClick={onClose}
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePopup;
