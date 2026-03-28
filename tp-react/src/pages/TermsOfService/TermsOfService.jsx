import {useNavigate} from 'react-router-dom';
import {useTheme} from '../../Context/ThemeContext';
import './TermsOfService.css';

const isKorean = navigator.language.startsWith('ko');

function TermsOfService() {
    const navigate = useNavigate();
    const {isDark} = useTheme();

    return (
        <div className={`terms-container ${isDark ? 'dark' : ''}`}>
            <h1 className="terms-title">{isKorean ? '서비스 이용약관' : 'Terms of Service'}</h1>
            <p className="terms-updated">{isKorean ? '최종 수정일: 2026년 3월 29일' : 'Last updated: March 29, 2026'}</p>

            <section className="terms-section">
                <h2>{isKorean ? '1. 서비스 소개' : '1. About the Service'}</h2>
                <p>
                    {isKorean
                        ? 'Typing Practice는 무료로 제공되는 타이핑 연습 서비스입니다. 누구나 회원가입 없이 기본 기능을 이용할 수 있으며, Google 로그인을 통해 추가 기능을 이용할 수 있습니다.'
                        : 'Typing Practice is a free typing practice service. Anyone can use basic features without an account, and additional features are available by signing in with Google.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '2. 이용 조건' : '2. Terms of Use'}</h2>
                <p>{isKorean ? '서비스를 이용함으로써 다음 사항에 동의합니다:' : 'By using the service, you agree to the following:'}</p>
                <ul>
                    <li>{isKorean ? '서비스를 합법적인 목적으로만 사용합니다.' : 'Use the service only for lawful purposes.'}</li>
                    <li>{isKorean ? '다른 사용자에게 피해를 주는 행위를 하지 않습니다.' : 'Do not engage in activities that harm other users.'}</li>
                    <li>{isKorean ? '부적절한 내용의 문장을 업로드하지 않습니다.' : 'Do not upload sentences with inappropriate content.'}</li>
                    <li>{isKorean ? '서비스의 정상적인 운영을 방해하지 않습니다.' : 'Do not interfere with the normal operation of the service.'}</li>
                    <li>{isKorean ? '허위 신고 등 기능을 악용하지 않습니다.' : 'Do not abuse features such as filing false reports.'}</li>
                </ul>
                <p>
                    {isKorean
                        ? '위 사항을 위반하는 경우 문장 업로드, 신고 등의 기능 이용이 제한되거나 계정이 정지될 수 있습니다.'
                        : 'Violations may result in restrictions on features such as sentence uploads and reports, or suspension of your account.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '3. 사용자 콘텐츠' : '3. User Content'}</h2>
                <p>
                    {isKorean
                        ? '사용자가 업로드한 문장은 공개 설정 시 다른 사용자에게 노출될 수 있습니다. 저작권이 있는 문장을 업로드하는 경우 그에 대한 책임은 업로드한 사용자에게 있습니다. 부적절한 문장은 관리자에 의해 삭제될 수 있습니다.'
                        : 'Sentences uploaded by users may be visible to other users when set to public. Users are responsible for any copyrighted content they upload. Inappropriate sentences may be removed by administrators.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '4. 계정' : '4. Accounts'}</h2>
                <p>
                    {isKorean
                        ? 'Google OAuth를 통해 로그인하며, 별도의 비밀번호를 저장하지 않습니다. 계정 삭제를 원하시면 문의해 주세요.'
                        : 'You sign in through Google OAuth, and we do not store any passwords. If you wish to delete your account, please contact us.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '5. 서비스 변경 및 중단' : '5. Service Changes and Termination'}</h2>
                <p>
                    {isKorean
                        ? '서비스는 사전 공지 없이 변경되거나 중단될 수 있습니다. 무료 서비스이므로 서비스 중단으로 인한 책임을 지지 않습니다.'
                        : 'The service may be changed or discontinued without prior notice. As a free service, we are not liable for any service interruptions.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '6. 면책 조항' : '6. Disclaimer'}</h2>
                <p>
                    {isKorean
                        ? '서비스는 "있는 그대로" 제공되며, 명시적이거나 묵시적인 어떠한 보증도 하지 않습니다. 서비스 이용으로 인해 발생하는 손해에 대해 책임을 지지 않습니다.'
                        : 'The service is provided "as is" without any warranties, express or implied. We are not liable for any damages arising from the use of the service.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '7. 약관 변경' : '7. Changes to These Terms'}</h2>
                <p>
                    {isKorean
                        ? '이 약관은 수시로 업데이트될 수 있습니다. 변경 사항은 이 페이지에 수정 날짜와 함께 반영됩니다.'
                        : 'These terms may be updated from time to time. Changes will be reflected on this page with an updated date.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '8. 문의' : '8. Contact'}</h2>
                <p>
                    {isKorean
                        ? <>서비스 이용에 관한 문의는 <a href="https://open.kakao.com/o/sMHDrAog" target="_blank" rel="noopener noreferrer">카카오톡</a>으로 연락해 주세요.</>
                        : <>For inquiries about the service, please contact us at <a href="https://open.kakao.com/o/sMHDrAog" target="_blank" rel="noopener noreferrer">KakaoTalk</a>.</>}
                </p>
            </section>

            <div className="terms-footer">
                <button className="terms-back-btn" onClick={() => navigate('/')}>
                    {isKorean ? '돌아가기' : 'Back'}
                </button>
            </div>
        </div>
    );
}

export default TermsOfService;