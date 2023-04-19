import * as React from 'react';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import { Checkbox, Drawer, FormControlLabel, TextField } from '@mui/material';
import axios from 'axios';



export interface paper{
  label: string, 
  id: string,
  checked : boolean
}

const authors = [
  {
    name: "",
    id : ""
  }
]

export default function SearchBar(props: any) {
  const [graphType, setGraphType] = React.useState('');
  const [searchParameter, setSearchParameter] = React.useState('');
  const [distance, setDistance] = React.useState('');
  const [word, setWord] = React.useState('');
  const [hideButtons, setHideButtons] = React.useState(true)

  const [papers, setPapers] = React.useState<paper[]>([])

  const handleChangeGraphType = (event: { target: { value: string } }) => {
    setGraphType(event.target.value);
    setPapers([])
    setHideButtons(true)
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

  const handleSearch= async() => {
    
    fetchData();
    setHideButtons(false)
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {

    let newPapers = [...papers]
    newPapers.forEach( (paper) => {
      if( paper.id == event.target.value){
        paper.checked = event.target.checked;
      }
    })
    setPapers(newPapers)


  }

  const handleSelectAll = () =>{
    let newPapers = [...papers]
    newPapers.forEach( (paper) => {
      paper.checked = true
    })
    setPapers(newPapers)
  }

  const handleSelectNone = () => {
    let newPapers = [...papers]
    newPapers.forEach( (paper) => {
      paper.checked = false
    })
    setPapers(newPapers)
  }

  const handleAdd = () => {
      let ids: string[] = []
      papers.forEach((paper) => {ids.push(paper.id)})
      props.callBackendAPI(graphType, ids)
  }

  const fetchData = async() => {
    const response = await axios.get(`http://localhost:80/search/${graphType}/${word}`);
    const body = await response.data;

    let newList : paper[] = []

    if(graphType === 'paper'){      
      body.nodes.forEach(( paper : any) => {
        newList.push({
          label: paper.title,
          id: paper.id,
          checked : false
        })
      })
    } else {

    }

    setPapers(newList)

    console.log(body)
  }

  React.useEffect(() => {}, [papers])

  let paperCheckList : React.ReactElement[] = [];
  papers.forEach( (paper) => {
    paperCheckList.push(
      <FormControl sx={{ m: 1}} key = {paper.id}>
        <FormControlLabel
          label = {paper.label}
          control = {<Checkbox
            checked = {paper.checked}
            onChange = {handleCheck}
            value = {paper.id}/>}
          labelPlacement = "end"
        />
      </FormControl>)
  })

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
          <MenuItem value={"paper"}>Paper</MenuItem>
          <MenuItem value={"author"}>Author</MenuItem>
        </Select>
      </FormControl>


    <FormControl sx={{ m: 1}}>
      <TextField id="outlined-basic" label="Enter Search Word" variant="outlined" onChange={handleChangeWord} />
    </FormControl>
    
    <FormControl sx={{ m: 2}}>
      <Button variant="contained" onClick={handleSearch} >Search</Button>
    </FormControl>

    <div hidden = {hideButtons}>
    <br/>

    <FormControl sx={{ m: 2}}>
      <Button onClick={handleSelectAll} >Select All</Button>
    </FormControl>
    <FormControl sx={{ m: 2}}>
      <Button onClick={handleSelectNone} >Select None</Button>
    </FormControl>
    <FormControl sx={{ m: 2}} >
      <Button  variant="contained" onClick={handleAdd} >Add</Button>
    </FormControl>
    <br/>
    </div>
    {paperCheckList}

    

    </div>
  );
}
