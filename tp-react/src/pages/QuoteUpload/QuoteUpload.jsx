import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaCircleInfo, FaGlobe, FaLock, FaPlus, FaUpload, FaXmark} from 'react-icons/fa6';
import {uploadQuote} from '../../utils/quoteApi';
import {useAuth} from '../../Context/AuthContext';
import {useError} from '../../Context/ErrorContext';
import {MAX_AUTHOR_LENGTH, MAX_SENTENCE_LENGTH, MIN_SENTENCE_LENGTH} from '../../const/config.const';
import './QuoteUpload.css';

const MAX_ENTRIES = 5;

function QuoteUpload() {
    const navigate = useNavigate();
    const {user} = useAuth();
    const {showError} = useError();
    const [entries, setEntries] = useState([createEmptyEntry(0)]);
    const [isUploading, setIsUploading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [isResultPopup, setIsResultPopup] = useState(false);

    function createEmptyEntry(id) {
        return {
            id,
            type: 'public',
            sentence: '',
            author: '',
            error: '',
        };
    }

    const addEntry = () => {
        if (entries.length >= MAX_ENTRIES) return;
        const newId = entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 0;
        setEntries([...entries, createEmptyEntry(newId)]);
    };

    const removeEntry = (id) => {
        if (entries.length <= 1) return;
        setEntries(entries.filter(entry => entry.id !== id));
    };

    const updateEntry = (id, field, value) => {
        // 문장 길이 제한
        if (field === 'sentence' && value.length > MAX_SENTENCE_LENGTH) {
            return;
        }
        // 출처 길이 제한
        if (field === 'author' && value.length > MAX_AUTHOR_LENGTH) {
            return;
        }

        setEntries(entries.map(entry => {
            if (entry.id === id) {
                return {...entry, [field]: value, error: ''};
            }
            return entry;
        }));
    };

    const validateEntry = (entry) => {
        const sentence = entry.sentence.trim();
        if (!sentence) return '';
        if (sentence.length < MIN_SENTENCE_LENGTH) {
            return `문장은 ${MIN_SENTENCE_LENGTH}자 이상이어야 합니다.`;
        }
        if (sentence.length > MAX_SENTENCE_LENGTH) {
            return `문장은 ${MAX_SENTENCE_LENGTH}자 이하여야 합니다.`;
        }
        if (entry.author && entry.author.length > MAX_AUTHOR_LENGTH) {
            return `저자는 ${MAX_AUTHOR_LENGTH}자 이하여야 합니다.`;
        }
        return '';
    };

    const getValidEntries = () => {
        return entries.filter(entry => entry.sentence.trim());
    };

    const handleUploadClick = () => {
        const validEntries = getValidEntries();

        if (validEntries.length === 0) {
            showError('최소 1개의 문장을 입력해주세요.');
            return;
        }

        // 유효성 검증
        let hasError = false;
        const updatedEntries = entries.map(entry => {
            if (!entry.sentence.trim()) return entry;
            const error = validateEntry(entry);
            if (error) hasError = true;
            return {...entry, error};
        });
        setEntries(updatedEntries);

        if (hasError) return;

        // 확인 팝업 메시지 생성
        const publicCount = validEntries.filter(e => e.type === 'public').length;
        const privateCount = validEntries.filter(e => e.type === 'private').length;

        let message;
        if (publicCount > 0 && privateCount > 0) {
            message = `공개 ${publicCount}개, 비공개 ${privateCount}개의 문장을 업로드합니다.`;
        } else if (publicCount > 0) {
            message = `${publicCount}개의 문장을 공개로 업로드합니다.`;
        } else {
            message = `${privateCount}개의 문장을 비공개로 업로드합니다.`;
        }

        setConfirmMessage(message);
        setIsResultPopup(false);
        setShowConfirm(true);
    };

    const executeUpload = async () => {
        setShowConfirm(false);
        setIsUploading(true);

        const validEntries = getValidEntries();
        let successCount = 0;
        const successIds = [];

        for (const entry of validEntries) {
            try {
                await uploadQuote(entry.type, entry.sentence.trim(), entry.author.trim() || undefined);
                successCount++;
                successIds.push(entry.id);
            } catch (error) {
                const errorMessage = error.response?.data?.message || '업로드에 실패했습니다.';
                setEntries(prev => prev.map(e =>
                    e.id === entry.id ? {...e, error: errorMessage} : e
                ));
            }
        }

        setIsUploading(false);

        if (successCount > 0) {
            // 성공한 entry 제거
            setEntries(prev => {
                const remaining = prev.filter(e => !successIds.includes(e.id));
                if (remaining.length === 0) {
                    return [createEmptyEntry(0)];
                }
                return remaining;
            });

            // 결과 팝업
            setConfirmMessage(`${successCount}개의 문장 업로드에 성공했습니다.`);
            setIsResultPopup(true);
            setShowConfirm(true);
        }
    };

    const handleConfirmOk = () => {
        if (isResultPopup) {
            setShowConfirm(false);
        } else {
            executeUpload();
        }
    };

    const handleTextareaChange = (e, id, field) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
        updateEntry(id, field, e.target.value);
    };

    // 로그인 필요
    if (!user) {
        return (
            <div className="quote-upload-container">
                <div className="quote-upload-header">
                    <h1 className="quote-upload-title">문장 업로드</h1>
                </div>
                <div className="quote-upload-login-required">
                    <p>로그인이 필요합니다.</p>
                    <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
                </div>
            </div>
        );
    }

    return (
        <div className="quote-upload-container">
            <div className="quote-upload-header">
                <h1 className="quote-upload-title">문장 업로드</h1>
            </div>

            <div className="quote-upload-type-info">
                <span className="quote-upload-type-hint">
                    각 문장마다 공개/비공개를 선택할 수 있습니다.
                    <span className="quote-upload-tooltip-trigger">
                        <FaCircleInfo/>
                        <span className="quote-upload-tooltip">
                            <p><strong>공개</strong>: 관리자 승인 후 모든 사용자에게 노출됩니다.</p>
                            <p><strong>비공개</strong>: 본인만 사용할 수 있습니다.</p>
                        </span>
                    </span>
                </span>
            </div>

            <div className="quote-upload-entries">
                {entries.map((entry, index) => (
                    <div key={entry.id} className={`quote-upload-entry ${entry.error ? 'error' : ''}`}>
                        <div className="quote-upload-entry-header">
                            <span className="quote-upload-entry-number">{index + 1}</span>
                            <button
                                className="quote-upload-entry-delete-btn"
                                onClick={() => removeEntry(entry.id)}
                                style={{display: entries.length <= 1 ? 'none' : 'flex'}}
                            >
                                <FaXmark/>
                            </button>
                        </div>
                        <div className="quote-upload-entry-type-toggle">
                            <button
                                className={`quote-upload-entry-type-btn ${entry.type === 'public' ? 'active' : ''}`}
                                onClick={() => updateEntry(entry.id, 'type', 'public')}
                            >
                                <FaGlobe/>
                                <span>공개</span>
                            </button>
                            <button
                                className={`quote-upload-entry-type-btn ${entry.type === 'private' ? 'active' : ''}`}
                                onClick={() => updateEntry(entry.id, 'type', 'private')}
                            >
                                <FaLock/>
                                <span>비공개</span>
                            </button>
                        </div>
                        <div className="quote-upload-entry-inputs">
                            <div className="quote-upload-sentence-wrapper">
                                <textarea
                                    className="quote-upload-input quote-upload-sentence"
                                    placeholder={`문장을 입력하세요 (${MIN_SENTENCE_LENGTH}-${MAX_SENTENCE_LENGTH}자)`}
                                    maxLength={MAX_SENTENCE_LENGTH}
                                    value={entry.sentence}
                                    onChange={(e) => handleTextareaChange(e, entry.id, 'sentence')}
                                    rows={1}
                                />
                                <span
                                    className={`quote-upload-char-count ${entry.sentence.length > 0 && entry.sentence.length < MIN_SENTENCE_LENGTH ? 'warning' : ''}`}>
                                    {entry.sentence.length}/{MAX_SENTENCE_LENGTH}
                                </span>
                            </div>
                            <div className="quote-upload-author-wrapper">
                                <textarea
                                    className="quote-upload-input quote-upload-author"
                                    placeholder="저자 (선택)"
                                    maxLength={MAX_AUTHOR_LENGTH}
                                    value={entry.author}
                                    onChange={(e) => handleTextareaChange(e, entry.id, 'author')}
                                    rows={1}
                                />
                            </div>
                        </div>
                        {entry.error && (
                            <div className="quote-upload-entry-error">{entry.error}</div>
                        )}
                    </div>
                ))}
            </div>

            <button
                className="quote-upload-add-btn"
                onClick={addEntry}
                disabled={entries.length >= MAX_ENTRIES}
            >
                <FaPlus/>
                <span>
                    {entries.length >= MAX_ENTRIES
                        ? `최대 ${MAX_ENTRIES}개`
                        : `문장 추가 (${entries.length}/${MAX_ENTRIES})`}
                </span>
            </button>

            <div className="quote-upload-actions">
                <button className="quote-upload-cancel-btn" onClick={() => navigate('/')}>
                    취소
                </button>
                <button
                    className="quote-upload-submit-btn"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <>
                            <span className="quote-upload-spinner"></span>
                            <span>업로드 중...</span>
                        </>
                    ) : (
                        <>
                            <FaUpload/>
                            <span>업로드</span>
                        </>
                    )}
                </button>
            </div>

            {/* 확인/결과 팝업 */}
            {showConfirm && (
                <div className="quote-upload-confirm-overlay">
                    <div className="quote-upload-confirm-popup">
                        <p className="quote-upload-confirm-message">{confirmMessage}</p>
                        <div className="quote-upload-confirm-actions">
                            {!isResultPopup && (
                                <button
                                    className="quote-upload-confirm-cancel-btn"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    취소
                                </button>
                            )}
                            <button
                                className="quote-upload-confirm-ok-btn"
                                onClick={handleConfirmOk}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuoteUpload;
