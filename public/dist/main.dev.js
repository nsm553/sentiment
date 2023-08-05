"use strict";

// Grab all HTML Elements
// All containers
var feedback = document.getElementById("feedbacktext");
var wholeContainer = document.querySelector(".feedback");
var resultContainer = document.querySelector(".results"); // All controls

var submit_button = document.getElementById("submit");
var closeButton = document.querySelector(".close"); // Results

var emoji = document.querySelector(".emoji");
var sentiment = document.querySelector(".sentiment"); // Add event listener to submit button, send feedback and
// name to our node js server application

submit_button.addEventListener("click", function () {
  console.log("Feedback: ", feedback.value); // Send POST request to our server

  var options = {
    method: "POST",
    body: JSON.stringify({
      feedback: feedback.value
    }),
    headers: new Headers({
      'Content-Type': "application/json"
    })
  }; // Use fetch to request server

  fetch("/feedback", options).then(function (res) {
    return res.json();
  }).then(function (response) {
    console.log(response.sentiment_score);
    var score = response.sentiment_score; // Separate responses according to sentiment_score

    if (score > 0) {
      emoji.innerHTML = "<p></p>";
      sentiment.innerHTML = "<p> Positive</p>";
    } else if (score === 0) {
      emoji.innerHTML = "<p></p>";
      sentiment.innerHTML = "<p>Neutral</p>";
    } else {
      emoji.innerHTML = "<p></p>";
      sentiment.innerHTML = "<p> Negative</p>";
    } // Result Box should appear


    resultContainer.classList.add("active");
    wholeContainer.classList.add("active");
  })["catch"](function (err) {
    return console.error("Error: ", err);
  }); // Clear all inputs after operation

  feedback.value = "";
}); // Close Button

closeButton.addEventListener("click", function () {
  wholeContainer.classList.remove("active");
  resultContainer.classList.remove("active");
});