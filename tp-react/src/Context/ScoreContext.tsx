import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react";
import {TypoEntry} from "@/utils/typingRecordApi";

type InputCheckState = ('none' | 'correct' | 'incorrect')[];

interface ResultScore {
    totalCpm: number;
    totalAcc: number;
    cnt: number;
}

interface TotalScore {
    highestCpm: number;
    cpms: number;
    accs: number;
    cnt: number;
}

interface PopupData {
    avgCpm: number;
    maxCpm: number;
    acc: number;
}

interface ScoreContextType {
    speedCheck: boolean;
    setSpeedCheck: Dispatch<SetStateAction<boolean>>;
    currentCpm: number;
    setCurrentCpm: Dispatch<SetStateAction<number>>;
    lastCpm: number;
    setLastCpm: Dispatch<SetStateAction<number>>;
    resultScore: ResultScore;
    setResultScore: Dispatch<SetStateAction<ResultScore>>;
    totalScore: TotalScore;
    setTotalScore: Dispatch<SetStateAction<TotalScore>>;
    inputCheck: InputCheckState;
    setInputCheck: Dispatch<SetStateAction<InputCheckState>>;
    correctCount: number;
    setCorrectCount: Dispatch<SetStateAction<number>>;
    incorrectCount: number;
    setIncorrectCount: Dispatch<SetStateAction<number>>;
    showPopup: boolean;
    setShowPopup: Dispatch<SetStateAction<boolean>>;
    popupData: PopupData;
    setPopupData: Dispatch<SetStateAction<PopupData>>;
    popupCpmList: number[];
    setPopupCpmList: Dispatch<SetStateAction<number[]>>;
    popupAccList: number[];
    setPopupAccList: Dispatch<SetStateAction<number[]>>;
    popupTypos: TypoEntry[];
    setPopupTypos: Dispatch<SetStateAction<TypoEntry[]>>;
    cpmList: number[];
    setCpmList: Dispatch<SetStateAction<number[]>>;
    accList: number[];
    setAccList: Dispatch<SetStateAction<number[]>>;
    resetCount: number;
    setResetCount: Dispatch<SetStateAction<number>>;
}

export const ScoreContext = createContext<ScoreContextType | null>(null);

export const useScore = (): ScoreContextType => {
    const context = useContext(ScoreContext);
    if (!context) {
        throw new Error('useScore must be used within ScoreContextProvider');
    }
    return context;
};

const initResultScore: ResultScore = {
    totalCpm: 0,
    totalAcc: 0,
    cnt: 0,
};

const initTotalScore: TotalScore = {
    highestCpm: 0,
    cpms: 0,
    accs: 0,
    cnt: 0,
};

interface ScoreContextProviderProps {
    children: ReactNode;
}

export const ScoreContextProvider = ({children}: ScoreContextProviderProps) => {
    const [speedCheck, setSpeedCheck] = useState<boolean>(true);
    const [currentCpm, setCurrentCpm] = useState<number>(0);
    const [lastCpm, setLastCpm] = useState<number>(0);
    const [resultScore, setResultScore] = useState<ResultScore>(initResultScore);
    const [totalScore, setTotalScore] = useState<TotalScore>(initTotalScore);
    const [inputCheck, setInputCheck] = useState<InputCheckState>([]);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [incorrectCount, setIncorrectCount] = useState<number>(0);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupData, setPopupData] = useState<PopupData>({avgCpm: 0, maxCpm: 0, acc: 0});
    const [popupCpmList, setPopupCpmList] = useState<number[]>([]);
    const [popupAccList, setPopupAccList] = useState<number[]>([]);
    const [popupTypos, setPopupTypos] = useState<TypoEntry[]>([]);

    const [cpmList, setCpmList] = useState<number[]>([]);
    const [accList, setAccList] = useState<number[]>([]);
    const [resetCount, setResetCount] = useState<number>(0);

    return (
        <ScoreContext.Provider
            value={{
                speedCheck, setSpeedCheck,
                currentCpm, setCurrentCpm,
                lastCpm, setLastCpm,
                resultScore, setResultScore,
                totalScore, setTotalScore,
                inputCheck, setInputCheck,
                correctCount, setCorrectCount,
                incorrectCount, setIncorrectCount,
                showPopup, setShowPopup,
                popupData, setPopupData,
                popupCpmList, setPopupCpmList,
                popupAccList, setPopupAccList,
                popupTypos, setPopupTypos,
                cpmList, setCpmList,
                accList, setAccList,
                resetCount, setResetCount,
            }}
        >
            {children}
        </ScoreContext.Provider>
    );
};