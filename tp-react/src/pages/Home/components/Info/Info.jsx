import {useState, useEffect, useRef} from "react";
import "./Info.css";
import ResultPeriod from "./ResultPeriod/ResultPeriod";
import FontSizeSlider from "../FontSizeSlider/FontSizeSlider";
import ModeToggle from "../ModeToggle/ModeToggle";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa6";
import {useScore} from "@/Context/ScoreContext.tsx";
import {useSetting} from "@/Context/SettingContext.tsx";
import {Storage_Controls_Collapsed, Storage_Display_Cpm} from "@/const/config.const.ts";

const Info = () => {
    const {currentCpm, lastCpm, totalScore} = useScore();
    const {displayCurrentCpm, setDisplayCurrentCpm} = useSetting();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isNarrowMode, setIsNarrowMode] = useState(false);
    const userPrefRef = useRef(localStorage.getItem(Storage_Controls_Collapsed));
    const infoRowRef = useRef(null);

    const cpmValue = displayCurrentCpm ? currentCpm : lastCpm;
    const cpmLabel = displayCurrentCpm ? "CURRENT CPM" : "LAST CPM";
    const accValue = totalScore.cnt === 0 ? "-" : Math.round(totalScore.accs / totalScore.cnt);
    const cntValue = totalScore.cnt === 0 ? "-" : totalScore.cnt;

    const handleCpmToggle = () => {
        const next = !displayCurrentCpm;
        setDisplayCurrentCpm(next);
        localStorage.setItem(Storage_Display_Cpm, String(next));
    };

    const controlsRef = useRef(null);

    useEffect(() => {
        const resolveState = () => {
            const narrow = window.innerWidth <= 1080;
            if (narrow) {
                setIsCollapsed(true);
                setIsNarrowMode(true);
            } else if (userPrefRef.current !== null) {
                setIsCollapsed(userPrefRef.current === "true");
                setIsNarrowMode(false);
            } else {
                setIsCollapsed(false);
                setIsNarrowMode(false);
            }
        };
        resolveState();
        window.addEventListener("resize", resolveState);
        return () => window.removeEventListener("resize", resolveState);
    }, []);

    // narrow 모드에서 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isNarrowMode && !isCollapsed && controlsRef.current && !controlsRef.current.contains(e.target)) {
                setIsCollapsed(true);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isNarrowMode, isCollapsed]);

    const handleToggle = (e) => {
        e.stopPropagation();
        const next = !isCollapsed;
        if (!isNarrowMode) {
            userPrefRef.current = String(next);
            localStorage.setItem(Storage_Controls_Collapsed, String(next));
        }
        setIsCollapsed(next);
    };

    const controlsClass = `info-controls${isCollapsed ? " collapsed" : ""}${isNarrowMode ? " narrow-mode" : ""}`;

    return (
        <div className="info-background">
            <div className="info-row" ref={infoRowRef}>
                <div className="info-stats">
                    <div className="info-stat info-stat-clickable" onClick={handleCpmToggle} title="Click to toggle Current/Last CPM">
                        <span className="info-stat-label">{cpmLabel}</span>
                        <span className="info-stat-value current">{cpmValue}</span>
                    </div>
                    <div className="info-stat">
                        <span className="info-stat-label">HIGHEST CPM</span>
                        <span className="info-stat-value">{totalScore.highestCpm}</span>
                    </div>
                    <div className="info-stat-sep"/>
                    <div className="info-stat">
                        <span className="info-stat-label">ACC</span>
                        <span className="info-stat-value">{accValue}</span>
                    </div>
                    <div className="info-stat">
                        <span className="info-stat-label">CNT</span>
                        <span className="info-stat-value">{cntValue}</span>
                    </div>
                </div>
                <div className={controlsClass} ref={controlsRef}>
                    <div className="info-controls-inner">
                        <FontSizeSlider/>
                        <div className="info-control-sep"/>
                        <ResultPeriod/>
                        <div className="info-control-sep"/>
                        <ModeToggle/>
                    </div>
                    <button className="info-controls-toggle" onClick={handleToggle}>
                        {isCollapsed ? <FaChevronLeft/> : <FaChevronRight/>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Info;
