const fs = require("fs");

// takes in processed data (JSON object) and reformats into array
const generateCsv = (posts) => {
    csvRows = [];
    const headers = [
        "author_id",
        "author_name",
        "post_id",
        "title",
        "upvotes",
        "upvote_ratio",
        "num_comments",
        "url",
        "post_date"
    ];

    csvRows.push(headers.join(','));
    
    for (const post of posts) {
        const values = Object.values(post).map(value => `"${value}"`).join(',');
        csvRows.push(values);
    }

    const csvString = csvRows.join('\n');
    const filePath = "./temp/redditPosts.csv";
    fs.writeFileSync(filePath, csvString, "utf-8", (err) => {
        if (err) console.error("Failed to write csv file");
        else console.log("Csv file successfully written");
    });

    return filePath;
}

module.exports = generateCsv;