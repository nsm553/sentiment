const express = require("express");
const natural = require("natural");
const stopword = require("stopword");

// For conversion of contractions to standard lexicon
const wordDict = {
    "aren't": "are not",
    "he'll": "he will",
    "he's": "he is",
    "i'd": "I would",
    "i'd": "I had",
    "i'll": "I will",
    "i'm": "I am",
    "isn't": "is not",
    "it's": "it is",
    "it'll": "it will",
    "i've": "I have",
    "let's": "let us"    
}

const port = 5500;
const host = "127.0.0.1"

let app = express()
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/", express.static(__dirname + "/public"));

app.listen(port, host, ()=>{
    console.log("Server is running ...");
    console.log("test data(aren't I'll): ", cleanupData("aren't I'll"))
});

//conversion functions
const convertToStandard = text => {
    const words = String(text).split(' ')
    words.forEach((word, indx) => {
        Object.keys(wordDict).forEach(key => {
            if(key === word.toLowerCase())
                words[indx] = wordDict[key]
        });
    });
    return words.join(' ')
}

const convertToLowerCase = text => {
    return text.toLowerCase();
}

const removeNonAlpha = text =>  {
    return String(text).replace(/[^a-zA-Z\s]+/g, '');
}

const cleanupData = text => {
    const normal = convertToStandard(text);
    console.log('normal: ', normal)
    const lower = convertToLowerCase(normal);
    console.log('lower: ', lower)
    const alpha = removeNonAlpha(lower);
    console.log('alpha: ', alpha)

    return alpha;
}

// API

app.post("/feedback", (request, response)=>{
    const { feedback } = request.body;

    const data = cleanupData(feedback)

    //Tokenization
    const tokenizer = new natural.WordTokenizer()
    tokens = tokenizer.tokenize(data)
    console.log('tokens: ', tokens)

    const filtered = stopword.removeStopwords(tokens)

    //stemming
    const SentiAnalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn')    
    score = SentiAnalyzer.getSentiment(filtered)
    console.log('score: ', score)

    response.status(200).json({
        message: feedback,
        sentiment_score: score
    })
});