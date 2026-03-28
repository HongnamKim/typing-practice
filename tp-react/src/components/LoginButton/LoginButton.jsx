import React from 'react';
import {FaGoogle} from 'react-icons/fa';
import {t} from '@/utils/i18n.ts';
import './LoginButton.css';

const LoginButton = ({onClick}) => {
    return (
        <button className="header-btn" onClick={onClick}>
            <FaGoogle />
            <span>{t('googleLogin')}</span>
        </button>
    );
};

export default LoginButton;
