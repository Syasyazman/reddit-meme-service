// extracts relevant data needed for database entry and report generation
const extractMemeData = (rawData) => {
    try {
        const postsArr = rawData.data.children;

        let parsedData = [];

        for (const post of postsArr) {
            const data = {
                author_id: post.data.author_fullname.substring(3),
                author_name: post.data.author,
                post_id: post.data.id,
                title: post.data.title,
                upvotes: post.data.ups,
                upvote_ratio: post.data.upvote_ratio,
                num_comments: post.data.num_comments,
                url: post.data.preview.images[0].source.url,
                post_date : post.data.created_utc
            }

            parsedData.push(data);
        }

        return parsedData;
    } catch (err) {
        console.error("Unable to extract data", err);
    }
    
}

module.exports = extractMemeData;