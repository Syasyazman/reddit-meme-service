const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { extractImageType } = require("./dataParser");

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
    const lineHeight = fontSize * 2;

    page.drawText('R/Memes Top 20 Voted Posts in Past 24 Hours', {
        x: 50,
        y: 750,
        size: 20,
        font: helveticaFont,
        color: rgb(0, 0, 0)
    });

    let currHeight = 720; 
    let count = 1;
    
    for (const post of posts) {
        // remove emoji unicode from title (if any)
        const filteredTitle = post.title.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        const titleWidth = helveticaFont.widthOfTextAtSize(filteredTitle, fontSize);
        const numTitleLines = Math.ceil(titleWidth / 450);

        const imageType = extractImageType(post.url);
        const imageBytes = await getImageBuffer(post.url);
        let hasImage = true;
        let image;
        let imageDims;

        if (imageType == "png") {
            image = await pdfDoc.embedPng(imageBytes);
        } else if (imageType == "jpg") {
            image = await pdfDoc.embedJpg(imageBytes);
        } else {
            hasImage = false;
        }

        if (hasImage) {
            const scaleFactor = Math.min(1, (0.4 * page.getWidth()) / image.width);
            imageDims = image.scale(scaleFactor);
        }

        // add new page if whole post cannot fit the current page
        const postHeight = (numTitleLines * lineHeight) + lineHeight + (imageDims ? imageDims.height : 0);
        if (currHeight < postHeight) {
            page = pdfDoc.addPage([600, 800]);
            currHeight = 750;
        }

        page.drawText(`${count}. ${filteredTitle}  (Upvotes: ${post.upvotes}) \n`, {
            x: 50,
            y: currHeight,
            maxWidth: 500,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0, 0, 0)
        });

        currHeight -= (numTitleLines * lineHeight);

        page.drawText(`Author: ${post.author_name} | Comments: ${post.num_comments} | Upvote Ratio: ${post.upvote_ratio}`, {
            x: 50,
            y: currHeight,
            maxWdith: 500,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0, 0, 0)
        });

        currHeight -= lineHeight;

        if (hasImage) {
            page.drawImage(image, {
                x: 50,
                y: currHeight - imageDims.height,
                width: imageDims.width,
                height: imageDims.height,
            });
            
            currHeight -= (imageDims.height + (2 * lineHeight));
        } else {
            page.drawText(`(Meme\'s ${imageType} format cannot be shown in this report)`, {
                x: 50,
                y: currHeight,
                maxWidth: 500,
                size: fontSize,
                font: helveticaFont,
                color: rgb(0, 0, 0)
            });

            currHeight -= 2 * lineHeight;
        }

        count++;
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

module.exports = generatePdf;