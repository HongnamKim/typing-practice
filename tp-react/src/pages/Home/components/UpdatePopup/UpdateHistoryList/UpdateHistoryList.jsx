import {updateHistory} from "@/data/updateHistory";
import UpdateSection from "../UpdateSection/UpdateSection";
import "./UpdateHistoryList.css";
import {useTheme} from "@/Context/ThemeContext.tsx";

const UpdateHistoryList = () => {
    const {isDark} = useTheme();

    return (
        <>
            {updateHistory
                .filter(update => !update.hidden)
                .map((update, index) => (
                    <div key={index} className={`update-history-item ${isDark ? "dark" : ""}`}>
                        <div className="update-history-header">
                            <span className="update-history-version">v{update.version}</span>
                            <span className={`update-history-date ${isDark ? "dark" : ""}`}>
                                {update.date}
                            </span>
                        </div>
                        <UpdateSection update={update}/>
                    </div>
                ))
            }
        </>
    );
};

export default UpdateHistoryList;
