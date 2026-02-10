import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {Storage_Dark_Mode} from "../const/config.const";

interface ThemeContextType {
    isDark: boolean | null;
    setIsDark: (value: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeContextProvider');
    }
    return context;
};

interface ThemeContextProviderProps {
    children: ReactNode;
}

export const ThemeContextProvider = ({children}: ThemeContextProviderProps) => {
    const [isDark, setIsDarkState] = useState<boolean | null>(null);

    // 다크모드 전환 시 transition 비활성화
    const setIsDark = useCallback((value: boolean) => {
        document.body.classList.add('disable-transitions');
        setIsDarkState(value);

        // 다음 프레임에서 transition 다시 활성화
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.body.classList.remove('disable-transitions');
            });
        });
    }, []);

    useEffect(() => {
        // 기존 다크모드 세팅이 있는 경우
        if (localStorage.getItem(Storage_Dark_Mode) === "true") {
            setIsDarkState(true);
            return;
        } else if (localStorage.getItem(Storage_Dark_Mode) === "false") {
            setIsDarkState(false);
            return;
        }

        // 기존 다크모드 세팅이 없는 경우 브라우저 세팅에 따라감
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            // 다크모드 지원 브라우저 + 다크모드 세팅
            setIsDarkState(true);
            localStorage.setItem(Storage_Dark_Mode, "true");
        } else {
            // 다크모드 지원 X 또는 라이트 모드 세팅
            setIsDarkState(false);
            localStorage.setItem(Storage_Dark_Mode, "false");
        }
    }, []);

    return (
        <ThemeContext.Provider value={{isDark, setIsDark}}>
            {children}
        </ThemeContext.Provider>
    );
};
