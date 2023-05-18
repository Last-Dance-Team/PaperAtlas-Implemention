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
  "Computer science",
  "Economics",
  "Political Science",
  "Medicine",
  "Biology",
];

function Filter(props: any) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("and");
  const [citationCount, setCitationCount] = useState<{
    min: number;
    max: number;
  }>({
    min: 0,
    max: 500,
  });

  const handleTagClick = (tag: string) => {
    setSelectedFields((prevSelectedFields) => {
      if (prevSelectedFields.includes(tag)) {
        return prevSelectedFields.filter((field) => field !== tag);
      } else {
        return [...prevSelectedFields, tag];
      }
    });
  };

  const handleFilterTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterType(event.target.checked ? "or" : "and");
  };

  const handleCitationCountChange = () => {
    props.filterByCitationCount(citationCount.min, citationCount.max);
  };

  const applyFilter = () => {
    props.filterSelectedFields(selectedFields, filterType);
  };

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
          checked={filterType === "or"}
          onChange={handleFilterTypeChange}
        />
        {filterType === "or" ? (
          <Typography variant="subtitle1" color="primary" fontWeight="bold">
            Or
          </Typography>
        ) : (
          <Typography variant="subtitle1" color="primary" fontWeight="bold">
            And
          </Typography>
        )}
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
            onChange={(e) =>
              setCitationCount((prevCitationCount) => ({
                ...prevCitationCount,
                min: parseInt(e.target.value),
              }))
            }
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
            <Button
              onClick={handleCitationCountChange}
              variant="contained"
              color="primary"
            >
              Apply Filter
            </Button>
          </ButtonContainer>
        </TextFieldContainer>
      </div>
    </div>
  );
}

export default Filter;
