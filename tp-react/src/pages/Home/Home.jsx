import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import FontSizeSlider from './components/FontSizeSlider/FontSizeSlider';
import ModeToggle from './components/ModeToggle/ModeToggle';
import UpdatePopup from './components/UpdatePopup/UpdatePopup';
import AverageScorePopUp from './components/AverageScorePopUp/AverageScorePopUp';
import Info from './components/Info/Info';
import Quote from './components/Quote/Quote';
import {SettingContextProvider} from '../../Context/SettingContext';
import {QuoteContextProvider} from '../../Context/QuoteContext';
import {Storage_Last_Mode} from '@/const/config.const.ts';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const lastMode = localStorage.getItem(Storage_Last_Mode);
        if (lastMode === 'word') {
            navigate('/word', {replace: true});
            return;
        }
        localStorage.setItem(Storage_Last_Mode, 'sentence');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
