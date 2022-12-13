import React, { useEffect, useState } from 'react';
import { LAYOUT_NAMES } from '../constants/Layout';
import GraphWithLayout from '../graph/GraphWithLayout';

function HomePage(){

    const [layoutName, setLaYoutName] = useState(LAYOUT_NAMES.DAGRE)
    const[elements, setElements] = useState({'nodes': [],
                                              'edges': []})


    const callBackendAPI = async () => {
      const response = await fetch('/getAuthor/Liu');
      const body = await response.json();

      if (response.status !== 200) {
        throw Error(body.message) 
      }
      setElements(body)
    };

    //useEffect(() => {callBackendAPI()}, [])
    
    //const layoutName = LAYOUT_NAMES.COLA

    return (
        <div>
          <GraphWithLayout layoutName = {layoutName}  elements = {elements} />
        </div>
      );
}


export default HomePage