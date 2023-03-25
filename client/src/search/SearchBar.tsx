import * as React from 'react';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';



export default function SearchBar(props: any) {
  const [graphType, setGraphType] = React.useState('');
  const [searchParameter, setSearchParameter] = React.useState('');
  const [distance, setDistance] = React.useState('');
  const [word, setWord] = React.useState('');

  const handleChangeGraphType = (event: { target: { value: string } }) => {
    setGraphType(event.target.value);
  };

  const handleChangeParameter = (event: { target: { value: string } }) => {
    setSearchParameter(event.target.value);
  };

  const handleChangeDistance= (event: { target: { value: string } }) => {
    setDistance(event.target.value);
  };

  const handleChangeWord= (event: { target: { value: string } }) => {
    setWord(event.target.value);
  };

  const handleClick= () => {
    props.callBackendAPI(graphType, word)
  };


  return (
    <div className= {'search-bar-body'}>
      <FormControl sx={{ m: 1, minWidth: 280 }}>
        <InputLabel id="demo-simple-select-label">Search Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={graphType}
          label="Graph Type"
          onChange={handleChangeGraphType}
        >
          <MenuItem value={"getPaper"}>Paper</MenuItem>
          <MenuItem value={"getAuthor"}>Author</MenuItem>
        </Select>
      </FormControl>


    <FormControl sx={{ m: 1}}>
      <TextField id="outlined-basic" label="Enter Search Word" variant="outlined" onChange={handleChangeWord} />
    </FormControl>
    
    <FormControl sx={{ m: 2}}>
      <Button variant="contained" onClick={handleClick} >Search</Button>
    </FormControl>

    </div>
  );
}
