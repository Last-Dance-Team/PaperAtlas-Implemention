import React, { useState } from "react";
import Button from "@mui/material/Button";
import { COLOR_NAMES } from "../constants/Colors";
import { Grid } from "@mui/material";

function Common(props:any) {

    return(<>
    <Button
    variant="contained"
    component="span"
    style={{
      color: !props.select ? COLOR_NAMES.BLUE : "white",
      borderColor: COLOR_NAMES.BLUE,
      backgroundColor: !props.select ? COLOR_NAMES.TRANSPARENT_BLUE : COLOR_NAMES.BLUE,
      width: "120px",
      height: "100%", // Set the height to 100%
        }}
        onClick={props.handleSelect}
     > Select</Button>

        {props.select && (
            <Grid >
                <div
                    style={{
                      display: "flex",
                      flexDirection: "column", // Change row to column
                      alignItems: "flex-start", // Align buttons to the left
                      justifyContent: "space-between", // Align buttons in the center vertically
                      height: "100%",
                      marginTop: "10px",
                    }}
                >
                    <Button
                      onClick={props.handleBringReferencesOfCommon}
                      variant="contained"
                      style={{
                        color: COLOR_NAMES.BLUE,
                        backgroundColor: COLOR_NAMES.TRANSPARENT_BLUE,
                        width: "300px",
                        marginBottom: "10px",
                      }} // Use marginBottom instead of marginTop for spacing
                    >
                      Common References
                    </Button>

                    <Button
                      onClick={props.handleBringPaperThatReferstoCommon}
                      variant="contained"
                      style={{
                        color: COLOR_NAMES.BLUE,
                        backgroundColor: COLOR_NAMES.TRANSPARENT_BLUE,
                        width: "300px",
                        marginBottom: "10px",
                      }}
                    >
                      Common Citations
                    </Button>

                    <Button
                      onClick={props.handleCommonPapersOfAuthors}
                      variant="contained"
                      style={{
                        color: COLOR_NAMES.BLUE,
                        backgroundColor: COLOR_NAMES.TRANSPARENT_BLUE,
                        width: "300px",
                        marginBottom: "10px",
                      }}
                    >
                      Common Papers of Authors
                    </Button>
                </div>
            </Grid>)}

        </>)

}

export default Common;