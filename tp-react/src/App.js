import "./App.css";

import TestComp from "./TestComp";
import { ThemeContextProvider } from "./Context/ThemeContext";
import Head from "./components/head/Head";
import AppDiv from "./components/AppDiv/AppDiv";
import Info from "./components/Info/Info";
import { SettingContextProvider } from "./Context/SettingContext";

function App() {
  return (
    <div>
      <ThemeContextProvider>
        <AppDiv>
          <Head />
          <SettingContextProvider>
            <Info />
            <TestComp />
          </SettingContextProvider>
        </AppDiv>
      </ThemeContextProvider>
    </div>
  );
}

export default App;
