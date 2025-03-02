// takes in processed data (JSON object) and reformats into array
const generateCsv = (postsArr) => {
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
    
    for (const post of postsArr) {
        const values = Object.values(post).join(',');
        csvRows.push(values);
    }

    csvRows.join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    return url;
}

module.exports = generateCsv;