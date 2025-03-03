// This file contains functions for data manipulation of reddit crawl results

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

// Parses Reddit image URLs as they can have different formats for the same image type
const extractImageType = (imageUrl) => {
    const index = imageUrl.indexOf('?');
    const rightOfIndexSubstr = imageUrl.substring(index + 1, index + 7);
    let urlSubstr;

    if (rightOfIndexSubstr == "format") {
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