import logo from "./logo.svg";
import "./App.css";
import ResponsiveAppBar from "./Components/AppBar";
import Intake from "./Components/Intake";
import Login from "./Components/Login";
import Logout from "./Components/Logout";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import PhotosUploader from "./Components/PhotosUploader";
import LoginForm from "./Components/NewLogin";
import SignInSide from "./Components/NewLogin";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
function App() {
  const [user, loading, error] = useAuthState(auth);
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <ResponsiveAppBar></ResponsiveAppBar>
        <div className="content-container flex justify-center">
          <Routes>
            <Route exact path="/" element={user ? <Intake /> : <Login />} />
            <Route path="/intake" element={<Intake />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/"></Navigate> : <Login />}
            />
            <Route
              path="/photos"
              element={user ? <PhotosUploader /> : <Login />}
            />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
