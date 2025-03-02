
const router = require("express").Router();
const addMemesToDb = require('../db');
const crawlRedditMemes = require('../utils/redditCrawler');

router.get("/top-memes", async (req, res) => {
    try {
        const { redditPosts, crawlDate } = await crawlRedditMemes();

        if (!redditPosts) {
            res.status(404).send({ message: "Unable to fetch response from Reddit" });
        }

        await addMemesToDb(redditPosts, crawlDate);

        res.status(200).json({ redditPosts: redditPosts });
    } catch (err) {
        console.error("Error retrieving top memes, ", err);
    }
});

module.exports = router;