import React, { useEffect, useState } from "react";
import axios from "axios";
import { LAYOUT_NAMES } from "../constants/Layout";
import GraphWithLayout from "../graph/GraphWithLayout";
import SearchBar from "../search/SearchBar";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Date } from "neo4j-driver";
import { Integer } from "neo4j-driver-core";
import { TextField } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import NodeDetail from "../drawer/NodeDetail";
import DrawerContent from "../drawer/DrawerContent";
import Slider from "@mui/material/Slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import { COLOR_NAMES } from "../constants/Colors";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 500;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

function HomePage() {
  //console.log("Home Page");

  const [layoutName, setLaYoutName] = useState(LAYOUT_NAMES.KLAY);
  const [elements, setElements] = useState<{ nodes: any[]; edges: any[] }>({
    nodes: [],
    edges: [],
  });

  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  const [filteredElements, setFilteredElements] = useState<{
    nodes: any[];
    edges: any[];
  }>({ nodes: [], edges: [] });
  const [pinnedNodes, setPinnedNodes] = useState<string[]>([]);

  const [selectCommon, setSelectCommon] = React.useState(0);

  const handleSelectCommon = () => {
    setSelectCommon((selectCommon + 1) % 2);
  };

  const callBackendAPI = async (
    graphType: string,
    ids: string[],
    bringReference: number,
    bringReferenced: number,
    distance: number
  ) => {
    const body = {
      ids: ids,
      distance: distance,
    };
    //console.log(body);
    // "proxy": "http://localhost:80",
    if (graphType === "author") {
      const response = await axios.put(
        `http://localhost:80/add/${graphType}`,
        body
      );
      var data = await response.data;
      if (response.status !== 200) {
        throw Error(data.message);
      }
    } else {
      if (bringReference == 1 && bringReferenced == 1) {
        const response = await axios.put(
          `http://localhost:80/add/${graphType}/dist`,
          body
        );
        var data = await response.data;
        if (response.status !== 200) {
          throw Error(data.message);
        }
      } else if (bringReference == 1 && bringReferenced == 0) {
        const response = await axios.put(
          `http://localhost:80/add/${graphType}/dist/reference`,
          body
        );
        var data = await response.data;
        if (response.status !== 200) {
          throw Error(data.message);
        }
      } else if (bringReference == 0 && bringReferenced == 1) {
        const response = await axios.put(
          `http://localhost:80/add/${graphType}/dist/referredBy`,
          body
        );
        var data = await response.data;
        if (response.status !== 200) {
          throw Error(data.message);
        }
      } else {
        const response = await axios.put(
          `http://localhost:80/add/${graphType}`,
          body
        );
        var data = await response.data;
        if (response.status !== 200) {
          throw Error(data.message);
        }
      }
    }
    const updatedNodes = data.nodes.map((b: any) => {
      b.data.abbr = b.data.label.substring(0, 10) + "...";
      return b;
    });

    const updatedEdges = data.edges.map((b: any) => {
      b.data.abbr = b.data.label.substring(0, 10) + "...";
      return b;
    });
    const elements = {
      nodes: updatedNodes,
      edges: updatedEdges,
    };

    setElements(elements);
    setFilteredElements(elements);

    setMinDate("");
    setMaxDate("");
  };

  const callBackendAPIMerge = async (
    graphType: string,
    ids: string[],
    bringReference: number,
    bringReferenced: number,
    distance: number
  ) => {
    const body = {
      ids: ids,
      distance: distance,
    };
    //console.log(body);
    // "proxy": "http://localhost:80",
    if (graphType === "author") {
      const response = await axios.put(
        `http://localhost:80/add/${graphType}`,
        body
      );
      var data = await response.data;
      if (response.status !== 200) {
        throw Error(data.message);
      }
    } else {
      if (bringReference == 1 && bringReferenced == 1) {
        const response = await axios.put(
          `http://localhost:80/add/${graphType}/dist`,
          body
        );
        var data = await response.data;
        if (response.status !== 200) {
          throw Error(data.message);
        }
      } else if (bringReference == 1 && bringReferenced == 0) {
        const response = await axios.put(
          `http://localhost:80/add/${graphType}/dist/reference`,
          body
        );
        var data = await response.data;
        if (response.status !== 200) {
          throw Error(data.message);
        }
      } else if (bringReference == 0 && bringReferenced == 1) {
        const response = await axios.put(
          `http://localhost:80/add/${graphType}/dist/referredBy`,
          body
        );
        var data = await response.data;
        if (response.status !== 200) {
          throw Error(data.message);
        }
      } else {
        const response = await axios.put(
          `http://localhost:80/add/${graphType}`,
          body
        );
        var data = await response.data;
        if (response.status !== 200) {
          throw Error(data.message);
        }
      }
    }

    const updatedNodes = data.nodes.map((b: any) => {
      b.data.abbr = b.data.label.substring(0, 10) + "...";
      return b;
    });

    const updatedEdges = data.edges.map((b: any) => {
      b.data.abbr = b.data.label.substring(0, 10) + "...";
      return b;
    });

    const mergedElements = {
      nodes: [...elements.nodes, ...updatedNodes],
      edges: [...elements.edges, ...updatedEdges],
    };

    //console.log(mergedElements.nodes)
    addNodes([...elements.nodes, ...updatedNodes]);

    setElements(mergedElements);
    setFilteredElements(mergedElements);

    setMinDate("");
    setMaxDate("");
  };

  const addNodes = async (nodes: any[]) => {
    const uniquePaperIds = new Set<number>();
    const uniqueAuthorIds = new Set<number>();
    nodes.forEach((node) =>
      node.data.type === "Paper"
        ? uniquePaperIds.add(Number(node.data.id))
        : uniqueAuthorIds.add(Number(node.data.id))
    );

    const body = {
      paperIds: Array.from(uniquePaperIds),
      authorIds: Array.from(uniqueAuthorIds),
    };

    //console.log(body);
    const response = await axios.put(`http://localhost:80/relations`, body);
    const data = await response.data;

    const updatedElements = {
      nodes: nodes,
      edges: data.edges,
    };

    setElements(updatedElements);
    setFilteredElements(updatedElements);

    setMinDate("");
    setMaxDate("");
  };

  const getReferences = async (paperId: string) => {
    //console.log(paperId);
    const response = await axios.get(
      `http://localhost:80/getReferences/${paperId}`
    );
    const data = await response.data;
    //console.log(data)
    addPapers(data.nodes);
    //addUniqueElements(data)
  };

  const getReferred = async (paperId: string) => {
    // console.log(paperId);
    const response = await axios.get(
      `http://localhost:80/getReferred/${paperId}`
    );
    const data = await response.data;
    //console.log(data)
    addPapers(data.nodes);
    //addUniqueElements(data)
  };

  const addPapers = async (papers: any[]) => {
    console.log(papers);
    console.log(elements);
    const uniqueIds = papers
      .filter(
        (node: any) => !elements.nodes.some((e) => e.data.id === node.data.id)
      )
      .map((e) => Number(e.data.id));

    const body = {
      ids: [...elements.nodes.map((n) => Number(n.data.id)), ...uniqueIds],
    };
    console.log(body);

    const response = await axios.put(`http://localhost:80/add/paper`, body);
    const data = await response.data;
    //setElements(data)
    //console.log(data)
    //applyDateFilter(value[0],value[1], data)
    addUniqueElements(data);
  };

  const getPapers = async (authorId: string) => {
    console.log(authorId);
    const response = await axios.get(
      `http://localhost:80/getPapersOfAuthor/${authorId}`
    );
    const data = await response.data;
    console.log(data);
    //addPapers(data.nodes)
    addUniqueElements(data);
  };

  const getAuthors = async (paperId: string) => {
    console.log(paperId);
    const response = await axios.get(
      `http://localhost:80/getAuthorsOfPapers/${paperId}`
    );
    const data = await response.data;
    console.log(data);
    //addPapers(data.nodes)
    addUniqueElements(data);
  };

  const addUniqueElements = (data: any) => {
    const uniqueNodes = data.nodes.filter(
      (node: any) => !elements.nodes.some((e) => e.data.id === node.data.id)
    );

    const uniqueEdges = data.edges.filter(
      (edge: any) =>
        !elements.edges.some(
          (e) =>
            e.data.source === edge.data.source &&
            e.data.target === edge.data.target
        )
    );

    const updatedNodes = uniqueNodes.map((b: any) => {
      b.data.abbr = b.data.label.substring(0, 10) + "...";
      return b;
    });
    const uniqueElements = {
      nodes: [...elements.nodes, ...updatedNodes],
      edges: [...elements.edges, ...uniqueEdges],
    };

    setElements(uniqueElements);
    applyDateFilter(value[0], value[1], uniqueElements);
  };

  const remove = (nodeId: string) => {
    const newNodes = elements.nodes.filter(
      (node: any) => !(node.data.id === nodeId)
    );

    const newEdges = elements.edges.filter(
      (edge: any) =>
        !(edge.data.source === nodeId || edge.data.target === nodeId)
    );

    const newElements = {
      nodes: newNodes,
      edges: newEdges,
    };

    setElements(newElements);
    applyDateFilter(value[0], value[1], newElements);
  };

  const updateSelect = (nodeId: string, selected: boolean) => {
    const newNodes = elements.nodes.map((node) =>
      node.data.id === nodeId
        ? { ...node, data: { ...node.data, selected: selected } }
        : node
    );

    const node = newNodes.find((node) => node.data.id === nodeId);

    const newElements = {
      nodes: newNodes,
      edges: elements.edges,
    };

    setElements(newElements);
    applyDateFilter(value[0], value[1], newElements);
    //handleDrawerOpenWithState(node.data, 1)
  };

  const updatePin = (nodeId: string, pinStatus: boolean) => {
    const newNodes = elements.nodes.map((node) =>
      node.data.id === nodeId
        ? { ...node, data: { ...node.data, pinned: pinStatus } }
        : node
    );

    const node = newNodes.find((node) => node.data.id === nodeId);

    const newElements = {
      nodes: newNodes,
      edges: elements.edges,
    };

    setElements(newElements);
    applyDateFilter(value[0], value[1], newElements);
    handleDrawerOpenWithState(node.data, 1);
  };

  useEffect(() => {}, []);

  const [minDate, setMinDate] = React.useState("");
  const [maxDate, setMaxDate] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [node, setNode] = React.useState({ type: "" });
  const [drawerState, setDrawerState] = React.useState(0);
  const [select, setSelect] = React.useState(false);

  const applyDateFilter = (
    minDate: number,
    maxDate: number,
    elements: { nodes: any[]; edges: any[] }
  ) => {
    console.log(elements);

    var minDateNo = Number(minDate); //source author target paper
    var maxDateNo = Number(maxDate); //source author target paper
    maxDateNo = maxDateNo ? maxDateNo : 3000;
    const newNodes = elements.nodes.filter((obj: any) => {
      return (
        obj.data.pinned ||
        obj.data.type != "Paper" ||
        (obj.data.year >= minDateNo && obj.data.year <= maxDateNo)
      );
    });
    //obj.data.type !="Paper"
    //|| pinnedNodes.some((e) => e === obj.data.id)
    //|| ( obj.data.year >= minDateNo && obj.data.year <= maxDateNo)})

    const newIds = newNodes.map((obj: any) => obj.data.id);
    const finalEdges = elements.edges.filter((obj: any) => {
      return (
        newIds.includes(obj.data.target) && newIds.includes(obj.data.source)
      );
    });

    const newAuthorIds = finalEdges.map((obj: any) => obj.data.source);
    const finalNodes = newNodes.filter((obj: any) => {
      return obj.data.type == "Paper" || newAuthorIds.includes(obj.data.id);
    });
    const filteredElements = {
      nodes: newNodes,
      edges: finalEdges,
    };
    setFilteredElements(filteredElements);
    console.log(filteredElements);
  };

  const filterAccordingToDate = () => {
    applyDateFilter(value[0], value[1], elements);
  };

  const changeDatefilter = (event: { target: { value: string } }) => {
    var minDate = Number(event.target.value); //source author target paper
    const newNodes = elements.nodes.filter((obj: any) => {
      return obj.data.year >= minDate || obj.data.type != "Paper";
    });

    const newIds = newNodes.map((obj: any) => obj.data.id);
    const finalEdges = elements.edges.filter((obj: any) => {
      return newIds.includes(obj.data.target);
    });

    const newAuthorIds = finalEdges.map((obj: any) => obj.data.source);
    const finalNodes = newNodes.filter((obj: any) => {
      return obj.data.type == "Paper" || newAuthorIds.includes(obj.data.id);
    });
    const filteredElements = {
      nodes: finalNodes,
      edges: finalEdges,
    };
    setFilteredElements(filteredElements);
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
    setDrawerState(0);
    setOpen(true);
    setNode(node);
  };

  const handleDrawerOpenWithState = (node: any, state: number) => {
    setDrawerState(state);
    setOpen(true);
    setNode(node);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSelect = () => {
    setShowAdditionalButtons(!showAdditionalButtons);
    handleSelectCommon();
    setSelect((prevSelect) => !prevSelect);
    console.log(select);
    if (select === true) {
      const updatedNodes = elements.nodes.map((node) => {
        return { ...node, data: { ...node.data, selected: false } };
      });
      const newElements = {
        nodes: updatedNodes,
        edges: elements.edges,
      };

      setElements(newElements);
      applyDateFilter(value[0], value[1], newElements);
    }
  };

  const handleDownload = () => {
    console.log("download elements", elements);
    if (elements.nodes.length == 0) {
      window.alert("No nodes in canvas!");
    } else {
      const jsonData = JSON.stringify(elements);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "elements.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>): void => {
        const fileContent = e.target?.result as string;
        try {
          const jsonData = JSON.parse(fileContent);
          if (elements.nodes.length > 0) {
            const confirmOverride = window.confirm(
              "Are you sure you want to override your current elements?"
            );
            if (!confirmOverride) {
              return;
            }
          }
          // Do something with the JSON data

          console.log(jsonData);
          setElements(jsonData);
          setFilteredElements(jsonData);

          setMinDate("");
          setMaxDate("");
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          window.alert("Invalid JSON file. Please upload a valid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const [name, setName] = useState("start");

  const handleName = (name: string) => {
    setName(name);
  };

  const styles = {
    root: {
      width: 500,
      padding: "20px 0",
    },
  };

  const [value, setValue] = React.useState<number[]>([1980, 2023]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
    filterAccordingToDate();
  };

  const marks = [
    {
      value: 1980,
      label: "1980",
    },
    {
      value: 2023,
      label: 2023,
    },
  ];

  function valuetext(value: number) {
    return `${value}`;
  }
  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          style={{ backgroundColor: COLOR_NAMES.LIGHT_BLUE, display: "flex" }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faGem} size="2x" color="white" />
            <Typography
              variant="h5"
              noWrap
              sx={{ flexGrow: 1 }}
              component="div"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "2rem",
                color: "#fff",
                paddingLeft: "16px",
              }}
            >
              Paper Atlas
            </Typography>
          </Link>
          <Typography
            variant="h6"
            noWrap
            sx={{ marginLeft: "auto" }}
            component="div"
          >
            {open ? (
              <IconButton color="inherit" onClick={handleDrawerClose}>
                <ChevronRightIcon />
              </IconButton>
            ) : (
              <IconButton color="inherit" onClick={handleDrawerOpen}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: 510,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 510,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerContent
          node={node}
          value={drawerState}
          callBackendAPI={callBackendAPI}
          callBackendAPIMerge={callBackendAPIMerge}
          handleDrawerClose={handleDrawerClose}
          getReferences={getReferences}
          getReferred={getReferred}
          getPapers={getPapers}
          getAuthors={getAuthors}
          remove={remove}
          updatePin={updatePin}
        />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={open ? 12 : 6}
            xl={open ? 12 : 6}
            style={{ paddingLeft: 25 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={1} md={1} lg={3} xl={1}>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Layout</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={layoutName}
                    label="Distance"
                    onChange={handleChangeLayout}
                  >
                    <MenuItem value={LAYOUT_NAMES.COLA}>Cola</MenuItem>
                    <MenuItem value={LAYOUT_NAMES.COSE_BILKENT}>
                      Cose Bilkent
                    </MenuItem>
                    <MenuItem value={LAYOUT_NAMES.DAGRE}>Dagre</MenuItem>
                    <MenuItem value={LAYOUT_NAMES.EULER}>Euler</MenuItem>
                    <MenuItem value={LAYOUT_NAMES.KLAY}>Klay</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={11} md={11} lg={9} xl={11}>
                <FormControl>
                  <div style={styles.root}>
                    <Slider
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="on"
                      getAriaValueText={valuetext}
                      min={1980}
                      max={2023}
                      style={{
                        color: COLOR_NAMES.LIGHT_BLUE, // Change the color here
                      }}
                    />
                  </div>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={open ? 12 : 6}
            xl={open ? 12 : 6}
            style={{ paddingTop: 25, paddingLeft: 20 }}
          >
            <Grid container>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <FormControl>
                  <Button
                    variant="contained"
                    component="span"
                    style={{
                      color: !selectCommon ? COLOR_NAMES.BLUE : "white",
                      borderColor: COLOR_NAMES.BLUE,
                      backgroundColor: !selectCommon
                        ? "white"
                        : COLOR_NAMES.BLUE,
                      width: "120px",
                      height: "100%", // Set the height to 100%
                    }}
                    onClick={handleSelect}
                  >
                    Find Common
                  </Button>
                </FormControl>
              </Grid>

              {showAdditionalButtons && (
                <Grid item xs={3} sm={3} md={3} lg={4} xl={6}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column", // Change row to column
                      alignItems: "flex-start", // Align buttons to the left
                      justifyContent: "space-between", // Align buttons in the center vertically
                      height: "100%",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      style={{
                        height: "33%", // Set the height to one-third of the container height
                        marginBottom: "3px",
                        fontSize: "10px",
                      }} // Use marginBottom instead of marginTop for spacing
                    >
                      Bring References
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      style={{
                        height: "33%", // Set the height to one-third of the container height
                        marginBottom: "3px",
                        fontSize: "10px",
                      }}
                    >
                      Bring Referring Papers
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      style={{
                        height: "33%", // Set the height to one-third of the container height
                        marginBottom: "3px",
                        fontSize: "10px",
                      }}
                    >
                      Find Common Papers
                    </Button>
                  </div>
                </Grid>
              )}

              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <FormControl>
                  <Button
                    variant="outlined"
                    onClick={handleDownload}
                    style={{
                      color: COLOR_NAMES.BLUE,
                      borderColor: COLOR_NAMES.BLUE,
                      width: "120px",
                    }}
                  >
                    Download
                  </Button>
                </FormControl>
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={2} xl={3}>
                <FormControl>
                  <label htmlFor="file-upload">
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        bgcolor: COLOR_NAMES.BLUE,
                        color: "white",
                        "&:hover": {
                          bgcolor: COLOR_NAMES.BLUE, // Set the desired background color on hover
                        },
                        "&:focus": {
                          bgcolor: COLOR_NAMES.BLUE, // Set the desired background color on focus
                        },
                        "& .MuiTouchRipple-root": {
                          // Override the ripple color
                          backgroundColor: "transparent", // Set the desired ripple color
                        },
                      }} // Customize the background color and text color
                    >
                      Upload File
                    </Button>
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <GraphWithLayout
          layoutName={layoutName}
          elements={filteredElements}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerOpenWithState={handleDrawerOpenWithState}
          handleName={handleName}
          select={select}
          updateSelect={updateSelect}
        />
      </Main>
    </div>
  );
}

export default HomePage;
