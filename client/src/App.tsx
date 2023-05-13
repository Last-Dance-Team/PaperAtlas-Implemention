
import React, { useEffect } from 'react';
import { LAYOUT_NAMES } from './constants/Layout';
import GraphWithLayout from './graph/GraphWithLayout';
import HomePage from './pages/HomePage';
import { Routes, Route } from "react-router-dom";

import DemoGraph from './graph/DemoGraph';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import SearchBar from  './search/SearchBar'
import LandingPage from './Landing page/LandingPage';


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
};

export default App;
