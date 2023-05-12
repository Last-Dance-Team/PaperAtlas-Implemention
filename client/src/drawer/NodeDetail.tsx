import { useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box, ThemeProvider, createTheme } from '@mui/system';
import Divider from '@mui/material/Divider';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';

const theme = createTheme({
    palette: {
      background: {
        paper: '#fff',
      },
      text: {
        primary: '#000',
        secondary: '#111',
      },
      action: {
        active: '#001E3C',
      },
    },
  });




function NodeDetail(props: any){
    var node = props.node

    console.log(node.pinned)

    const handleReference = () => {
        props.getReferences(node.id)
    }

    const handleReferred = () => {
        props.getReferred(node.id)
    }
    const handleAuthors = () => {
        props.getAuthors(node.id)
    }
    const handlePapers = () => {
        props.getPapers(node.id)
    }
    const handleRemove = () => {
        props.remove(node.id)
    }
    const handlePin = () => {
        props.updatePin(node.id, true)
    }
    const handleUnpin = () => {
        props.updatePin(node.id, false)
    }

    const fetchInfo = async() => {
        console.log(props.node.id)
        const response = await axios.get(`http://localhost:80/paper/info/${props.node.id}`);
        const data = await response.data
        console.log(data)
    }

    useEffect(() => {
        console.log("in use effect")
        if(props.node.type == 'Paper'){
            console.log("in if")
            fetchInfo()
        }
    }, [props.node])




    if (node.type == 'Paper'){
        return(
            <div>   
                <Button sx={{  m: 0.5 }} variant="outlined" onClick = {handleReference}>References</Button>
                <Button sx={{  m: 0.5 }} variant="outlined" onClick = {handleReferred}>Citations</Button> 
                <Button sx={{  m: 0.5 }} variant="outlined" onClick = {handleAuthors}>Authors</Button>  
                <Button sx={{  m: 0.5 }} variant="outlined" onClick = {handleRemove}>Remove</Button> 
                <> { !node.pinned && (<Button sx={{  m: 0, width:50 }} variant="outlined" onClick = {handlePin}>Pin</Button>)  }</>
                <> { node.pinned && (<Button sx={{  m: 0, width:50 }} variant="contained" onClick = {handleUnpin}>Unpin</Button>)  }</>       
                <ThemeProvider theme={theme}>
                    <Box sx={{  bgcolor: 'background.paper',}}>
                        <Box sx={{  m: 1, color: 'text.secondary' }}><strong>Title: </strong>  </Box>
                        <Box sx={{  m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.label}  </Box>
                        <br/>
                        <Box sx={{  m: 1, color: 'text.secondary' }}><strong>Publication Year: </strong>  </Box>
                        <Box sx={{  m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.year}  </Box>
                        <br/>
                        <Box sx={{  m: 1, color: 'text.secondary' }}><strong>DOI: </strong>  </Box>
                        <Box sx={{  m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.doi}  </Box>
                        <br/>
                        <Box sx={{ m: 1, color: 'text.secondary' }}><strong>Field of Study: </strong>  </Box>

                                {node.uniqueFieldsOfStudies.map( (a: string) =>{
                                    return(<Box key = {a} sx={{  m: 2, color: 'text.primary', fontSize: 16, fontWeight: 'medium'}}>{a}</Box>)
                                })}

                                <br/>
                        <Box sx={{  m: 1, color: 'text.secondary' }}><strong>Citation Count: </strong>  </Box>
                        <Box sx={{  m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.citationCount}  </Box>

                        <br/>
                        <Box sx={{  m: 2, color: 'text.primary', fontSize: 16, fontWeight: 'medium'}}> <a href= {node.url}>URL to Paper</a></Box>
                    
                        <br/>

                    </Box>
                </ThemeProvider>
            </div>)
    }

    if (node.type == 'Author'){
        return(
            <div>
                <Button sx={{  m: 0.5 }} variant="outlined" onClick = {handlePapers}>Papers</Button>  
                <Button sx={{  m: 0.5 }} variant="outlined" onClick = {handleRemove}>Remove</Button> 
                <> { !node.pinned && (<Button sx={{  m: 0, width:50 }} variant="outlined" onClick = {handlePin}>Pin</Button>)  }</>
                <> { node.pinned && (<Button sx={{  m: 0, width:50 }} variant="contained" onClick = {handleUnpin}>Unpin</Button>)  }</> 
                <ThemeProvider theme={theme}>
                    <Box sx={{  bgcolor: 'background.paper',}}>
                        <Box sx={{ m: 1, color: 'text.secondary' }}><strong>Name: </strong>  </Box>
                        <Box sx={{ m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.label}  </Box>
                        <br/>
                        <div hidden = {node.aliases.length === 0 }>
                            <Box sx={{ m: 1, color: 'text.secondary' }}><strong>Aliases: </strong>  </Box>

                            {node.aliases.map( (a: string) =>{
                                return(<Box key = {a} sx={{  m: 2, color: 'text.primary', fontSize: 16, fontWeight: 'medium'}}>{a}</Box>)
                            })}

                            <br/>
                        </div>
                        
                        <Box sx={{ m: 1, color: 'text.secondary' }}><strong>Paper Count: </strong>  </Box>
                        <Box sx={{  m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.paperCount}  </Box>
                        <br/>
                        <Box sx={{ m: 1, color: 'text.secondary' }}><strong>Citation Count: </strong>  </Box>
                        <Box sx={{  m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.citationCount}  </Box>


                    </Box>
                </ThemeProvider>
            </div>)
    }
    return(
        <div>
            No Selected Node
        </div>
    )
}

export default NodeDetail;