import {useTheme} from "@/Context/ThemeContext.tsx";

const ReportReasonOption = ({value, checked, onChange, title, description}) => {
    const {isDark} = useTheme();

    return (
        <label className={`report-reason-option ${isDark ? 'dark' : ''}`}>
            <input
                type="radio"
                name="reportReason"
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <span className="report-reason-radio"></span>
            <div className="report-reason-content">
                <span className="report-reason-text">{title}</span>
                <span className={`report-reason-desc ${isDark ? 'dark' : ''}`}>{description}</span>
            </div>
        </label>
    );
};

export default ReportReasonOption;
