import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NodeDetail from "./NodeDetail";
import SearchBar from "../search/SearchBar";
import Filter from "./Filter";
import Common from "./Common";

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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function DrawerContent(props: any) {
  const [value, setValue] = React.useState(props.value);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    setValue(props.value);
  }, [props.value, props.node]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Search" {...a11yProps(0)} style={{ textTransform: 'lowercase' }}/>
          <Tab label="Node Details" {...a11yProps(1)} style={{ textTransform: 'lowercase' }}  />
          <Tab label="Filter" {...a11yProps(2)}  style={{ textTransform: 'lowercase' }}/>
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <SearchBar
          callBackendAPI={props.callBackendAPI}
          callBackendAPIMerge={props.callBackendAPIMerge}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NodeDetail {...props} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Filter
          filter={props.filter}
          citationCount = {props.citationCount}
          selectedFields = {props.selectedFields}
          filterType= {props.filterType}
        />
      </TabPanel>
    </Box>
  );
}

export default DrawerContent;
