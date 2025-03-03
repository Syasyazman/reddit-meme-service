const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { extractImageType } = require("./dataParser");

const getImageBuffer = async (imageUrl) => {
    const response = await fetch(imageUrl)
    const imageBuffer = await response.arrayBuffer();
    
    return imageBuffer;
}

const embedImageIntoPDF = async (imageType, imageBytes, pdfDoc, pageWidth) => {
    let image, imageDims;
    let hasImage = true;

    if (imageType == "png") {
        image = await pdfDoc.embedPng(imageBytes);
    } else if (imageType == "jpg") {
        image = await pdfDoc.embedJpg(imageBytes);
    } else {
        image = null;
        imageDims = null;
        hasImage = false;
    }

    if (hasImage) {
        const scaleFactor = Math.min(1, (0.4 * pageWidth) / image.width);
        imageDims = image.scale(scaleFactor);
    }

    return { image: image, imageDims: imageDims };
}

const generatePdf = async (postsArr) => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle('Reddit Top 20 Memes Report');
    let page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 14;
    const lineHeight = fontSize * 2;

    // Write header of report
    page.drawText('R/Memes Top 20 Voted Posts in Past 24 Hours', {
        x: 50,
        y: 750,
        size: 20,
        font: font,
        color: rgb(0, 0, 0)
    });

    let currHeight = 720; // tracks y param of drawText() - measured from botton of page
    let postCount = 1;
    
    for (const post of postsArr) {
        // remove emoji unicode from title (if any)
        const filteredTitle = post.title.replace(/[\p{Extended_Pictographic}]/gu, '');
        const titleWidth = font.widthOfTextAtSize(filteredTitle + ` (Upvotes: ${post.upvotes})`, fontSize);
        const numTitleLines = Math.ceil(titleWidth / 450); // determines text wrap

        const imageType = extractImageType(post.url);
        const imageBytes = await getImageBuffer(post.url);
        const { image, imageDims } = await embedImageIntoPDF(imageType, imageBytes, pdfDoc, page.getWidth());

        // add new page if whole post cannot fit the current page
        const postHeight = (numTitleLines * lineHeight) + lineHeight + (imageDims ? imageDims.height : 0);
        if (currHeight < postHeight) {
            page = pdfDoc.addPage([600, 800]);
            currHeight = 750;
        }

        page.drawText(`${postCount}. ${filteredTitle}  (Upvotes: ${post.upvotes}) \n`, {
            x: 50,
            y: currHeight,
            maxWidth: 500,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0)
        });

        currHeight -= (numTitleLines * lineHeight);

        page.drawText(`Author: ${post.author_name} | Comments: ${post.num_comments} | Upvote Ratio: ${post.upvote_ratio}`, {
            x: 50,
            y: currHeight,
            maxWdith: 500,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0)
        });

        currHeight -= lineHeight;

        if (image != null) {
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
                font: font,
                color: rgb(0, 0, 0)
            });

            currHeight -= 2 * lineHeight;
        }

        postCount++;
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

module.exports = generatePdf;