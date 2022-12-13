
import React, { useEffect } from 'react';
import { LAYOUT_NAMES } from './constants/Layout';
import GraphWithLayout from './graph/GraphWithLayout';
import HomePage from './pages/HomePage';

import DemoGraph from './graph/DemoGraph';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import SearchBar from  './SearchBar'


const App: React.FC = () => {



  const layoutName = LAYOUT_NAMES.COLA

  return (
    <div>
      <h1>My Graph Visualization</h1>
      <SearchBar/>
      <HomePage/>
    </div>
  );
};

export default App;
