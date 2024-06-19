import "./App.css";

import { ThemeContextProvider } from "./Context/ThemeContext";
import Head from "./components/head/Head";
import AppDiv from "./components/AppDiv/AppDiv";
import Info from "./components/Info/Info";
import { SettingContextProvider } from "./Context/SettingContext";
import { ScoreContextProvider } from "./Context/ScoreContext";
import QuoteInput from "./components/QuoteInput/QuoteInput";
import Contact from "./components/Contact/Contact";

function App() {
  return (
    <div>
      <ThemeContextProvider>
        <AppDiv>
          <Head />
          <SettingContextProvider>
            <ScoreContextProvider>
              <Info />
              <QuoteInput />
            </ScoreContextProvider>
          </SettingContextProvider>
          <Contact />
        </AppDiv>
      </ThemeContextProvider>
    </div>
  );
}

export default App;
