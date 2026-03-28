import React from 'react';
import {t} from '@/utils/i18n.ts';
import GoogleLogo from '../GoogleLogo/GoogleLogo';
import './LoginButton.css';

const LoginButton = ({onClick}) => {
    return (
        <button className="google-login-btn" onClick={onClick}>
            <GoogleLogo/>
            <span>{t('googleLogin')}</span>
        </button>
    );
};

export default LoginButton;
