import {useEffect, useRef, useState} from 'react';
import {useTheme} from '@/Context/ThemeContext.tsx';
import {MAX_AUTHOR_LENGTH, MAX_SENTENCE_LENGTH, MIN_SENTENCE_LENGTH} from '@/const/config.const.ts';
import {t} from '@/utils/i18n.ts';
import './QuoteEditPopup.css';

const QuoteEditPopup = ({quote, onSave, onClose}) => {
    const {isDark} = useTheme();
    const [sentence, setSentence] = useState(quote.sentence);
    const [author, setAuthor] = useState(quote.author || '');
    const textareaRef = useRef(null);

    // textarea 높이 자동 조절
    useEffect(() => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }, [sentence]);

    const isValid = () => {
        const trimmed = sentence.trim();
        return trimmed.length >= MIN_SENTENCE_LENGTH && trimmed.length <= MAX_SENTENCE_LENGTH;
    };

    const handleSave = () => {
        if (!isValid()) return;
        onSave({
            sentence: sentence.trim(),
            author: author.trim() || null
        });
    };

    return (
        <div className={`quote-edit-popup-overlay ${isDark ? 'dark' : ''}`} onClick={onClose}>
            <div className="quote-edit-popup" onClick={e => e.stopPropagation()}>
                <h3 className="quote-edit-title">{t('editSentence')}</h3>
                <div className="quote-edit-content">
                    <div className="quote-edit-field">
                        <label className="quote-edit-label">{t('sentence')}</label>
                        <textarea
                            ref={textareaRef}
                            className="quote-edit-input quote-edit-sentence"
                            value={sentence}
                            onChange={(e) => {
                                if (e.target.value.length <= MAX_SENTENCE_LENGTH) {
                                    setSentence(e.target.value);
                                }
                            }}
                            maxLength={MAX_SENTENCE_LENGTH}
                            rows={1}
                        />
                        <span
                            className={`quote-edit-char-count ${sentence.length > 0 && sentence.length < MIN_SENTENCE_LENGTH ? 'warning' : ''}`}>
                            {sentence.length}/{MAX_SENTENCE_LENGTH}
                        </span>
                    </div>
                    <div className="quote-edit-field">
                        <label className="quote-edit-label">{t('authorOptional')}</label>
                        <input
                            type="text"
                            className="quote-edit-input"
                            value={author}
                            onChange={(e) => {
                                if (e.target.value.length <= MAX_AUTHOR_LENGTH) {
                                    setAuthor(e.target.value);
                                }
                            }}
                            maxLength={MAX_AUTHOR_LENGTH}
                        />
                    </div>
                </div>
                <div className="quote-edit-actions">
                    <button className="quote-edit-cancel-btn" onClick={onClose}>{t('cancel')}</button>
                    <button
                        className="quote-edit-save-btn"
                        onClick={handleSave}
                        disabled={!isValid()}
                    >
                        {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteEditPopup;
