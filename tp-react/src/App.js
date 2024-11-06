import "./App.css";

import { ThemeContextProvider } from "./Context/ThemeContext";
import Head from "./components/Head/Head";
import AppDiv from "./components/AppDiv/AppDiv";
import Info from "./components/Info/Info";
import { SettingContextProvider } from "./Context/SettingContext";
import { ScoreContextProvider } from "./Context/ScoreContext";
import Quote from "./components/Quote/Quote";
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
              <Quote />
            </ScoreContextProvider>
          </SettingContextProvider>
          <Contact />
        </AppDiv>
      </ThemeContextProvider>
    </div>
  );
}

export default App;
