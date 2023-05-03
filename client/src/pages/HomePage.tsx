import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LAYOUT_NAMES } from '../constants/Layout';
import GraphWithLayout from '../graph/GraphWithLayout';
import SearchBar from '../search/SearchBar'
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Date } from 'neo4j-driver';
import { Integer } from 'neo4j-driver-core';
import { TextField } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import NodeDetail from '../drawer/NodeDetail';
import DrawerContent from '../drawer/DrawerContent';

const drawerWidth = 500;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


function HomePage(){

  console.log("Home Page")

    const [layoutName, setLaYoutName] = useState(LAYOUT_NAMES.KLAY)
    const[elements, setElements] = useState<{ nodes: any[], edges: any[]}>({'nodes': [] ,'edges': []})

    const[filteredElements, setFilteredElements] = useState<{ nodes: any[], edges: any[]}>({'nodes': [] ,'edges': []}) 
    const[pinnedNodes, setPinnedNodes] = useState<string[]>([])                                           

    const callBackendAPI = async (graphType : string, ids: string[]) => {   
      console.log("here")
      
      const body = {
        ids : ids
      }
     // "proxy": "http://localhost:80",

      const response = await axios.put(`http://localhost:80/add/${graphType}`, body);
      const data = await response.data

      console.log(data)

      const updatedNodes = data.nodes.map((b: any) => {b.data.abbr = (b.data.label).substring(0,10) + '...'
                                  return b})
      
      const updatedEdges = data.edges.map((b: any) => {b.data.abbr = (b.data.label).substring(0,10) + '...'
                                  return b})
      const elements = {
        'nodes': updatedNodes,
        'edges': updatedEdges
      }

      if (response.status !== 200) {
        throw Error(data.message) 
      }

      console.log("here")
      setElements(elements)
      setFilteredElements(elements)

      setMinDate('')
      setMaxDate('')

    };

    const getReferences = async(paperId: string) => {
      console.log(paperId)
      const response = await axios.get(`/getReferences/${paperId}`);
      const data = await response.data 
      console.log(data)
      addUniqueElements(data)

    }

    const getReferred = async(paperId: string) => {
      console.log(paperId)
      const response = await axios.get(`/getReferred/${paperId}`);
      const data = await response.data
      console.log(data)
      addUniqueElements(data)

    }

    const addUniqueElements = (data: any) => {
      const uniqueNodes = data.nodes.filter((node: any) => 
        !elements.nodes.some((e) => e.data.id === node.data.id)
      )

      const uniqueEdges = data.edges.filter((edge: any) => 
        !elements.edges.some((e) => e.data.source === edge.data.source && e.data.target === edge.data.target)
      )

      const updatedNodes = uniqueNodes.map((b: any) => {b.data.abbr = (b.data.label).substring(0,10) + '...'
                                  return b})
      const uniqueElements = {
        nodes: [...(elements.nodes), ...updatedNodes],
        edges: [...(elements.edges), ...uniqueEdges]
      }
      
      setElements(uniqueElements)
      applyDateFilter(minDate,maxDate, uniqueElements)
    }

    const remove = (nodeId: string) => {
      const newNodes = elements.nodes.filter((node: any) => !(node.data.id === nodeId))

      const newEdges = elements.edges.filter((edge: any) => !(edge.data.source === nodeId || edge.data.target === nodeId))

      const newElements = {
        nodes : newNodes,
        edges: newEdges
      }

      setElements(newElements)
      applyDateFilter(minDate, maxDate, newElements)
    }

    const pin = (nodeId: string) => {
        setPinnedNodes([...pinnedNodes, nodeId])
    }

    const unpin = (nodeId: string) => {
      setPinnedNodes(pinnedNodes.filter((e: string) => !(e === nodeId)))
    }

    useEffect(() => {}, [])

    const [minDate, setMinDate] = React.useState('');
    const [maxDate, setMaxDate] = React.useState('');
    const [open, setOpen] = React.useState(true);
    const [node, setNode] = React.useState({'type': ''})
    const [drawerState, setDrawerState] = React.useState(0)

    const applyDateFilter =  (minDate: string, maxDate : string, elements: {nodes: any[], edges: any[]}) => {
      console.log(elements)
      var minDateNo = Number(minDate) //source author target paper
      var maxDateNo = Number(maxDate) //source author target paper
      maxDateNo = maxDateNo ? maxDateNo : 3000
      const newNodes = elements.nodes.filter((obj : any ) => {
        return (obj.data.year >= minDateNo && obj.data.year <= maxDateNo) || obj.data.type !="Paper"})
        //obj.data.type !="Paper"
        //|| pinnedNodes.some((e) => e === obj.data.id)
        //|| ( obj.data.year >= minDateNo && obj.data.year <= maxDateNo)})
        
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
      console.log(filteredElements)

    };

    const filterAccordingToDate= () => {
      applyDateFilter(minDate,maxDate, elements)
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
        setMaxDate(event.target.value);

    };

    const handleChangeLayout = (event: { target: { value: string } }) => {
      setLaYoutName(event.target.value);
    };

    const handleDrawerOpen = (node: any) => {
      setDrawerState(0)
      setOpen(true);
      setNode(node)
    };

    const handleDrawerOpenWithState = (node: any, state: number) => {
      setOpen(true);
      setNode(node)
      setDrawerState(state)
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };
    

    const [name, setName] = useState('start');

    const handleName = (name: string) => {
      setName(name);
    };

    return (
        <div>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <Typography variant="h5" noWrap sx={{ flexGrow: 1 }} component="div">
                Paper Atlas
              </Typography>  
              <Typography variant="h6" noWrap sx={{ position: 'right' }} component="div">
                    <IconButton onClick={handleDrawerOpen}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Typography>      
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: 510,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 510,
                boxSizing: 'border-box',
              },
            }}
            variant="persistent"
            anchor="right"
            open={open}
          >
              <DrawerContent 
                node ={node} 
                value = {drawerState}
                callBackendAPI = {callBackendAPI} 
                handleDrawerClose = {handleDrawerClose}
                getReferences={getReferences}
                getReferred = {getReferred}
                remove = {remove}
                pin = {pin}
                unpin = {unpin}/>

          </Drawer>
          <Main open={open}>
            <DrawerHeader />
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
                <MenuItem value={LAYOUT_NAMES.KLAY}>Klay</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1}}>
              <TextField id="minYear" label="Enter min year" variant="outlined" onChange={handleChangeMinDate} value = {minDate} InputProps={{  inputProps: {
        maxLength: 4},type: 'number'}}  
              />
            </FormControl>
            <FormControl sx={{ m: 1,fontSize: '150px' }} style={{ fontSize: '150px' }}>
              <TextField id="maxYear" label="Enter max year" variant="outlined" onChange={handleChangeMaxDate} value = {maxDate} InputProps={{  inputProps: {
        maxLength: 4},type: 'number'}}  
              />
            </FormControl>
            <FormControl sx={{ m: 2}} >
              <Button variant="contained" onClick={filterAccordingToDate} >Filter</Button>
            </FormControl>
            <GraphWithLayout 
              layoutName = {layoutName}  
              elements = {filteredElements} 
              handleDrawerOpen={handleDrawerOpen}
              handleDrawerOpenWithState = {handleDrawerOpenWithState} 
              handleName = {handleName} />
          </Main>
        </div>
      );
}


export default HomePage