import fs from "fs";
import path from "path";
import url from "url";
import * as cheerio from "cheerio";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateFilePath = path.join(__dirname, '..', 'templates', 'template.html');
const htmlFilePath = path.join(__dirname, '..', 'public', 'index.html');
const stateFilePath = path.join(__dirname, '..', 'data', 'state.json');
const dataFilePath = path.join(__dirname, '..', 'data', 'data.json');

export function loadData() {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
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
        const link = data.developers_link[i] !== null
            ? `<a href="${data.developers_link[i]}" target="_blank">${data.developers[i]}</a>`
            : `<a>${data.developers[i]}</a>`;
        namesString += link;
    }
    const updatedText = $(`#developers`).html().replace('%names%', namesString);
    $(`#developers`).html(updatedText);
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