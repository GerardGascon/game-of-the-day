import * as helper from "./issues/helper.js";
import axios from "axios";
import url from "url";
import path from "path";
import fs from "fs";

const issueText = `
### Game Title

ABC

### Link

https://geri8.itch.io/abc

### Store Name

itch.io

### Cover Image

![abc](https://github.com/user-attachments/assets/4fb9fe92-db85-4c4b-810f-82426b21dbbd)


### Description

ABC is a game about characters.
You control the whole alphabet, from the letters A to Z.

### Screenshots

![screenshot-0](https://github.com/user-attachments/assets/c2906dc2-0ad3-4184-914f-a5f6db804874)
![screenshot-1](https://github.com/user-attachments/assets/cd85114e-c615-4fab-beea-20f1c5b4974f)
![screenshot-2](https://github.com/user-attachments/assets/c3d90f09-9b85-420f-9317-b2aa77e43908)


### Developers

Geri - https://x.com/G_of_Geri
`;

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
                images.push(`${data.filename}/${fileName}.${extension}`);
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
    // const body = process.env.ISSUE_BODY;
    const body = issueText;
    const parsedData = helper.parseIssue(body);

    console.log(parsedData)

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
