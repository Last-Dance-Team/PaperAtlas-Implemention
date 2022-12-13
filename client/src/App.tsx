import React from 'react';
import DemoGraph from './graph/DemoGraph';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import SearchBar from  './SearchBar'

const App: React.FC = () => {
  return (
    <div>
      <h1>My Graph Visualization</h1>
      <SearchBar/>
      <DemoGraph />
    </div>
  );
};

export default App;
