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

const extractImageType = (imageUrl) => {
    const index = imageUrl.indexOf('?');
    const rightSubstr = imageUrl.substring(index + 1, index + 7);
    let urlSubstr;

    if (rightSubstr == "format") {
        urlSubstr = imageUrl.substring(index + 8, index + 13);
    } else {
        urlSubstr = imageUrl.substring(index - 4, index);
    }

    if (urlSubstr.includes("png")) {
        return "png";
    } else if (urlSubstr.includes("jpeg") || urlSubstr.includes("jpg") || urlSubstr.includes("pjpg")) {
        return "jpg";
    } else if (urlSubstr.includes("gif")) {
        return "gif";
    } else {
        return "";
    }
}

module.exports = { extractMemeData, extractImageType };