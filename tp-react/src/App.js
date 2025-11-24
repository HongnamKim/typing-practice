import "./App.css";

import { ThemeContextProvider } from "./Context/ThemeContext";
import Head from "./components/Head/Head";
import AppDiv from "./components/AppDiv/AppDiv";
import Info from "./components/Info/Info";
import { SettingContextProvider } from "./Context/SettingContext";
import { ScoreContextProvider } from "./Context/ScoreContext";
import Quote from "./components/Quote/Quote";
import Contact from "./components/Contact/Contact";
import { QuoteContextProvider } from "./Context/QuoteContext";
import AverageScorePopUp from "./components/AverageScorePopUp/AverageScorePopUp";
import FontSizeSlider from "./components/FontSizeSlider/FontSizeSlider";
import {Analytics} from "@vercel/analytics/react";

function App() {
  return (
    <ThemeContextProvider>
      <AppDiv>
        <Head />
        <SettingContextProvider>
          <FontSizeSlider />
          <ScoreContextProvider>
            <AverageScorePopUp />
            <Info />
            <QuoteContextProvider>
              <Quote />
            </QuoteContextProvider>
          </ScoreContextProvider>
        </SettingContextProvider>
        <Contact />
          <Analytics/>
      </AppDiv>
    </ThemeContextProvider>

  );
}

export default App;


