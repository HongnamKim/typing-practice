import {useTheme} from "../../../Context/ThemeContext";
import {updateHistory} from "../../../data/updateHistory";
import UpdateSection from "../UpdateSection/UpdateSection";
import "./LatestUpdate.css";

// showPopup: true인 최신 업데이트 찾기
const getLatestPopupUpdate = () => {
    return updateHistory.find(update => update.showPopup);
};

const LatestUpdate = () => {
    const {isDark} = useTheme();
    const latestPopupUpdate = getLatestPopupUpdate();

    if (!latestPopupUpdate) return null;

    return (
        <>
            <div className={`update-popup-version ${isDark ? "dark" : ""}`}>
                v{latestPopupUpdate.version}
            </div>
            <div className={`update-popup-date ${isDark ? "dark" : ""}`}>
                {latestPopupUpdate.date}
            </div>
            <UpdateSection update={latestPopupUpdate}/>
        </>
    );
};

export default LatestUpdate;
export {getLatestPopupUpdate};
