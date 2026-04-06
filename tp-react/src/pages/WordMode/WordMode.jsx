import {useEffect} from "react";
import {WordContextProvider, useWord} from "./context/WordContext";
import WordInfo from "./components/WordInfo/WordInfo";
import WordTyping from "./components/WordTyping/WordTyping";
import WordResult from "./components/WordResult/WordResult";
import UpdatePopup from "../Home/components/UpdatePopup/UpdatePopup";
import {SettingContextProvider} from "@/Context/SettingContext.tsx";
import {Storage_Last_Mode} from "@/const/config.const.ts";
import "./WordMode.css";

const WordModeContent = () => {
    const {state} = useWord();
    const {phase} = state;

    return (
        <>
            <WordInfo/>
            <div className="word-mode-container">
                {phase !== 'result' && <WordTyping/>}
                {phase === 'result' && <WordResult/>}
            </div>
        </>
    );
};

const WordMode = () => {
    useEffect(() => {
        localStorage.setItem(Storage_Last_Mode, 'word');
    }, []);

    return (
        <SettingContextProvider>
            <UpdatePopup/>
            <WordContextProvider>
                <WordModeContent/>
            </WordContextProvider>
        </SettingContextProvider>
    );
};

export default WordMode;
