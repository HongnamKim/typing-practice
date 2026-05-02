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
            <p className="terms-updated">{isKorean ? '최종 수정일: 2026년 5월 2일' : 'Last updated: May 2, 2026'}</p>

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
                <h2>{isKorean ? '3. 사용자 콘텐츠 및 저작권' : '3. User Content and Copyright'}</h2>
                <p>
                    {isKorean
                        ? '사용자가 업로드한 문장은 공개 설정 시 다른 사용자에게 노출될 수 있습니다. 사용자는 다음 사항에 동의하고 책임을 집니다:'
                        : 'Sentences uploaded by users may be visible to other users when set to public. By uploading, users agree to the following:'}
                </p>
                <ul>
                    <li>{isKorean ? '타인의 저작권, 초상권, 명예, 기타 권리를 침해하는 콘텐츠를 업로드하지 않습니다.' : 'Do not upload content that infringes on copyrights, portrait rights, reputation, or other rights of others.'}</li>
                    <li>{isKorean ? '노래 가사, 시, 소설, 기사 등 저작권이 있는 콘텐츠를 무단으로 업로드하지 않습니다. 출처를 표시하더라도 저작권자의 허락 없는 업로드는 권리 침해에 해당합니다.' : 'Do not upload copyrighted content such as lyrics, poems, novels, or articles without permission. Citing the source does not exempt unauthorized uploads from being infringement.'}</li>
                    <li>{isKorean ? '업로드한 콘텐츠로 인한 모든 법적 책임은 업로드한 사용자 본인에게 있습니다.' : 'All legal responsibility for uploaded content rests with the uploading user.'}</li>
                    <li>{isKorean ? '운영자는 업로드된 콘텐츠를 사전에 검증하지 않으며, 권리 침해 신고가 접수되거나 부적절한 콘텐츠로 판단되는 경우 사전 통보 없이 비공개 또는 삭제할 수 있습니다.' : 'The operator does not pre-screen uploaded content. Content may be hidden or deleted without prior notice upon receiving infringement reports or when judged inappropriate.'}</li>
                    <li>{isKorean ? '권리 침해로 인해 운영자에게 손해가 발생한 경우, 업로드한 사용자에게 구상권을 청구할 수 있습니다.' : 'If the operator suffers damages due to rights infringement, the uploading user may be liable for indemnification.'}</li>
                </ul>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '4. 저작권 침해 신고' : '4. Copyright Infringement Reports'}</h2>
                <p>
                    {isKorean
                        ? '본 서비스에 업로드된 콘텐츠가 귀하의 저작권을 침해한다고 판단되시면 아래 절차에 따라 신고해 주시기 바랍니다.'
                        : 'If you believe content uploaded to this service infringes your copyright, please follow the procedure below to file a report.'}
                </p>
                <p>
                    <strong>{isKorean ? '신고 시 포함사항' : 'Information to include in your report'}</strong>
                </p>
                <ul>
                    <li>{isKorean ? '신고자 성명 및 연락처' : 'Reporter\'s name and contact information'}</li>
                    <li>{isKorean ? '침해받은 저작물 정보 (제목, 저작자 등)' : 'Information about the infringed work (title, author, etc.)'}</li>
                    <li>{isKorean ? '침해 콘텐츠의 위치 또는 식별 정보 (URL, 문장 내용 등)' : 'Location or identification of the infringing content (URL, sentence text, etc.)'}</li>
                    <li>{isKorean ? '신고자가 저작권자 본인 또는 정당한 대리인임을 확인하는 진술' : 'Statement confirming you are the copyright owner or an authorized agent'}</li>
                    <li>{isKorean ? '신고 내용이 사실임을 서약하는 문구' : 'A statement that the information in the report is accurate'}</li>
                </ul>
                <p>
                    {isKorean
                        ? <>신고는 이메일(<a href="mailto:khn4636@gmail.com">khn4636@gmail.com</a>) 또는 <a href="https://open.kakao.com/o/sMHDrAog" target="_blank" rel="noopener noreferrer">카카오톡</a>으로 접수해 주시기 바랍니다. 신고 접수 후 영업일 기준 3~7일 이내에 검토 후 조치하며, 결과를 신고자에게 통지합니다.</>
                        : <>Please submit reports via email (<a href="mailto:khn4636@gmail.com">khn4636@gmail.com</a>) or <a href="https://open.kakao.com/o/sMHDrAog" target="_blank" rel="noopener noreferrer">KakaoTalk</a>. Reports will be reviewed within 3-7 business days after receipt, and the result will be communicated to the reporter.</>}
                </p>
                <p>
                    {isKorean
                        ? '반복적으로 권리 침해 콘텐츠를 업로드하는 사용자의 계정은 영구 정지될 수 있습니다.'
                        : 'Accounts of users who repeatedly upload infringing content may be permanently suspended.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '5. 계정' : '5. Accounts'}</h2>
                <p>
                    {isKorean
                        ? 'Google OAuth를 통해 로그인하며, 별도의 비밀번호를 저장하지 않습니다. 계정 삭제를 원하시면 문의해 주세요.'
                        : 'You sign in through Google OAuth, and we do not store any passwords. If you wish to delete your account, please contact us.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '6. 서비스 변경 및 중단' : '6. Service Changes and Termination'}</h2>
                <p>
                    {isKorean
                        ? '서비스는 사전 공지 없이 변경되거나 중단될 수 있습니다. 무료 서비스이므로 서비스 중단으로 인한 책임을 지지 않습니다.'
                        : 'The service may be changed or discontinued without prior notice. As a free service, we are not liable for any service interruptions.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '7. 면책 조항' : '7. Disclaimer'}</h2>
                <p>
                    {isKorean
                        ? '서비스는 "있는 그대로" 제공되며, 명시적이거나 묵시적인 어떠한 보증도 하지 않습니다. 서비스 이용으로 인해 발생하는 손해에 대해 책임을 지지 않습니다.'
                        : 'The service is provided "as is" without any warranties, express or implied. We are not liable for any damages arising from the use of the service.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '8. 약관 변경' : '8. Changes to These Terms'}</h2>
                <p>
                    {isKorean
                        ? '이 약관은 수시로 업데이트될 수 있습니다. 변경 사항은 이 페이지에 수정 날짜와 함께 반영됩니다.'
                        : 'These terms may be updated from time to time. Changes will be reflected on this page with an updated date.'}
                </p>
            </section>

            <section className="terms-section">
                <h2>{isKorean ? '9. 문의' : '9. Contact'}</h2>
                <p>
                    {isKorean
                        ? <>서비스 이용에 관한 문의는 이메일(<a href="mailto:khn4636@gmail.com">khn4636@gmail.com</a>) 또는 <a href="https://open.kakao.com/o/sMHDrAog" target="_blank" rel="noopener noreferrer">카카오톡</a>으로 연락해 주세요.</>
                        : <>For inquiries about the service, please contact us via email (<a href="mailto:khn4636@gmail.com">khn4636@gmail.com</a>) or <a href="https://open.kakao.com/o/sMHDrAog" target="_blank" rel="noopener noreferrer">KakaoTalk</a>.</>}
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