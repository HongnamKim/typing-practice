import {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaFlag} from 'react-icons/fa6';
import {useAuth} from '../../Context/AuthContext';
import {useError} from '../../Context/ErrorContext';
import {deleteReport, getMyReports} from '@/utils/reportApi.ts';
import ReportCard from './components/ReportCard';
import ReportFilters from './components/ReportFilters';
import ConfirmPopup from '../../components/ConfirmPopup/ConfirmPopup';
import ScrollButtons from '../../components/ScrollButtons/ScrollButtons';
import './MyReports.css';

const PAGE_SIZE = 10;

function MyReports() {
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
    const [statusFilter, setStatusFilter] = useState('all');

    // 목록 상태
    const [reports, setReports] = useState([]);
    const [hasNext, setHasNext] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    // 삭제 확인 팝업
    const [deletingReportId, setDeletingReportId] = useState(null);

    // refs
    const loadMoreRef = useRef(null);
    const isLoadingRef = useRef(false);
    const hasNextRef = useRef(true);
    const pageRef = useRef(1);

    // 신고 목록 로드
    const loadReports = useCallback(async (reset = false) => {
        if (isLoadingRef.current || (!reset && !hasNextRef.current)) return;

        isLoadingRef.current = true;
        setIsLoading(true);
        const currentPage = reset ? 1 : pageRef.current;

        try {
            const params = {page: currentPage, size: PAGE_SIZE};
            if (statusFilter !== 'all') params.status = statusFilter;

            const response = await getMyReports(params);
            const data = response.data.data;

            if (reset) {
                setReports(data.content || []);
            } else {
                setReports(prev => [...prev, ...(data.content || [])]);
            }

            hasNextRef.current = data.hasNext ?? false;
            pageRef.current = currentPage + 1;
            setHasNext(data.hasNext ?? false);
            setIsEmpty(reset && (!data.content || data.content.length === 0));
        } catch (error) {
            console.error('신고 목록 로드 실패:', error);
            if (reset) {
                setIsEmpty(true);
            }
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [statusFilter]);

    // 필터 변경 시 목록 초기화
    useEffect(() => {
        setReports([]);
        setHasNext(true);
        setIsEmpty(false);
        pageRef.current = 1;
        hasNextRef.current = true;
    }, [statusFilter]);

    // 초기 로드 및 필터 변경 시 로드
    useEffect(() => {
        if (user && reports.length === 0 && hasNext) {
            loadReports(true);
        }
    }, [user, statusFilter, reports.length, hasNext, loadReports]);

    // 무한 스크롤 (Intersection Observer)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingRef.current && hasNextRef.current) {
                    loadReports();
                }
            },
            {threshold: 0.1}
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [loadReports, reports.length]);

    // 삭제
    const handleDelete = async () => {
        if (!deletingReportId) return;

        try {
            await deleteReport(deletingReportId);

            setReports(prev => prev.filter(r => r.id !== deletingReportId));
            setDeletingReportId(null);

            if (reports.length === 1) {
                setIsEmpty(true);
            }
        } catch (error) {
            console.error('신고 삭제 실패:', error);
            const message = error.response?.data?.detail || '신고 삭제에 실패했습니다.';
            showError(message);
            setDeletingReportId(null);
        }
    };

    // 초기화 중이면 아무것도 렌더링하지 않음
    if (!isInitialized) {
        return null;
    }

    // 로그인 필요
    if (!user) {
        return (
            <div className="my-reports-container">
                <div className="my-reports-header">
                    <h1 className="my-reports-title">신고 내역</h1>
                </div>
                <div className="my-reports-login-required">
                    <p>로그인이 필요합니다.</p>
                    <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-reports-container">
            <div className="my-reports-header">
                <h1 className="my-reports-title">신고 내역</h1>
            </div>

            <ReportFilters
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            <div className="my-reports-list">
                {reports.map(report => (
                    <ReportCard
                        key={report.id}
                        report={report}
                        onDelete={setDeletingReportId}
                    />
                ))}

                {isLoading && (
                    <div className="my-reports-loading">
                        <div className="my-reports-spinner"></div>
                    </div>
                )}

                {isEmpty && (
                    <div className="my-reports-empty">
                        <FaFlag/>
                        <p>신고 내역이 없습니다.</p>
                    </div>
                )}

                {/* 무한 스크롤 트리거 */}
                {hasNext && !isEmpty && <div ref={loadMoreRef} style={{height: '1px'}}/>}
            </div>

            <div className="my-reports-actions">
                <button className="my-reports-back-btn" onClick={() => navigate('/')}>
                    돌아가기
                </button>
            </div>

            {/* 삭제 확인 팝업 */}
            {deletingReportId && (
                <ConfirmPopup
                    message="이 신고를 취소하시겠습니까?"
                    confirmText="삭제"
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingReportId(null)}
                    isDanger
                />
            )}

            <ScrollButtons/>
        </div>
    );
}

export default MyReports;
