import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeContextProvider } from "./Context/ThemeContext";
import { AuthProvider } from "./Context/AuthContext";
import { ErrorProvider } from "./Context/ErrorContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Head from "./components/Head/Head";
import AppDiv from "./components/AppDiv/AppDiv";
import Contact from "./components/Contact/Contact";
import Home from "./pages/Home/Home";
import QuoteUpload from "./pages/QuoteUpload/QuoteUpload";
import MyQuotes from "./pages/MyQuotes/MyQuotes";
import MyReports from "./pages/MyReports/MyReports";
import Stats from "./pages/Stats/Stats";
import {Analytics} from "@vercel/analytics/react";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ThemeContextProvider>
          <ErrorProvider>
            <AuthProvider>
              <AppDiv>
                <Head />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/quote/upload" element={<QuoteUpload />} />
                  <Route path="/quote/my" element={<MyQuotes />} />
                  <Route path="/quote/report" element={<MyReports />} />
                  <Route path="/stats" element={<Stats />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Contact />
                <Analytics/>
              </AppDiv>
            </AuthProvider>
          </ErrorProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
