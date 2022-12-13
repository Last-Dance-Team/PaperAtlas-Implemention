import React, { useEffect } from 'react';
import { LAYOUT_NAMES } from './constants/Layout';
import GraphWithLayout from './graph/GraphWithLayout';
import HomePage from './pages/HomePage';


const App: React.FC = () => {



  const layoutName = LAYOUT_NAMES.COLA

  return (
    <div>
      <h1>My Graph Visualization</h1>
      <HomePage/>
    </div>
  );
};

export default App;
