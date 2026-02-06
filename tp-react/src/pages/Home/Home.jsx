import FontSizeSlider from './components/FontSizeSlider/FontSizeSlider';
import ModeToggle from './components/ModeToggle/ModeToggle';
import UpdatePopup from './components/UpdatePopup/UpdatePopup';
import AverageScorePopUp from './components/AverageScorePopUp/AverageScorePopUp';
import Info from './components/Info/Info';
import Quote from './components/Quote/Quote';
import {SettingContextProvider} from '../../Context/SettingContext';
import {ScoreContextProvider} from '../../Context/ScoreContext';
import {QuoteContextProvider} from '../../Context/QuoteContext';

function Home() {
    return (
        <SettingContextProvider>
            <div className="top-left-controls">
                <FontSizeSlider/>
                <ModeToggle/>
            </div>
            <UpdatePopup/>
            <ScoreContextProvider>
                <AverageScorePopUp/>
                <Info/>
                <QuoteContextProvider>
                    <Quote/>
                </QuoteContextProvider>
            </ScoreContextProvider>
        </SettingContextProvider>
    );
}

export default Home;
