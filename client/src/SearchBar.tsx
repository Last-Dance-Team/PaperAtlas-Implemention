import * as React from 'react';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';



export default function CustomizedSelects() {
  const [graph, setGraph] = React.useState('');
  const [searchparameter, setsearchparameter] = React.useState('');
  const [distance, setDistance] = React.useState('');
  const handleChange = (event: { target: { value: string } }) => {
    setGraph(event.target.value);
  };
  return (
    <div>
      <FormControl sx={{ m: 1 }} variant="standard">
        <InputLabel htmlFor="demo-customized-select-native" >Graph Type</InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={graph}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"AuthorPaper"}>Paper and Authors</MenuItem>
          <MenuItem value={"JournalPaper"}>Papers groupued by Journals</MenuItem>
          <MenuItem value={"KeyboardPaper"}>Papers and Keyboards</MenuItem>
          <MenuItem value={"CitationPaper"}>Papers and Citations</MenuItem>
          <MenuItem value={"ReferencePaper"}>Common References of Papers</MenuItem>
          <MenuItem value={"AuthorCitation"}>Authors and Citations</MenuItem>
        </Select>
      </FormControl>


      <FormControl sx={{ m: 1 }} variant="standard">
        <InputLabel htmlFor="demo-customized-select-native">Search Parameter</InputLabel>
        <NativeSelect
          id="demo-customized-select-native"
          value={searchparameter}
          onChange={handleChange}
        >
          <option aria-label="None" value="" />
          <option value={"First"}>First Parameter</option>
          <option value={"Secoond"}>Second Parameter</option>
        </NativeSelect>
      </FormControl>
            
      
      <FormControl sx={{ m: 1 }} variant="standard">
        <InputLabel htmlFor="demo-customized-select-native">Distance</InputLabel>
        <NativeSelect
          id="demo-customized-select-native"
          value={distance}
          onChange={handleChange}
        >
          <option aria-label="None" value="" />
          <option value={"First"}>1</option>
          <option value={"Secoond"}>2</option>
          <option value={"Third"}>3</option>
          <option value={"Fourth"}>4</option>
        </NativeSelect>
      </FormControl>

      <FormControl sx={{ m: 1 }} variant="standard" >
        <InputLabel htmlFor="demo-customized-textbox" >Search</InputLabel>
        
      </FormControl>
      <FormControl sx={{ m: 1 }} variant="standard" >
        <Button variant="contained" >Search Graph</Button>
        
      </FormControl>
    </div>
  );
}
