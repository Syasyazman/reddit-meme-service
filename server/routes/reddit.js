
const router = require("express").Router();
const pool = require("../db");

const addMemesToDb = async (data) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        
        for (const d of data) {
            const post = {
                author_id: d.data.author_fullname.substring(3),
                author_name: d.data.author,
                post_id: d.data.id,
                title: d.data.title,
                upvotes: d.data.ups,
                upvote_ratio: d.data.upvote_ratio,
                num_comments: d.data.num_comments,
                url: d.data.preview.images[0].source.url,
                post_date : d.data.created_utc,
                crawl_date: new Date().getTime(),
            }

            await client.query(`INSERT INTO account (id, name) 
                                VALUES ($1, $2)`,
                                [post.author_id, post.author_name]);

            await client.query(`INSERT INTO meme (id, title, upvotes, upvote_ratio, num_comments, url) 
                                VALUES ($1, $2, $3, $4, $5, $6)`,
                                [post.post_id, post.title, post.upvotes, 
                                post.upvote_ratio, post.num_comments, post.url]);

            await client.query(`INSERT INTO post (author_id, post_id, post_date, crawl_date) 
                                VALUES ($1, $2, $3, $4)`,
                                [post.author_id, post.post_id, post.post_date, post.crawl_date]);
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK')
        throw err;
    } finally {
        client.release();
    }
}

router.get("/top-memes", async (req, res) => {
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

        if (!response) {
            res.status(404).send({ message: "Unable to fetch response from Reddit" });
        }

        const redditPosts = response.data.children;    
        await addMemesToDb(redditPosts);

        res.json({ redditData: redditPosts });
    } catch (err) {
        console.error("Error retrieving top memes, ", err);
    }
});

module.exports = router;