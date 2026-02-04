import React from 'react';
import {FaGoogle} from 'react-icons/fa';
import './LoginButton.css';

const LoginButton = ({onClick}) => {
    return (
        <button className="header-btn" onClick={onClick}>
            <FaGoogle />
            <span>구글 로그인</span>
        </button>
    );
};

export default LoginButton;
