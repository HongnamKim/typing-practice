import {useSetting} from "../../Context/SettingContext";
import {Storage_Font_Size} from "../../const/config.const";
import "./FontSizeSlider.css";

const FontSizeSlider = () => {
    const {fontSize, setFontSize} = useSetting();

    // 슬라이더 값(0-100)을 폰트 크기로 변환
    const sliderToFontSize = (sliderValue) => {
        const normalized = sliderValue / 100; // 0 ~ 1

        if (normalized <= 0.5) {
            // 0 ~ 0.5: 0.9rem ~ 2.0rem (선형)
            return 0.9 + (normalized * 2) * 1.1;
        } else {
            // 0.5 ~ 1: 2.0rem ~ 3.0rem (지수적 증가)
            const t = (normalized - 0.5) * 2; // 0 ~ 1
            return 2.0 + (t * t); // 제곱으로 가속
        }
    };

    // 폰트 크기를 슬라이더 값(0-100)으로 변환
    const fontSizeToSlider = (size) => {
        if (size <= 2.0) {
            // 0.9 ~ 2.0
            const normalized = (size - 0.9) / 1.1;
            return normalized * 50;
        } else {
            // 2.0 ~ 3.0
            const normalized = Math.sqrt((size - 2.0));
            return 50 + normalized * 50;
        }
    };

    const handleChange = (e) => {
        const sliderValue = parseFloat(e.target.value);
        const newSize = sliderToFontSize(sliderValue);
        setFontSize(newSize);
        localStorage.setItem(Storage_Font_Size, newSize.toString());
    };

    const handleReset = () => {
        setFontSize(2.0);
        localStorage.setItem(Storage_Font_Size, "2.0");
    };

    return (
        <div className="font-size-slider-container">
            <label
                className="font-size-label"
                onClick={handleReset}
                title="Click to reset"
            >
                Font Size
            </label>
            <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={fontSizeToSlider(fontSize)}
                onChange={handleChange}
                className="font-size-slider"
            />
        </div>
    );
};

export default FontSizeSlider;
