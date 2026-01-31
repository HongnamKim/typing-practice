import React from 'react';
import {useTheme} from '../../Context/ThemeContext';
import {FaUser} from 'react-icons/fa';
import './LoginButton.css';

const LoginButton = ({onClick}) => {
    const {isDark} = useTheme();

    return (
        <button className={`header-btn ${isDark ? 'dark' : ''}`} onClick={onClick}>
            <FaUser />
            <span>로그인</span>
        </button>
    );
};

export default LoginButton;
