import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTheme} from '../../Context/ThemeContext';
import {useAuth} from '../../Context/AuthContext';
import {logout as logoutApi} from '../../utils/authApi';
import ProfilePopup from '../ProfilePopup/ProfilePopup';
import {FaChevronDown, FaCog, FaFileAlt, FaFlag, FaSignOutAlt, FaUser} from 'react-icons/fa';
import {t} from '@/utils/i18n.ts';
import './ProfileDropdown.css';

// UUID 형식 체크 함수
const isUuidFormat = (str) => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const {isDark} = useTheme();
    const {user, logout} = useAuth();
    //const {showError} = useError();
    const [isOpen, setIsOpen] = useState(false);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const dropdownRef = useRef(null);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleMenuClick = async (action) => {
        setIsOpen(false);

        switch (action) {
            case 'my-sentences':
                navigate('/quote/my');
                break;
            case 'my-reports':
                navigate('/quote/report');
                break;
            case 'settings':
                setShowProfilePopup(true);
                break;
            case 'logout':
                try {
                    await logoutApi();
                    logout();
                } catch (error) {
                    console.error('로그아웃 실패:', error);
                    // 로그아웃 API 실패해도 클라이언트에서는 로그아웃 처리
                    logout();
                }
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className="profile-container" ref={dropdownRef}>
                <button
                    className={`profile-btn ${isDark ? 'dark' : ''}`}
                    onClick={toggleDropdown}
                >
                    <FaUser/>
                    <span>{isUuidFormat(user?.nickname) ? t('setNicknameBtn') : (user?.nickname || t('user'))}</span>
                    <FaChevronDown style={{fontSize: '0.7rem'}}/>
                </button>

                {isOpen && (
                    <div className={`dropdown-menu ${isDark ? 'dark' : ''}`}>
                        <button
                            className={`dropdown-item ${isDark ? 'dark' : ''}`}
                            onClick={() => handleMenuClick('my-sentences')}
                        >
                            <FaFileAlt/>
                            <span>{t('mySentences')}</span>
                        </button>
                        <button
                            className={`dropdown-item ${isDark ? 'dark' : ''}`}
                            onClick={() => handleMenuClick('settings')}
                        >
                            <FaCog/>
                            <span>{t('profile')}</span>
                        </button>
                        <button
                            className={`dropdown-item ${isDark ? 'dark' : ''}`}
                            onClick={() => handleMenuClick('my-reports')}
                        >
                            <FaFlag/>
                            <span>{t('reportHistory')}</span>
                        </button>
                        <div className={`dropdown-divider ${isDark ? 'dark' : ''}`}></div>
                        <button
                            className={`dropdown-item ${isDark ? 'dark' : ''}`}
                            onClick={() => handleMenuClick('logout')}
                        >
                            <FaSignOutAlt/>
                            <span>{t('logout')}</span>
                        </button>
                    </div>
                )}
            </div>

            {showProfilePopup && (
                <ProfilePopup onClose={() => setShowProfilePopup(false)}/>
            )}
        </>
    );
};

export default ProfileDropdown;
