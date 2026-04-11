import {createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useScore} from "./ScoreContext";
import {useAuth} from "./AuthContext";
import {useError} from "./ErrorContext";
import {getQuotes} from "../utils/quoteApi";
import {defaultQuotes} from "../data/default-quotes.const.ts";
import {Session_Post_Login_Quote_Source} from "../const/config.const";
import {t} from "../utils/i18n";

interface Quote {
    quoteId?: number;
    sentence: string;
    author?: string;
}

type QuoteSourceType = 'all' | 'my';

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
const QUOTE_SOURCE = {
    ALL: 'all' as const,
    MY: 'my' as const,
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
    const {user} = useAuth();
    const {showError} = useError();

    const seedRef = useRef<number>(generateSeed());
    const currentPageRef = useRef<number>(1);
    const hasNextRef = useRef<boolean>(true);
    const isLoadingRef = useRef<boolean>(false);

    const [quoteSource, setQuoteSource] = useState<QuoteSourceType>(QUOTE_SOURCE.ALL);
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
                if (content.length === 0 && source === QUOTE_SOURCE.ALL) {
                    // 서버 응답은 왔지만 공개 문장이 없는 경우 로컬 문장 사용
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
                if (reset) {
                    setIsEmpty(true);
                }
            }
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [quoteSource, setCurrentQuote, showError, loadFallbackQuotes]);

    useEffect(() => {
        if (!user && quoteSource === QUOTE_SOURCE.MY) {
            setQuoteSource(QUOTE_SOURCE.ALL);
        }
        // 로그인 후 저장된 소스 전환 적용
        if (user) {
            const pendingSource = sessionStorage.getItem(Session_Post_Login_Quote_Source);
            if (pendingSource === 'my') {
                sessionStorage.removeItem(Session_Post_Login_Quote_Source);
                setQuoteSource(QUOTE_SOURCE.MY);
            }
        }
    }, [user, quoteSource]);

    useEffect(() => {
        resetState();
        loadQuotes(1, true, quoteSource);
    }, [quoteSource]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (quotes.length === 0) return;

        if (quotesIndex < 0) {
            setQuotesIndex(quotes.length - 1);
            return;
        }

        if (quotesIndex >= quotes.length) {
            if (hasNextRef.current && !isLoadingRef.current) {
                loadQuotes(currentPageRef.current + 1, false, quoteSource);
            } else {
                if (isOffline) {
                    const shuffled = shuffleArray(quotes);
                    setQuotes(shuffled);
                    setQuotesIndex(0);
                    setCurrentQuote(shuffled[0]);
                } else {
                    seedRef.current = generateSeed();
                    resetState();
                    loadQuotes(1, true, quoteSource);
                }
            }
            return;
        }

        setCurrentQuote(quotes[quotesIndex]);
    }, [quotesIndex, quotes]); // eslint-disable-line react-hooks/exhaustive-deps

    const currentQuote = quotes[quotesIndex] || null;

    const changeQuoteSource = useCallback((source: QuoteSourceType): boolean => {
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
                currentQuote,
                quotesIndex,
                setQuotesIndex,
                quoteSource,
                changeQuoteSource,
                isLoading,
                isEmpty,
                isOffline,
            }}
        >
            {children}
        </QuoteContext.Provider>
    );
};