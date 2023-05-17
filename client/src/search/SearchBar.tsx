import * as React from "react";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import {
  Checkbox,
  Drawer,
  FormControlLabel,
  IconButton,
  TextField,
  makeStyles,
} from "@mui/material";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import MergeIcon from "@mui/icons-material/Merge";
import StartIcon from "@mui/icons-material/Start";
import ArticleIcon from "@mui/icons-material/Article";
import FormHelperText from "@mui/material/FormHelperText";
export interface paper {
  label: string;
  id: string;
  checked: boolean;
}

const authors = [
  {
    name: "",
    id: "",
  },
];
const itemsPerPage = 10;
let pageNumber = 0;
export default function SearchBar(props: any) {
  const [graphType, setGraphType] = React.useState("");
  const [searchParameter, setSearchParameter] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [word, setWord] = React.useState("");
  const [hideButtons, setHideButtons] = React.useState(true);

  const [papers, setPapers] = React.useState<paper[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  const [isMerge, setIsMerge] = React.useState(false);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const handleChangeGraphType = (event: { target: { value: string } }) => {
    setGraphType(event.target.value);
    setPapers([]);
    setHideButtons(true);
  };

  const handleChangeParameter = (event: { target: { value: string } }) => {
    setSearchParameter(event.target.value);
  };

  const handleChangeDistance = (event: { target: { value: string } }) => {
    setDistance(event.target.value);
  };

  const handleChangeWord = (event: { target: { value: string } }) => {
    setWord(event.target.value);
  };

  const handleChangeCurrentPage = (event: { target: { value: string } }) => {
    setCurrentPage(parseInt(event.target.value));
  };

  const handleSearch = async () => {
    if (word.length < 3) {
      window.alert("Word length less than 3. Please choose a longer word!");

      return;
    }
    fetchData();
    setHideButtons(false);
    setCurrentPage(1);
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newPapers = [...papers];
    newPapers.forEach((paper) => {
      if (paper.id == event.target.value) {
        paper.checked = event.target.checked;
      }
    });
    setPapers(newPapers);
  };

  const handleCheckForMerge = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMerge(event.target.checked);
  };

  const handleSelectAll = () => {
    let newPapers = [...papers];
    newPapers.forEach((paper) => {
      paper.checked = true;
    });
    setPapers(newPapers);
  };

  const handleSelectNone = () => {
    let newPapers = [...papers];
    newPapers.forEach((paper) => {
      paper.checked = false;
    });
    setPapers(newPapers);
  };

  const handleAdd = () => {
    let ids: string[] = [];
    papers.forEach((paper) => {
      if (paper.checked) {
        ids.push(paper.id);
      }
    });
    if (selectedButton == 2) {
      props.callBackendAPI(
        graphType,
        ids,
        bringReference,
        bringReferenced,
        distance
      );
    } else {
      props.callBackendAPIMerge(
        graphType,
        ids,
        bringReference,
        bringReferenced,
        distance
      );
    }
  };

  const fetchData = async () => {
    const response = await axios.get(
      `http://localhost:80/search/${graphType}/${word}`
    );
    const body = await response.data;

    let newList: paper[] = [];

    if (graphType === "paper") {
      body.nodes.forEach((paper: any) => {
        newList.push({
          label: paper.title,
          id: paper.id,
          checked: false,
        });
      });
    } else {
      body.authors.forEach((author: any) => {
        newList.push({
          label: author.name,
          id: author.id,
          checked: false,
        });
      });
    }

    setPapers(newList);

    console.log(body);
  };

  React.useEffect(() => {}, [papers]);

  pageNumber = Math.ceil((1.0 * papers.length) / itemsPerPage);
  let paperCheckList: React.ReactElement[] = [];
  papers.forEach((paper) => {
    paperCheckList.push(
      <FormControl sx={{ m: 1, display: "block" }} key={paper.id}>
        <FormControlLabel
          label={paper.label}
          control={
            <Checkbox
              checked={paper.checked}
              onChange={handleCheck}
              value={paper.id}
            />
          }
          labelPlacement="end"
        />
      </FormControl>
    );
  });

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const [selectedButton, setSelectedButton] = React.useState(1);

  const handleButtonClick = (buttonNumber: React.SetStateAction<number>) => {
    setSelectedButton(buttonNumber);
  };

  const [bringReference, setBringReference] = React.useState(0);

  const handleReferenceButtonClick = () => {
    setBringReference((bringReference + 1) % 2);
  };

  const [bringReferenced, setBringReferenced] = React.useState(0);

  const handleReferencedButtonClick = () => {
    setBringReferenced((bringReferenced + 1) % 2);
  };

  return (
    <div className={"search-bar-body"}>
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

      <FormControl sx={{ m: 1 }}>
        <TextField
          id="outlined-basic"
          label="Enter Search Word"
          variant="outlined"
          onChange={handleChangeWord}
        />
      </FormControl>

      <FormControl sx={{ m: 2 }}>
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </FormControl>

      <div hidden={hideButtons}>
        <div style={{ display: "flex" }}>
          <IconButton
            onClick={() => handleButtonClick(1)}
            style={{
              color: selectedButton === 1 ? "purple" : "grey",
              borderColor: selectedButton === 1 ? "purple" : "grey",
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: "4px", // Optionally, add border radius for a rounded appearance
              backgroundColor: "transparent",
              boxShadow: "none",
              padding: "8px",
              margin: "10px",
            }}
          >
            <MergeIcon />
            <span style={{ fontSize: "14px" }}>Merge to the graph</span>
          </IconButton>

          <IconButton
            onClick={() => handleButtonClick(2)}
            style={{
              color: selectedButton === 2 ? "purple" : "grey",
              borderColor: selectedButton === 2 ? "purple" : "grey",
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: "4px", // Optionally, add border radius for a rounded appearance
              backgroundColor: "transparent",
              boxShadow: "none",
              padding: "8px",
              margin: "10px",
            }}
          >
            <StartIcon />
            <span style={{ fontSize: "14px" }}>Start a graph </span>
          </IconButton>
        </div>
        {graphType !== "author" && (
          <div style={{ display: "flex" }}>
            <IconButton
              onClick={handleReferenceButtonClick}
              style={{
                color: bringReference === 1 ? "purple" : "grey",
                borderColor: bringReference === 1 ? "purple" : "grey",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "4px", // Optionally, add border radius for a rounded appearance
                backgroundColor: "transparent",
                boxShadow: "none",
                padding: "8px",
                margin: "10px",
              }}
            >
              <ArticleIcon />
              <span style={{ fontSize: "14px" }}>Bring references</span>
            </IconButton>

            <IconButton
              onClick={handleReferencedButtonClick}
              style={{
                color: bringReferenced === 1 ? "purple" : "grey",
                borderColor: bringReferenced === 1 ? "purple" : "grey",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "4px", // Optionally, add border radius for a rounded appearance
                backgroundColor: "transparent",
                boxShadow: "none",
                padding: "8px",
                margin: "10px",
              }}
            >
              <ArticleIcon />
              <span style={{ fontSize: "14px" }}>Bring papers that refer </span>
            </IconButton>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <InputLabel id="demo-simple-select-helper-label">
                Distance
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={distance}
                onChange={handleChangeDistance}
                autoWidth
                label="Distance"
              >
                <MenuItem value={0}>
                  <em>0</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </Select>
            </div>
          </div>
        )}

        <br />
        <FormControl sx={{ m: 1 }}>
          <Button onClick={handleSelectAll}>Select All</Button>
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <Button onClick={handleSelectNone}>Select None</Button>
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </FormControl>
        <br />
      </div>
      {paperCheckList.slice(firstIndex, lastIndex)}

      <div style={{ display: "flex", justifyContent: "center" }}>
        {paperCheckList.length > 0 && (
          <Pagination
            count={pageNumber}
            page={currentPage}
            onChange={handlePageChange}
            color="secondary"
          />
        )}
      </div>
    </div>
  );
}
