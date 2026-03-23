import {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaFileCircleQuestion} from 'react-icons/fa6';
import {useAuth} from '../../Context/AuthContext';
import {useError} from '../../Context/ErrorContext';
import {cancelPublishQuote, deleteQuote, getMyQuotes, publishQuote, updateQuote, extractQuoteErrorMessage} from '@/utils/quoteApi.ts';
import QuoteCard from './components/QuoteCard';
import QuoteFilters from './components/QuoteFilters';
import QuoteEditPopup from './components/QuoteEditPopup';
import ConfirmPopup from '../../components/ConfirmPopup/ConfirmPopup';
import ScrollButtons from '../../components/ScrollButtons/ScrollButtons';
import './MyQuotes.css';

const PAGE_SIZE = 10;

function MyQuotes() {
    const navigate = useNavigate();
    const {user, isInitialized} = useAuth();
    const {showError} = useError();

    // 초기화 완료 후 로그인 안 되어 있으면 홈으로 이동
    useEffect(() => {
        if (isInitialized && !user) {
            navigate('/');
        }
    }, [user, isInitialized, navigate]);

    // 필터 상태
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // 목록 상태
    const [quotes, setQuotes] = useState([]);
    const [hasNext, setHasNext] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    // 팝업 상태
    const [editingQuote, setEditingQuote] = useState(null);
    const [deletingQuoteId, setDeletingQuoteId] = useState(null);

    // refs
    const loadMoreRef = useRef(null);
    const isLoadingRef = useRef(false);
    const hasNextRef = useRef(true);
    const pageRef = useRef(1);

    // 문장 목록 로드
    const loadQuotes = useCallback(async (reset = false) => {
        if (isLoadingRef.current || (!reset && !hasNextRef.current)) return;

        isLoadingRef.current = true;
        setIsLoading(true);
        const currentPage = reset ? 1 : pageRef.current;

        try {
            const params = {page: currentPage, size: PAGE_SIZE};
            if (typeFilter !== 'all') params.type = typeFilter;
            if (statusFilter !== 'all') params.status = statusFilter;

            const response = await getMyQuotes(params);
            const data = response.data.data;

            if (reset) {
                setQuotes(data.content || []);
            } else {
                setQuotes(prev => [...prev, ...(data.content || [])]);
            }

            hasNextRef.current = data.hasNext ?? false;
            pageRef.current = currentPage + 1;
            setHasNext(data.hasNext ?? false);
            setIsEmpty(reset && (!data.content || data.content.length === 0));
        } catch (error) {
            console.error('문장 목록 로드 실패:', error);
            if (reset) {
                setIsEmpty(true);
            }
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [typeFilter, statusFilter]);

    // 필터 변경 시 목록 초기화
    useEffect(() => {
        setQuotes([]);
        setHasNext(true);
        setIsEmpty(false);
        pageRef.current = 1;
        hasNextRef.current = true;
    }, [typeFilter, statusFilter]);

    // 초기 로드 및 필터 변경 시 로드
    useEffect(() => {
        if (user && quotes.length === 0 && hasNext) {
            loadQuotes(true);
        }
    }, [user, typeFilter, statusFilter, quotes.length, hasNext, loadQuotes]);

    // 무한 스크롤 (Intersection Observer)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingRef.current && hasNextRef.current) {
                    loadQuotes();
                }
            },
            {threshold: 0.1}
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [loadQuotes, quotes.length]);

    // 수정 저장
    const handleSaveEdit = async ({sentence, author}) => {
        if (!editingQuote) return;

        try {
            await updateQuote(editingQuote.quoteId, {sentence, author});

            setQuotes(prev => prev.map(q =>
                q.quoteId === editingQuote.quoteId
                    ? {...q, sentence, author}
                    : q
            ));
            setEditingQuote(null);
        } catch (error) {
            console.error('문장 수정 실패:', error);
            showError(extractQuoteErrorMessage(error, '내 문장 내에 유사한 문장이 존재합니다.', '문장 수정에 실패했습니다.'));
        }
    };

    // 삭제
    const handleDelete = async () => {
        if (!deletingQuoteId) return;

        try {
            await deleteQuote(deletingQuoteId);

            setQuotes(prev => prev.filter(q => q.quoteId !== deletingQuoteId));
            setDeletingQuoteId(null);

            if (quotes.length === 1) {
                setIsEmpty(true);
            }
        } catch (error) {
            console.error('문장 삭제 실패:', error);
            const message = error.response?.data?.detail || '문장 삭제에 실패했습니다.';
            showError(message);
            setDeletingQuoteId(null);
        }
    };

    // 공개 전환
    const handlePublish = async (quoteId) => {
        try {
            await publishQuote(quoteId);

            setQuotes(prev => prev.map(q =>
                q.quoteId === quoteId
                    ? {...q, type: 'PUBLIC', status: 'PENDING'}
                    : q
            ));
        } catch (error) {
            console.error('공개 전환 실패:', error);
            showError(extractQuoteErrorMessage(error, '공개 문장 내에 유사한 문장이 존재합니다.', '공개 전환에 실패했습니다.'));
        }
    };

    // 공개 취소
    const handleCancelPublish = async (quoteId) => {
        try {
            await cancelPublishQuote(quoteId);

            setQuotes(prev => prev.map(q =>
                q.quoteId === quoteId
                    ? {...q, type: 'PRIVATE', status: 'ACTIVE'}
                    : q
            ));
        } catch (error) {
            console.error('공개 취소 실패:', error);
            const message = error.response?.data?.detail || '공개 취소에 실패했습니다.';
            showError(message);
        }
    };

    // 초기화 중이면 아무것도 렌더링하지 않음
    if (!isInitialized) {
        return null;
    }

    // 로그인 필요
    if (!user) {
        return (
            <div className="my-quotes-container">
                <div className="my-quotes-header">
                    <h1 className="my-quotes-title">내 문장</h1>
                </div>
                <div className="my-quotes-login-required">
                    <p>로그인이 필요합니다.</p>
                    <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-quotes-container">
            <div className="my-quotes-header">
                <h1 className="my-quotes-title">내 문장</h1>
            </div>

            <QuoteFilters
                typeFilter={typeFilter}
                statusFilter={statusFilter}
                onTypeChange={setTypeFilter}
                onStatusChange={setStatusFilter}
            />

            <div className="my-quotes-list">
                {quotes.map(quote => (
                    <QuoteCard
                        key={quote.quoteId}
                        quote={quote}
                        onEdit={setEditingQuote}
                        onDelete={setDeletingQuoteId}
                        onPublish={handlePublish}
                        onCancelPublish={handleCancelPublish}
                    />
                ))}

                {isLoading && (
                    <div className="my-quotes-loading">
                        <div className="my-quotes-spinner"></div>
                    </div>
                )}

                {isEmpty && (
                    <div className="my-quotes-empty">
                        <FaFileCircleQuestion/>
                        <p>등록한 문장이 없습니다.</p>
                    </div>
                )}

                {/* 무한 스크롤 트리거 */}
                {hasNext && !isEmpty && <div ref={loadMoreRef} style={{height: '1px'}}/>}
            </div>

            <div className="my-quotes-actions">
                <button className="my-quotes-back-btn" onClick={() => navigate('/')}>
                    돌아가기
                </button>
                <button className="my-quotes-upload-btn" onClick={() => navigate('/quote/upload')}>
                    문장 업로드
                </button>
            </div>

            {/* 수정 팝업 */}
            {editingQuote && (
                <QuoteEditPopup
                    quote={editingQuote}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingQuote(null)}
                />
            )}

            {/* 삭제 확인 팝업 */}
            {deletingQuoteId && (
                <ConfirmPopup
                    message="이 문장을 삭제하시겠습니까?"
                    confirmText="삭제"
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingQuoteId(null)}
                    isDanger
                />
            )}

            <ScrollButtons/>
        </div>
    );
}

export default MyQuotes;
