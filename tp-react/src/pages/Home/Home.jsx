import FontSizeSlider from './components/FontSizeSlider/FontSizeSlider';
import ModeToggle from './components/ModeToggle/ModeToggle';
import UpdatePopup from './components/UpdatePopup/UpdatePopup';
import AverageScorePopUp from './components/AverageScorePopUp/AverageScorePopUp';
import Info from './components/Info/Info';
import Quote from './components/Quote/Quote';
import {SettingContextProvider} from '../../Context/SettingContext';
import {QuoteContextProvider} from '../../Context/QuoteContext';

function Home() {
    return (
        <SettingContextProvider>
            <div className="top-left-controls">
                <FontSizeSlider/>
                <ModeToggle/>
            </div>
            <UpdatePopup/>
            <AverageScorePopUp/>
            <Info/>
            <QuoteContextProvider>
                <Quote/>
            </QuoteContextProvider>
        </SettingContextProvider>
    );
}

export default Home;
