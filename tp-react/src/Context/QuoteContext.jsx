import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useScore} from "./ScoreContext";
import {useAuth} from "./AuthContext";
import {useError} from "./ErrorContext";
import {getQuotes} from "../utils/quoteApi";

export const QuoteContext = createContext(null);

export const useQuote = () => {
    const context = useContext(QuoteContext);
    if (!context) {
        throw new Error('useQuote must be used within QuoteContextProvider');
    }
    return context;
};

// 상수
const QUOTES_PER_PAGE = 100;
const QUOTE_SOURCE = {
    ALL: 'all',
    MY: 'my',
};

// 시드 생성 함수 (소수점 둘째자리까지, -1.0 ~ 1.0)
const generateSeed = () => Math.round((Math.random() * 2 - 1) * 100) / 100;

export const QuoteContextProvider = ({children}) => {
    const {setInputCheck} = useScore();
    const {user} = useAuth();
    const {showError} = useError();

    // Refs
    const seedRef = useRef(generateSeed());
    const currentPageRef = useRef(1);
    const hasNextRef = useRef(true);
    const isLoadingRef = useRef(false);

    // 문장 소스
    const [quoteSource, setQuoteSource] = useState(QUOTE_SOURCE.ALL);

    // 문장 목록
    const [quotes, setQuotes] = useState([]);
    const [quotesIndex, setQuotesIndex] = useState(0);
    const [sentence, setSentence] = useState("");
    const [author, setAuthor] = useState("");

    // UI 상태
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    // 상태 초기화
    const resetState = useCallback(() => {
        setQuotes([]);
        setQuotesIndex(0);
        setSentence("");
        setAuthor("");
        currentPageRef.current = 1;
        hasNextRef.current = true;
        setIsEmpty(false);
    }, []);

    // 현재 문장 설정
    const setCurrentQuote = useCallback((quote) => {
        if (!quote?.sentence) return;
        setSentence(quote.sentence);
        setAuthor(quote.author || '');
        setInputCheck(new Array(quote.sentence.length).fill("none"));
    }, [setInputCheck]);

    // 문장 로드
    const loadQuotes = useCallback(async (page = 1, reset = false, source = quoteSource) => {
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
            const content = data.content || [];

            if (reset) {
                setQuotes(content);
                setQuotesIndex(0);
            } else {
                setQuotes(prev => [...prev, ...content]);
            }

            hasNextRef.current = data.hasNext ?? false;
            currentPageRef.current = page;
            setIsEmpty(reset && content.length === 0);

            // 첫 로드 시 첫 번째 문장 설정
            if (reset && content.length > 0) {
                setCurrentQuote(content[0]);
            }
        } catch (error) {
            console.error('문장 로드 실패:', error);
            showError('문장을 불러오는데 실패했습니다.');
            if (reset) {
                setIsEmpty(true);
            }
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [quoteSource, setCurrentQuote, showError]);

    // 로그아웃 시 전체 문장으로 초기화
    useEffect(() => {
        if (!user && quoteSource === QUOTE_SOURCE.MY) {
            setQuoteSource(QUOTE_SOURCE.ALL);
        }
    }, [user, quoteSource]);

    // 소스 변경 시 로드
    useEffect(() => {
        resetState();
        loadQuotes(1, true, quoteSource);
    }, [quoteSource]); // eslint-disable-line react-hooks/exhaustive-deps

    // 문장 인덱스 변경 시
    useEffect(() => {
        if (quotes.length === 0) return;

        // 이전 문장 (인덱스 < 0)
        if (quotesIndex < 0) {
            setQuotesIndex(quotes.length - 1);
            return;
        }

        // 다음 문장 (인덱스 >= 길이)
        if (quotesIndex >= quotes.length) {
            if (hasNextRef.current && !isLoadingRef.current) {
                // 다음 페이지 로드
                loadQuotes(currentPageRef.current + 1, false, quoteSource);
            } else {
                // 마지막 페이지 끝: 시드 재생성 후 첫 페이지로
                seedRef.current = generateSeed();
                resetState();
                loadQuotes(1, true, quoteSource);
            }
            return;
        }

        setCurrentQuote(quotes[quotesIndex]);
    }, [quotesIndex, quotes]); // eslint-disable-line react-hooks/exhaustive-deps

    // 문장 소스 변경 핸들러
    const changeQuoteSource = useCallback((source) => {
        if (source === QUOTE_SOURCE.MY && !user) {
            return false;
        }
        setQuoteSource(source);
        return true;
    }, [user]);

    return (
        <QuoteContext.Provider
            value={{
                sentence,
                author,
                quotesIndex,
                setQuotesIndex,
                quoteSource,
                changeQuoteSource,
                isLoading,
                isEmpty,
            }}
        >
            {children}
        </QuoteContext.Provider>
    );
};
