import fs from "fs";
import path from "path";
import url from "url";
import YAML from "yaml";
import * as cheerio from "cheerio";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateFilePath = path.join(__dirname, '..', 'templates', 'template.html');
const htmlFilePath = path.join(__dirname, '..', 'public', 'index.html');
const stateFilePath = path.join(__dirname, '..', 'data', 'state.json');
const directoryPath = path.join(__dirname, '..', 'data');
const coversPath = path.join(__dirname, '..', 'content', 'covers');
const dstCoversPath = path.join(__dirname, '..', 'public', 'images', 'cover');
const screenshots = path.join(__dirname, '..', 'content', 'screenshots');
const dstScreenshots = path.join(__dirname, '..', 'public', 'images', 'screenshots');

function generate_uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function(c) {
            var uuid = Math.random() * 16 | 0, v = c == 'x' ? uuid : (uuid & 0x3 | 0x8);
            return uuid.toString(16);
        });
}

export function generateUniqueIdentifier(){
    return generate_uuidv4();
}

export function loadData() {
    return readDir();
}

function readDir() {
    const parsedDataList = []

    try {
        const files = fs.readdirSync(directoryPath);
        const yamlFiles = files.filter(file => path.extname(file) === '.yaml');

        yamlFiles.forEach(file => {
            const filePath = path.join(directoryPath, file);

            try {
                const data = fs.readFileSync(filePath, 'utf8');

                const parsedData = YAML.parse(data);
                parsedDataList.push({
                    name: file,
                    content: parsedData
                });
            } catch(err) {
                console.error(`Error parsing YAML file `, err);
                return process.exit(1);
            }
        });

    } catch (err) {
        console.error(`Unable to scan directory `, err);
        return process.exit(1);
    }

    return parsedDataList;
}

export function loadState(){
    if (fs.existsSync(stateFilePath)) {
        const data = fs.readFileSync(stateFilePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

export function saveState(state){
    fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), 'utf8');
}

function findFile(directory, nameWithoutExtension) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fileWithoutExtension = path.parse(file).name;

        if (fileWithoutExtension === nameWithoutExtension) {
            return file;  // Return the full file name including the extension
        }
    }
    return null;
}

function copy(src, dest) {
    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        const entries = fs.readdirSync(src);

        for (let entry of entries) {
            const srcPath = path.join(src, entry);
            const destPath = path.join(dest, entry);

            copy(srcPath, destPath);
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

export function createPageFile(dataSelected, version, fileName){
    const page = generatePage(dataSelected, version);
    fs.writeFileSync(htmlFilePath, page);

    const name = fileName.replace('.yaml', '');
    const sourceFileName = findFile(coversPath, name);

    if (!fs.existsSync(dstCoversPath))
        fs.mkdirSync(dstCoversPath);
    fs.copyFileSync(path.join(coversPath, sourceFileName), path.join(dstCoversPath, sourceFileName));

    if (!fs.existsSync(dstScreenshots))
        fs.mkdirSync(dstScreenshots);
    copy(path.join(screenshots, name), dstScreenshots);
}

function generatePage(data, version){
    const htmlContent = fs.readFileSync(templateFilePath, 'utf8');
    const $ = cheerio.load(htmlContent);

    $(`#game-title`).html(data.name);
    $(`.game-link`).html(data.link_name).attr('href', data.link);
    $(`.developer.game-link`).html("Play it Now");
    $(`#cover`).attr('src', `images/cover/${data.cover}?${Date.now()}`);
    $(`#description`).html(data.description.replace('\n', '<br>'));

    $(`#screenshots`).html('');
    for (const i in data.screenshots) {
        const imgElement = `<img src="images/screenshots/${data.screenshots[i]}?${Date.now()}" alt="Screenshot ${i+1}">`;
        $(`#screenshots`).append(imgElement);
    }

    let namesString = '';
    for (const i in data.developers) {
        if (i != 0){
            if (i == data.developers.length - 1)
                namesString += ' &amp; ';
            else
                namesString += ', ';
        }


        const link = extractAndCreateAnchor(data.developers[i]);
        namesString += link;
    }
    const updatedText = $(`#developers`).html().replace('%names%', namesString);
    $(`#developers`).html(updatedText);

    $('meta[name="website-id"]').attr('content', `${version}`);

    return $.html();
}

function extractAndCreateAnchor(inputStr) {
    const regex = /(.*)\((.*)\)/;
    const match = inputStr.match(regex);

    if (match && match.length === 3) {
        const name = match[1];
        const link = match[2];

        return `<a href="${link}" target="_blank">${name.trimEnd()}</a>`;
    } else {
        return inputStr.trimEnd();
    }
}

export function getAvailableItems(state, data){
    if (state.length === data.length)
        state.length = 0;

    let items = [];
    for (const dat of data) {
        let contains = false;
        for (const stat of state) {
            if (stat.item === dat.name){
                contains = true;
                break;
            }
        }
        if (contains)
            continue;

        items.push(dat.name);
    }
    return items;
}