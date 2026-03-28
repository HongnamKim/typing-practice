import React from 'react';
import {FaGlobe, FaLock, FaXmark} from 'react-icons/fa6';
import {MAX_AUTHOR_LENGTH, MAX_SENTENCE_LENGTH, MIN_SENTENCE_LENGTH} from '@/const/config.const.ts';
import './UploadEntry.css';

export interface UploadEntryData {
    id: number;
    type: 'public' | 'private';
    sentence: string;
    author: string;
    error: string;
}

interface UploadEntryProps {
    entry: UploadEntryData;
    index: number;
    showDelete: boolean;
    onUpdate: (id: number, field: keyof Pick<UploadEntryData, 'type' | 'sentence' | 'author'>, value: string) => void;
    onRemove: (id: number) => void;
}

const UploadEntry = ({entry, index, showDelete, onUpdate, onRemove}: UploadEntryProps) => {

    const handleTextareaChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        field: 'sentence' | 'author',
    ) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
        onUpdate(entry.id, field, e.target.value);
    };

    return (
        <div className={`quote-upload-entry ${entry.error ? 'error' : ''}`}>
            <div className="quote-upload-entry-header">
                <span className="quote-upload-entry-number">{index + 1}</span>
                <button
                    className="quote-upload-entry-delete-btn"
                    onClick={() => onRemove(entry.id)}
                    style={{display: showDelete ? 'flex' : 'none'}}
                >
                    <FaXmark/>
                </button>
            </div>
            <div className="quote-upload-entry-type-toggle">
                <button
                    className={`quote-upload-entry-type-btn ${entry.type === 'public' ? 'active' : ''}`}
                    onClick={() => onUpdate(entry.id, 'type', 'public')}
                >
                    <FaGlobe/>
                    <span>공개</span>
                </button>
                <button
                    className={`quote-upload-entry-type-btn ${entry.type === 'private' ? 'active' : ''}`}
                    onClick={() => onUpdate(entry.id, 'type', 'private')}
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
                        onChange={(e) => handleTextareaChange(e, 'sentence')}
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
                        onChange={(e) => handleTextareaChange(e, 'author')}
                        rows={1}
                    />
                </div>
            </div>
            {entry.error && (
                <div className="quote-upload-entry-error">{entry.error}</div>
            )}
        </div>
    );
};

export default UploadEntry;
