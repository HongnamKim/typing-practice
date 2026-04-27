import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UpdatePopup from './components/UpdatePopup/UpdatePopup';
import SessionResult from './components/SessionResult/SessionResult';
import Info from './components/Info/Info';
import Quote from './components/Quote/Quote';
import {SettingContextProvider} from '../../Context/SettingContext';
import {QuoteContextProvider} from '../../Context/QuoteContext';
import {useScore} from '../../Context/ScoreContext';
import {Storage_Last_Mode} from '@/const/config.const.ts';

function Home() {
    const navigate = useNavigate();
    const {showPopup, setShowPopup, setPopupTypos} = useScore();

    useEffect(() => {
        const lastMode = localStorage.getItem(Storage_Last_Mode);
        if (lastMode === 'word') {
            navigate('/word', {replace: true});
            return;
        }
        localStorage.setItem(Storage_Last_Mode, 'sentence');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSessionResultClose = () => {
        setShowPopup(false);
        setPopupTypos([]);
    };

    return (
        <SettingContextProvider>
            <UpdatePopup/>
            <Info/>
            <QuoteContextProvider>
                {showPopup ? (
                    <SessionResult onClose={handleSessionResultClose}/>
                ) : (
                    <Quote/>
                )}
            </QuoteContextProvider>
        </SettingContextProvider>
    );
}

export default Home;
