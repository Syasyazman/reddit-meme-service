require("dotenv").config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASENAME
});

const addMemesToDb = async (postsArr, crawlDate) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        
        for (const post of postsArr) {
            await client.query(`INSERT INTO account (id, name) 
                                VALUES ($1, $2) 
                                ON CONFLICT (id) DO NOTHING`,
                                [post.author_id, post.author_name]);

            await client.query(`INSERT INTO meme (id, title, upvotes, upvote_ratio, num_comments, url) 
                                VALUES ($1, $2, $3, $4, $5, $6)
                                ON CONFLICT (id) DO NOTHING`,
                                [post.post_id, post.title, post.upvotes, 
                                post.upvote_ratio, post.num_comments, post.url]);

            await client.query(`INSERT INTO post (author_id, post_id, post_date, crawl_date) 
                                VALUES ($1, $2, $3, $4)`,
                                [post.author_id, post.post_id, post.post_date, crawlDate]);
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK')
        throw err;
    } finally {
        client.release();
    }
}

module.exports = addMemesToDb;