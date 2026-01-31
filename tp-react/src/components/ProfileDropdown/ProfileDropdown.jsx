import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '../../Context/ThemeContext';
import {useAuth} from '../../Context/AuthContext';
import {logout as logoutApi} from '../../utils/authApi';
import ProfilePopup from '../ProfilePopup/ProfilePopup';
import {FaChartBar, FaChevronDown, FaCog, FaFileAlt, FaSignOutAlt, FaUser} from 'react-icons/fa';
import './ProfileDropdown.css';

// UUID 형식 체크 함수
const isUuidFormat = (str) => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const ProfileDropdown = () => {
    const {isDark} = useTheme();
    const {user, logout} = useAuth();
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
                alert('내 문장 기능 (준비 중)');
                break;
            case 'stats':
                alert('통계 기능 (준비 중)');
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
                    <span>{isUuidFormat(user?.nickname) ? '닉네임 설정' : (user?.nickname || '사용자')}</span>
                    <FaChevronDown style={{fontSize: '0.7rem'}}/>
                </button>

                {isOpen && (
                    <div className={`dropdown-menu ${isDark ? 'dark' : ''}`}>
                        <button
                            className={`dropdown-item ${isDark ? 'dark' : ''}`}
                            onClick={() => handleMenuClick('my-sentences')}
                        >
                            <FaFileAlt/>
                            <span>내 문장</span>
                        </button>
                        <button
                            className={`dropdown-item ${isDark ? 'dark' : ''}`}
                            onClick={() => handleMenuClick('stats')}
                        >
                            <FaChartBar/>
                            <span>통계</span>
                        </button>
                        <button
                            className={`dropdown-item ${isDark ? 'dark' : ''}`}
                            onClick={() => handleMenuClick('settings')}
                        >
                            <FaCog/>
                            <span>프로필</span>
                        </button>
                        <div className={`dropdown-divider ${isDark ? 'dark' : ''}`}></div>
                        <button
                            className={`dropdown-item ${isDark ? 'dark' : ''}`}
                            onClick={() => handleMenuClick('logout')}
                        >
                            <FaSignOutAlt/>
                            <span>로그아웃</span>
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
