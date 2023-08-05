"use strict";

var _wordDict;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require("express");

var natural = require("natural");

var stopword = require("stopword"); // For conversion of contractions to standard lexicon


var wordDict = (_wordDict = {
  "aren't": "are not",
  "he'll": "he will",
  "he's": "he is",
  "i'd": "I would"
}, _defineProperty(_wordDict, "i'd", "I had"), _defineProperty(_wordDict, "i'll", "I will"), _defineProperty(_wordDict, "i'm", "I am"), _defineProperty(_wordDict, "isn't", "is not"), _defineProperty(_wordDict, "it's", "it is"), _defineProperty(_wordDict, "it'll", "it will"), _defineProperty(_wordDict, "i've", "I have"), _defineProperty(_wordDict, "let's", "let us"), _wordDict);
var port = 5500;
var host = "127.0.0.1";
var app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use("/", express["static"](__dirname + "/public"));
app.listen(port, host, function () {
  console.log("Server is running ...");
  console.log("test data(aren't I'll): ", cleanupData("aren't I'll"));
}); //conversion functions

var convertToStandard = function convertToStandard(text) {
  var words = String(text).split(' ');
  words.forEach(function (word, indx) {
    Object.keys(wordDict).forEach(function (key) {
      if (key === word.toLowerCase()) words[indx] = wordDict[key];
    });
  });
  return words.join(' ');
};

var convertToLowerCase = function convertToLowerCase(text) {
  return text.toLowerCase();
};

var removeNonAlpha = function removeNonAlpha(text) {
  return String(text).replace(/[^a-zA-Z\s]+/g, '');
};

var cleanupData = function cleanupData(text) {
  var normal = convertToStandard(text);
  console.log('normal: ', normal);
  var lower = convertToLowerCase(normal);
  console.log('lower: ', lower);
  var alpha = removeNonAlpha(lower);
  console.log('alpha: ', alpha);
  return alpha;
}; // API


app.post("/feedback", function (request, response) {
  var feedback = request.body.feedback;
  var data = cleanupData(feedback); //Tokenization

  var tokenizer = new natural.WordTokenizer();
  tokens = tokenizer.tokenize(data);
  console.log('tokens: ', tokens);
  var filtered = stopword.removeStopwords(tokens); //stemming

  var SentiAnalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  score = SentiAnalyzer.getSentiment(filtered);
  console.log('score: ', score);
  response.status(200).json({
    message: feedback,
    sentiment_score: score
  });
});