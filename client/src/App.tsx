
import React, { useEffect } from 'react';
import { LAYOUT_NAMES } from './constants/Layout';
import GraphWithLayout from './graph/GraphWithLayout';
import HomePage from './pages/HomePage';

import DemoGraph from './graph/DemoGraph';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import SearchBar from  './search/SearchBar'


const App: React.FC = () => {

  return (
    <div>
      <HomePage/>
    </div>
  );
};

export default App;
