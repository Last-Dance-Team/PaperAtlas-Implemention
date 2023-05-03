import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NodeDetail from './NodeDetail';
import SearchBar from '../search/SearchBar';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
    >
        {value === index && (
        <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
        </Box>
        )}
    </div>
    );
}

function a11yProps(index: number) {
    return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    };
}

function DrawerContent(props: any){
    const [value, setValue] = React.useState(props.value);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

    React.useEffect(() => {
        setValue(props.value)
    }, [props.value])

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Search" {...a11yProps(0)} />
                <Tab label="Node Deatil" {...a11yProps(1)} />
                <Typography variant="h6" noWrap sx={{ position: 'right' }} component="div">
                    <IconButton onClick={props.handleDrawerClose}>
                        <ChevronRightIcon />
                    </IconButton>
                </Typography>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <SearchBar callBackendAPI = {props.callBackendAPI} callBackendAPIMerge = {props.callBackendAPIMerge}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <NodeDetail {...props}/>
            </TabPanel>
        </Box>
    )
}

export default DrawerContent;