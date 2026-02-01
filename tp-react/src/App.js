import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "./Context/ThemeContext";
import { AuthProvider } from "./Context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Head from "./components/Head/Head";
import AppDiv from "./components/AppDiv/AppDiv";
import Contact from "./components/Contact/Contact";
import Home from "./pages/Home/Home";
import QuoteUpload from "./pages/QuoteUpload/QuoteUpload";
import {Analytics} from "@vercel/analytics/react";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ThemeContextProvider>
          <AuthProvider>
            <AppDiv>
              <Head />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quote/upload" element={<QuoteUpload />} />
              </Routes>
              <Contact />
              <Analytics/>
            </AppDiv>
          </AuthProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
