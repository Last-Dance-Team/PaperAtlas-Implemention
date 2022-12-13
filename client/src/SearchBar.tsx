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
  const [graphType, setGraphType] = React.useState('');
  const [searchParameter, setSearchParameter] = React.useState('');
  const [distance, setDistance] = React.useState('');
  const handleChangeGraphType = (event: { target: { value: string } }) => {
    setGraphType(event.target.value);
  };

  const handleChangeParameter = (event: { target: { value: string } }) => {
    setSearchParameter(event.target.value);
  };

  const handleChangeDistance= (event: { target: { value: string } }) => {
    setDistance(event.target.value);
  };
  return (
    <div className= {'search-bar-body'}>
      <FormControl sx={{ m: 1, minWidth: 280 }}>
        <InputLabel id="demo-simple-select-label">Graph Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={graphType}
          label="Graph Type"
          onChange={handleChangeGraphType}
        >
          <MenuItem value={"AuthorPaper"}>Paper and Authors</MenuItem>
          <MenuItem value={"JournalPaper"}>Papers groupued by Journals</MenuItem>
          <MenuItem value={"KeyboardPaper"}>Papers and Keyboards</MenuItem>
          <MenuItem value={"CitationPaper"}>Papers and Citations</MenuItem>
          <MenuItem value={"ReferencePaper"}>Common References of Papers</MenuItem>
          <MenuItem value={"AuthorCitation"}>Authors and Citations</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="demo-simple-select-label">Search Parameter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={searchParameter}
          label="Search Parameter"
          onChange={handleChangeParameter}
        >
          <MenuItem value={"AuthorPaper"}>Paper Title</MenuItem>
          <MenuItem value={"JournalPaper"}>Author Name</MenuItem>
          <MenuItem value={"KeyboardPaper"}>Keyword</MenuItem>
        </Select>
      </FormControl>


      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="demo-simple-select-label">Distance</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={distance}
          label="Distance"
          onChange={handleChangeDistance}
        >
          <MenuItem value={1}>One</MenuItem>
          <MenuItem value={2}>Two</MenuItem>
          <MenuItem value={3}>Three</MenuItem>
          <MenuItem value={4}>Four</MenuItem>
          <MenuItem value={5}>Five</MenuItem>
        </Select>
      </FormControl>

        <Button variant="contained" >Search Graph</Button>

    </div>
  );
}
