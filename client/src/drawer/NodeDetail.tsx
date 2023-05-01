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

    const handleReference = () => {
        console.log(node)
        props.getReferences(node.id)
    }

    const HandleReferred = () => {
        console.log(node)
        props.getReferred(node.id)
    }

    if (node.type == 'Paper'){
        return(
        <div>
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
                            return(<Box sx={{  m: 2, color: 'text.primary', fontSize: 16, fontWeight: 'medium'}}>{a}</Box>)
                        })}

                        <br/>
                <Box sx={{  m: 1, color: 'text.secondary' }}><strong>Citation Count: </strong>  </Box>
                <Box sx={{  m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.citationCount}  </Box>

                <br/>
                <Box sx={{  m: 2, color: 'text.primary', fontSize: 16, fontWeight: 'medium'}}> <a href= {node.url}>URL to Paper</a></Box>
               
                <br/>

        </Box>
        
        </ThemeProvider>
        <Button onClick={handleReference}>References</Button>
        <Button onClick={HandleReferred}>Citation</Button>
        </div>
        )
    }

    if (node.type == 'Author'){
        return(
            <ThemeProvider theme={theme}>
                <Box sx={{  bgcolor: 'background.paper',}}>
                    <Box sx={{ m: 1, color: 'text.secondary' }}><strong>Name: </strong>  </Box>
                    <Box sx={{ m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.label}  </Box>
                    <br/>
                    <div hidden = {node.aliases.length === 0 }>
                        <Box sx={{ m: 1, color: 'text.secondary' }}><strong>Aliases: </strong>  </Box>

                        {node.aliases.map( (a: string) =>{
                            return(<Box sx={{  m: 2, color: 'text.primary', fontSize: 16, fontWeight: 'medium'}}>{a}</Box>)
                        })}

                        <br/>
                    </div>
                    
                    <Box sx={{ m: 1, color: 'text.secondary' }}><strong>Paper Count: </strong>  </Box>
                    <Box sx={{  m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.paperCount}  </Box>
                    <br/>
                    <Box sx={{ m: 1, color: 'text.secondary' }}><strong>Citation Count: </strong>  </Box>
                    <Box sx={{  m: 2, color: 'text.primary', fontSize: 20, fontWeight: 'medium'}}>{node.citationCount}  </Box>


                </Box>
            </ThemeProvider>)
    }
    return(
        <div>
            No Selected Node
        </div>
    )
}

export default NodeDetail;