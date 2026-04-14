import {createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useScore} from "./ScoreContext";
import {useAuth} from "./AuthContext";
import {useError} from "./ErrorContext";
import {getQuotes, getAdaptiveQuotes} from "../utils/quoteApi";
import type {ServingType} from "../utils/quoteApi";
import {defaultQuotes} from "../data/default-quotes.const.ts";
import {Session_Post_Login_Quote_Source, Storage_Quote_Source, LANGUAGE} from "../const/config.const";
import {t} from "../utils/i18n";

interface Quote {
    quoteId?: number;
    sentence: string;
    author?: string;
    servingType?: ServingType;
}

type QuoteSourceType = 'all' | 'my' | 'adaptive';

interface QuoteContextType {
    sentence: string;
    author: string;
    currentQuote: Quote | null;
    quotesIndex: number;
    setQuotesIndex: React.Dispatch<React.SetStateAction<number>>;
    quoteSource: QuoteSourceType;
    changeQuoteSource: (source: QuoteSourceType) => boolean;
    isLoading: boolean;
    isEmpty: boolean;
    isOffline: boolean;
    prefetchAdaptiveQuotes: () => void;
}

export const QuoteContext = createContext<QuoteContextType | null>(null);

export const useQuote = (): QuoteContextType => {
    const context = useContext(QuoteContext);
    if (!context) {
        throw new Error('useQuote must be used within QuoteContextProvider');
    }
    return context;
};

const QUOTES_PER_PAGE = 100;
const ADAPTIVE_COUNT = 50;
const QUOTE_SOURCE = {
    ALL: 'all' as const,
    MY: 'my' as const,
    ADAPTIVE: 'adaptive' as const,
};

const generateSeed = () => Math.floor(Math.random() * 1_999_999_999) - 999_999_999;

const shuffleArray = <T, >(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

interface QuoteContextProviderProps {
    children: ReactNode;
}

export const QuoteContextProvider = ({children}: QuoteContextProviderProps) => {
    const {setInputCheck} = useScore();
    const {user, isInitialized} = useAuth();
    const {showError} = useError();

    const seedRef = useRef<number>(generateSeed());
    const currentPageRef = useRef<number>(1);
    const hasNextRef = useRef<boolean>(true);
    const isLoadingRef = useRef<boolean>(false);
    const excludeIdsRef = useRef<number[]>([]);

    const getInitialQuoteSource = (): QuoteSourceType => {
        const stored = localStorage.getItem(Storage_Quote_Source);
        if (stored === 'all' || stored === 'my' || stored === 'adaptive') return stored;
        return QUOTE_SOURCE.ALL;
    };

    const [quoteSource, setQuoteSource] = useState<QuoteSourceType>(getInitialQuoteSource);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [quotesIndex, setQuotesIndex] = useState<number>(0);
    const [sentence, setSentence] = useState<string>("");
    const [author, setAuthor] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const [isOffline, setIsOffline] = useState<boolean>(false);

    const resetState = useCallback(() => {
        setQuotes([]);
        setQuotesIndex(0);
        setSentence("");
        setAuthor("");
        currentPageRef.current = 1;
        hasNextRef.current = true;
        excludeIdsRef.current = [];
        setIsEmpty(false);
    }, []);

    const setCurrentQuote = useCallback((quote: Quote) => {
        if (!quote?.sentence) return;
        setSentence(quote.sentence);
        setAuthor(quote.author || '');
        setInputCheck(new Array(quote.sentence.length).fill("none"));
    }, [setInputCheck]);

    const loadFallbackQuotes = useCallback(() => {
        const shuffled = shuffleArray(defaultQuotes);
        setQuotes(shuffled);
        setQuotesIndex(0);
        hasNextRef.current = false;
        setIsOffline(true);
        setIsEmpty(false);

        if (shuffled.length > 0) {
            setCurrentQuote(shuffled[0]);
        }
    }, [setCurrentQuote]);

    const loadAdaptiveQuotes = useCallback(async (reset = false) => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        setIsLoading(true);

        try {
            const response = await getAdaptiveQuotes(LANGUAGE.KOREAN, ADAPTIVE_COUNT, excludeIdsRef.current);
            const rawContent = response.data.data;
            const contentArray = Array.isArray(rawContent) ? rawContent : (rawContent as any).content || [];
            const content = contentArray.map((q: any) => ({
                ...q,
                servingType: q.servingType || 'ADAPTIVE',
            }));

            if (reset) {
                setQuotes(content);
                setQuotesIndex(0);
            } else {
                setQuotes(prev => [...prev, ...content]);
            }

            // excludeIds 관리
            const newIds = content.map((q: any) => q.quoteId || q.id).filter(Boolean);
            const randomCount = content.filter((q: any) => q.servingType === 'RANDOM').length;
            if (randomCount >= Math.ceil(ADAPTIVE_COUNT / 2)) {
                excludeIdsRef.current = [];
            } else {
                excludeIdsRef.current = [...excludeIdsRef.current, ...newIds];
            }

            hasNextRef.current = content.length > 0;
            setIsEmpty(reset && content.length === 0);
            setIsOffline(false);

            if (reset && content.length > 0) {
                setCurrentQuote(content[0]);
            }
        } catch (error) {
            console.error('적응형 문장 로드 실패:', error);
            showError(t('sentenceLoadFailed'));
            if (reset) setIsEmpty(true);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [setCurrentQuote, showError]);

    const loadPagedQuotes = useCallback(async (page = 1, reset = false, source = quoteSource) => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        setIsLoading(true);

        try {
            const response = await getQuotes({
                page,
                count: QUOTES_PER_PAGE,
                seed: seedRef.current,
                onlyMyQuotes: source === QUOTE_SOURCE.MY,
            });
            const data = response.data.data;
            const content = (data.content || []).map((q: any) => ({
                ...q,
                servingType: 'RANDOM' as ServingType,
            }));

            if (reset) {
                if (content.length === 0 && source === QUOTE_SOURCE.ALL) {
                    loadFallbackQuotes();
                    return;
                }
                setQuotes(content);
                setQuotesIndex(0);
            } else {
                setQuotes(prev => [...prev, ...content]);
            }

            hasNextRef.current = data.hasNext ?? false;
            currentPageRef.current = page;
            setIsEmpty(reset && content.length === 0);
            setIsOffline(false);

            if (reset && content.length > 0) {
                setCurrentQuote(content[0]);
            }
        } catch (error) {
            console.error('문장 로드 실패:', error);

            if (reset && source === QUOTE_SOURCE.ALL) {
                console.log('서버 연결 실패 - 로컬 문장 사용');
                loadFallbackQuotes();
            } else {
                showError(t('sentenceLoadFailed'));
                if (reset) setIsEmpty(true);
            }
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [quoteSource, setCurrentQuote, showError, loadFallbackQuotes]);

    useEffect(() => {
        if (!isInitialized) return;
        if (!user && (quoteSource === QUOTE_SOURCE.MY || quoteSource === QUOTE_SOURCE.ADAPTIVE)) {
            setQuoteSource(QUOTE_SOURCE.ALL);
        }
        // 로그인 후 저장된 소스 전환 적용
        if (user) {
            const pendingSource = sessionStorage.getItem(Session_Post_Login_Quote_Source);
            if (pendingSource === 'my' || pendingSource === 'adaptive') {
                sessionStorage.removeItem(Session_Post_Login_Quote_Source);
                setQuoteSource(pendingSource as QuoteSourceType);
            }
        }
    }, [user, isInitialized, quoteSource]);

    useEffect(() => {
        // 로그인 필요한 소스는 인증 초기화 후 로드
        if ((quoteSource === QUOTE_SOURCE.MY || quoteSource === QUOTE_SOURCE.ADAPTIVE) && !isInitialized) return;
        // 비로그인 상태에서 로그인 필요한 소스는 로드하지 않음 (다른 effect에서 'all'로 전환됨)
        if ((quoteSource === QUOTE_SOURCE.MY || quoteSource === QUOTE_SOURCE.ADAPTIVE) && !user) return;

        resetState();
        if (quoteSource === QUOTE_SOURCE.ADAPTIVE) {
            loadAdaptiveQuotes(true);
        } else {
            loadPagedQuotes(1, true, quoteSource);
        }
        localStorage.setItem(Storage_Quote_Source, quoteSource);
    }, [quoteSource, isInitialized]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (quotes.length === 0) return;

        if (quotesIndex < 0) {
            setQuotesIndex(quotes.length - 1);
            return;
        }

        if (quotesIndex >= quotes.length) {
            if (quoteSource === QUOTE_SOURCE.ADAPTIVE) {
                if (hasNextRef.current && !isLoadingRef.current) {
                    loadAdaptiveQuotes(false);
                }
            } else if (hasNextRef.current && !isLoadingRef.current) {
                loadPagedQuotes(currentPageRef.current + 1, false, quoteSource);
            } else {
                if (isOffline) {
                    const shuffled = shuffleArray(quotes);
                    setQuotes(shuffled);
                    setQuotesIndex(0);
                    setCurrentQuote(shuffled[0]);
                } else {
                    seedRef.current = generateSeed();
                    resetState();
                    loadPagedQuotes(1, true, quoteSource);
                }
            }
            return;
        }

        setCurrentQuote(quotes[quotesIndex]);
    }, [quotesIndex, quotes]); // eslint-disable-line react-hooks/exhaustive-deps

    const currentQuote = quotes[quotesIndex] || null;

    const changeQuoteSource = useCallback((source: QuoteSourceType): boolean => {
        if ((source === QUOTE_SOURCE.MY || source === QUOTE_SOURCE.ADAPTIVE) && !user) {
            return false;
        }
        setQuoteSource(source);
        return true;
    }, [user]);

    const prefetchAdaptiveQuotes = useCallback(() => {
        if (quoteSource !== QUOTE_SOURCE.ADAPTIVE) return;
        loadAdaptiveQuotes(false);
    }, [quoteSource, loadAdaptiveQuotes]);

    return (
        <QuoteContext.Provider
            value={{
                sentence,
                author,
                currentQuote,
                quotesIndex,
                setQuotesIndex,
                quoteSource,
                changeQuoteSource,
                isLoading,
                isEmpty,
                isOffline,
                prefetchAdaptiveQuotes,
            }}
        >
            {children}
        </QuoteContext.Provider>
    );
};