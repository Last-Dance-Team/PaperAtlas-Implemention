import React from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import { useState } from "react";
import { Card, CardContent, Grid } from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { makeStyles } from '@mui/material';
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
interface Review {
  name: string;
  stars: number;
  comment: string;
}

const reviews = [
  {
    name: "John Doe",
    stars: 5,
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "Jane Smith",
    stars: 4,
    comment:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  },
  {
    name: "Bob Johnson",
    stars: 3,
    comment:
      "Vivamus vestibulum lorem eu elit aliquet, vitae faucibus odio fringilla.",
  },
  {
    name: "Sarah Lee",
    stars: 5,
    comment: "Sed at mauris et mi rutrum lobortis eget quis odio.",
  },
];
const buttonStyle = {
  backgroundColor: "#2ac4c9",
  color: "#FFFFFF",
  borderRadius: "20px",
  padding: "10px 20px",
  fontWeight: 400,
  fontSize: "1rem",
};

declare module "@mui/material/styles" {
  interface Palette {
    customColor: Palette["primary"];
  }
  interface PaletteOptions {
    customColor?: PaletteOptions["primary"];
  }
}

//For feedback dialog
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  dialogTitle: {
    textAlign: "center",
  },
  starIcon: {
    fontSize: "48px",
    display: "flex",
    justifyContent: "center",
  },
  dialog: {
    maxWidth: "500px",
    margin: "auto",
  },
  feedbackForm: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  rating: {
    display: "flex",
    gap: "8px",
  },
  star: {
    cursor: "pointer",
  },
}));

type FeedbackDialogProps = {
  open: boolean;
  onClose: () => void;
};

const FeedbackDialog = ({ open, onClose }: FeedbackDialogProps) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    // handle form submission
    console.log(
      `Submitting feedback: name=${name}, content=${content}, rating=${rating}`
    );
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="feedback-dialog-title"
      className={classes.dialog}
      fullWidth
    >
      <DialogTitle id="feedback-dialog-title" className={classes.dialogTitle}>
        Give Feedback
      </DialogTitle>
      <DialogContent style={{ padding: "24px" }}>
        <form className={classes.feedbackForm} onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Feedback"
            variant="outlined"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Typography variant="subtitle1">Rating:</Typography>
          <div className={classes.rating}>
            {[1, 2, 3, 4, 5].map((value) => {
              const Icon = value <= rating ? StarIcon : StarBorderIcon;
              return (
                <Icon
                  key={value}
                  className={classes.star}
                  onClick={() => setRating(value)}
                />
              );
            })}
          </div>
          <Button type="submit" variant="contained" style={buttonStyle}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

function LandingPage() {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const handleOpenFeedbackDialog = () => {
    setFeedbackDialogOpen(true);
  };

  const handleCloseFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
  };

  const navigate = useNavigate();

  const handleStartApp = () => {
    navigate("/home");
  };

  const classes = useStyles();

  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  };

  return (
    <div className="app-container">
      <div className="center-container">
      <FontAwesomeIcon
          icon={faGem}
          size="8x"
          style={{ color: "#2ac4c9", padding: 10 }}
        />
        <Typography
          variant="h2"
          className="header-text"
          style={{ paddingBottom: 10 }}
        >
          Welcome to Paper Atlas
        </Typography>
        <Typography
          variant="h5"
          align="center"
          style={{ maxWidth: "900px", paddingBottom: 10, color: "grey" }}
        >
          Introducing Paper Atlas - a revolutionary web application that
          visualizes research papers as an interactive graph-based structure,
          making it easy for academicians and students to find relevant papers
          for their research. With customizable features such as filtering,
          highlighting, and ranking papers, Paper Atlas provides an unparalleled
          research experience, making research more efficient than ever before.
        </Typography>

        <Button
          variant="contained"
          style={buttonStyle}
          onClick={handleStartApp}
        >
          Start app
        </Button>
        <div className="reviews-section">
          <h2>Reviews</h2>
          <div className="slider-container">
            <Slider {...settings}>
              {reviews.map((review, index) => (
                <Grid
                  key={index}
                  item
                  xs={11}
                  className="card-wrapper"
                  style={{ height: "300px" }}
                >
                  <Card
                    key={index}
                    style={{ height: "150px", width: "100%" }}
                    className="card"
                  >
                    <CardContent>
                      <Typography variant="h6" component="h3">
                        {review.name}
                      </Typography>
                      <Typography variant="caption">
                        {Array(review.stars)
                          .fill("")
                          .map((_, i) => (
                            <span key={i} className="star">
                              ★
                            </span>
                          ))}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxHeight: "80px",
                          WebkitLineClamp: "4",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {review.comment}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Slider>
          </div>
        </div>
        <Button
          className="give-feedback-button"
          style={buttonStyle}
          variant="contained"
          onClick={handleOpenFeedbackDialog}
        >
          Give feedback
        </Button>
        {feedbackDialogOpen && (
          <div className={classes.root}>
            <FeedbackDialog
              open={feedbackDialogOpen}
              onClose={handleCloseFeedbackDialog}
            />
          </div>
        )}
        <div className="pdf-reports-section">
          <h2>PDF Reports</h2>
          <ul>
            <li>
              <a href="http://localhost:80/reports/analyse.pdf">
                Analysis and Requirement Report
              </a>
            </li>
            <li>
              <a href="http://localhost:80/reports/design.pdf">
                Detailed Design Report
              </a>
            </li>
            <li>
              <a href="http://localhost:80/reports/finale.pdf">Final Report</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
