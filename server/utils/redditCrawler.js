
const addMemesToDb = require("../db");
const extractMemeData = require("../utils/dataParser");
const generateCsv = require("../utils/csvMaker");

const crawlRedditMemes = async () => {
    try {
        // fetch json data from reddit
        const redditData = await fetch("https://www.reddit.com/r/memes/top.json?raw_json=1&t=day&limit=20", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const response = await redditData.json();
        const crawlDate = new Date().getTime();
        const redditPosts = extractMemeData(response);
        
        return { redditPosts: redditPosts, crawlDate: crawlDate };
    } catch (err) {
        console.error("Error retrieving top memes, ", err);
    }
};

module.exports = crawlRedditMemes;