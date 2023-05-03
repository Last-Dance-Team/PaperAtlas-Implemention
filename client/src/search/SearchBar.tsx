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
import Pagination from '@mui/material/Pagination';



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
const itemsPerPage = 10;
let pageNumber = 0;
export default function SearchBar(props: any) {
  const [graphType, setGraphType] = React.useState('');
  const [searchParameter, setSearchParameter] = React.useState('');
  const [distance, setDistance] = React.useState('');
  const [word, setWord] = React.useState('');
  const [hideButtons, setHideButtons] = React.useState(true)

  const [papers, setPapers] = React.useState<paper[]>([])
  const [ currentPage,setCurrentPage] = React.useState(1);
  

  const [isMerge, setIsMerge] = React.useState(false);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

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

  const handleChangeCurrentPage= (event: { target: { value: string } }) => {
    setCurrentPage(parseInt(event.target.value));
  };

  const handleSearch= async() => {
    
    fetchData();
    setHideButtons(false)
    setCurrentPage(1);
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

  const handleCheckForMerge = (event: React.ChangeEvent<HTMLInputElement>) => {

    setIsMerge(event.target.checked);
    
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
      papers.forEach((paper) => {
        if(paper.checked){
          ids.push(paper.id)
        }})
    if( !isMerge)
    {
      props.callBackendAPI(graphType, ids)
    }
    else
    {
      props.callBackendAPIMerge(graphType, ids)
    }
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
      body.authors.forEach(( author : any) => {
        newList.push({
          label: author.name,
          id: author.id,
          checked : false
        })
      })

    }

    setPapers(newList)

    console.log(body)
  }

  React.useEffect(() => {}, [papers])
  
  pageNumber =  Math.ceil( 1.0 * papers.length / itemsPerPage);
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

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value);
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
    <FormControlLabel
          label = {"Merge"}
          control = {<Checkbox
            checked = {isMerge}
            onChange = {handleCheckForMerge}
           />}
          labelPlacement = "end"
    />
    <br/>
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
    {paperCheckList.slice(firstIndex, lastIndex)}

    
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      { paperCheckList.length > 0 && (
      <Pagination count={pageNumber}
        page={currentPage}
        onChange={handlePageChange}
        color="secondary" />
      )}
    </div>
    </div>
    
  );
}
