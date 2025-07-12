import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Downloader from "./components/Downloader";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/downloader" element={<Downloader />} />
      </Routes>
    </Router>
  );
}

export default App;
