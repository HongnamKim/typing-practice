import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeContextProvider } from "./Context/ThemeContext";
import { AuthProvider } from "./Context/AuthContext";
import { ErrorProvider } from "./Context/ErrorContext";
import { ScoreContextProvider } from "./Context/ScoreContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Head from "./components/Head/Head";
import AppDiv from "./components/AppDiv/AppDiv";
import Contact from "./components/Contact/Contact";
import Home from "./pages/Home/Home";
import WordMode from "./pages/WordMode/WordMode";
import QuoteUpload from "./pages/QuoteUpload/QuoteUpload";
import MyQuotes from "./pages/MyQuotes/MyQuotes";
import MyReports from "./pages/MyReports/MyReports";
import Stats from "./pages/Stats/Stats";
import Updates from "./pages/Updates/Updates";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import {Analytics} from "@vercel/analytics/react";
import ConsentBanner from "./components/ConsentBanner/ConsentBanner";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ThemeContextProvider>
          <ErrorProvider>
            <AuthProvider>
              <ScoreContextProvider>
              <AppDiv>
                <Head />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/word" element={<WordMode />} />
                  <Route path="/quote/upload" element={<QuoteUpload />} />
                  <Route path="/quote/my" element={<MyQuotes />} />
                  <Route path="/quote/report" element={<MyReports />} />
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/updates" element={<Updates />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Contact />
                <ConsentBanner/>
                <Analytics/>
              </AppDiv>
              </ScoreContextProvider>
            </AuthProvider>
          </ErrorProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
