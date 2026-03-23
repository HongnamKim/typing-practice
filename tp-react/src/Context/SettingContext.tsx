import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {
    Storage_Compact_Mode,
    Storage_Display_Cpm,
    Storage_Font_Size,
    Storage_Result_Period
} from "../const/config.const";

interface SettingContextType {
    displayCurrentCpm: boolean | null;
    setDisplayCurrentCpm: Dispatch<SetStateAction<boolean | null>>;
    resultPeriod: number | null;
    setResultPeriod: Dispatch<SetStateAction<number | null>>;
    fontSize: number;
    setFontSize: Dispatch<SetStateAction<number>>;
    isCompactMode: boolean;
    setIsCompactMode: Dispatch<SetStateAction<boolean>>;
}

export const SettingContext = createContext<SettingContextType | null>(null);

export const useSetting = (): SettingContextType => {
    const context = useContext(SettingContext);
    if (!context) {
        throw new Error('useSetting must be used within SettingContextProvider');
    }
    return context;
};

export const resultPeriodSet = [5, 10, 15, Infinity] as const;
export const resultPeriodDisplaySet = ["5", "10", "15", "∞"] as const;

interface SettingContextProviderProps {
    children: ReactNode;
}

export const SettingContextProvider = ({children}: SettingContextProviderProps) => {
    const [displayCurrentCpm, setDisplayCurrentCpm] = useState<boolean | null>(null);
    const [resultPeriod, setResultPeriod] = useState<number | null>(null);
    const [fontSize, setFontSize] = useState<number>(2.0);
    const [isCompactMode, setIsCompactMode] = useState<boolean>(false);

    useEffect(() => {
        const beforeSetting = localStorage.getItem(Storage_Display_Cpm);
        if (beforeSetting) {
            setDisplayCurrentCpm(beforeSetting === "true");
        } else {
            localStorage.setItem(Storage_Display_Cpm, "true");
            setDisplayCurrentCpm(true);
        }

        const savedPeriod = localStorage.getItem(Storage_Result_Period);
        if (savedPeriod) {
            setResultPeriod(+savedPeriod);
        } else {
            localStorage.setItem(Storage_Result_Period, "0");
            setResultPeriod(0);
        }

        const savedFontSize = localStorage.getItem(Storage_Font_Size);
        if (savedFontSize) {
            setFontSize(parseFloat(savedFontSize));
        } else {
            localStorage.setItem(Storage_Font_Size, "2.0");
            setFontSize(2.0);
        }

        const savedCompactMode = localStorage.getItem(Storage_Compact_Mode);
        if (savedCompactMode) {
            setIsCompactMode(savedCompactMode === "true");
        } else {
            localStorage.setItem(Storage_Compact_Mode, "false");
            setIsCompactMode(false);
        }
    }, []);

    return (
        <SettingContext.Provider value={{
            displayCurrentCpm,
            setDisplayCurrentCpm,
            resultPeriod,
            setResultPeriod,
            fontSize,
            setFontSize,
            isCompactMode,
            setIsCompactMode
        }}>
            {children}
        </SettingContext.Provider>
    );
};