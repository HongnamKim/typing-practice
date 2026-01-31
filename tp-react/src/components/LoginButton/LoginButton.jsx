import React from 'react';
import {FaUser} from 'react-icons/fa';
import './LoginButton.css';

const LoginButton = ({onClick}) => {
    return (
        <button className="header-btn" onClick={onClick}>
            <FaUser />
            <span>로그인</span>
        </button>
    );
};

export default LoginButton;
