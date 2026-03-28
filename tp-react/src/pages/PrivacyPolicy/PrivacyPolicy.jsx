import {useNavigate} from 'react-router-dom';
import {useTheme} from '../../Context/ThemeContext';
import './PrivacyPolicy.css';

const isKorean = navigator.language.startsWith('ko');

function PrivacyPolicy() {
    const navigate = useNavigate();
    const {isDark} = useTheme();

    return (
        <div className={`privacy-container ${isDark ? 'dark' : ''}`}>
            <h1 className="privacy-title">{isKorean ? '개인정보 처리방침' : 'Privacy Policy'}</h1>
            <p className="privacy-updated">{isKorean ? '최종 수정일: 2026년 3월 29일' : 'Last updated: March 29, 2026'}</p>

            <section className="privacy-section">
                <h2>{isKorean ? '1. 개요' : '1. Overview'}</h2>
                <p>
                    {isKorean
                        ? 'Typing Practice는 무료 타이핑 연습 서비스입니다. 이 서비스는 사용자의 개인정보를 소중히 여기며, 수집하는 데이터의 종류, 목적, 처리 방식을 아래에 안내합니다.'
                        : 'Typing Practice is a free typing practice service. We respect your privacy and are committed to protecting your personal data. This policy explains what data we collect, why, and how we handle it.'}
                </p>
            </section>

            <section className="privacy-section">
                <h2>{isKorean ? '2. 수집하는 데이터' : '2. Data We Collect'}</h2>
                <h3>{isKorean ? '계정 정보' : 'Account Information'}</h3>
                <p>
                    {isKorean
                        ? 'Google 로그인 시 Google OAuth를 통해 이름과 이메일 주소를 수신합니다. 이 정보는 인증 및 프로필 표시 목적으로만 사용됩니다.'
                        : 'When you sign in with Google, we receive your name and email address from Google OAuth. We use this solely for authentication and displaying your profile.'}
                </p>
                <h3>{isKorean ? '타이핑 기록' : 'Typing Records'}</h3>
                <p>
                    {isKorean
                        ? '로그인 상태에서 타이핑 결과(속도, 정확도, 초기화 횟수, 오타 패턴)를 서버에 저장합니다. 이 데이터는 개인 통계 및 진행 상황 추적에 사용됩니다.'
                        : 'When you are logged in, we store your typing results including speed (CPM), accuracy, reset count, and typo patterns. This data is used to provide your personal statistics and track your progress.'}
                </p>
                <h3>{isKorean ? '사용자 등록 문장' : 'User-Submitted Sentences'}</h3>
                <p>
                    {isKorean
                        ? '업로드한 문장은 서버에 저장되며, 다른 사용자의 타이핑 연습을 위해 공개될 수 있습니다.'
                        : 'Sentences you upload are stored on our server and may be shared publicly for other users to practice with.'}
                </p>
                <h3>{isKorean ? '로컬 저장소' : 'Local Storage'}</h3>
                <p>
                    {isKorean
                        ? '다크 모드, 글꼴 크기, 표시 설정 등의 환경설정을 브라우저의 로컬 저장소에 저장합니다. 이 데이터는 기기에만 남아 있으며 서버로 전송되지 않습니다.'
                        : "We use your browser's local storage to save preferences such as dark mode, font size, and display settings. This data stays on your device and is never sent to our server."}
                </p>
            </section>

            <section className="privacy-section">
                <h2>{isKorean ? '3. 분석' : '3. Analytics'}</h2>
                <p>
                    {isKorean
                        ? 'Vercel Web Analytics를 사용하여 익명의 집계 데이터를 수집합니다. 쿠키를 사용하지 않으며, 개인 식별 정보를 수집하지 않습니다. 방문자는 수신 요청에서 생성된 해시로 식별됩니다.'
                        : 'We use Vercel Web Analytics, which collects anonymous, aggregated usage data. It does not use cookies and does not collect personally identifiable information. Visitors are identified by a hash generated from the incoming request.'}
                </p>
            </section>

            <section className="privacy-section">
                <h2>{isKorean ? '4. 데이터 사용 목적' : '4. How We Use Your Data'}</h2>
                <p>{isKorean ? '수집한 데이터는 다음 목적으로만 사용됩니다:' : 'We use your data only for the following purposes:'}</p>
                <ul>
                    <li>{isKorean ? '계정 인증' : 'Authenticating your account'}</li>
                    <li>{isKorean ? '개인 타이핑 통계 및 진행 상황 추적 제공' : 'Providing personalized typing statistics and progress tracking'}</li>
                    <li>{isKorean ? '익명 사용 패턴을 기반으로 한 서비스 개선' : 'Improving the service based on anonymous usage patterns'}</li>
                </ul>
                <p>{isKorean
                    ? '개인 데이터를 마케팅 목적으로 제3자에게 판매, 공유 또는 제공하지 않습니다.'
                    : 'We do not sell, share, or provide your personal data to third parties for marketing purposes.'}</p>
            </section>

            <section className="privacy-section">
                <h2>{isKorean ? '5. 데이터 보관' : '5. Data Retention'}</h2>
                <p>
                    {isKorean
                        ? '타이핑 기록 및 계정 데이터는 계정이 활성 상태인 동안 보관됩니다. 문의를 통해 데이터 삭제를 요청할 수 있습니다.'
                        : 'Your typing records and account data are retained as long as your account is active. You may request deletion of your data by contacting us.'}
                </p>
            </section>

            <section className="privacy-section">
                <h2>{isKorean ? '6. 사용자 권리' : '6. Your Rights'}</h2>
                <p>{isKorean ? '사용자는 다음과 같은 권리를 갖습니다:' : 'You have the right to:'}</p>
                <ul>
                    <li>{isKorean ? '개인 데이터에 대한 접근' : 'Access your personal data'}</li>
                    <li>{isKorean ? '데이터 수정 또는 삭제 요청' : 'Request correction or deletion of your data'}</li>
                    <li>{isKorean ? '언제든지 동의 철회' : 'Withdraw consent at any time'}</li>
                </ul>
                <p>
                    {isKorean
                        ? <>권리 행사를 원하시면 <a href="https://open.kakao.com/o/sMHDrAog" target="_blank" rel="noopener noreferrer">카카오톡</a>으로 문의해 주세요.</>
                        : <>To exercise these rights, please contact us at <a href="https://open.kakao.com/o/sMHDrAog" target="_blank" rel="noopener noreferrer">KakaoTalk</a>.</>}
                </p>
            </section>

            <section className="privacy-section">
                <h2>{isKorean ? '7. 방침 변경' : '7. Changes to This Policy'}</h2>
                <p>
                    {isKorean
                        ? '이 방침은 수시로 업데이트될 수 있습니다. 변경 사항은 이 페이지에 수정 날짜와 함께 반영됩니다.'
                        : 'We may update this policy from time to time. Changes will be reflected on this page with an updated date.'}
                </p>
            </section>

            <div className="privacy-footer">
                <button className="privacy-back-btn" onClick={() => navigate('/')}>
                    {isKorean ? '돌아가기' : 'Back'}
                </button>
            </div>
        </div>
    );
}

export default PrivacyPolicy;