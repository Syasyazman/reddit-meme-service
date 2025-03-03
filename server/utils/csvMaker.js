const fs = require("fs");

// Post results in JSON has to be reformatted and written into file before being sent to telebot
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
        const values = Object.values(post)
                             .map(value => `"${value}"`)
                             .join(',');
        csvRows.push(values);
    }

    const csvString = csvRows.join('\n');
    
    const filePath = "./temp/redditTopMemesReport.csv";
    fs.writeFileSync(filePath, csvString, "utf-8", (err) => {
        if (err) console.error("Failed to write CSV file", err);
        else console.log("CSV file successfully written");
    });

    return filePath;
}

module.exports = generateCsv;