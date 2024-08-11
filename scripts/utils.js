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

export function createPageFile(dataSelected){
    const page = generatePage(dataSelected);
    fs.writeFileSync(htmlFilePath, page);
}

function generatePage(data){
    const htmlContent = fs.readFileSync(templateFilePath, 'utf8');
    const $ = cheerio.load(htmlContent);

    $(`#game-title`).html(data.name);
    $(`.game-link`).html(data.link_name).attr('href', data.link);
    $(`#cover`).attr('src', `images/covers/${data.cover}`);
    $(`#description`).html(data.description.replace('\n', '<br>'));

    $(`#screenshots`).html('');
    for (const i in data.screenshots) {
        const imgElement = `<img src="images/screenshots/${data.screenshots[i]}" alt="Screenshot ${i+1}">`;
        $(`#screenshots`).append(imgElement);
    }

    let namesString = '';
    for (const i in data.developers) {
        if (i != 0)
            namesString += ', ';
        const link = data.developers[i].link != null
            ? `<a href="${data.developers[i].link}" target="_blank">${data.developers[i].name}</a>`
            : `<a>${data.developers[i].name}</a>`;
        namesString += link;
    }
    const updatedText = $(`#developers`).html().replace('%names%', namesString);
    $(`#developers`).html(updatedText);

    const image = $(`head`).html().replace('%og-image%', `https://gerardgascon.com/game-of-the-day/images/covers/${data.cover}`);
    $(`head`).html(image);

    return $.html();
}

export function getAvailableItems(state, data){
    if (state.length === data.length)
        state.length = 0;

    let items = [];
    for (const i in data) {
        if (state.includes(data[i].name))
            continue;

        items.push(data[i].name);
    }
    return items;
}