import React, { useState } from "react";
import {
  Button,
  Chip,
  Divider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { COLOR_NAMES } from "../constants/Colors";

interface FilterProps {
  filterOr: (selectedFields: string[]) => void;
  filterAnd: (selectedFields: string[]) => void;
  filterByCitationCount: (min: number, max: number) => void;
}

const StyledSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-thumb": {
    backgroundColor: COLOR_NAMES.DARK_BLUE,
  },
  "&.Mui-checked .MuiSwitch-thumb": {
    backgroundColor: COLOR_NAMES.DARK_BLUE,
  },
  "& .MuiSwitch-track": {
    backgroundColor: COLOR_NAMES.DARK_BLUE,
  },
}));
const Container = styled("div")({
  display: "flex",
  alignItems: "center",
});
const ButtonContainer = styled("div")({
  marginLeft: "16px",
});

const TextFieldContainer = styled("div")({
  display: "flex",
  gap: "16px",
  marginBottom: "20px",
});

const array_area = [
  "Medicine",
  "Biology",
  "Agricultural And Food Sciences",
  "Engineering",
  "Political Science",
  "Psychology",
  "Materials Science",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Geography",
  "Chemistry",
  "Art",
  "Economics",
  "Business",
  "Environmental Science",
  "Geology",
  "Linguistics",
  "Philosophy",
  "Sociology",
  "Education",
  "Law",
  "History",
];

const empty_array: string[] = [];
function Filter(props: any) {
  const [selectedFields, setSelectedFields] = useState<string[]>(
    props.selectedFields
  );
  const [filterType, setFilterType] = useState(props.filterType);
  const [citationCount, setCitationCount] = useState<{
    min: number;
    max: number;
  }>(props.citationCount);

  const handleTagClick = (tag: string) => {
    const fields = selectedFields.includes(tag)
      ? selectedFields.filter((field) => field !== tag)
      : [...selectedFields, tag];
    /*
    setSelectedFields((prevSelectedFields) => {
      if (prevSelectedFields.includes(tag)) {
        return prevSelectedFields.filter((field) => field !== tag);
      } else {
        return [...prevSelectedFields, tag];
      }
    });
    */
    setSelectedFields(fields);
    props.filter(citationCount.min, citationCount.max, fields, filterType);
  };

  const handleSelectAll = () => {
    setSelectedFields(array_area);
    props.filter(
      citationCount.min,
      citationCount.max,
      array_area,
      filterType
    );
  };
  
  const handleSelectNone = () => {
    setSelectedFields(empty_array);
    props.filter(
      citationCount.min,
      citationCount.max,
      empty_array,
      filterType
    );
  };

  const handleFilterTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFilterType = event.target.checked ? "and" : "or";
    //setFilterType(event.target.checked ? "or" : "and");
    setFilterType(newFilterType);
    props.filter(
      citationCount.min,
      citationCount.max,
      selectedFields,
      newFilterType
    );
  };

  const handleCitationCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCitationCount((prevCitationCount) => ({
      ...prevCitationCount,
      min: parseInt(event.target.value),
    }));
  };

  const applyFilter = () => {
    props.filter(
      citationCount.min,
      citationCount.max,
      selectedFields,
      filterType
    );
  };

  const StyledButton = styled(Button)`
  margin: 10px;
  padding: 10px 20px;
  background-color: #219296;
  color: #fff;
  border-radius: 5px;
`;

const StyledTypography = styled(Typography)`
  width: 50px; /* Adjust the width as needed */
`;
  return (
    <div>
      <Typography
        variant="h6"
        style={{ paddingBottom: "10px", paddingLeft: "8px" }}
      >
        Filter by Area
      </Typography>
      <div>
        {array_area.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            color={selectedFields.includes(tag) ? "primary" : "default"}
            onClick={() => handleTagClick(tag)}
            style={{ margin: "4px" }}
          />
        ))}
      </div>
      <Container>
        <StyledSwitch
          checked={filterType === "and"}
          onChange={handleFilterTypeChange}
        />
        {filterType === "or" ? (
          <StyledTypography variant="subtitle1" color="primary" fontWeight="bold">
            OR 
          </StyledTypography>
        ) : (
          <StyledTypography variant="subtitle1" color="primary" fontWeight="bold">
            AND
          </StyledTypography>
        )}
        
        <StyledButton  onClick={handleSelectAll} style={{ textTransform: 'capitalize' }} >Select All</StyledButton >
        
        
        <StyledButton  onClick={handleSelectNone} style={{ textTransform: 'capitalize' }} >Select None</StyledButton >
        
      </Container>
      <Divider style={{ marginBottom: "30px", marginTop: "30px" }} />
      <Typography variant="h6" style={{ marginBottom: "20px" }}>
        Filter by citation count
      </Typography>
      <div>
        <TextFieldContainer>
          <TextField
            type="number"
            label="Min"
            value={citationCount.min}
            onChange={handleCitationCountChange}
            size="small"
            sx={{ width: "120px" }}
          />
          <TextField
            type="number"
            label="Max"
            value={citationCount.max}
            onChange={(e) =>
              setCitationCount((prevCitationCount) => ({
                ...prevCitationCount,
                max: parseInt(e.target.value),
              }))
            }
            size="small"
            sx={{ width: "120px" }}
          />
          <ButtonContainer>
            <Button onClick={applyFilter} variant="contained" color="primary" style={{
              backgroundColor :"#219296",
              textTransform: 'capitalize'
             }}>
              Apply Filter
            </Button>
          </ButtonContainer>
        </TextFieldContainer>
      </div>
    </div>
  );
}

export default Filter;
