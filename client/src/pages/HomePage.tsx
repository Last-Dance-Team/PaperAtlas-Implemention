import React, { useEffect, useState } from 'react';
import { LAYOUT_NAMES } from '../constants/Layout';
import GraphWithLayout from '../graph/GraphWithLayout';
import SearchBar from '../SearchBar'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function HomePage(){

    const [layoutName, setLaYoutName] = useState(LAYOUT_NAMES.COLA)
    const[elements, setElements] = useState({'nodes': [],
                                              'edges': []})


    const callBackendAPI = async (graphType: string, parameterType : string, word: string) => {
      console.log("here")
      const response = await fetch(`/${graphType}/${word}`);
      const body = await response.json();

      if (response.status !== 200) {
        throw Error(body.message) 
      }

      console.log("here")
      console.log(body)
      setElements(body)
    };

    useEffect(() => {}, [])

    const handleChangeLayout = (event: { target: { value: string } }) => {
      setLaYoutName(event.target.value);
    };

    return (
        <div>
          <SearchBar callBackendAPI = {callBackendAPI}/>
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Layout</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={layoutName}
              label="Distance"
              onChange={handleChangeLayout}
            >
              <MenuItem value={LAYOUT_NAMES.COLA}>Cola</MenuItem>
              <MenuItem value={LAYOUT_NAMES.COSE_BILKENT}>Cose Bilkent</MenuItem>
              <MenuItem value={LAYOUT_NAMES.DAGRE}>Dagre</MenuItem>
              <MenuItem value={LAYOUT_NAMES.EULER}>Euler</MenuItem>
              <MenuItem value={LAYOUT_NAMES.KALY}>Klay</MenuItem>
            </Select>
          </FormControl>
          <GraphWithLayout layoutName = {layoutName}  elements = {elements} />
        </div>
      );
}


export default HomePage