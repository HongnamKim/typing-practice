import {updateHistory, formatUpdateDate} from "@/data/updateHistory";
import UpdateSection from "../UpdateSection/UpdateSection";
import {t} from "@/utils/i18n.ts";
import "./LatestUpdate.css";

// showPopup: true인 최신 업데이트 찾기
const getLatestPopupUpdate = () => {
    return updateHistory.find(update => update.showPopup);
};

const LatestUpdate = () => {
    const latestPopupUpdate = getLatestPopupUpdate();

    if (!latestPopupUpdate) return null;

    return (
        <>
            <span className="update-popup-badge">v{latestPopupUpdate.version} Released</span>
            <div className="update-popup-version-row">
                <span className="update-popup-version">{t('updateNotice')}</span>
                <span className="update-popup-date">{formatUpdateDate(latestPopupUpdate.date)}</span>
            </div>
            <UpdateSection update={latestPopupUpdate}/>
        </>
    );
};

export default LatestUpdate;
export {getLatestPopupUpdate};
