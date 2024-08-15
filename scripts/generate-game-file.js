import * as helper from "./issues/helper.js";
import axios from "axios";
import url from "url";
import path from "path";
import fs from "fs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getExtensionFromMimeType(mimeType) {
    const mimeMap = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/bmp': 'bmp',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'image/tiff': 'tiff'
    };

    return mimeMap[mimeType] || '';
}

async function downloadImage(link, filePath) {
    console.log(link);
    let ext = "";
    await axios({
        url: link,
        method: 'GET',
        responseType: 'stream'
    }).then(response => {
        const mimeType = response.headers['content-type'];
        const extension = getExtensionFromMimeType(mimeType);

        if (!extension) {
            console.error('Unable to determine the file extension.');
            return;
        }

        const fileName = `${filePath}.${extension}`
        response.data.pipe(fs.createWriteStream(fileName));
        console.log(`Image saved to ${fileName}`);

        ext = extension;
    });

    return ext;
}

async function saveImages(data) {
    const screenshotsDir = path.join(__dirname, '..', 'public', 'images', 'screenshots', data.filename);
    const coversDir = path.join(__dirname, '..', 'public', 'images', 'covers');

    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    const images = [];

    const downloadImages = async () => {
        let i = 0;
        for (const image of data.screenshots) {
            const fileName = `screenshot-${i++}`;
            const filePath = path.join(screenshotsDir, fileName);
            console.log(`Downloading ${image} to ${filePath}`);
            await downloadImage(image, filePath).then(extension => {
                images.push(`${fileName}.${extension}`);
            });
        }
    };

    const downloadCover = async () => {
        const fileName = data.filename;
        const filePath = path.join(coversDir, fileName);
        console.log(`Downloading ${data.cover} to ${filePath}`);
        await downloadImage(data.cover, filePath).then(extension => {
            data.cover = `${data.filename}.${extension}`;
        });
    };

    await downloadImages();
    await downloadCover();
    return images;
}

const main = async() => {
    const body = process.env.ISSUE_BODY;
    const actor = process.env.ISSUE_OWNER;
    const parsedData = helper.parseIssue(body);
    parsedData.filename = `${actor}-${parsedData.filename}`;

    await saveImages(parsedData).then(images => {
        parsedData.screenshots = images;
    });

    const data = {
        name: parsedData.name,
        link: parsedData.link,
        link_name: parsedData.link_name,
        cover: parsedData.cover,
        description: parsedData.description,
        screenshots: parsedData.screenshots,
        developers: parsedData.developers
    };

    const yamlFilePath = path.join(__dirname, '..', 'data', `${parsedData.filename}.yaml`);
    const yamlContent = helper.buildYaml(data);
    fs.writeFileSync(yamlFilePath, yamlContent);
};

main();
