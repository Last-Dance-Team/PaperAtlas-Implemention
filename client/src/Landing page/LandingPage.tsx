import React from 'react';
import './style.css';
import { useNavigate } from "react-router-dom";


interface Review {
  name: string;
  stars: number;
  comment: string;
}

const reviews: Review[] = [
  { name: 'John Doe', stars: 4, comment: 'This app is amazing!' },
  { name: 'Jane Smith', stars: 5, comment: 'I love this app!' },
  { name: 'Bob Johnson', stars: 3, comment: 'Pretty good app.' },
];


function LandingPage(){ 
 
  const handleGiveFeedback = () => {
    // handle give feedback button click
  };

  const navigate = useNavigate();

  const handleStartApp = () => {
    navigate("/home");
  };

  return (
    <div className="landing-page">
      <h1 className="header">Welcome to Paper Atlas</h1>
      <p className="subtext">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tincidunt ante eget aliquam facilisis. Nulla facilisi. Proin vestibulum tincidunt sem a bibendum.</p>
      <button className="start-app-button" onClick={handleStartApp}>Start app</button>
      <div className="reviews-section">
        <h2>Reviews</h2>
        <div className="review-card-container">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <p className="review-stars">{Array(review.stars).fill('').map((_, i) => <span key={i} className="star">★</span>)}</p>
              <p className="review-name">{review.name}</p>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
        <button className="give-feedback-button" onClick={handleGiveFeedback}>Give feedback</button>
      </div>
      <div className="pdf-reports-section">
        <h2>PDF Reports</h2>
        <ul>
          <li><a href="/report1.pdf">Report 1</a></li>
          <li><a href="/report2.pdf">Report 2</a></li>
          <li><a href="/report3.pdf">Report 3</a></li>
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
