import React, { useEffect, useState } from 'react';
import { LAYOUT_NAMES } from '../constants/Layout';
import GraphWithLayout from '../graph/GraphWithLayout';
import SearchBar from '../SearchBar'
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Date } from 'neo4j-driver';
import { Integer } from 'neo4j-driver-core';
import { TextField } from '@mui/material';



function HomePage(){

    const [layoutName, setLaYoutName] = useState(LAYOUT_NAMES.COLA)
    const[elements, setElements] = useState({'nodes': [],
                                              'edges': []})

    const[filteredElements, setFilteredElements] = useState({'nodes': [],
                                              'edges': []})                                          

    const callBackendAPI = async (graphType: string, parameterType : string, word: string) => {   
      console.log("here")
      const response = await fetch(`/${graphType}/${word}`);
      const body = await response.json();

      const updatedNodes = body.nodes.map((b: any) => {b.data.abbr = (b.data.label).substring(0,15) + '...'
                                  return b})
      
      const updatedEdges = body.edges.map((b: any) => {b.data.abbr = (b.data.label).substring(0,15) + '...'
                                  return b})
      const elements = {
        'nodes': updatedNodes,
        'edges': updatedEdges
      }

      if (response.status !== 200) {
        throw Error(body.message) 
      }

      console.log("here")
      setElements(elements)
      setFilteredElements(elements)
    };

    useEffect(() => {}, [])

    const [minDate, setMinDate] = React.useState('');
    const [maxDate, setMaxDate] = React.useState('3000');
    
    const applyDateFilter =  (minDate: string, maxDate : string) => {
      var minDateNo = Number(minDate) //source author target paper
      var maxDateNo = Number(maxDate) //source author target paper
      const newNodes = elements.nodes.filter((obj : any ) => {
      return (obj.data.year >= minDateNo && obj.data.year <= maxDateNo) || obj.data.type !="Paper"})
        
      const newIds = newNodes.map((obj : any ) => obj.data.id);
      const finalEdges = elements.edges.filter((obj : any ) => {
        return newIds.includes(obj.data.target) })
      
      
      const newAuthorIds = finalEdges.map((obj : any ) => obj.data.source);
      const finalNodes = newNodes.filter((obj : any ) => {
        return obj.data.type =="Paper" || newAuthorIds.includes(obj.data.id) })
      const filteredElements = {
        'nodes': finalNodes,
        'edges': finalEdges
      }
      setFilteredElements(filteredElements)

    };

    const filterAccordingToDate= () => {
      applyDateFilter(minDate,maxDate)
    };

    const changeDatefilter = (event: { target: { value: string } }) => {
      var minDate = Number(event.target.value) //source author target paper
      const newNodes = elements.nodes.filter((obj : any ) => {
      return obj.data.year >= minDate || obj.data.type !="Paper"})
        
      const newIds = newNodes.map((obj : any ) => obj.data.id);
      const finalEdges = elements.edges.filter((obj : any ) => {
        return newIds.includes(obj.data.target) })
      
      
      const newAuthorIds = finalEdges.map((obj : any ) => obj.data.source);
      const finalNodes = newNodes.filter((obj : any ) => {
        return obj.data.type =="Paper" || newAuthorIds.includes(obj.data.id) })
      const filteredElements = {
        'nodes': finalNodes,
        'edges': finalEdges
      }
      setFilteredElements(filteredElements)
    };

    const handleChangeMinDate = (event: { target: { value: string } }) => {
      setMinDate(event.target.value);
    };

    const handleChangeMaxDate = (event: { target: { value: string } }) => {
      if ( event.target.value == "" )
      {
        setMaxDate('3000');
      }
      else
      {
        setMaxDate(event.target.value);
      }
    };

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
          <FormControl sx={{ m: 1}}>
            <TextField id="minYear" label="Enter min year" variant="outlined" onChange={handleChangeMinDate} InputProps={{  inputProps: {
      maxLength: 4},type: 'number'}}  
            />
          </FormControl>
          <FormControl sx={{ m: 1,fontSize: '150px' }} style={{ fontSize: '150px' }}>
            <TextField id="maxYear" label="Enter max year" variant="outlined" onChange={handleChangeMaxDate} InputProps={{  inputProps: {
      maxLength: 4},type: 'number'}}  
            />
          </FormControl>
          <FormControl sx={{ m: 2}} >
            <Button variant="contained" onClick={filterAccordingToDate} >Filter</Button>
          </FormControl>
          <GraphWithLayout layoutName = {layoutName}  elements = {filteredElements} />
        </div>
      );
}


export default HomePage