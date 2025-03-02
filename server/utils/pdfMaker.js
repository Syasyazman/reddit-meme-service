const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const getImageBuffer = async (imageUrl) => {
    const response = await fetch(imageUrl)
    const imageBuffer = await response.arrayBuffer();
    
    return imageBuffer;
}

const generatePdf = async (posts) => {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 14;

    let currHeight = 750; 
    let count = 1;
    
    for (const post of posts) {
        // add new page if reached the end
        if (currHeight < 150) {
            page = pdfDoc.addPage([600, 800]);
            currHeight = 750;
        }

        // remove emoji unicode from title (if any)
        const filteredTitle = post.title.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        page.drawText(`${count}. ${filteredTitle}  (Upvotes: ${post.upvotes}) \n`, {
            x: 50,
            y: currHeight,
            maxWidth: 550,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0, 0, 0)
        });

        page.drawText(`Author: ${post.author_name} | Comments: ${post.num_comments} | Upvote Ratio: ${post.upvote_ratio}`, {
            x: 50,
            y: currHeight - 20,
            maxWdith: 550,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0, 0, 0)
        });

        const index = post.url.indexOf('?');
        const urlSubstr = post.url.substring(index - 4, index);
        const imageBytes = await getImageBuffer(post.url);

        if (urlSubstr == ".png") {
            const pngImage = await pdfDoc.embedPng(imageBytes);
            const pngDims = pngImage.scale(0.4)

            page.drawImage(pngImage, {
                x: 50,
                y: currHeight - 40 - pngDims.height,
                width: pngDims.width,
                height: pngDims.height,
            })
            
            currHeight -= (pngDims.height + 20);
        } else if (urlSubstr == "jpeg") {
            const jpgImage = await pdfDoc.embedJpg(imageBytes);
            const jpgDims = jpgImage.scale(0.2)

            page.drawImage(jpgImage, {
                x: 50,
                y: currHeight - 40 - jpgDims.height,
                width: jpgDims.width,
                height: jpgDims.height,
            })

            currHeight -= (jpgDims.height + 20);
        }

        currHeight -= 40;
        count++;
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

module.exports = generatePdf;