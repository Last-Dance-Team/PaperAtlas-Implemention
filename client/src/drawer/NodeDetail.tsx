import { useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Box, ThemeProvider, createTheme } from "@mui/system";
import Divider from "@mui/material/Divider";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2ac4c9",
    },
    secondary: {
      main: "#219296",
    },
    info: {
      main: "#008993",
    },
    background: {
      paper: "#fff",
    },
    text: {
      primary: "#000",
      secondary: "#111",
    },
    action: {
      active: "#001E3C",
    },
  },
});

function NodeDetail(props: any) {
  var node = props.node;

  const [info, setInfo] = React.useState({ abstract: "", tldr: "", url: "" });

  const handleReference = () => {
    props.getReferences(node.id);
  };

  const handleReferred = () => {
    props.getReferred(node.id);
  };
  const handleAuthors = () => {
    props.getAuthors(node.id);
  };
  const handlePapers = () => {
    props.getPapers(node.id);
  };

  const handleCiteddAuthors = () => {
    props.getCitedAuthors(node.id);
  };

  const handleRemove = () => {
    props.remove(node.id);
  };
  const handlePin = () => {
    props.updatePin(node.id, true);
  };
  const handleUnpin = () => {
    props.updatePin(node.id, false);
  };

  const fetchInfo = async () => {
    const response = await axios.get(
      `http://localhost:80/paper/info/${props.node.id}`
    );
    const data = await response.data;
    setInfo(data);
    console.log(data);
  };

  useEffect(() => {
    if (props.node.type == "Paper") {
      fetchInfo();
    }
  }, [props.node]);

  if (node.type == "Paper") {
    return (
      <div>
        <Button sx={{ m: 0.5 }} variant="outlined" onClick={handleReference}>
          References
        </Button>
        <Button sx={{ m: 0.5 }} variant="outlined" onClick={handleReferred}>
          Citations
        </Button>
        <Button sx={{ m: 0.5 }} variant="outlined" onClick={handleAuthors}>
          Authors
        </Button>
        <Button sx={{ m: 0.5 }} variant="outlined" onClick={handleRemove}>
          Remove
        </Button>
        <>
          {" "}
          {!node.pinned && (
            <Button
              sx={{ m: 0, width: 50 }}
              variant="outlined"
              onClick={handlePin}
            >
              Pin
            </Button>
          )}
        </>
        <>
          {" "}
          {node.pinned && (
            <Button
              sx={{ m: 0, width: 50 }}
              variant="contained"
              onClick={handleUnpin}
            >
              Unpin
            </Button>
          )}
        </>
        <ThemeProvider theme={theme}>
          <Box sx={{ bgcolor: "background.paper", p: 2 }}>
            <Box sx={{ mb: 1, color: "text.secondary", fontSize: 16 }}>
              <strong>Title:</strong>
            </Box>
            <Box
              sx={{
                mb: 2,
                color: "text.primary",
                fontSize: 16,
                fontWeight: "medium",
              }}
            >
              {node.label}
            </Box>

            <Box sx={{ mb: 1, color: "text.secondary", fontSize: 16 }}>
              <strong>Publication Year:</strong>
            </Box>
            <Box
              sx={{
                mb: 2,
                color: "text.primary",
                fontSize: 16,
                fontWeight: "medium",
              }}
            >
              {node.year}
            </Box>

            <Box sx={{ mb: 1, color: "text.secondary", fontSize: 16 }}>
              <strong>DOI:</strong>
            </Box>
            <Box
              sx={{
                mb: 2,
                color: "text.primary",
                fontSize: 16,
                fontWeight: "medium",
              }}
            >
              {node.doi}
            </Box>

            <Box sx={{ mb: 1, color: "text.secondary", fontSize: 16 }}>
              <strong>Field of Study:</strong>
            </Box>
            {node.uniqueFieldsOfStudies.map((a: string) => (
              <Box
                key={a}
                sx={{
                  mb: 2,
                  color: "text.primary",
                  fontSize: 16,
                  fontWeight: "medium",
                  ml: 2,
                }}
              >
                {"- " + a}
              </Box>
            ))}

            <Box sx={{ mb: 1, color: "text.secondary", fontSize: 16 }}>
              <strong>Citation Count:</strong>
            </Box>
            <Box
              sx={{
                mb: 2,
                color: "text.primary",
                fontSize: 16,
                fontWeight: "medium",
              }}
            >
              {node.citationCount}
            </Box>

            <Box
              sx={{
                mb: 2,
                color: "text.primary",
                fontSize: 16,
                fontWeight: "medium",
              }}
            >
              <a href={info.url === "" ? node.url : info.url}>URL to Paper</a>
            </Box>

            {info.abstract === "" ? null : (
              <>
                <Box sx={{ mb: 1, color: "text.secondary", fontSize: 16 }}>
                  <strong>Abstract:</strong>
                </Box>
                <Box
                  sx={{
                    mb: 1,
                    color: "text.primary",
                    fontSize: 16,
                    fontWeight: "medium",
                  }}
                >
                  {info.abstract}
                </Box>
              </>
            )}
          </Box>
        </ThemeProvider>
      </div>
    );
  }

  if (node.type == "Author") {
    return (
      <div>
        <Button sx={{ m: 0.5 }} variant="outlined" onClick={handlePapers}>
          Papers
        </Button>
        <Button sx={{ m: 0.5 }} variant="outlined" onClick={handleCiteddAuthors}>
          Referenced Authors
        </Button>
        <Button sx={{ m: 0.5 }} variant="outlined" onClick={handleRemove}>
          Remove
        </Button>
        <>
          {" "}
          {!node.pinned && (
            <Button
              sx={{ m: 0, width: 50 }}
              variant="outlined"
              onClick={handlePin}
            >
              Pin
            </Button>
          )}
        </>
        <>
          {" "}
          {node.pinned && (
            <Button
              sx={{ m: 0, width: 50 }}
              variant="contained"
              onClick={handleUnpin}
            >
              Unpin
            </Button>
          )}
        </>
        <ThemeProvider theme={theme}>
          <Box sx={{ bgcolor: "background.paper" }}>
            <Box sx={{ m: 1, color: "text.secondary", fontSize: 20 }}>
              <strong>Name:</strong>{" "}
            </Box>
            <Box
              sx={{
                m: 1,
                color: "text.primary",
                fontSize: 16,
                fontWeight: "medium",
              }}
            >
              {node.label}{" "}
            </Box>
            <div hidden={ !node.aliases || node.aliases.length === 0}>
              <Box sx={{ m: 1, color: "text.secondary", fontSize: 20 }}>
                <strong>Aliases:</strong>{" "}
              </Box>

              {(node.aliases) ? node.aliases.map((a: string) => {
                return (
                  <Box
                    key={a}
                    sx={{
                      m: 1,
                      color: "text.primary",
                      fontSize: 16,
                      fontWeight: "medium",
                    }}
                  >
                    {a}
                  </Box>
                );
              }): <></>}
            </div>

            <Box sx={{ m: 1, color: "text.secondary", fontSize: 20 }}>
              <strong>Paper Count:</strong>{" "}
            </Box>
            <Box
              sx={{
                m: 1,
                color: "text.primary",
                fontSize: 16,
                fontWeight: "medium",
              }}
            >
              {node.paperCount}{" "}
            </Box>
            <Box sx={{ m: 1, color: "text.secondary", fontSize: 20 }}>
              <strong>Citation Count:</strong>{" "}
            </Box>
            <Box
              sx={{
                m: 1,
                color: "text.primary",
                fontSize: 16,
                fontWeight: "medium",
              }}
            >
              {node.citationCount}{" "}
            </Box>
          </Box>
        </ThemeProvider>
      </div>
    );
  }
  return <div>No Selected Node</div>;
}

export default NodeDetail;
